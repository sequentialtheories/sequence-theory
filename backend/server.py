from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import httpx
import hashlib
import base64
import json
import time
from pathlib import Path
from pydantic import BaseModel
from typing import Optional
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.backends import default_backend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Supabase config
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://qldjhlnsphlixmzzrdwi.supabase.co')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')

# Turnkey config
TURNKEY_API_PUBLIC_KEY = os.environ.get('TURNKEY_API_PUBLIC_KEY', '')
TURNKEY_API_PRIVATE_KEY = os.environ.get('TURNKEY_API_PRIVATE_KEY', '')
TURNKEY_ORGANIZATION_ID = os.environ.get('TURNKEY_ORGANIZATION_ID', '')

class WalletProvisionRequest(BaseModel):
    user_id: str
    email: str

class WalletProvisionResponse(BaseModel):
    success: bool
    wallet_address: Optional[str] = None
    error: Optional[str] = None

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def base64url_decode(data: str) -> bytes:
    padding = 4 - len(data) % 4
    if padding != 4:
        data += '=' * padding
    return base64.urlsafe_b64decode(data)

def sign_turnkey_request(payload: str) -> dict:
    """Sign a Turnkey API request using the API private key"""
    try:
        # Decode the private key (base64url encoded PKCS8)
        private_key_bytes = base64url_decode(TURNKEY_API_PRIVATE_KEY)
        
        # Load the private key
        private_key = serialization.load_der_private_key(
            private_key_bytes,
            password=None,
            backend=default_backend()
        )
        
        # Sign the payload
        signature = private_key.sign(
            payload.encode('utf-8'),
            ec.ECDSA(hashes.SHA256())
        )
        
        # Encode signature as base64url
        signature_b64 = base64url_encode(signature)
        
        return {
            'publicKey': TURNKEY_API_PUBLIC_KEY,
            'signature': signature_b64,
            'scheme': 'SIGNATURE_SCHEME_TK_API_P256'
        }
    except Exception as e:
        logger.error(f"Error signing request: {e}")
        raise

