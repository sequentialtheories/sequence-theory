"""
TURNKEY EMBEDDED WALLET SERVICE
================================

CORRECT ARCHITECTURE (per Turnkey docs):
- Root org = Sequence Theory (signs requests with API key)
- Sub-org per app user with:
  - SYSTEM placeholder as root user (no auth methods = can't login)
  - OTP policy auto-attached at creation time
  - Wallet created ONLY after OTP verification
  - End user is NOT root - they verify via OTP BEFORE wallet creation
- OTP happens inside the SUB-ORG (OTP is enabled by default in sub-orgs)
- Parent org's API key retains full control over all sub-orgs

FLOW:
1. User calls init-email-auth → sub-org created (NO wallet) + OTP policy attached
2. OTP sent via Turnkey inside sub-org
3. User calls verify-email-otp → Verified via sub-org → marked as verified
4. User calls create-wallet → ONLY IF verified → wallet created in existing sub-org

Docs:
- Organizations: https://docs.turnkey.com/concepts/organizations
- Delegated access: https://docs.turnkey.com/concepts/policies/delegated-access-backend
- Email auth: https://docs.turnkey.com/authentication/email
- Policy language: https://docs.turnkey.com/concepts/policies/language

Uses a custom local Turnkey client implementation that requires
only standard PyPI packages (cryptography, requests).
"""

import os
import json
import logging
import httpx
from typing import Optional, Dict, Any, Tuple
from datetime import datetime

# Use local Turnkey client implementation (no external SDK required)
from turnkey_client import (
    TurnkeyClient,
    ApiKeyStamper,
    ApiKeyStamperConfig,
)

logger = logging.getLogger(__name__)

# Turnkey Configuration
TURNKEY_API_BASE_URL = "https://api.turnkey.com"
TURNKEY_ORGANIZATION_ID = os.environ.get('TURNKEY_ORGANIZATION_ID', '')
TURNKEY_API_PUBLIC_KEY = os.environ.get('TURNKEY_API_PUBLIC_KEY', '')
TURNKEY_API_PRIVATE_KEY = os.environ.get('TURNKEY_API_PRIVATE_KEY', '')

# Supabase Configuration (for DB operations)
SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')


def get_timestamp_ms() -> str:
    """Get current timestamp in milliseconds as string"""
    return str(int(datetime.utcnow().timestamp() * 1000))


def structured_log(event: str, **kwargs) -> None:
    """
    Emit a structured JSON log line for debugging Turnkey flows.
    All Turnkey operations MUST use this for traceability.
    """
    log_entry = {
        "event": event,
        "timestamp": datetime.utcnow().isoformat(),
        "turnkey_parent_org_id": TURNKEY_ORGANIZATION_ID,
        "api_key_public": TURNKEY_API_PUBLIC_KEY[:20] + "..." if TURNKEY_API_PUBLIC_KEY else "NOT_SET",
        **kwargs
    }
    logger.info(f"[TURNKEY_STRUCTURED] {json.dumps(log_entry)}")


def get_turnkey_client(org_id: Optional[str] = None) -> TurnkeyClient:
    """
    Create and return a properly configured Turnkey client.
    Uses the local client with API key stamping.
    """
    config = ApiKeyStamperConfig(
        api_public_key=TURNKEY_API_PUBLIC_KEY,
        api_private_key=TURNKEY_API_PRIVATE_KEY
    )
    stamper = ApiKeyStamper(config)
    
    target_org = org_id or TURNKEY_ORGANIZATION_ID
    
    client = TurnkeyClient(
        base_url=TURNKEY_API_BASE_URL,
        stamper=stamper,
        organization_id=target_org
    )
    
    structured_log(
        "turnkey_client_created",
        target_organization_id=target_org,
        is_parent_org=(target_org == TURNKEY_ORGANIZATION_ID)
    )
    
    return client


async def verify_turnkey_config() -> bool:
    """
    Verify Turnkey configuration is valid by making a whoami request.
    """
    try:
        client = get_turnkey_client()
        response = client.get_whoami()
        structured_log(
            "turnkey_config_verified",
            org_name=response.get('organizationName', 'unknown'),
            org_id=response.get('organizationId', 'unknown'),
            user_id=response.get('userId', 'unknown')
        )
        return True
    except Exception as e:
        structured_log("turnkey_config_verification_failed", error=str(e))
        return False


