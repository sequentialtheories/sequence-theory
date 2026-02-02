#!/usr/bin/env python3
"""
Turnkey Verification Gate Test Suite
===================================

Tests the specific verification gate and wallet creation flow as requested:
1. Health Check: GET /api/health - Verify Turnkey is configured
2. Wallet Info (no auth): GET /api/turnkey/wallet-info - Should return 401
3. Verification Status: GET /api/turnkey/verification-status - Check if verification is enforced
4. Login to get auth token
5. POST /api/turnkey/create-wallet (without verification) - Should return 403 with {"error": "NOT_VERIFIED"}
6. POST /api/turnkey/init-email-auth - Should return {"ok": true}
7. GET /api/turnkey/verification-status - Check verification state
8. GET /api/turnkey/wallet-info - Check if user already has wallet

Credentials: sequencetheoryinc@gmail.com / TestPassword123!
Backend URL: Use REACT_APP_BACKEND_URL from frontend .env file
"""

import asyncio
import httpx
import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Backend URL from frontend .env
BACKEND_URL = "https://wallet-auth-service.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

# Test credentials
TEST_EMAIL = "sequencetheoryinc@gmail.com"
TEST_PASSWORD = "TestPassword123!"

class VerificationGateTester:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.test_results = []
        self.auth_token = None
        
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
    
    async def test_health_check(self):
        """Test 1: Health Check - Verify Turnkey is configured"""
        try:
            response = await self.client.get(f"{API_BASE}/health")
            
            if response.status_code != 200:
                self.log_result(
                    "Health Check", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            
            data = response.json()
            
            # Check turnkey_configured is true
            if not data.get("turnkey_configured"):
                self.log_result(
                    "Health Check", 
                    False, 
                    f"turnkey_configured is {data.get('turnkey_configured')}, expected True",
                    {"response": data}
                )
                return False
            
            self.log_result(
                "Health Check", 
                True, 
                "Turnkey is configured correctly",
                {
                    "status": data.get("status"),
                    "turnkey_configured": data.get("turnkey_configured"),
                    "wallet_custody": data.get("wallet_custody")
                }
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Health Check", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_wallet_info_no_auth(self):
        """Test 2: Wallet Info (no auth) - Should return 401"""
        try:
            response = await self.client.get(f"{API_BASE}/turnkey/wallet-info")
            
            if response.status_code != 401:
                self.log_result(
                    "Wallet Info (No Auth)", 
                    False, 
                    f"Expected 401, got {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            
            self.log_result(
                "Wallet Info (No Auth)", 
                True, 
                "Correctly returns 401 without authentication",
                {"status_code": response.status_code}
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Wallet Info (No Auth)", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_verification_status_no_auth(self):
        """Test 3: Verification Status (no auth) - Should return 401"""
        try:
            response = await self.client.get(f"{API_BASE}/turnkey/verification-status")
            
            if response.status_code != 401:
                self.log_result(
                    "Verification Status (No Auth)", 
                    False, 
                    f"Expected 401, got {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            
            self.log_result(
                "Verification Status (No Auth)", 
                True, 
                "Correctly returns 401 without authentication",
                {"status_code": response.status_code}
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Verification Status (No Auth)", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def login_user(self):
        """Login to get auth token"""
        try:
            # Supabase auth endpoint
            supabase_url = "https://qldjhlnsphlixmzzrdwi.supabase.co"
            auth_url = f"{supabase_url}/auth/v1/token?grant_type=password"
            
            login_data = {
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            }
            
            headers = {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZGpobG5zcGhsaXhtenpyZHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMTQyNjgsImV4cCI6MjA2ODU5MDI2OH0.mIYpRjdBedu6VQl4wBUIbNM1WwOAN_vHdKNhF5l4g9o",
                "Content-Type": "application/json"
            }
            
            response = await self.client.post(auth_url, json=login_data, headers=headers)
            
            if response.status_code != 200:
                self.log_result(
                    "User Login", 
                    False, 
                    f"Login failed: HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            
            data = response.json()
            access_token = data.get("access_token")
            
            if not access_token:
                self.log_result(
                    "User Login", 
                    False, 
                    "No access token in response",
                    {"response": data}
                )
                return False
            
            self.auth_token = access_token
            
            self.log_result(
                "User Login", 
                True, 
                f"Successfully logged in as {TEST_EMAIL}",
                {"email": TEST_EMAIL, "token_length": len(access_token)}
            )
            return True
            
        except Exception as e:
            self.log_result(
                "User Login", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_create_wallet_without_verification(self):
        """Test 4: Create wallet without verification - Should return 403 with NOT_VERIFIED"""
        if not self.auth_token:
            self.log_result(
                "Create Wallet (No Verification)", 
                False, 
                "No auth token available"
            )
            return False
        
        try:
            headers = {
                "Authorization": f"Bearer {self.auth_token}",
                "Content-Type": "application/json"
            }
            
            # Get user ID first
            user_response = await self.client.get(
                "https://qldjhlnsphlixmzzrdwi.supabase.co/auth/v1/user",
                headers={
                    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZGpobG5zcGhsaXhtenpyZHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMTQyNjgsImV4cCI6MjA2ODU5MDI2OH0.mIYpRjdBedu6VQl4wBUIbNM1WwOAN_vHdKNhF5l4g9o",
                    "Authorization": f"Bearer {self.auth_token}"
                }
            )
            
            if user_response.status_code != 200:
                self.log_result(
                    "Create Wallet (No Verification)", 
                    False, 
                    f"Failed to get user info: {user_response.status_code}",
                    {"status_code": user_response.status_code}
                )
                return False
            
            user_data = user_response.json()
            user_id = user_data.get("id")
            
            wallet_data = {
                "email": TEST_EMAIL,
                "user_id": user_id,
                "name": "Test User"
            }
            
            response = await self.client.post(
                f"{API_BASE}/turnkey/create-wallet", 
                json=wallet_data, 
                headers=headers
            )
            
            # Should return 403 with NOT_VERIFIED error
            if response.status_code != 403:
                self.log_result(
                    "Create Wallet (No Verification)", 
                    False, 
                    f"Expected 403, got {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            
            try:
                data = response.json()
                if data.get("error") != "NOT_VERIFIED":
                    self.log_result(
                        "Create Wallet (No Verification)", 
                        False, 
                        f"Expected error 'NOT_VERIFIED', got {data.get('error')}",
                        {"response": data}
                    )
                    return False
            except:
                self.log_result(
                    "Create Wallet (No Verification)", 
                    False, 
                    "Response is not valid JSON",
                    {"response": response.text}
                )
                return False
            
            self.log_result(
                "Create Wallet (No Verification)", 
                True, 
                "Verification gate correctly blocks wallet creation",
                {"status_code": response.status_code, "error": data.get("error")}
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Create Wallet (No Verification)", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_init_email_auth(self):
        """Test 5: Initialize email OTP - Should return {"ok": true}"""
        if not self.auth_token:
            self.log_result(
                "Init Email Auth", 
                False, 
                "No auth token available"
            )
            return False
        
        try:
            headers = {
                "Authorization": f"Bearer {self.auth_token}",
                "Content-Type": "application/json"
            }
            
            otp_data = {
                "email": TEST_EMAIL
            }
            
            response = await self.client.post(
                f"{API_BASE}/turnkey/init-email-auth", 
                json=otp_data, 
                headers=headers
            )
            
            if response.status_code != 200:
                self.log_result(
                    "Init Email Auth", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            
            try:
                data = response.json()
                if not data.get("ok"):
                    self.log_result(
                        "Init Email Auth", 
                        False, 
                        f"Expected 'ok': true, got {data}",
                        {"response": data}
                    )
                    return False
            except:
                self.log_result(
                    "Init Email Auth", 
                    False, 
                    "Response is not valid JSON",
                    {"response": response.text}
                )
                return False
            
            self.log_result(
                "Init Email Auth", 
                True, 
                "Email OTP initialization successful",
                {"status_code": response.status_code, "response": data}
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Init Email Auth", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_verification_status_with_auth(self):
        """Test 6: Check verification status with auth"""
        if not self.auth_token:
            self.log_result(
                "Verification Status (With Auth)", 
                False, 
                "No auth token available"
            )
            return False
        
        try:
            headers = {
                "Authorization": f"Bearer {self.auth_token}"
            }
            
            response = await self.client.get(
                f"{API_BASE}/turnkey/verification-status", 
                headers=headers
            )
            
            if response.status_code != 200:
                self.log_result(
                    "Verification Status (With Auth)", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            
            try:
                data = response.json()
                is_verified = data.get("isVerified")
                method = data.get("method")
                
                self.log_result(
                    "Verification Status (With Auth)", 
                    True, 
                    f"Verification status retrieved: isVerified={is_verified}, method={method}",
                    {"response": data}
                )
                return True
            except:
                self.log_result(
                    "Verification Status (With Auth)", 
                    False, 
                    "Response is not valid JSON",
                    {"response": response.text}
                )
                return False
            
        except Exception as e:
            self.log_result(
                "Verification Status (With Auth)", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_wallet_info_with_auth(self):
        """Test 7: Check wallet info with auth"""
        if not self.auth_token:
            self.log_result(
                "Wallet Info (With Auth)", 
                False, 
                "No auth token available"
            )
            return False
        
        try:
            headers = {
                "Authorization": f"Bearer {self.auth_token}"
            }
            
            response = await self.client.get(
                f"{API_BASE}/turnkey/wallet-info", 
                headers=headers
            )
            
            if response.status_code != 200:
                self.log_result(
                    "Wallet Info (With Auth)", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            
            try:
                data = response.json()
                has_wallet = data.get("hasWallet")
                wallet_address = data.get("walletAddress")
                wallet_id = data.get("walletId")
                
                self.log_result(
                    "Wallet Info (With Auth)", 
                    True, 
                    f"Wallet info retrieved: hasWallet={has_wallet}, address={wallet_address}",
                    {"response": data}
                )
                return True
            except:
                self.log_result(
                    "Wallet Info (With Auth)", 
                    False, 
                    "Response is not valid JSON",
                    {"response": response.text}
                )
                return False
            
        except Exception as e:
            self.log_result(
                "Wallet Info (With Auth)", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def run_verification_gate_tests(self):
        """Run all verification gate tests in sequence"""
        print("=" * 80)
        print("TURNKEY VERIFICATION GATE TEST SUITE")
        print("=" * 80)
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Base: {API_BASE}")
        print(f"Test Email: {TEST_EMAIL}")
        print(f"Test started at: {datetime.utcnow().isoformat()}")
        print()
        
        # Run tests in sequence
        test_results = []
        
        # Test 1: Health Check
        test_results.append(await self.test_health_check())
        
        # Test 2: Wallet Info (no auth)
        test_results.append(await self.test_wallet_info_no_auth())
        
        # Test 3: Verification Status (no auth)
        test_results.append(await self.test_verification_status_no_auth())
        
        # Test 4: Login to get auth token
        login_success = await self.login_user()
        test_results.append(login_success)
        
        if login_success:
            # Test 5: Create wallet without verification
            test_results.append(await self.test_create_wallet_without_verification())
            
            # Test 6: Initialize email OTP
            test_results.append(await self.test_init_email_auth())
            
            # Test 7: Check verification status
            test_results.append(await self.test_verification_status_with_auth())
            
            # Test 8: Check wallet info
            test_results.append(await self.test_wallet_info_with_auth())
        else:
            print("⚠️  Skipping authenticated tests due to login failure")
        
        # Summary
        print("=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in test_results if result)
        total = len(test_results)
        
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
    async with VerificationGateTester() as tester:
        success = await tester.run_verification_gate_tests()
        return 0 if success else 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)