async def create_turnkey_wallet(user_id: str, email: str) -> dict:
    """Create a Turnkey sub-organization and wallet for a user"""
    
    if not all([TURNKEY_API_PUBLIC_KEY, TURNKEY_API_PRIVATE_KEY, TURNKEY_ORGANIZATION_ID]):
        raise HTTPException(status_code=500, detail="Turnkey credentials not configured")
    
    timestamp = str(int(time.time() * 1000))
    
    # Create sub-organization WITHOUT authenticators (invisible wallet)
    create_sub_org_payload = {
        "subOrganizationName": f"User-{user_id[:8]}",
        "rootUsers": [{
            "userName": email.split('@')[0],
            "userEmail": email,
            "apiKeys": [],
            "authenticators": [],  # No authenticators = invisible wallet
            "oauthProviders": []
        }],
        "rootQuorumThreshold": 1,
        "wallet": {
            "walletName": "Polygon Wallet",
            "accounts": [{
                "curve": "CURVE_SECP256K1",
                "pathFormat": "PATH_FORMAT_BIP32",
                "path": "m/44'/60'/0'/0/0",
                "addressFormat": "ADDRESS_FORMAT_ETHEREUM"
            }]
        }
    }
    
    request_body = {
        "type": "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7",
        "organizationId": TURNKEY_ORGANIZATION_ID,
        "timestampMs": timestamp,
        "parameters": create_sub_org_payload
    }
    
    payload_string = json.dumps(request_body, separators=(',', ':'))
    stamp = sign_turnkey_request(payload_string)
    
    logger.info(f"Creating Turnkey wallet for user: {user_id}")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.turnkey.com/public/v1/submit/create_sub_organization",
            headers={
                "Content-Type": "application/json",
                "X-Stamp": json.dumps(stamp)
            },
            content=payload_string
        )
        
        if response.status_code != 200:
            logger.error(f"Turnkey API error: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail=f"Turnkey API error: {response.status_code}")
        
        data = response.json()
        
    # Extract wallet info
    result = data.get('activity', {}).get('result', {})
    result_v7 = result.get('createSubOrganizationResultV7', {})
    result_v4 = result.get('createSubOrganizationResultV4', {})
    wallet_result = result_v7 or result_v4
    
    sub_org_id = wallet_result.get('subOrganizationId')
    wallet_info = wallet_result.get('wallet', {})
    wallet_id = wallet_info.get('walletId')
    wallet_address = wallet_info.get('addresses', [None])[0]
    
    if not wallet_address:
        logger.error(f"No wallet address in response: {data}")
        raise HTTPException(status_code=500, detail="Failed to get wallet address from Turnkey")
    
    logger.info(f"Wallet created: {wallet_address} for user: {user_id}")
    
    return {
        "wallet_address": wallet_address,
        "sub_org_id": sub_org_id,
        "wallet_id": wallet_id
    }

async def update_supabase_profile(user_id: str, wallet_address: str):
    """Update the user's profile in Supabase with their wallet address"""
    if not SUPABASE_SERVICE_KEY:
        logger.warning("SUPABASE_SERVICE_ROLE_KEY not configured, skipping profile update")
        return
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        # Update profiles table
        response = await client.patch(
            f"{SUPABASE_URL}/rest/v1/profiles?user_id=eq.{user_id}",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            json={"eth_address": wallet_address}
        )
        
        if response.status_code not in [200, 204]:
            logger.error(f"Failed to update profile: {response.status_code} - {response.text}")
        else:
            logger.info(f"Profile updated with wallet address for user: {user_id}")
        
        # Also insert into user_wallets table
        wallet_data = {
            "user_id": user_id,
            "wallet_address": wallet_address,
            "network": "polygon",
            "provider": "turnkey",
            "provenance": "turnkey_invisible",
            "created_via": "backend_api"
        }
        
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/user_wallets",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            json=wallet_data
        )
        
        if response.status_code not in [200, 201, 204, 409]:  # 409 = conflict (already exists)
            logger.error(f"Failed to insert wallet: {response.status_code} - {response.text}")

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/health")
async def health():
    return {
        "status": "healthy",
        "turnkey_configured": bool(TURNKEY_API_PUBLIC_KEY and TURNKEY_API_PRIVATE_KEY and TURNKEY_ORGANIZATION_ID),
        "supabase_configured": bool(SUPABASE_SERVICE_KEY)
    }

@api_router.post("/provision-wallet", response_model=WalletProvisionResponse)
async def provision_wallet(request: WalletProvisionRequest, authorization: Optional[str] = Header(None)):
    """
    Provision an invisible Turnkey wallet for a user.
    Called automatically after signup - completely invisible to user.
    """
    try:
        logger.info(f"Provisioning wallet for user: {request.user_id}")
        
        # Check if wallet already exists in Supabase
        if SUPABASE_SERVICE_KEY:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{SUPABASE_URL}/rest/v1/profiles?user_id=eq.{request.user_id}&select=eth_address",
                    headers={
                        "apikey": SUPABASE_SERVICE_KEY,
                        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data and data[0].get('eth_address'):
                        logger.info(f"Wallet already exists for user: {request.user_id}")
                        return WalletProvisionResponse(
                            success=True,
                            wallet_address=data[0]['eth_address']
                        )
        
        # Create Turnkey wallet
        wallet_data = await create_turnkey_wallet(request.user_id, request.email)
        
        # Update Supabase
        await update_supabase_profile(request.user_id, wallet_data['wallet_address'])
        
        return WalletProvisionResponse(
            success=True,
            wallet_address=wallet_data['wallet_address']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error provisioning wallet: {e}")
        return WalletProvisionResponse(
            success=False,
            error=str(e)
        )

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown():
    pass
