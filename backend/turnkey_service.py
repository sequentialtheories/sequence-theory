"""
TURNKEY EMBEDDED WALLET SERVICE
================================

Handles all Turnkey API interactions for:
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
import json
import time
import hashlib
import httpx
from typing import Optional, Dict, Any, Tuple
from datetime import datetime
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.backends import default_backend
import logging

logger = logging.getLogger(__name__)

# Turnkey Configuration
TURNKEY_API_BASE_URL = "https://api.turnkey.com"
TURNKEY_ORGANIZATION_ID = os.environ.get('TURNKEY_ORGANIZATION_ID', '')
TURNKEY_API_PUBLIC_KEY = os.environ.get('TURNKEY_API_PUBLIC_KEY', '')
TURNKEY_API_PRIVATE_KEY = os.environ.get('TURNKEY_API_PRIVATE_KEY', '')


def get_timestamp_ms() -> str:
    """Get current timestamp in milliseconds as string"""
    return str(int(datetime.utcnow().timestamp() * 1000))


def create_api_stamp(body: str) -> str:
    """
    Create API stamp for Turnkey request authentication.
    
    The stamp is a JSON object containing:
    - publicKey: The API public key
    - signature: ECDSA signature of the request body
    - scheme: The signing scheme (SIGNATURE_SCHEME_TK_API_P256)
    """
    try:
        # Convert hex private key to bytes
        private_key_bytes = bytes.fromhex(TURNKEY_API_PRIVATE_KEY)
        
        # Create EC private key from raw bytes
        # Turnkey uses secp256k1 curve
        private_key = ec.derive_private_key(
            int.from_bytes(private_key_bytes, 'big'),
            ec.SECP256K1(),
            default_backend()
        )
        
        # Hash the body with SHA256
        body_bytes = body.encode('utf-8')
        
        # Sign the hash
        signature = private_key.sign(
            body_bytes,
            ec.ECDSA(hashes.SHA256())
        )
        
        # Create the stamp
        stamp = {
            "publicKey": TURNKEY_API_PUBLIC_KEY,
            "signature": signature.hex(),
            "scheme": "SIGNATURE_SCHEME_TK_API_P256"
        }
        
        return json.dumps(stamp)
    except Exception as e:
        logger.error(f"Failed to create API stamp: {e}")
        raise


async def turnkey_request(endpoint: str, body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Make authenticated request to Turnkey API.
    """
    url = f"{TURNKEY_API_BASE_URL}{endpoint}"
    body_str = json.dumps(body, separators=(',', ':'))
    
    try:
        stamp = create_api_stamp(body_str)
    except Exception as e:
        logger.error(f"Failed to create stamp: {e}")
        # For now, we'll make the request without proper stamping
        # This will be fixed once we have proper key format
        stamp = json.dumps({
            "publicKey": TURNKEY_API_PUBLIC_KEY,
            "signature": "",
            "scheme": "SIGNATURE_SCHEME_TK_API_P256"
        })
    
    headers = {
        "Content-Type": "application/json",
        "X-Stamp": stamp
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, content=body_str, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"Turnkey API error: {response.status_code} - {response.text}")
            raise Exception(f"Turnkey API error: {response.status_code}")
        
        return response.json()


async def create_sub_organization_with_wallet(
    user_email: str,
    user_name: str
) -> Tuple[str, str, str]:
    """
    Create a Turnkey sub-organization with an embedded wallet for a user.
    
    Returns:
        Tuple of (sub_org_id, wallet_id, eth_address)
    """
    body = {
        "type": "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7",
        "timestampMs": get_timestamp_ms(),
        "organizationId": TURNKEY_ORGANIZATION_ID,
        "parameters": {
            "subOrganizationName": f"User: {user_email}",
            "rootUsers": [{
                "userName": user_name or user_email.split('@')[0],
                "userEmail": user_email,
                "apiKeys": [],
                "authenticators": [],
                "oauthProviders": []
            }],
            "wallet": {
                "walletName": f"Wallet for {user_email}",
                "accounts": [{
                    "curve": "CURVE_SECP256K1",
                    "pathFormat": "PATH_FORMAT_BIP32",
                    "path": "m/44'/60'/0'/0/0",
                    "addressFormat": "ADDRESS_FORMAT_ETHEREUM"
                }]
            }
        }
    }
    
    result = await turnkey_request("/public/v1/submit/create_sub_organization", body)
    
    # Extract results
    activity_result = result.get("activity", {}).get("result", {})
    sub_org_result = activity_result.get("createSubOrganizationResultV7", {})
    
    sub_org_id = sub_org_result.get("subOrganizationId", "")
    wallet_data = sub_org_result.get("wallet", {})
    wallet_id = wallet_data.get("walletId", "")
    addresses = wallet_data.get("addresses", [])
    eth_address = addresses[0] if addresses else ""
    
    logger.info(f"Created sub-org {sub_org_id} with wallet {wallet_id} for {user_email}")
    
    return sub_org_id, wallet_id, eth_address