async def create_otp_policy_for_sub_org(sub_org_id: str, supabase_user_id: str) -> Tuple[bool, Optional[str]]:
    """
    Create OTP policy inside a sub-org to allow email OTP authentication.
    
    CRITICAL: This policy MUST exist in the sub-org where OTP activities will execute.
    The ST System user (delegated account) creates this policy.
    
    Returns: (success, policy_id or None)
    """
    structured_log(
        "create_otp_policy_start",
        supabase_user_id=supabase_user_id,
        target_sub_org_id=sub_org_id,
        activity_type="ACTIVITY_TYPE_CREATE_POLICY"
    )
    
    try:
        # Use the parent org client - ST System API key can create policies in sub-org
        # because ST System user exists in the sub-org as root user
        client = get_turnkey_client()
        
        body = {
            "type": "ACTIVITY_TYPE_CREATE_POLICY",
            "timestampMs": get_timestamp_ms(),
            "organizationId": sub_org_id,  # Policy goes INTO the sub-org
            "parameters": {
                "policyName": "Allow OTP Authentication",
                "effect": "EFFECT_ALLOW",
                "condition": "activity.type == 'ACTIVITY_TYPE_INIT_OTP_AUTH' || activity.type == 'ACTIVITY_TYPE_OTP_AUTH'",
                "consensus": "approvers.any()",
                "notes": f"Auto-created OTP policy for supabase user {supabase_user_id}"
            }
        }
        
        structured_log(
            "create_otp_policy_request",
            supabase_user_id=supabase_user_id,
            target_sub_org_id=sub_org_id,
            turnkey_request_organization_id=sub_org_id,
            policy_condition="activity.type == 'ACTIVITY_TYPE_INIT_OTP_AUTH' || activity.type == 'ACTIVITY_TYPE_OTP_AUTH'"
        )
        
        result = client.create_policy(body)
        
        activity = result.get("activity", {})
        activity_id = activity.get("id", "")
        activity_status = activity.get("status", "")
        activity_result = activity.get("result", {})
        policy_result = activity_result.get("createPolicyResult", {})
        policy_id = policy_result.get("policyId", "")
        
        structured_log(
            "create_otp_policy_response",
            supabase_user_id=supabase_user_id,
            target_sub_org_id=sub_org_id,
            activity_id=activity_id,
            activity_status=activity_status,
            policy_id=policy_id,
            success=bool(policy_id)
        )
        
        return bool(policy_id), policy_id
        
    except Exception as e:
        structured_log(
            "create_otp_policy_error",
            supabase_user_id=supabase_user_id,
            target_sub_org_id=sub_org_id,
            error=str(e),
            error_type=type(e).__name__
        )
        import traceback
        logger.error(f"[TURNKEY] Traceback: {traceback.format_exc()}")
        return False, None


