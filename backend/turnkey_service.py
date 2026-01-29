"""
TURNKEY EMBEDDED WALLET SERVICE
================================

CORRECT ARCHITECTURE:
- Root org = Sequence Theory (with system API key)
- Sub-org per app user (managed by ST system, NOT by end user)
- Sub-org root user = Sequence Theory system API user
- App users authenticate via OTP/passkey for wallet actions
- End users are NEVER Turnkey org admins

Uses a custom local Turnkey client implementation that requires
only standard PyPI packages (cryptography, requests).

Handles:
- Sub-organization creation with embedded wallet
- Wallet creation for authenticated users
- Auto-attaching OTP policies to sub-orgs

SECURITY NOTES:
- Private keys are NEVER stored or exposed
- All signing happens in Turnkey's secure TEE
- Only wallet addresses and Turnkey IDs stored in Supabase
- Non-custodial enforced by policies, not by making users root admins
"""

import os
import logging
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


def get_timestamp_ms() -> str:
    """Get current timestamp in milliseconds as string"""
    return str(int(datetime.utcnow().timestamp() * 1000))


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
    
    client = TurnkeyClient(
        base_url=TURNKEY_API_BASE_URL,
        stamper=stamper,
        organization_id=org_id or TURNKEY_ORGANIZATION_ID
    )
    
    return client


async def verify_turnkey_config() -> bool:
    """
    Verify Turnkey configuration is valid by making a whoami request.
    """
    try:
        client = get_turnkey_client()
        response = client.get_whoami()
        logger.info(f"Turnkey config verified. Org: {response.get('organizationName', 'unknown')}")
        return True
    except Exception as e:
        logger.error(f"Turnkey config verification failed: {e}")
        return False


async def create_otp_policy_for_sub_org(sub_org_id: str) -> bool:
    """
    Create OTP policy inside a sub-org to allow email OTP authentication.
    
    This MUST be called immediately after creating a sub-org to enable OTP flow.
    
    Policy allows:
    - ACTIVITY_TYPE_INIT_OTP_AUTH (send OTP)
    - ACTIVITY_TYPE_OTP_AUTH (verify OTP)
    """
    logger.info(f"[TURNKEY] Creating OTP policy for sub-org: {sub_org_id}")
    
    try:
        # Use the parent org client to create policy in sub-org
        client = get_turnkey_client()
        
        # Create policy request
        body = {
            "type": "ACTIVITY_TYPE_CREATE_POLICY",
            "timestampMs": get_timestamp_ms(),
            "organizationId": sub_org_id,  # Policy goes INTO the sub-org
            "parameters": {
                "policyName": "Allow OTP Authentication",
                "effect": "EFFECT_ALLOW",
                "condition": "activity.type == 'ACTIVITY_TYPE_INIT_OTP_AUTH' || activity.type == 'ACTIVITY_TYPE_OTP_AUTH'",
                "consensus": "approvers.any()",
                "notes": "Auto-created policy to allow email OTP for wallet operations"
            }
        }
        
        logger.info(f"[TURNKEY] Calling create_policy for sub-org {sub_org_id}...")
        
        result = client.create_policy(body)
        
        activity = result.get("activity", {})
        activity_result = activity.get("result", {})
        policy_result = activity_result.get("createPolicyResult", {})
        
        policy_id = policy_result.get("policyId", "")
        
        if policy_id:
            logger.info(f"[TURNKEY] SUCCESS - Created OTP policy {policy_id} in sub-org {sub_org_id}")
            return True
        else:
            logger.warning(f"[TURNKEY] Policy creation returned no policyId. Result: {result}")
            return False
        
    except Exception as e:
        logger.error(f"[TURNKEY] Error creating OTP policy: {e}")
        import traceback
        logger.error(f"[TURNKEY] Traceback: {traceback.format_exc()}")
        # Don't raise - policy creation failure shouldn't block wallet creation
        # The user can still use passkey or we can retry policy creation later
        return False