async def init_email_auth(email: str, target_sub_org_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Initialize email OTP authentication.
    
    This uses Turnkey's built-in email authentication.
    """
    body = {
        "type": "ACTIVITY_TYPE_EMAIL_AUTH_V2",
        "timestampMs": get_timestamp_ms(),
        "organizationId": target_sub_org_id or TURNKEY_ORGANIZATION_ID,
        "parameters": {
            "email": email,
            "targetPublicKey": "",  # Will be set by frontend
            "apiKeyName": f"Email Auth Key - {get_timestamp_ms()}",
            "expirationSeconds": "900",  # 15 minutes
            "emailCustomization": {
                "appName": "Sequence Theory",
                "templateVariables": json.dumps({
                    "product_name": "The Vault Club"
                })
            }
        }
    }
    
    result = await turnkey_request("/public/v1/submit/email_auth", body)
    return result


async def init_email_recovery(email: str, target_sub_org_id: str) -> Dict[str, Any]:
    """
    Initialize email-based wallet recovery for existing users.
    """
    body = {
        "type": "ACTIVITY_TYPE_INIT_USER_EMAIL_RECOVERY",
        "timestampMs": get_timestamp_ms(),
        "organizationId": target_sub_org_id,
        "parameters": {
            "email": email,
            "targetPublicKey": "",  # Will be set by frontend
            "expirationSeconds": "900"
        }
    }
    
    result = await turnkey_request("/public/v1/submit/init_user_email_recovery", body)
    return result


async def sign_message(
    sub_org_id: str,
    wallet_address: str,
    message: str,
    encoding: str = "PAYLOAD_ENCODING_TEXT_UTF8"
) -> Dict[str, Any]:
    """
    Sign a message with the user's wallet.
    
    Args:
        sub_org_id: The user's Turnkey sub-organization ID
        wallet_address: The Ethereum address to sign with
        message: The message to sign
        encoding: Payload encoding (TEXT_UTF8 or HEXADECIMAL)
    
    Returns:
        Signature data (r, s, v, signature)
    """
    # For text messages, we need to hash them first
    if encoding == "PAYLOAD_ENCODING_TEXT_UTF8":
        # Ethereum personal message prefix
        prefix = f"\x19Ethereum Signed Message:\n{len(message)}"
        prefixed_message = prefix + message
        message_hash = hashlib.sha256(prefixed_message.encode()).hexdigest()
        payload = message_hash
        hash_function = "HASH_FUNCTION_NO_OP"  # Already hashed
    else:
        payload = message
        hash_function = "HASH_FUNCTION_KECCAK256"
    
    body = {
        "type": "ACTIVITY_TYPE_SIGN_RAW_PAYLOAD_V2",
        "timestampMs": get_timestamp_ms(),
        "organizationId": sub_org_id,
        "parameters": {
            "signWith": wallet_address,
            "payload": payload,
            "encoding": "PAYLOAD_ENCODING_HEXADECIMAL",
            "hashFunction": hash_function
        }
    }
    
    result = await turnkey_request("/public/v1/submit/sign_raw_payload", body)
    
    activity_result = result.get("activity", {}).get("result", {})
    sign_result = activity_result.get("signRawPayloadResult", {})
    
    return {
        "r": sign_result.get("r", ""),
        "s": sign_result.get("s", ""),
        "v": sign_result.get("v", ""),
        "signature": f"0x{sign_result.get('r', '')}{sign_result.get('s', '')}{sign_result.get('v', '')}"
    }


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
        transaction_type: Transaction type (ETHEREUM, LEGACY, EIP1559, EIP2930)
    
    Returns:
        Signed transaction data
    """
    body = {
        "type": "ACTIVITY_TYPE_SIGN_TRANSACTION_V2",
        "timestampMs": get_timestamp_ms(),
        "organizationId": sub_org_id,
        "parameters": {
            "signWith": wallet_address,
            "type": transaction_type,
            "unsignedTransaction": unsigned_transaction
        }
    }
    
    result = await turnkey_request("/public/v1/submit/sign_transaction", body)
    
    activity_result = result.get("activity", {}).get("result", {})
    sign_result = activity_result.get("signTransactionResult", {})
    
    return {
        "signedTransaction": sign_result.get("signedTransaction", "")
    }


async def get_wallet_info(sub_org_id: str, wallet_id: str) -> Dict[str, Any]:
    """
    Get wallet information from Turnkey.
    """
    body = {
        "organizationId": sub_org_id,
        "walletId": wallet_id
    }
    
    result = await turnkey_request("/public/v1/query/get_wallet", body)
    return result.get("wallet", {})


async def create_passkey_authenticator(
    sub_org_id: str,
    user_id: str,
    attestation: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Register a passkey authenticator for a user.
    """
    body = {
        "type": "ACTIVITY_TYPE_CREATE_AUTHENTICATORS_V2",
        "timestampMs": get_timestamp_ms(),
        "organizationId": sub_org_id,
        "parameters": {
            "userId": user_id,
            "authenticators": [{
                "authenticatorName": f"Passkey - {get_timestamp_ms()}",
                "challenge": attestation.get("challenge", ""),
                "attestation": attestation
            }]
        }
    }
    
    result = await turnkey_request("/public/v1/submit/create_authenticators", body)
    return result
