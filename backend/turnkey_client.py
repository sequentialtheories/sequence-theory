"""
Standalone Turnkey API Client
=============================

This module provides a self-contained implementation of the Turnkey API client
using only standard PyPI packages (cryptography, requests). No external Turnkey
SDK packages required.

This enables deployment without the turnkey-http, turnkey-api-key-stamper, or
turnkey-sdk-types packages which are not available on PyPI.
"""

import json
import requests
from base64 import urlsafe_b64encode
from dataclasses import dataclass
from typing import Optional, Dict, Any
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.backends import default_backend


# ============================================================================
# API Key Stamper (replaces turnkey-api-key-stamper)
# ============================================================================

@dataclass
class ApiKeyStamperConfig:
    """Configuration for API key stamper."""
    api_public_key: str
    api_private_key: str


@dataclass
class TStamp:
    """Stamp result containing header name and value."""
    stamp_header_name: str
    stamp_header_value: str


def _sign_with_api_key(public_key: str, private_key: str, content: str) -> str:
    """Sign content with API key and validate public key matches."""
    # Derive private key from hex
    ec_private_key = ec.derive_private_key(
        int(private_key, 16), ec.SECP256R1(), default_backend()
    )

    # Get the public key from the private key to validate
    public_key_obj = ec_private_key.public_key()
    public_key_bytes = public_key_obj.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.CompressedPoint,
    )
    derived_public_key = public_key_bytes.hex()

    # Validate that the provided public key matches
    if derived_public_key != public_key:
        raise ValueError(
            f"Bad API key. Expected to get public key {public_key}, "
            f"got {derived_public_key}"
        )

    # Sign the content
    signature = ec_private_key.sign(content.encode(), ec.ECDSA(hashes.SHA256()))
    return signature.hex()


class ApiKeyStamper:
    """Stamps requests to the Turnkey API for authentication using API keys."""

    def __init__(self, config: ApiKeyStamperConfig):
        self.api_public_key = config.api_public_key
        self.api_private_key = config.api_private_key
        self.stamp_header_name = "X-Stamp"

    def stamp(self, content: str) -> TStamp:
        """Create an authentication stamp for the given content."""
        signature = _sign_with_api_key(
            self.api_public_key, self.api_private_key, content
        )

        stamp = {
            "publicKey": self.api_public_key,
            "scheme": "SIGNATURE_SCHEME_TK_API_P256",
            "signature": signature,
        }

        # Encode stamp to base64url
        stamp_header_value = (
            urlsafe_b64encode(json.dumps(stamp).encode()).decode().rstrip("=")
        )

        return TStamp(
            stamp_header_name=self.stamp_header_name,
            stamp_header_value=stamp_header_value,
        )


# ============================================================================
# Turnkey HTTP Client (replaces turnkey-http)
# ============================================================================

