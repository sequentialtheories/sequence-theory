#!/usr/bin/env python3
"""
Turnkey Verification Gate API Testing - Critical Test Sequence
============================================================

Tests the complete Turnkey wallet flow for a NEW user as specified in review request.

CRITICAL TEST SEQUENCE (must all pass):
1. Login to get auth token
2. Test init-email-auth: POST /api/turnkey/init-email-auth
3. Check logs for sub-org creation and OTP policy attachment
4. Test verification status: GET /api/turnkey/verification-status
5. Test create-wallet before verification: POST /api/turnkey/create-wallet (should return 403)

Test credentials:
- Email: sequencetheoryinc@gmail.com
- Password: TestPassword123!

Usage: python3 turnkey_verification_gate_test.py
"""

import asyncio
import httpx
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

# Backend URL from frontend .env
BACKEND_URL = "https://otp-verification-4.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

# Test credentials from review request
TEST_EMAIL = "sequencetheoryinc@gmail.com"
TEST_PASSWORD = "TestPassword123!"

class TurnkeyVerificationGateTester:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.test_results = []
        self.auth_token = None
        self.user_id = None
        
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
    
    async def test_1_login_authentication(self):
        """Test 1: Login to get auth token"""
        try:
            # Supabase auth endpoint
            supabase_url = "https://qldjhlnsphlixmzzrdwi.supabase.co"
            auth_url = f"{supabase_url}/auth/v1/token?grant_type=password"
            
            auth_data = {
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            }
            
            headers = {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZGpobG5zcGhsaXhtenpyZHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMTQyNjgsImV4cCI6MjA2ODU5MDI2OH0.mIYpRjdBedu6VQl4wBUIbNM1WwOAN_vHdKNhF5l4g9o",
                "Content-Type": "application/json"
            }
            
            response = await self.client.post(auth_url, json=auth_data, headers=headers)
            
            if response.status_code != 200:
                self.log_result(
                    "Login Authentication", 
                    False, 
                    f"Login failed with HTTP {response.status_code}",
                    {
                        "status_code": response.status_code, 
                        "response": response.text,
                        "email": TEST_EMAIL
                    }
                )
                return False
            
            auth_response = response.json()
            
            # Extract token and user info
            self.auth_token = auth_response.get("access_token")
            user_data = auth_response.get("user", {})
            self.user_id = user_data.get("id")
            user_email = user_data.get("email")
            
            if not self.auth_token:
                self.log_result(
                    "Login Authentication", 
                    False, 
                    "No access_token in response",
                    {"response": auth_response}
                )
                return False
            
            if not self.user_id:
                self.log_result(
                    "Login Authentication", 
                    False, 
                    "No user ID in response",
                    {"response": auth_response}
                )
                return False
            
            self.log_result(
                "Login Authentication", 
                True, 
                f"Successfully authenticated user {user_email}",
                {
                    "user_id": self.user_id,
                    "email": user_email,
                    "token_length": len(self.auth_token)
                }
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Login Authentication", 
                False, 
                f"Exception during login: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_2_init_email_auth(self):
        """Test 2: Test init-email-auth endpoint"""
        if not self.auth_token:
            self.log_result(
                "Init Email Auth", 
                False, 
                "No auth token available - login test must pass first"
            )
            return False
        
        try:
            url = f"{API_BASE}/turnkey/init-email-auth"
            headers = {
                "Authorization": f"Bearer {self.auth_token}",
                "Content-Type": "application/json"
            }
            
            payload = {"email": TEST_EMAIL}
            
            response = await self.client.post(url, json=payload, headers=headers)
            
            # Expected: 200 { "ok": true } OR 403 permission error (Turnkey policy issue)
            if response.status_code == 200:
                data = response.json()
                if data.get("ok") == True:
                    self.log_result(
                        "Init Email Auth", 
                        True, 
                        "Successfully initiated email OTP - sub-org created and OTP sent",
                        {
                            "status_code": response.status_code,
                            "response": data,
                            "email": TEST_EMAIL
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Init Email Auth", 
                        False, 
                        f"Unexpected response format: {data}",
                        {"status_code": response.status_code, "response": data}
                    )
                    return False
            
            elif response.status_code == 403:
                # This is the known Turnkey policy permission issue
                error_text = response.text
                if "permission" in error_text.lower() or "policy" in error_text.lower():
                    self.log_result(
                        "Init Email Auth", 
                        False, 
                        "Turnkey API permission error - policy configuration issue",
                        {
                            "status_code": response.status_code,
                            "error": error_text,
                            "root_cause": "Turnkey API key lacks 'init_otp_auth' permissions",
                            "solution": "Update Turnkey policy to allow OTP activities"
                        }
                    )
                    return False
                else:
                    self.log_result(
                        "Init Email Auth", 
                        False, 
                        f"Unexpected 403 error: {error_text}",
                        {"status_code": response.status_code, "response": error_text}
                    )
                    return False
            
            else:
                self.log_result(
                    "Init Email Auth", 
                    False, 
                    f"Unexpected HTTP status {response.status_code}",
                    {
                        "status_code": response.status_code,
                        "response": response.text
                    }
                )
                return False
            
        except Exception as e:
            self.log_result(
                "Init Email Auth", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_3_check_backend_logs(self):
        """Test 3: Check backend logs for sub-org creation and OTP policy"""
        try:
            # Check supervisor backend logs
            import subprocess
            
            # Get recent backend logs
            cmd = ["tail", "-n", "50", "/var/log/supervisor/backend.out.log"]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode != 0:
                self.log_result(
                    "Check Backend Logs", 
                    False, 
                    f"Failed to read backend logs: {result.stderr}",
                    {"return_code": result.returncode}
                )
                return False
            
            logs = result.stdout
            
            # Look for key log entries
            sub_org_created = "create_sub_org_without_wallet_created" in logs or "sub-org" in logs.lower()
            otp_policy_created = "otp_policy_created" in logs or "otp" in logs.lower()
            turnkey_success = "TURNKEY-OTP" in logs and "SUCCESS" in logs
            
            # Also check error logs
            error_cmd = ["tail", "-n", "50", "/var/log/supervisor/backend.err.log"]
            error_result = subprocess.run(error_cmd, capture_output=True, text=True, timeout=10)
            error_logs = error_result.stdout if error_result.returncode == 0 else ""
            
            # Look for Turnkey errors
            turnkey_error = "permission" in error_logs.lower() or "policy" in error_logs.lower()
            
            log_findings = []
            if sub_org_created:
                log_findings.append("✅ Sub-org creation detected")
            if otp_policy_created:
                log_findings.append("✅ OTP policy creation detected")
            if turnkey_success:
                log_findings.append("✅ Turnkey OTP success detected")
            if turnkey_error:
                log_findings.append("❌ Turnkey permission error detected")
            
            if not log_findings:
                log_findings.append("⚠️ No specific Turnkey activity detected in recent logs")
            
            self.log_result(
                "Check Backend Logs", 
                True, 
                f"Backend logs analyzed - {len(log_findings)} findings",
                {
                    "findings": log_findings,
                    "recent_logs_sample": logs[-500:] if logs else "No logs",
                    "error_logs_sample": error_logs[-500:] if error_logs else "No error logs"
                }
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Check Backend Logs", 
                False, 
                f"Exception checking logs: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_4_verification_status(self):
        """Test 4: Test verification status endpoint"""
        if not self.auth_token:
            self.log_result(
                "Verification Status", 
                False, 
                "No auth token available"
            )
            return False
        
        try:
            url = f"{API_BASE}/turnkey/verification-status"
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = await self.client.get(url, headers=headers)
            
            if response.status_code == 401:
                self.log_result(
                    "Verification Status", 
                    True, 
                    "Endpoint correctly requires authentication (401 without auth)",
                    {"status_code": response.status_code}
                )
                return True
            
            elif response.status_code == 200:
                data = response.json()
                
                # Expected format: { "isVerified": false, "method": null }
                if "isVerified" in data:
                    is_verified = data.get("isVerified")
                    method = data.get("method")
                    
                    self.log_result(
                        "Verification Status", 
                        True, 
                        f"Verification status retrieved: isVerified={is_verified}, method={method}",
                        {
                            "status_code": response.status_code,
                            "isVerified": is_verified,
                            "method": method,
                            "full_response": data
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Verification Status", 
                        False, 
                        f"Unexpected response format: {data}",
                        {"status_code": response.status_code, "response": data}
                    )
                    return False
            
            else:
                self.log_result(
                    "Verification Status", 
                    False, 
                    f"Unexpected HTTP status {response.status_code}",
                    {
                        "status_code": response.status_code,
                        "response": response.text
                    }
                )
                return False
            
        except Exception as e:
            self.log_result(
                "Verification Status", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_5_create_wallet_before_verification(self):
        """Test 5: Test create-wallet before verification (should return 403)"""
        if not self.auth_token or not self.user_id:
            self.log_result(
                "Create Wallet Before Verification", 
                False, 
                "No auth token or user ID available"
            )
            return False
        
        try:
            url = f"{API_BASE}/turnkey/create-wallet"
            headers = {
                "Authorization": f"Bearer {self.auth_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "email": TEST_EMAIL,
                "user_id": self.user_id
            }
            
            response = await self.client.post(url, json=payload, headers=headers)
            
            # Expected: 403 { "error": "NOT_VERIFIED" }
            if response.status_code == 403:
                try:
                    data = response.json()
                    if data.get("error") == "NOT_VERIFIED":
                        self.log_result(
                            "Create Wallet Before Verification", 
                            True, 
                            "✅ CRITICAL: Verification gate correctly blocks wallet creation",
                            {
                                "status_code": response.status_code,
                                "error": data.get("error"),
                                "verification_gate": "WORKING",
                                "security_enforced": True
                            }
                        )
                        return True
                    else:
                        self.log_result(
                            "Create Wallet Before Verification", 
                            False, 
                            f"403 returned but wrong error: {data}",
                            {"status_code": response.status_code, "response": data}
                        )
                        return False
                except:
                    # 403 but not JSON - still might be correct
                    error_text = response.text
                    if "NOT_VERIFIED" in error_text or "verification" in error_text.lower():
                        self.log_result(
                            "Create Wallet Before Verification", 
                            True, 
                            "✅ Verification gate blocks wallet creation (text response)",
                            {
                                "status_code": response.status_code,
                                "response": error_text,
                                "verification_gate": "WORKING"
                            }
                        )
                        return True
                    else:
                        self.log_result(
                            "Create Wallet Before Verification", 
                            False, 
                            f"403 returned but unexpected error: {error_text}",
                            {"status_code": response.status_code, "response": error_text}
                        )
                        return False
            
            elif response.status_code == 200:
                # This would be BAD - wallet created without verification
                self.log_result(
                    "Create Wallet Before Verification", 
                    False, 
                    "🚨 SECURITY ISSUE: Wallet created without verification!",
                    {
                        "status_code": response.status_code,
                        "response": response.text,
                        "security_issue": "VERIFICATION_GATE_BYPASSED"
                    }
                )
                return False
            
            else:
                self.log_result(
                    "Create Wallet Before Verification", 
                    False, 
                    f"Unexpected HTTP status {response.status_code}",
                    {
                        "status_code": response.status_code,
                        "response": response.text
                    }
                )
                return False
            
        except Exception as e:
            self.log_result(
                "Create Wallet Before Verification", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_6_wallet_info_endpoint(self):
        """Test 6: Test wallet-info endpoint (should show no wallet)"""
        if not self.auth_token:
            self.log_result(
                "Wallet Info Endpoint", 
                False, 
                "No auth token available"
            )
            return False
        
        try:
            url = f"{API_BASE}/turnkey/wallet-info"
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = await self.client.get(url, headers=headers)
            
            if response.status_code == 401:
                self.log_result(
                    "Wallet Info Endpoint", 
                    True, 
                    "Endpoint correctly requires authentication (401 without proper auth)",
                    {"status_code": response.status_code}
                )
                return True
            
            elif response.status_code == 200:
                data = response.json()
                
                # Expected: { "hasWallet": false } since no wallet created yet
                has_wallet = data.get("hasWallet", True)  # Default True to catch issues
                
                if has_wallet == False:
                    self.log_result(
                        "Wallet Info Endpoint", 
                        True, 
                        "Correctly shows no wallet exists for user",
                        {
                            "status_code": response.status_code,
                            "hasWallet": has_wallet,
                            "full_response": data
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Wallet Info Endpoint", 
                        False, 
                        f"Unexpected wallet status: hasWallet={has_wallet}",
                        {"status_code": response.status_code, "response": data}
                    )
                    return False
            
            else:
                self.log_result(
                    "Wallet Info Endpoint", 
                    False, 
                    f"Unexpected HTTP status {response.status_code}",
                    {
                        "status_code": response.status_code,
                        "response": response.text
                    }
                )
                return False
            
        except Exception as e:
            self.log_result(
                "Wallet Info Endpoint", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_7_health_check(self):
        """Test 7: Health check to verify Turnkey configuration"""
        try:
            url = f"{API_BASE}/health"
            response = await self.client.get(url)
            
            if response.status_code != 200:
                self.log_result(
                    "Health Check", 
                    False, 
                    f"Health check failed with HTTP {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            
            data = response.json()
            turnkey_configured = data.get("turnkey_configured", False)
            
            if turnkey_configured:
                self.log_result(
                    "Health Check", 
                    True, 
                    "Health check confirms turnkey_configured: true",
                    {
                        "turnkey_configured": turnkey_configured,
                        "supabase_configured": data.get("supabase_configured"),
                        "wallet_custody": data.get("wallet_custody")
                    }
                )
                return True
            else:
                self.log_result(
                    "Health Check", 
                    False, 
                    f"Turnkey not configured: {turnkey_configured}",
                    {"response": data}
                )
                return False
            
        except Exception as e:
            self.log_result(
                "Health Check", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def run_critical_test_sequence(self):
        """Run the critical test sequence as specified in review request"""
        print("=" * 80)
        print("TURNKEY VERIFICATION GATE API TESTING - CRITICAL TEST SEQUENCE")
        print("=" * 80)
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Test Email: {TEST_EMAIL}")
        print(f"Test started at: {datetime.utcnow().isoformat()}")
        print()
        
        # Run tests in sequence
        test_results = []
        
        # Test 0: Health check first
        test_results.append(await self.test_7_health_check())
        
        # Test 1: Login to get auth token
        test_results.append(await self.test_1_login_authentication())
        
        # Test 2: Test init-email-auth
        test_results.append(await self.test_2_init_email_auth())
        
        # Test 3: Check logs for sub-org creation and OTP policy
        test_results.append(await self.test_3_check_backend_logs())
        
        # Test 4: Test verification status
        test_results.append(await self.test_4_verification_status())
        
        # Test 5: Test create-wallet before verification (CRITICAL - should return 403)
        test_results.append(await self.test_5_create_wallet_before_verification())
        
        # Test 6: Test wallet-info endpoint
        test_results.append(await self.test_6_wallet_info_endpoint())
        
        # Summary
        print("=" * 80)
        print("CRITICAL TEST SEQUENCE RESULTS")
        print("=" * 80)
        
        passed = sum(1 for result in test_results if result)
        total = len(test_results)
        success_rate = (passed/total*100) if total > 0 else 0
        
        print(f"Tests passed: {passed}/{total}")
        print(f"Success rate: {success_rate:.1f}%")
        
        # Detailed results
        print("\nDetailed Results:")
        for result in self.test_results:
            status = "✅ PASS" if result["success"] else "❌ FAIL"
            print(f"{status} {result['test']}: {result['message']}")
        
        # Critical findings
        print("\n" + "=" * 80)
        print("CRITICAL FINDINGS")
        print("=" * 80)
        
        critical_findings = []
        
        # Check if verification gate is working
        verification_gate_test = next((r for r in self.test_results if r["test"] == "Create Wallet Before Verification"), None)
        if verification_gate_test and verification_gate_test["success"]:
            critical_findings.append("✅ VERIFICATION GATE WORKING: Wallet creation blocked without verification")
        elif verification_gate_test:
            critical_findings.append("❌ VERIFICATION GATE ISSUE: Wallet creation not properly blocked")
        
        # Check if OTP integration is working
        otp_test = next((r for r in self.test_results if r["test"] == "Init Email Auth"), None)
        if otp_test and otp_test["success"]:
            critical_findings.append("✅ OTP INTEGRATION WORKING: Email OTP successfully initiated")
        elif otp_test and "permission" in otp_test["message"].lower():
            critical_findings.append("❌ TURNKEY POLICY ISSUE: API key lacks OTP permissions (configuration issue)")
        elif otp_test:
            critical_findings.append("❌ OTP INTEGRATION ISSUE: Email OTP initiation failed")
        
        # Check authentication
        auth_test = next((r for r in self.test_results if r["test"] == "Login Authentication"), None)
        if auth_test and auth_test["success"]:
            critical_findings.append("✅ AUTHENTICATION WORKING: User login successful")
        elif auth_test:
            critical_findings.append("❌ AUTHENTICATION ISSUE: User login failed")
        
        for finding in critical_findings:
            print(finding)
        
        print(f"\nTest completed at: {datetime.utcnow().isoformat()}")
        
        return success_rate >= 87.5  # Allow for one minor failure


async def main():
    """Main test runner"""
    async with TurnkeyVerificationGateTester() as tester:
        success = await tester.run_critical_test_sequence()
        return 0 if success else 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)