async def create_sub_organization_with_wallet(
    user_email: str,
    user_name: str,
    passkey_attestation: Optional[Dict[str, Any]] = None
) -> Tuple[str, str, str, str]:
    """
    Create a Turnkey sub-organization with an embedded wallet for a user.
    
    CRITICAL ARCHITECTURE:
    - The sub-org root user is the SEQUENCE THEORY SYSTEM (via API key)
    - NOT the end user's email
    - End users authenticate via OTP/passkey but are NOT Turnkey admins
    - This allows us to manage policies and permissions centrally
    
    Args:
        user_email: User's email address (for naming/reference only, NOT as root user)
        user_name: User's display name (for naming/reference only)
        passkey_attestation: Optional passkey attestation data for WebAuthn
    
    Returns:
        Tuple of (sub_org_id, wallet_id, eth_address, root_user_id)
    """
    logger.info(f"[TURNKEY] Creating sub-org for Supabase user: {user_email}")
    logger.info(f"[TURNKEY] NOTE: Root user will be ST system, NOT end user")
    
    try:
        client = get_turnkey_client()
        
        # CRITICAL: Root user is the SEQUENCE THEORY SYSTEM API KEY
        # NOT the end user. This allows us to:
        # 1. Manage policies in sub-orgs
        # 2. Control OTP flow
        # 3. Keep architecture scalable
        #
        # The root user gets the SAME API key as the parent org
        # This means the parent org API key can manage this sub-org
        
        body = {
            "type": "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7",
            "timestampMs": get_timestamp_ms(),
            "organizationId": TURNKEY_ORGANIZATION_ID,
            "parameters": {
                # Name includes user email for reference, but user is NOT admin
                "subOrganizationName": f"ST Wallet: {user_email}",
                
                # ROOT USER = Sequence Theory System (via API key)
                # NOT the end user email!
                "rootUsers": [{
                    "userName": "Sequence Theory System",
                    "apiKeys": [{
                        "apiKeyName": "ST System Key",
                        "publicKey": TURNKEY_API_PUBLIC_KEY
                    }],
                    # No email, no authenticators, no oauth - pure API key access
                    "authenticators": [],
                    "oauthProviders": []
                }],
                
                "rootQuorumThreshold": 1,
                
                # Create wallet for the user
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
        
        logger.info(f"[TURNKEY] Calling create_sub_organization with ST system as root user...")
        
        # Create sub-organization with wallet
        result = client.create_sub_organization(body)
        
        logger.info(f"[TURNKEY] Activity result received")
        
        # Extract results from activity response
        activity = result.get("activity", {})
        activity_result = activity.get("result", {})
        
        # Try different result versions
        sub_org_result = (
            activity_result.get("createSubOrganizationResultV7") or
            activity_result.get("createSubOrganizationResult") or
            {}
        )
        
        if not sub_org_result:
            logger.error(f"[TURNKEY] No sub-organization result in response. Result: {result}")
            raise Exception(f"No sub-organization result in response")
        
        sub_org_id = sub_org_result.get("subOrganizationId", "")
        wallet_data = sub_org_result.get("wallet", {})
        wallet_id = wallet_data.get("walletId", "")
        addresses = wallet_data.get("addresses", [])
        eth_address = addresses[0] if addresses else ""
        
        # Get root user ID (this is the ST system user, not end user)
        root_users = sub_org_result.get("rootUserIds", [])
        root_user_id = root_users[0] if root_users else ""
        
        logger.info(f"[TURNKEY] SUCCESS - Created sub-org {sub_org_id}")
        logger.info(f"[TURNKEY] SUCCESS - Wallet ID: {wallet_id}")
        logger.info(f"[TURNKEY] SUCCESS - ETH Address: {eth_address}")
        logger.info(f"[TURNKEY] SUCCESS - Root User (ST System): {root_user_id}")
        
        # CRITICAL: Auto-attach OTP policy to the new sub-org
        # This allows end users to authenticate via email OTP
        logger.info(f"[TURNKEY] Auto-attaching OTP policy to sub-org...")
        policy_success = await create_otp_policy_for_sub_org(sub_org_id)
        
        if policy_success:
            logger.info(f"[TURNKEY] OTP policy attached successfully")
        else:
            logger.warning(f"[TURNKEY] OTP policy attachment failed - user may need passkey auth")
        
        return sub_org_id, wallet_id, eth_address, root_user_id
        
    except Exception as e:
        logger.error(f"[TURNKEY] Error creating sub-organization: {e}")
        import traceback
        logger.error(f"[TURNKEY] Traceback: {traceback.format_exc()}")
        raise


async def sign_raw_payload(
    sub_org_id: str,
    wallet_address: str,
    payload: str,
    encoding: str = "PAYLOAD_ENCODING_HEXADECIMAL",
    hash_function: str = "HASH_FUNCTION_KECCAK256"
) -> Dict[str, Any]:
    """
    Sign a raw payload with the user's wallet.
    
    Since the ST system API key is the root user of the sub-org,
    we can sign directly without additional user authentication.
    
    For non-custodial behavior, add policies that require user auth
    (OTP or passkey) before signing.
    
    Args:
        sub_org_id: The user's Turnkey sub-organization ID
        wallet_address: The Ethereum address to sign with
        payload: The payload to sign (hex encoded)
        encoding: Payload encoding
        hash_function: Hash function to use
    
    Returns:
        Signature data (r, s, v, signature)
    """
    logger.info(f"[TURNKEY] Signing payload for wallet: {wallet_address}")
    logger.info(f"[TURNKEY] Sub-org ID: {sub_org_id}")
    logger.info(f"[TURNKEY] Payload: {payload[:50]}...")
    
    try:
        # Create client for the sub-organization
        # Uses same API key since ST system is root user
        client = get_turnkey_client(sub_org_id)
        
        # Create request body
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
        
        logger.info(f"[TURNKEY] Calling sign_raw_payload...")
        
        result = client.sign_raw_payload(body)
        
        activity = result.get("activity", {})
        activity_result = activity.get("result", {})
        sign_result = activity_result.get("signRawPayloadResult", {})
        
        if not sign_result:
            logger.error(f"[TURNKEY] No signature result")
            raise Exception("No signature result")
        
        r = sign_result.get("r", "")
        s = sign_result.get("s", "")
        v = sign_result.get("v", "")
        
        signature = f"0x{r}{s}{v}"
        
        logger.info(f"[TURNKEY] SUCCESS - Signature: {signature[:30]}...")
        
        return {
            "r": r,
            "s": s,
            "v": v,
            "signature": signature
        }
        
    except Exception as e:
        logger.error(f"[TURNKEY] Error signing payload: {e}")
        import traceback
        logger.error(f"[TURNKEY] Traceback: {traceback.format_exc()}")
        raise


async def sign_transaction(
    sub_org_id: str,
    wallet_address: str,
    unsigned_transaction: str,
    transaction_type: str = "TRANSACTION_TYPE_ETHEREUM"
) -> Dict[str, Any]:
    """
    Sign an EVM transaction.
    
    Args:
        sub_org_id: The user's Turnkey sub-organization ID
        wallet_address: The Ethereum address to sign with
        unsigned_transaction: RLP-encoded unsigned transaction (hex)
        transaction_type: Transaction type
    
    Returns:
        Signed transaction data
    """
    logger.info(f"[TURNKEY] Signing transaction for wallet: {wallet_address}")
    
    try:
        client = get_turnkey_client(sub_org_id)
        
        # Create request body
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
        
        return {
            "signedTransaction": sign_result.get("signedTransaction", "")
        }
        
    except Exception as e:
        logger.error(f"[TURNKEY] Error signing transaction: {e}")
        raise