class TurnkeyClient:
    """HTTP client for the Turnkey API with request stamping."""

    def __init__(
        self,
        base_url: str = "https://api.turnkey.com",
        stamper: Optional[ApiKeyStamper] = None,
        organization_id: Optional[str] = None,
    ):
        self.base_url = base_url.rstrip("/")
        self.stamper = stamper
        self.organization_id = organization_id

    def _make_request(self, method: str, path: str, body: Optional[Dict] = None) -> Dict[str, Any]:
        """Make a stamped request to the Turnkey API."""
        url = f"{self.base_url}{path}"
        
        # Prepare body
        body_str = json.dumps(body) if body else "{}"
        
        # Create headers
        headers = {
            "Content-Type": "application/json",
        }
        
        # Add stamp if stamper is configured
        if self.stamper:
            stamp = self.stamper.stamp(body_str)
            headers[stamp.stamp_header_name] = stamp.stamp_header_value
        
        # Make request
        if method.upper() == "POST":
            response = requests.post(url, data=body_str, headers=headers)
        elif method.upper() == "GET":
            response = requests.get(url, headers=headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        # Parse response
        try:
            result = response.json()
        except:
            result = {"raw_response": response.text}
        
        if not response.ok:
            raise Exception(f"Turnkey API error: {response.status_code} - {result}")
        
        return result

    def get_whoami(self) -> Dict[str, Any]:
        """Get the current user/organization info."""
        body = {
            "organizationId": self.organization_id
        }
        return self._make_request("POST", "/public/v1/query/whoami", body)

    def create_sub_organization(self, body: Dict[str, Any]) -> Dict[str, Any]:
        """Create a sub-organization."""
        return self._make_request("POST", "/public/v1/submit/create_sub_organization", body)

    def init_otp_auth(self, body: Dict[str, Any]) -> Dict[str, Any]:
        """Initialize OTP authentication."""
        return self._make_request("POST", "/public/v1/submit/init_otp_auth", body)

    def otp_auth(self, body: Dict[str, Any]) -> Dict[str, Any]:
        """Verify OTP authentication."""
        return self._make_request("POST", "/public/v1/submit/otp_auth", body)

    def sign_raw_payload(self, body: Dict[str, Any]) -> Dict[str, Any]:
        """Sign a raw payload."""
        return self._make_request("POST", "/public/v1/submit/sign_raw_payload", body)

    def sign_transaction(self, body: Dict[str, Any]) -> Dict[str, Any]:
        """Sign a transaction."""
        return self._make_request("POST", "/public/v1/submit/sign_transaction", body)


# ============================================================================
# Type definitions (replaces turnkey-sdk-types)
# ============================================================================

@dataclass
class InitOtpAuthBody:
    """Body for init_otp_auth request."""
    type: str = "ACTIVITY_TYPE_INIT_OTP_AUTH"
    timestampMs: str = ""
    organizationId: str = ""
    parameters: Dict[str, Any] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "timestampMs": self.timestampMs,
            "organizationId": self.organizationId,
            "parameters": self.parameters or {}
        }


@dataclass
class VerifyOtpBody:
    """Body for otp_auth (verify) request."""
    type: str = "ACTIVITY_TYPE_OTP_AUTH"
    timestampMs: str = ""
    organizationId: str = ""
    parameters: Dict[str, Any] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "timestampMs": self.timestampMs,
            "organizationId": self.organizationId,
            "parameters": self.parameters or {}
        }


@dataclass
class CreateSubOrganizationBody:
    """Body for create_sub_organization request."""
    type: str = "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7"
    timestampMs: str = ""
    organizationId: str = ""
    parameters: Dict[str, Any] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "timestampMs": self.timestampMs,
            "organizationId": self.organizationId,
            "parameters": self.parameters or {}
        }


@dataclass 
class v1RootUserParamsV4:
    """Root user parameters for sub-organization creation."""
    userName: str = ""
    userEmail: str = ""
    apiKeys: list = None
    authenticators: list = None
    oauthProviders: list = None


@dataclass
class v1WalletParams:
    """Wallet parameters for sub-organization creation."""
    walletName: str = ""
    accounts: list = None


@dataclass
class v1WalletAccountParams:
    """Wallet account parameters."""
    curve: str = "CURVE_SECP256K1"
    pathFormat: str = "PATH_FORMAT_BIP32"
    path: str = "m/44'/60'/0'/0/0"
    addressFormat: str = "ADDRESS_FORMAT_ETHEREUM"


@dataclass
class SignRawPayloadBody:
    """Body for sign_raw_payload request."""
    type: str = "ACTIVITY_TYPE_SIGN_RAW_PAYLOAD_V2"
    timestampMs: str = ""
    organizationId: str = ""
    parameters: Dict[str, Any] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "timestampMs": self.timestampMs,
            "organizationId": self.organizationId,
            "parameters": self.parameters or {}
        }


@dataclass
class SignTransactionBody:
    """Body for sign_transaction request."""
    type: str = "ACTIVITY_TYPE_SIGN_TRANSACTION_V2"
    timestampMs: str = ""
    organizationId: str = ""
    parameters: Dict[str, Any] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "timestampMs": self.timestampMs,
            "organizationId": self.organizationId,
            "parameters": self.parameters or {}
        }
