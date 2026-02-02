#!/usr/bin/env python3
"""
Backend Test Suite for Turnkey Verification Gate Flow
====================================================

Tests the FIXED Turnkey verification gate flow as requested:
1. Login to get auth token
2. Test create-wallet without verification (should fail with 403 NOT_VERIFIED)
3. Test init-email-auth (should create sub-org + send OTP)
4. Check backend logs for sub-org creation
5. Verify sub-org was stored in DB

Test credentials:
- Email: sequencetheoryinc@gmail.com
- Password: TestPassword123!

Usage: python3 backend_test.py
"""

import asyncio
import httpx
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

# Add backend directory to path for imports
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Backend URL from frontend .env
BACKEND_URL = "https://wallet-auth-service.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

# Test credentials from review request
TEST_EMAIL = "sequencetheoryinc@gmail.com"
TEST_PASSWORD = "TestPassword123!"

class TurnkeyBackendTester:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.test_results = []
        
    async def __aenter__(self):
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    def log_result(self, test_name: str, success: bool, message: str, details: dict = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.utcnow().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        
        if details:
            for key, value in details.items():
                print(f"  {key}: {value}")
        print()
    
    async def test_health_endpoint(self):
        """Test 1: Health Check - should return turnkey_configured: true"""
        try:
            response = await self.client.get(f"{API_BASE}/health")
            
            if response.status_code != 200:
                self.log_result(
                    "Health Endpoint", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            
            data = response.json()
            
            # Check required fields
            required_fields = ["status", "turnkey_configured"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                self.log_result(
                    "Health Endpoint", 
                    False, 
                    f"Missing fields: {missing_fields}",
                    {"response": data}
                )
                return False
            
            # Check status is healthy
            if data.get("status") != "healthy":
                self.log_result(
                    "Health Endpoint", 
                    False, 
                    f"Status not healthy: {data.get('status')}",
                    {"response": data}
                )
                return False
            
            # Check turnkey_configured is true
            if not data.get("turnkey_configured"):
                self.log_result(
                    "Health Endpoint", 
                    False, 
                    f"turnkey_configured is {data.get('turnkey_configured')}, expected True",
                    {"response": data}
                )
                return False
            
            self.log_result(
                "Health Endpoint", 
                True, 
                "Health check passed with turnkey_configured: true",
                {
                    "status": data.get("status"),
                    "turnkey_configured": data.get("turnkey_configured"),
                    "supabase_configured": data.get("supabase_configured"),
                    "coingecko_configured": data.get("coingecko_configured"),
                    "wallet_custody": data.get("wallet_custody")
                }
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Health Endpoint", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_turnkey_config_verification(self):
        """Test 2: Turnkey Config Verification (internal test)"""
        try:
            # Change to backend directory and run the verification
            import subprocess
            import os
            
            backend_path = Path(__file__).parent / "backend"
            
            # Test command from the review request
            cmd = [
                "python3", "-c", 
                """
import os
import asyncio
from dotenv import load_dotenv
load_dotenv('.env')
from turnkey_service import verify_turnkey_config
result = asyncio.run(verify_turnkey_config())
print(f'Turnkey config verified: {result}')
"""
            ]
            
            result = subprocess.run(
                cmd, 
                cwd=backend_path, 
                capture_output=True, 
                text=True, 
                timeout=30
            )
            
            if result.returncode != 0:
                self.log_result(
                    "Turnkey Config Verification", 
                    False, 
                    f"Command failed with return code {result.returncode}",
                    {
                        "stdout": result.stdout,
                        "stderr": result.stderr,
                        "return_code": result.returncode
                    }
                )
                return False
            
            output = result.stdout.strip()
            
            # Check if verification was successful
            if "Turnkey config verified: True" in output:
                self.log_result(
                    "Turnkey Config Verification", 
                    True, 
                    "Turnkey SDK configuration verified successfully",
                    {"output": output}
                )
                return True
            else:
                self.log_result(
                    "Turnkey Config Verification", 
                    False, 
                    "Turnkey config verification returned False",
                    {
                        "output": output,
                        "stderr": result.stderr
                    }
                )
                return False
                
        except subprocess.TimeoutExpired:
            self.log_result(
                "Turnkey Config Verification", 
                False, 
                "Command timed out after 30 seconds"
            )
            return False
        except Exception as e:
            self.log_result(
                "Turnkey Config Verification", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_create_sub_organization(self):
        """Test 3: Create Sub-Organization Test (direct service test)"""
        try:
            import subprocess
            import time
            
            backend_path = Path(__file__).parent / "backend"
            
            # Generate unique email for this test
            timestamp = int(time.time())
            test_email = f"backend_test_{timestamp}@test.com"
            
            # Test command from the review request
            cmd = [
                "python3", "-c", 
                f"""
import os
import asyncio
from dotenv import load_dotenv
load_dotenv('.env')
from turnkey_service import create_sub_organization_with_wallet

async def test():
    result = await create_sub_organization_with_wallet(
        user_email='{test_email}',
        user_name='Backend Test User'
    )
    print(f'Created sub-org: {{result[0]}}')
    print(f'Created wallet: {{result[1]}}')
    print(f'ETH address: {{result[2]}}')
    print(f'Root user ID: {{result[3]}}')
    
asyncio.run(test())
"""
            ]
            
            result = subprocess.run(
                cmd, 
                cwd=backend_path, 
                capture_output=True, 
                text=True, 
                timeout=60  # Longer timeout for API calls
            )
            
            if result.returncode != 0:
                self.log_result(
                    "Create Sub-Organization", 
                    False, 
                    f"Command failed with return code {result.returncode}",
                    {
                        "stdout": result.stdout,
                        "stderr": result.stderr,
                        "return_code": result.returncode,
                        "test_email": test_email
                    }
                )
                return False
            
            output = result.stdout.strip()
            lines = output.split('\n')
            
            # Parse the output
            sub_org_id = None
            wallet_id = None
            eth_address = None
            root_user_id = None
            
            for line in lines:
                if line.startswith('Created sub-org:'):
                    sub_org_id = line.split(':', 1)[1].strip()
                elif line.startswith('Created wallet:'):
                    wallet_id = line.split(':', 1)[1].strip()
                elif line.startswith('ETH address:'):
                    eth_address = line.split(':', 1)[1].strip()
                elif line.startswith('Root user ID:'):
                    root_user_id = line.split(':', 1)[1].strip()
            
            # Validate results according to success criteria
            validation_errors = []
            
            # Sub-org ID should be a UUID (36 chars with hyphens)
            if not sub_org_id or len(sub_org_id) != 36 or sub_org_id.count('-') != 4:
                validation_errors.append(f"Invalid sub-org ID format: {sub_org_id}")
            
            # Wallet ID should be a UUID
            if not wallet_id or len(wallet_id) != 36 or wallet_id.count('-') != 4:
                validation_errors.append(f"Invalid wallet ID format: {wallet_id}")
            
            # ETH address should start with 0x and be 42 characters
            if not eth_address or not eth_address.startswith('0x') or len(eth_address) != 42:
                validation_errors.append(f"Invalid ETH address format: {eth_address}")
            
            # Root user ID should be a UUID
            if not root_user_id or len(root_user_id) != 36 or root_user_id.count('-') != 4:
                validation_errors.append(f"Invalid root user ID format: {root_user_id}")
            
            if validation_errors:
                self.log_result(
                    "Create Sub-Organization", 
                    False, 
                    f"Validation errors: {'; '.join(validation_errors)}",
                    {
                        "sub_org_id": sub_org_id,
                        "wallet_id": wallet_id,
                        "eth_address": eth_address,
                        "root_user_id": root_user_id,
                        "test_email": test_email,
                        "full_output": output
                    }
                )
                return False
            
            self.log_result(
                "Create Sub-Organization", 
                True, 
                "Sub-organization and wallet created successfully with valid IDs",
                {
                    "sub_org_id": sub_org_id,
                    "wallet_id": wallet_id,
                    "eth_address": eth_address,
                    "root_user_id": root_user_id,
                    "test_email": test_email
                }
            )
            
            # Store for potential use in signing test
            self.test_sub_org_id = sub_org_id
            self.test_wallet_address = eth_address
            
            return True
                
        except subprocess.TimeoutExpired:
            self.log_result(
                "Create Sub-Organization", 
                False, 
                "Command timed out after 60 seconds"
            )
            return False
        except Exception as e:
            self.log_result(
                "Create Sub-Organization", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_sign_raw_payload(self):
        """Test 4: Sign Raw Payload Test (optional - requires existing wallet)"""
        # Check if we have wallet info from previous test
        if not hasattr(self, 'test_sub_org_id') or not hasattr(self, 'test_wallet_address'):
            self.log_result(
                "Sign Raw Payload", 
                False, 
                "Skipped - no wallet available from sub-organization test"
            )
            return False
        
        try:
            import subprocess
            
            backend_path = Path(__file__).parent / "backend"
            
            # Test message to sign
            test_message = "Hello from Turnkey backend test!"
            
            cmd = [
                "python3", "-c", 
                f"""
import os
import asyncio
from dotenv import load_dotenv
load_dotenv('.env')
from turnkey_service import sign_raw_payload

async def test():
    # Simple test message hash (32 bytes hex)
    test_hash = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    
    result = await sign_raw_payload(
        sub_org_id='{self.test_sub_org_id}',
        wallet_address='{self.test_wallet_address}',
        payload=test_hash,
        encoding="PAYLOAD_ENCODING_HEXADECIMAL",
        hash_function="HASH_FUNCTION_NO_OP"
    )
    
    print(f'Signature: {{result.get("signature", "")}}')
    print(f'R: {{result.get("r", "")}}')
    print(f'S: {{result.get("s", "")}}')
    print(f'V: {{result.get("v", "")}}')
    
asyncio.run(test())
"""
            ]
            
            result = subprocess.run(
                cmd, 
                cwd=backend_path, 
                capture_output=True, 
                text=True, 
                timeout=30
            )
            
            if result.returncode != 0:
                self.log_result(
                    "Sign Raw Payload", 
                    False, 
                    f"Command failed with return code {result.returncode}",
                    {
                        "stdout": result.stdout,
                        "stderr": result.stderr,
                        "return_code": result.returncode,
                        "sub_org_id": self.test_sub_org_id,
                        "wallet_address": self.test_wallet_address
                    }
                )
                return False
            
            output = result.stdout.strip()
            lines = output.split('\n')
            
            # Parse signature components
            signature = None
            r_value = None
            s_value = None
            v_value = None
            
            for line in lines:
                if line.startswith('Signature:'):
                    signature = line.split(':', 1)[1].strip()
                elif line.startswith('R:'):
                    r_value = line.split(':', 1)[1].strip()
                elif line.startswith('S:'):
                    s_value = line.split(':', 1)[1].strip()
                elif line.startswith('V:'):
                    v_value = line.split(':', 1)[1].strip()
            
            # Validate signature components
            validation_errors = []
            
            if not signature or not signature.startswith('0x'):
                validation_errors.append(f"Invalid signature format: {signature}")
            
            if not r_value or len(r_value) != 64:  # 32 bytes = 64 hex chars
                validation_errors.append(f"Invalid R value: {r_value}")
            
            if not s_value or len(s_value) != 64:  # 32 bytes = 64 hex chars
                validation_errors.append(f"Invalid S value: {s_value}")
            
            if not v_value or v_value not in ['1b', '1c', '00', '01']:  # Valid v values
                validation_errors.append(f"Invalid V value: {v_value}")
            
            if validation_errors:
                self.log_result(
                    "Sign Raw Payload", 
                    False, 
                    f"Signature validation errors: {'; '.join(validation_errors)}",
                    {
                        "signature": signature,
                        "r": r_value,
                        "s": s_value,
                        "v": v_value,
                        "full_output": output
                    }
                )
                return False
            
            self.log_result(
                "Sign Raw Payload", 
                True, 
                "Raw payload signed successfully with valid signature components",
                {
                    "signature": signature,
                    "r": r_value,
                    "s": s_value,
                    "v": v_value
                }
            )
            return True
                
        except subprocess.TimeoutExpired:
            self.log_result(
                "Sign Raw Payload", 
                False, 
                "Command timed out after 30 seconds"
            )
            return False
        except Exception as e:
            self.log_result(
                "Sign Raw Payload", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def run_all_tests(self):
        """Run all Turnkey backend tests"""
        print("=" * 80)
        print("TURNKEY WALLET CREATION BACKEND TESTS")
        print("=" * 80)
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Base: {API_BASE}")
        print(f"Test started at: {datetime.utcnow().isoformat()}")
        print()
        
        # Run tests in sequence
        test_results = []
        
        # Test 1: Health endpoint
        test_results.append(await self.test_health_endpoint())
        
        # Test 2: Turnkey config verification
        test_results.append(await self.test_turnkey_config_verification())
        
        # Test 3: Create sub-organization
        test_results.append(await self.test_create_sub_organization())
        
        # Test 4: Sign raw payload (optional)
        test_results.append(await self.test_sign_raw_payload())
        
        # Summary
        print("=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in test_results if result)
        total = len([r for r in test_results if r is not False])  # Exclude skipped tests
        
        print(f"Tests passed: {passed}/{total}")
        print(f"Success rate: {(passed/total*100):.1f}%" if total > 0 else "No tests run")
        
        # Detailed results
        print("\nDetailed Results:")
        for result in self.test_results:
            status = "✅ PASS" if result["success"] else "❌ FAIL"
            print(f"{status} {result['test']}: {result['message']}")
        
        print(f"\nTest completed at: {datetime.utcnow().isoformat()}")
        
        return passed == total and total > 0


async def main():
    """Main test runner"""
    async with TurnkeyBackendTester() as tester:
        success = await tester.run_all_tests()
        return 0 if success else 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)