async def init_otp_for_user(
    supabase_user_id: str,
    user_email: str,
    sub_org_id: str
) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Initialize email OTP for a user.
    
    CRITICAL: OTP MUST be initiated against the user's SUB-ORG, not parent org.
    The user must exist as an end-user in that sub-org.
    
    Args:
        supabase_user_id: The Supabase user ID
        user_email: The user's email address
        sub_org_id: The user's Turnkey sub-organization ID (REQUIRED)
    
    Returns:
        (success, otp_id, error_message)
    """
    # HARD ASSERTION: sub_org_id must exist
    if not sub_org_id:
        structured_log(
            "init_otp_assertion_failed",
            supabase_user_id=supabase_user_id,
            assertion="sub_org_id must exist before OTP calls",
            sub_org_id=sub_org_id
        )
        return False, None, "ASSERTION_FAILED: User must have sub-org before OTP"
    
    structured_log(
        "init_otp_start",
        supabase_user_id=supabase_user_id,
        user_email=user_email,
        target_sub_org_id=sub_org_id,
        activity_type="ACTIVITY_TYPE_INIT_OTP_AUTH"
    )
    
    try:
        # Create client targeting the SUB-ORG, not parent org
        client = get_turnkey_client(sub_org_id)
        
        body = {
            "type": "ACTIVITY_TYPE_INIT_OTP_AUTH",
            "timestampMs": get_timestamp_ms(),
            "organizationId": sub_org_id,  # Target SUB-ORG, not parent
            "parameters": {
                "otpType": "OTP_TYPE_EMAIL",
                "contact": user_email,
                "emailCustomization": {
                    "appName": "Sequence Theory"
                },
                "expirationSeconds": "600"
            }
        }
        
        structured_log(
            "init_otp_request",
            supabase_user_id=supabase_user_id,
            target_sub_org_id=sub_org_id,
            turnkey_request_organization_id=sub_org_id,
            turnkey_signing_api_key=TURNKEY_API_PUBLIC_KEY[:20] + "...",
            activity_type="ACTIVITY_TYPE_INIT_OTP_AUTH",
            contact_email=user_email
        )
        
        result = client.init_otp_auth(body)
        
        activity = result.get("activity", {})
        activity_id = activity.get("id", "")
        activity_status = activity.get("status", "")
        activity_result = activity.get("result", {})
        
        # Extract otpId
        init_result = (
            activity_result.get("initOtpAuthResultV2") or
            activity_result.get("initOtpAuthResult") or
            {}
        )
        otp_id = init_result.get("otpId")
        
        structured_log(
            "init_otp_response",
            supabase_user_id=supabase_user_id,
            target_sub_org_id=sub_org_id,
            activity_id=activity_id,
            activity_status=activity_status,
            otp_id=otp_id,
            success=bool(otp_id)
        )
        
        if otp_id:
            return True, otp_id, None
        else:
            return False, None, f"No otpId in response. Activity: {activity_id}, Status: {activity_status}"
        
    except Exception as e:
        error_str = str(e)
        structured_log(
            "init_otp_error",
            supabase_user_id=supabase_user_id,
            target_sub_org_id=sub_org_id,
            error=error_str,
            error_type=type(e).__name__
        )
        return False, None, error_str


async def verify_otp_for_user(
    supabase_user_id: str,
    otp_id: str,
    otp_code: str,
    sub_org_id: str
) -> Tuple[bool, Optional[str]]:
    """
    Verify email OTP for a user.
    
    CRITICAL: OTP verification MUST use the SAME sub-org as init-otp.
    
    Args:
        supabase_user_id: The Supabase user ID
        otp_id: The OTP ID from init_otp
        otp_code: The code entered by user
        sub_org_id: The user's Turnkey sub-organization ID (REQUIRED - must match init)
    
    Returns:
        (success, error_message)
    """
    # HARD ASSERTION: sub_org_id must exist and match
    if not sub_org_id:
        structured_log(
            "verify_otp_assertion_failed",
            supabase_user_id=supabase_user_id,
            assertion="sub_org_id must exist and match init-otp org",
            sub_org_id=sub_org_id
        )
        return False, "ASSERTION_FAILED: sub_org_id required for verify"
    
    structured_log(
        "verify_otp_start",
        supabase_user_id=supabase_user_id,
        target_sub_org_id=sub_org_id,
        otp_id=otp_id,
        activity_type="ACTIVITY_TYPE_OTP_AUTH"
    )
    
    try:
        # Create client targeting the SUB-ORG (same as init)
        client = get_turnkey_client(sub_org_id)
        
        body = {
            "type": "ACTIVITY_TYPE_OTP_AUTH",
            "timestampMs": get_timestamp_ms(),
            "organizationId": sub_org_id,  # Target SUB-ORG (same as init)
            "parameters": {
                "otpId": otp_id,
                "otpCode": otp_code
            }
        }
        
        structured_log(
            "verify_otp_request",
            supabase_user_id=supabase_user_id,
            target_sub_org_id=sub_org_id,
            turnkey_request_organization_id=sub_org_id,
            turnkey_signing_api_key=TURNKEY_API_PUBLIC_KEY[:20] + "...",
            activity_type="ACTIVITY_TYPE_OTP_AUTH",
            otp_id=otp_id
        )
        
        result = client.otp_auth(body)
        
        activity = result.get("activity", {})
        activity_id = activity.get("id", "")
        activity_status = activity.get("status", "")
        activity_result = activity.get("result", {})
        verify_result = activity_result.get("otpAuthResult")
        
        structured_log(
            "verify_otp_response",
            supabase_user_id=supabase_user_id,
            target_sub_org_id=sub_org_id,
            activity_id=activity_id,
            activity_status=activity_status,
            verified=bool(verify_result),
            success=bool(verify_result)
        )
        
        if verify_result:
            return True, None
        else:
            return False, f"Verification failed. Activity: {activity_id}, Status: {activity_status}"
        
    except Exception as e:
        error_str = str(e)
        structured_log(
            "verify_otp_error",
            supabase_user_id=supabase_user_id,
            target_sub_org_id=sub_org_id,
            error=error_str,
            error_type=type(e).__name__
        )
        return False, error_str


async def create_sub_organization_with_wallet(
    supabase_user_id: str,
    user_email: str,
    user_name: str,
    passkey_attestation: Optional[Dict[str, Any]] = None
) -> Tuple[str, str, str, str]:
    """
    Create a Turnkey sub-organization with an embedded wallet for a user.
    
    CORRECT ARCHITECTURE (per Turnkey docs):
    - API keys are ONLY for signing requests, NOT org membership
    - rootUsers contains ONLY the end user (email identity) for OTP auth
    - Parent org's API key can manage child sub-orgs automatically
    - OTP-allow policy is created in the sub-org after creation
    
    Docs:
    - https://docs.turnkey.com/concepts/organizations
    - https://docs.turnkey.com/concepts/policies/delegated-access-backend
    - https://docs.turnkey.com/authentication/email
    
    Args:
        supabase_user_id: The Supabase user ID (for logging/tracking)
        user_email: User's email address (creates email identity in sub-org)
        user_name: User's display name
        passkey_attestation: Optional passkey attestation data
    
    Returns:
        Tuple of (sub_org_id, wallet_id, eth_address, root_user_id)
    """
    structured_log(
        "create_sub_org_start",
        supabase_user_id=supabase_user_id,
        user_email=user_email,
        activity_type="ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7"
    )
    
    try:
        client = get_turnkey_client()
        
        # CORRECT ARCHITECTURE (per Turnkey docs):
        # - rootUsers contains a SYSTEM placeholder (no auth methods = can't login)
        # - End user is NOT added as root - they authenticate via OTP before this
        # - Parent org's API key retains full control over sub-org
        # - This prevents users from having admin access to their sub-org
        #
        # Docs: https://docs.turnkey.com/concepts/policies/delegated-access-backend
        
        body = {
            "type": "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7",
            "timestampMs": get_timestamp_ms(),
            "organizationId": TURNKEY_ORGANIZATION_ID,
            "parameters": {
                "subOrganizationName": f"ST Wallet: {user_email}",
                
                # Delegated Account with API key credential
                # Using parent org's API key gives us control over this sub-org
                "rootUsers": [
                    {
                        "userName": "Delegated Account",
                        # NO userEmail - cannot receive OTP  
                        # NO authenticators - cannot use passkey
                        # API key = parent org's key for delegated control
                        "apiKeys": [
                            {
                                "apiKeyName": "Delegated API Key",
                                "publicKey": TURNKEY_API_PUBLIC_KEY,
                                "curveType": "API_KEY_CURVE_P256"
                            }
                        ],
                        "authenticators": [],
                        "oauthProviders": []
                    }
                ],
                
                "rootQuorumThreshold": 1,
                
                # Create wallet
                "wallet": {
                    "walletName": f"Wallet: {user_email}",
                    "accounts": [{
                        "curve": "CURVE_SECP256K1",
                        "pathFormat": "PATH_FORMAT_BIP32",
                        "path": "m/44'/60'/0'/0/0",
                        "addressFormat": "ADDRESS_FORMAT_ETHEREUM"
                    }]
                }
            }
        }
        
        structured_log(
            "create_sub_org_request",
            supabase_user_id=supabase_user_id,
            turnkey_request_organization_id=TURNKEY_ORGANIZATION_ID,
            turnkey_signing_api_key=TURNKEY_API_PUBLIC_KEY[:20] + "...",
            activity_type="ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7",
            root_users_count=1,
            root_user_type="SYSTEM_PLACEHOLDER_NO_AUTH",
            note="End user is NOT root - verified via OTP before wallet creation"
        )
        
        result = client.create_sub_organization(body)
        
        activity = result.get("activity", {})
        activity_id = activity.get("id", "")
        activity_status = activity.get("status", "")
        activity_result = activity.get("result", {})
        
        sub_org_result = (
            activity_result.get("createSubOrganizationResultV7") or
            activity_result.get("createSubOrganizationResult") or
            {}
        )
        
        if not sub_org_result:
            structured_log(
                "create_sub_org_error",
                supabase_user_id=supabase_user_id,
                activity_id=activity_id,
                error="No sub-organization result in response"
            )
            raise Exception("No sub-organization result in response")
        
        sub_org_id = sub_org_result.get("subOrganizationId", "")
        wallet_data = sub_org_result.get("wallet", {})
        wallet_id = wallet_data.get("walletId", "")
        addresses = wallet_data.get("addresses", [])
        eth_address = addresses[0] if addresses else ""
        root_user_ids = sub_org_result.get("rootUserIds", [])
        
        structured_log(
            "create_sub_org_response",
            supabase_user_id=supabase_user_id,
            activity_id=activity_id,
            activity_status=activity_status,
            sub_org_id=sub_org_id,
            wallet_id=wallet_id,
            eth_address=eth_address,
            root_user_ids=root_user_ids,
            root_user_count=len(root_user_ids),
            success=bool(sub_org_id and wallet_id and eth_address)
        )
        
        if not sub_org_id or not wallet_id or not eth_address:
            raise Exception(f"Incomplete sub-org creation: sub_org={sub_org_id}, wallet={wallet_id}, address={eth_address}")
        
        # CRITICAL: Auto-attach OTP policy to the new sub-org
        structured_log(
            "create_otp_policy_starting",
            supabase_user_id=supabase_user_id,
            target_sub_org_id=sub_org_id
        )
        
        policy_success, policy_id = await create_otp_policy_for_sub_org(sub_org_id, supabase_user_id)
        
        structured_log(
            "create_sub_org_complete",
            supabase_user_id=supabase_user_id,
            sub_org_id=sub_org_id,
            wallet_id=wallet_id,
            eth_address=eth_address,
            otp_policy_created=policy_success,
            otp_policy_id=policy_id
        )
        
        return sub_org_id, wallet_id, eth_address, root_user_ids[0] if root_user_ids else ""
        
    except Exception as e:
        structured_log(
            "create_sub_org_error",
            supabase_user_id=supabase_user_id,
            error=str(e),
            error_type=type(e).__name__
        )
        import traceback
        logger.error(f"[TURNKEY] Traceback: {traceback.format_exc()}")
        raise


async def ensure_user_has_sub_org(
    supabase_user_id: str,
    user_email: str,
    user_name: str,
    supabase_client,  # httpx.AsyncClient
    supabase_url: str,
    supabase_service_key: str
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Ensure a user has a sub-org. Create one if not exists.
    
    This is the IDEMPOTENT entry point for sub-org management.
    
    Returns:
        (sub_org_id, wallet_id, eth_address) or (None, None, None) if failed
    """
    structured_log(
        "ensure_sub_org_start",
        supabase_user_id=supabase_user_id,
        user_email=user_email
    )
    
    # Check profiles table first
    profile_response = await supabase_client.get(
        f"{supabase_url}/rest/v1/profiles",
        params={
            "user_id": f"eq.{supabase_user_id}",
            "select": "turnkey_sub_org_id,turnkey_wallet_id,eth_address"
        },
        headers={
            "apikey": supabase_service_key,
            "Authorization": f"Bearer {supabase_service_key}"
        }
    )
    
    if profile_response.status_code == 200:
        profiles = profile_response.json()
        if profiles and len(profiles) > 0:
            profile = profiles[0]
            existing_sub_org = profile.get("turnkey_sub_org_id")
            existing_wallet = profile.get("turnkey_wallet_id")
            existing_address = profile.get("eth_address")
            
            if existing_sub_org and existing_wallet and existing_address:
                structured_log(
                    "ensure_sub_org_found_existing",
                    supabase_user_id=supabase_user_id,
                    sub_org_id=existing_sub_org,
                    wallet_id=existing_wallet,
                    eth_address=existing_address
                )
                return existing_sub_org, existing_wallet, existing_address
    
    # Also check user_wallets table
    wallet_response = await supabase_client.get(
        f"{supabase_url}/rest/v1/user_wallets",
        params={
            "user_id": f"eq.{supabase_user_id}",
            "select": "turnkey_sub_org_id,turnkey_wallet_id,wallet_address"
        },
        headers={
            "apikey": supabase_service_key,
            "Authorization": f"Bearer {supabase_service_key}"
        }
    )
    
    if wallet_response.status_code == 200:
        wallets = wallet_response.json()
        if wallets and len(wallets) > 0:
            wallet = wallets[0]
            existing_sub_org = wallet.get("turnkey_sub_org_id")
            existing_wallet = wallet.get("turnkey_wallet_id")
            existing_address = wallet.get("wallet_address")
            
            if existing_sub_org and existing_wallet and existing_address:
                structured_log(
                    "ensure_sub_org_found_in_wallets",
                    supabase_user_id=supabase_user_id,
                    sub_org_id=existing_sub_org,
                    wallet_id=existing_wallet,
                    eth_address=existing_address
                )
                return existing_sub_org, existing_wallet, existing_address
    
    # No existing sub-org - create one
    structured_log(
        "ensure_sub_org_creating_new",
        supabase_user_id=supabase_user_id,
        user_email=user_email
    )
    
    sub_org_id, wallet_id, eth_address, _ = await create_sub_organization_with_wallet(
        supabase_user_id=supabase_user_id,
        user_email=user_email,
        user_name=user_name
    )
    
    # Store in both tables for redundancy
    # Store in profiles
    await supabase_client.patch(
        f"{supabase_url}/rest/v1/profiles",
        params={"user_id": f"eq.{supabase_user_id}"},
        json={
            "turnkey_sub_org_id": sub_org_id,
            "turnkey_wallet_id": wallet_id,
            "eth_address": eth_address
        },
        headers={
            "apikey": supabase_service_key,
            "Authorization": f"Bearer {supabase_service_key}",
            "Content-Type": "application/json"
        }
    )
    
    # Store in user_wallets
    await supabase_client.post(
        f"{supabase_url}/rest/v1/user_wallets",
        json={
            "user_id": supabase_user_id,
            "wallet_address": eth_address,
            "turnkey_sub_org_id": sub_org_id,
            "turnkey_wallet_id": wallet_id,
            "provider": "turnkey",
            "network": "polygon"
        },
        headers={
            "apikey": supabase_service_key,
            "Authorization": f"Bearer {supabase_service_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    )
    
    structured_log(
        "ensure_sub_org_created",
        supabase_user_id=supabase_user_id,
        sub_org_id=sub_org_id,
        wallet_id=wallet_id,
        eth_address=eth_address
    )
    
    return sub_org_id, wallet_id, eth_address


async def sign_raw_payload(
    sub_org_id: str,
    wallet_address: str,
    payload: str,
    encoding: str = "PAYLOAD_ENCODING_HEXADECIMAL",
    hash_function: str = "HASH_FUNCTION_KECCAK256"
) -> Dict[str, Any]:
    """Sign a raw payload with the user's wallet."""
    structured_log(
        "sign_raw_payload_start",
        sub_org_id=sub_org_id,
        wallet_address=wallet_address,
        activity_type="ACTIVITY_TYPE_SIGN_RAW_PAYLOAD_V2"
    )
    
    try:
        client = get_turnkey_client(sub_org_id)
        
        body = {
            "type": "ACTIVITY_TYPE_SIGN_RAW_PAYLOAD_V2",
            "timestampMs": get_timestamp_ms(),
            "organizationId": sub_org_id,
            "parameters": {
                "signWith": wallet_address,
                "payload": payload,
                "encoding": encoding,
                "hashFunction": hash_function
            }
        }
        
        result = client.sign_raw_payload(body)
        
        activity = result.get("activity", {})
        activity_result = activity.get("result", {})
        sign_result = activity_result.get("signRawPayloadResult", {})
        
        if not sign_result:
            raise Exception("No signature result")
        
        r = sign_result.get("r", "")
        s = sign_result.get("s", "")
        v = sign_result.get("v", "")
        
        structured_log(
            "sign_raw_payload_success",
            sub_org_id=sub_org_id,
            activity_id=activity.get("id", "")
        )
        
        return {"r": r, "s": s, "v": v, "signature": f"0x{r}{s}{v}"}
        
    except Exception as e:
        structured_log(
            "sign_raw_payload_error",
            sub_org_id=sub_org_id,
            error=str(e)
        )
        raise


async def sign_transaction(
    sub_org_id: str,
    wallet_address: str,
    unsigned_transaction: str,
    transaction_type: str = "TRANSACTION_TYPE_ETHEREUM"
) -> Dict[str, Any]:
    """Sign an EVM transaction."""
    structured_log(
        "sign_transaction_start",
        sub_org_id=sub_org_id,
        wallet_address=wallet_address,
        activity_type="ACTIVITY_TYPE_SIGN_TRANSACTION_V2"
    )
    
    try:
        client = get_turnkey_client(sub_org_id)
        
        body = {
            "type": "ACTIVITY_TYPE_SIGN_TRANSACTION_V2",
            "timestampMs": get_timestamp_ms(),
            "organizationId": sub_org_id,
            "parameters": {
                "signWith": wallet_address,
                "unsignedTransaction": unsigned_transaction,
                "type": transaction_type
            }
        }
        
        result = client.sign_transaction(body)
        
        activity = result.get("activity", {})
        activity_result = activity.get("result", {})
        sign_result = activity_result.get("signTransactionResult", {})
        
        if not sign_result:
            raise Exception("No transaction signature result")
        
        structured_log(
            "sign_transaction_success",
            sub_org_id=sub_org_id,
            activity_id=activity.get("id", "")
        )
        
        return {"signedTransaction": sign_result.get("signedTransaction", "")}
        
    except Exception as e:
        structured_log(
            "sign_transaction_error",
            sub_org_id=sub_org_id,
            error=str(e)
        )
        raise



async def ensure_user_sub_org_for_otp(
    supabase_user_id: str,
    user_email: str,
    user_name: str
) -> Optional[str]:
    """
    Ensure user has a sub-org for OTP. Create WITHOUT wallet if needed.
    
    CORRECT ARCHITECTURE:
    - Sub-org is created WITHOUT wallet at OTP time
    - OTP policy is attached immediately
    - Wallet is created ONLY after OTP verification
    - Parent API key has full control of sub-org
    
    Returns: sub_org_id or None if failed
    """
    structured_log(
        "ensure_sub_org_for_otp_start",
        supabase_user_id=supabase_user_id,
        user_email=user_email
    )
    
    # Check if user already has a sub-org in DB
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Check profiles table
        profile_response = await client.get(
            f"{SUPABASE_URL}/rest/v1/profiles",
            params={
                "user_id": f"eq.{supabase_user_id}",
                "select": "turnkey_sub_org_id"
            },
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        
        if profile_response.status_code == 200:
            profiles = profile_response.json()
            if profiles and len(profiles) > 0:
                existing_sub_org = profiles[0].get("turnkey_sub_org_id")
                if existing_sub_org:
                    structured_log(
                        "ensure_sub_org_for_otp_found_existing",
                        supabase_user_id=supabase_user_id,
                        sub_org_id=existing_sub_org
                    )
                    return existing_sub_org
        
        # No existing sub-org - create one WITHOUT wallet
        structured_log(
            "ensure_sub_org_for_otp_creating_new",
            supabase_user_id=supabase_user_id,
            user_email=user_email
        )
        
        sub_org_id = await create_sub_org_without_wallet(
            supabase_user_id=supabase_user_id,
            user_email=user_email,
            user_name=user_name
        )
        
        if not sub_org_id:
            structured_log(
                "ensure_sub_org_for_otp_failed",
                supabase_user_id=supabase_user_id,
                error="create_sub_org_without_wallet returned None"
            )
            return None
        
        # Store sub_org_id in profiles table
        update_response = await client.patch(
            f"{SUPABASE_URL}/rest/v1/profiles",
            params={"user_id": f"eq.{supabase_user_id}"},
            json={"turnkey_sub_org_id": sub_org_id},
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json"
            }
        )
        
        if update_response.status_code not in [200, 204]:
            logger.warning(f"Failed to update profiles with sub_org_id: {update_response.text}")
        
        structured_log(
            "ensure_sub_org_for_otp_created",
            supabase_user_id=supabase_user_id,
            sub_org_id=sub_org_id
        )
        
        return sub_org_id


async def create_sub_org_without_wallet(
    supabase_user_id: str,
    user_email: str,
    user_name: str
) -> Optional[str]:
    """
    Create a Turnkey sub-organization WITHOUT a wallet.
    
    ARCHITECTURE (per Turnkey delegated-access-backend docs):
    - rootUsers contains Delegated Account with API key credential
    - This API key is the SAME as parent org's key (gives parent control)
    - NO wallet created here (wallet comes after OTP verification)
    - OTP policy is attached immediately after sub-org creation
    
    Returns: sub_org_id or None if failed
    """
    structured_log(
        "create_sub_org_without_wallet_start",
        supabase_user_id=supabase_user_id,
        user_email=user_email
    )
    
    try:
        turnkey_client = get_turnkey_client()
        
        # Create sub-org WITHOUT wallet
        # Per Turnkey docs, root users MUST have at least one credential
        # We use the parent org's API key as the delegated account's credential
        body = {
            "type": "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7",
            "timestampMs": get_timestamp_ms(),
            "organizationId": TURNKEY_ORGANIZATION_ID,
            "parameters": {
                "subOrganizationName": f"ST Wallet: {user_email}",
                
                # Delegated Account with API key credential
                # Using parent org's API key gives us control over this sub-org
                "rootUsers": [
                    {
                        "userName": "Delegated Account",
                        # NO userEmail - cannot receive OTP  
                        # NO authenticators - cannot use passkey
                        # API key = parent org's key for delegated control
                        "apiKeys": [
                            {
                                "apiKeyName": "Delegated API Key",
                                "publicKey": TURNKEY_API_PUBLIC_KEY,
                                "curveType": "API_KEY_CURVE_P256"
                            }
                        ],
                        "authenticators": [],
                        "oauthProviders": []
                    }
                ],
                
                "rootQuorumThreshold": 1
                
                # NOTE: NO "wallet" parameter - wallet created later after OTP
            }
        }
        
        structured_log(
            "create_sub_org_without_wallet_request",
            supabase_user_id=supabase_user_id,
            note="Creating sub-org WITHOUT wallet - wallet comes after OTP"
        )
        
        result = turnkey_client.create_sub_organization(body)
        
        activity = result.get("activity", {})
        activity_result = activity.get("result", {})
        
        sub_org_result = (
            activity_result.get("createSubOrganizationResultV7") or
            activity_result.get("createSubOrganizationResult") or
            {}
        )
        
        sub_org_id = sub_org_result.get("subOrganizationId", "")
        
        if not sub_org_id:
            structured_log(
                "create_sub_org_without_wallet_no_result",
                supabase_user_id=supabase_user_id,
                activity_result=str(activity_result)
            )
            return None
        
        structured_log(
            "create_sub_org_without_wallet_created",
            supabase_user_id=supabase_user_id,
            sub_org_id=sub_org_id
        )
        
        # CRITICAL: Attach OTP policy to the new sub-org
        # OTP is ENABLED by default in sub-orgs, but we add explicit policy for safety
        policy_success, policy_id = await create_otp_policy_for_sub_org(sub_org_id, supabase_user_id)
        
        structured_log(
            "create_sub_org_without_wallet_complete",
            supabase_user_id=supabase_user_id,
            sub_org_id=sub_org_id,
            otp_policy_created=policy_success,
            otp_policy_id=policy_id
        )
        
        return sub_org_id
        
    except Exception as e:
        structured_log(
            "create_sub_org_without_wallet_error",
            supabase_user_id=supabase_user_id,
            error=str(e)
        )
        import traceback
        logger.error(f"[TURNKEY] Traceback: {traceback.format_exc()}")
        return None


async def create_wallet_in_sub_org(
    sub_org_id: str,
    user_email: str
) -> Tuple[Optional[str], Optional[str]]:
    """
    Create a wallet in an existing sub-organization.
    
    Called ONLY after OTP verification is complete.
    
    Returns: (wallet_id, eth_address) or (None, None) if failed
    """
    structured_log(
        "create_wallet_in_sub_org_start",
        sub_org_id=sub_org_id,
        user_email=user_email
    )
    
    try:
        # Use parent org client to create wallet in sub-org
        turnkey_client = get_turnkey_client()
        
        body = {
            "type": "ACTIVITY_TYPE_CREATE_WALLET",
            "timestampMs": get_timestamp_ms(),
            "organizationId": sub_org_id,  # Target sub-org
            "parameters": {
                "walletName": f"Wallet: {user_email}",
                "accounts": [{
                    "curve": "CURVE_SECP256K1",
                    "pathFormat": "PATH_FORMAT_BIP32",
                    "path": "m/44'/60'/0'/0/0",
                    "addressFormat": "ADDRESS_FORMAT_ETHEREUM"
                }]
            }
        }
        
        structured_log(
            "create_wallet_in_sub_org_request",
            sub_org_id=sub_org_id
        )
        
        result = turnkey_client.create_wallet(body)
        
        activity = result.get("activity", {})
        activity_result = activity.get("result", {})
        wallet_result = activity_result.get("createWalletResult", {})
        
        wallet_id = wallet_result.get("walletId", "")
        addresses = wallet_result.get("addresses", [])
        eth_address = addresses[0] if addresses else ""
        
        if not wallet_id or not eth_address:
            structured_log(
                "create_wallet_in_sub_org_no_result",
                sub_org_id=sub_org_id,
                activity_result=str(activity_result)
            )
            return None, None
        
        structured_log(
            "create_wallet_in_sub_org_success",
            sub_org_id=sub_org_id,
            wallet_id=wallet_id,
            eth_address=eth_address
        )
        
        return wallet_id, eth_address
        
    except Exception as e:
        structured_log(
            "create_wallet_in_sub_org_error",
            sub_org_id=sub_org_id,
            error=str(e)
        )
        import traceback
        logger.error(f"[TURNKEY] Traceback: {traceback.format_exc()}")
        return None, None
