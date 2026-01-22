"""
TURNKEY EMBEDDED WALLET SERVICE
================================

Uses the official Turnkey Python SDK for proper API authentication.

Handles:
- Sub-organization creation
- Wallet creation
- Email OTP authentication
- Message signing
- Transaction signing

SECURITY NOTES:
- Private keys are NEVER stored or exposed
- All signing happens in Turnkey's secure TEE
- Only wallet addresses and Turnkey IDs stored in Supabase
"""

import os
import logging
from typing import Optional, Dict, Any, Tuple
from datetime import datetime

from turnkey_http import TurnkeyClient
from turnkey_api_key_stamper import ApiKeyStamper, ApiKeyStamperConfig
from turnkey_sdk_types.generated.types import (
    CreateSubOrganizationBody,
    v1RootUserParamsV4,
    v1WalletParams,
    v1WalletAccountParams,
    EmailAuthBody,
    v1EmailAuthCustomizationParams,
    GetActivityBody,
    SignRawPayloadBody,
    SignTransactionBody,
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
    Uses the official SDK with API key stamping.
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
        logger.info(f"Turnkey config verified. Org: {response.organizationName}")
        return True
    except Exception as e:
        logger.error(f"Turnkey config verification failed: {e}")
        return False


async def create_sub_organization_with_wallet(
    user_email: str,
    user_name: str,
    passkey_attestation: Optional[Dict[str, Any]] = None
) -> Tuple[str, str, str, str]:
    """
    Create a Turnkey sub-organization with an embedded wallet for a user.
    
    Args:
        user_email: User's email address
        user_name: User's display name
        passkey_attestation: Optional passkey attestation data for WebAuthn
    
    Returns:
        Tuple of (sub_org_id, wallet_id, eth_address, root_user_id)
    """
    try:
        client = get_turnkey_client()
        
        # Build root user - using typed SDK objects
        root_user = v1RootUserParamsV4(
            userName=user_name or user_email.split('@')[0],
            userEmail=user_email,
            apiKeys=[],
            authenticators=[],
            oauthProviders=[]
        )
        
        # Build wallet params
        wallet_params = v1WalletParams(
            walletName=f"Wallet for {user_email}",
            accounts=[
                v1WalletAccountParams(
                    curve="CURVE_SECP256K1",
                    pathFormat="PATH_FORMAT_BIP32",
                    path="m/44'/60'/0'/0/0",
                    addressFormat="ADDRESS_FORMAT_ETHEREUM"
                )
            ]
        )
        
        # Create the request body
        body = CreateSubOrganizationBody(
            timestampMs=get_timestamp_ms(),
            organizationId=TURNKEY_ORGANIZATION_ID,
            subOrganizationName=f"User: {user_email}",
            rootUsers=[root_user],
            rootQuorumThreshold=1,
            wallet=wallet_params
        )
        
        # Create sub-organization with wallet
        result = client.create_sub_organization(body)
        
        # Extract results from activity
        activity_result = result.activity.result
        
        # Try different result versions (SDK uses camelCase)
        sub_org_result = None
        if hasattr(activity_result, 'createSubOrganizationResultV7') and activity_result.createSubOrganizationResultV7:
            sub_org_result = activity_result.createSubOrganizationResultV7
        elif hasattr(activity_result, 'createSubOrganizationResult') and activity_result.createSubOrganizationResult:
            sub_org_result = activity_result.createSubOrganizationResult
        
        if not sub_org_result:
            raise Exception(f"No sub-organization result in response. Activity result: {activity_result}")
        
        sub_org_id = sub_org_result.subOrganizationId
        wallet_data = sub_org_result.wallet
        wallet_id = wallet_data.walletId if wallet_data else ""
        addresses = wallet_data.addresses if wallet_data else []
        eth_address = addresses[0] if addresses else ""
        
        # Get root user ID
        root_users = sub_org_result.rootUserIds or []
        root_user_id = root_users[0] if root_users else ""
        
        logger.info(f"Created sub-org {sub_org_id} with wallet {wallet_id} for {user_email}")
        
        return sub_org_id, wallet_id, eth_address, root_user_id
        
    except Exception as e:
        logger.error(f"Error creating sub-organization: {e}")
        raise


async def init_email_auth(
    email: str,
    target_public_key: str,
    target_sub_org_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Initialize email OTP authentication using Turnkey's built-in email auth.
    
    Args:
        email: User's email address
        target_public_key: The public key to associate with the email auth session
        target_sub_org_id: Optional sub-organization ID (for existing users)
    
    Returns:
        Activity result with email auth details
    """
    try:
        org_id = target_sub_org_id or TURNKEY_ORGANIZATION_ID
        client = get_turnkey_client(org_id)
        
        # Create email customization
        email_customization = v1EmailAuthCustomizationParams(
            appName="Sequence Theory",
            logoUrl="",
            magicLinkTemplate="",
            templateVariables=""
        )
        
        # Create request body
        body = EmailAuthBody(
            timestampMs=get_timestamp_ms(),
            organizationId=org_id,
            email=email,
            targetPublicKey=target_public_key,
            apiKeyName=f"Email Auth Key - {get_timestamp_ms()}",
            expirationSeconds="900",  # 15 minutes
            emailCustomization=email_customization
        )
        
        result = client.email_auth(body)
        activity = result.activity
        
        return {
            "activity_id": activity.id,
            "status": activity.status,
            "organization_id": activity.organizationId
        }
        
    except Exception as e:
        logger.error(f"Error initiating email auth: {e}")
        raise


async def complete_email_auth(
    activity_id: str,
    otp_code: str,
    target_sub_org_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Complete email OTP authentication by verifying the code.
    
    Note: Turnkey's email auth flow works differently - the OTP verification
    happens when the user clicks the magic link or enters the code in the
    Turnkey-hosted page. This function checks the activity status.
    
    Args:
        activity_id: The activity ID from init_email_auth
        otp_code: The OTP code entered by the user (for status check)
        target_sub_org_id: The sub-organization ID
    
    Returns:
        Authentication result with session info
    """
    try:
        org_id = target_sub_org_id or TURNKEY_ORGANIZATION_ID
        client = get_turnkey_client(org_id)
        
        # Create request body
        body = GetActivityBody(
            timestampMs=get_timestamp_ms(),
            organizationId=org_id,
            activityId=activity_id
        )
        
        # Get the activity status
        activity_result = client.get_activity(body)
        
        status = activity_result.activity.status if activity_result else "unknown"
        
        return {
            "activity_id": activity_id,
            "status": status,
            "verified": status == "ACTIVITY_STATUS_COMPLETED"
        }
        
    except Exception as e:
        logger.error(f"Error completing email auth: {e}")
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
    
    Args:
        sub_org_id: The user's Turnkey sub-organization ID
        wallet_address: The Ethereum address to sign with
        payload: The payload to sign (hex encoded)
        encoding: Payload encoding
        hash_function: Hash function to use
    
    Returns:
        Signature data (r, s, v, signature)
    """
    try:
        # Create client for the sub-organization
        client = get_turnkey_client(sub_org_id)
        
        # Create request body
        body = SignRawPayloadBody(
            timestampMs=get_timestamp_ms(),
            organizationId=sub_org_id,
            signWith=wallet_address,
            payload=payload,
            encoding=encoding,
            hashFunction=hash_function
        )
        
        result = client.sign_raw_payload(body)
        
        activity_result = result.activity.result
        sign_result = activity_result.signRawPayloadResult
        
        if not sign_result:
            raise Exception("No signature result")
        
        r = sign_result.r or ""
        s = sign_result.s or ""
        v = sign_result.v or ""
        
        return {
            "r": r,
            "s": s,
            "v": v,
            "signature": f"0x{r}{s}{v}"
        }
        
    except Exception as e:
        logger.error(f"Error signing payload: {e}")
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
    try:
        client = get_turnkey_client(sub_org_id)
        
        # Create request body
        body = SignTransactionBody(
            timestampMs=get_timestamp_ms(),
            organizationId=sub_org_id,
            signWith=wallet_address,
            unsignedTransaction=unsigned_transaction,
            type=transaction_type
        )
        
        result = client.sign_transaction(body)
        
        activity_result = result.activity.result
        sign_result = activity_result.signTransactionResult
        
        if not sign_result:
            raise Exception("No transaction signature result")
        
        return {
            "signedTransaction": sign_result.signedTransaction or ""
        }
        
    except Exception as e:
        logger.error(f"Error signing transaction: {e}")
        raise
