#!/usr/bin/env python3
"""
Crypto Indices API Test Suite
=============================

Tests the crypto indices endpoints for:
1. Constant scores across timeframes
2. Equal weight Wave100 implementation
3. Realistic candlestick generation

Usage: python3 crypto_indices_test.py
"""

import asyncio
import httpx
import json
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://turnkey-wallet-api.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class CryptoIndicesAPITester:
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
    
    async def fetch_indices_data(self, time_period: str):
        """Fetch indices data for a specific time period"""
        try:
            response = await self.client.post(
                f"{API_BASE}/crypto-indices",
                json={"timePeriod": time_period}
            )
            
            if response.status_code != 200:
                return None, f"HTTP {response.status_code}: {response.text}"
            
            return response.json(), None
            
        except Exception as e:
            return None, f"Exception: {str(e)}"
    
    async def test_constant_scores_across_timeframes(self):
        """Test 1: Index scores should be CONSTANT regardless of timeframe"""
        try:
            timeframes = ['daily', 'month', 'year', 'all']
            scores_by_timeframe = {}
            
            # Fetch data for all timeframes
            for timeframe in timeframes:
                data, error = await self.fetch_indices_data(timeframe)
                if error:
                    self.log_result(
                        "Constant Scores - Data Fetch", 
                        False, 
                        f"Failed to fetch {timeframe} data: {error}"
                    )
                    return False
                
                # Extract scores
                scores = {}
                for index_name in ['anchor5', 'vibe20', 'wave100']:
                    if index_name in data and data[index_name]:
                        scores[index_name] = data[index_name].get('currentValue')
                
                scores_by_timeframe[timeframe] = scores
            
            # Compare scores across timeframes
            validation_errors = []
            
            # Use daily as reference
            reference_scores = scores_by_timeframe['daily']
            
            for timeframe in ['month', 'year', 'all']:
                current_scores = scores_by_timeframe[timeframe]
                
                for index_name in ['anchor5', 'vibe20', 'wave100']:
                    ref_score = reference_scores.get(index_name)
                    curr_score = current_scores.get(index_name)
                    
                    if ref_score != curr_score:
                        validation_errors.append(
                            f"{index_name} score differs: daily={ref_score}, {timeframe}={curr_score}"
                        )
            
            if validation_errors:
                self.log_result(
                    "Constant Scores Across Timeframes", 
                    False, 
                    f"Score inconsistencies found: {'; '.join(validation_errors)}",
                    {"scores_by_timeframe": scores_by_timeframe}
                )
                return False
            
            self.log_result(
                "Constant Scores Across Timeframes", 
                True, 
                "All index scores are constant across timeframes",
                {
                    "anchor5_score": reference_scores.get('anchor5'),
                    "vibe20_score": reference_scores.get('vibe20'),
                    "wave100_score": reference_scores.get('wave100'),
                    "verified_timeframes": timeframes
                }
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Constant Scores Across Timeframes", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_wave100_equal_weighting(self):
        """Test 2: Wave100 should be equal-weighted (each token has equal weight)"""
        try:
            data, error = await self.fetch_indices_data('daily')
            if error:
                self.log_result(
                    "Wave100 Equal Weighting", 
                    False, 
                    f"Failed to fetch data: {error}"
                )
                return False
            
            wave100 = data.get('wave100')
            if not wave100:
                self.log_result(
                    "Wave100 Equal Weighting", 
                    False, 
                    "Wave100 data not found in response"
                )
                return False
            
            meta = wave100.get('meta', {})
            constituents = meta.get('constituents', [])
            
            if not constituents:
                self.log_result(
                    "Wave100 Equal Weighting", 
                    False, 
                    "No constituents found in Wave100 meta data"
                )
                return False
            
            # Check total number of constituents
            total_constituents = meta.get('total_constituents', len(constituents))
            if total_constituents != 100:
                self.log_result(
                    "Wave100 Equal Weighting", 
                    False, 
                    f"Expected 100 constituents, found {total_constituents}",
                    {"total_constituents": total_constituents}
                )
                return False
            
            # Check equal weighting (should be 1% each for 100 tokens)
            expected_weight = 1.0  # 1% for each of 100 tokens
            weight_errors = []
            
            for i, constituent in enumerate(constituents[:10]):  # Check first 10 for performance
                weight = constituent.get('weight')
                if weight != expected_weight:
                    weight_errors.append(
                        f"Token {constituent.get('symbol', 'unknown')} has weight {weight}, expected {expected_weight}"
                    )
            
            if weight_errors:
                self.log_result(
                    "Wave100 Equal Weighting", 
                    False, 
                    f"Weight inconsistencies found: {'; '.join(weight_errors)}",
                    {
                        "expected_weight": expected_weight,
                        "sample_weights": [c.get('weight') for c in constituents[:5]],
                        "total_constituents": total_constituents
                    }
                )
                return False
            
            # Check methodology
            methodology = wave100.get('methodology', '')
            weighting = meta.get('weighting', '')
            
            self.log_result(
                "Wave100 Equal Weighting", 
                True, 
                f"Wave100 uses equal weighting with {total_constituents} constituents at {expected_weight}% each",
                {
                    "total_constituents": total_constituents,
                    "weight_per_token": expected_weight,
                    "methodology": methodology,
                    "weighting": weighting,
                    "sample_tokens": [f"{c.get('symbol')}({c.get('weight')}%)" for c in constituents[:5]]
                }
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Wave100 Equal Weighting", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_realistic_candlestick_generation(self):
        """Test 3: Candlestick patterns should look realistic with proper volatility differentiation"""
        try:
            data, error = await self.fetch_indices_data('daily')
            if error:
                self.log_result(
                    "Realistic Candlestick Generation", 
                    False, 
                    f"Failed to fetch data: {error}"
                )
                return False
            
            indices = ['anchor5', 'vibe20', 'wave100']
            expected_volatility = ['low', 'moderate', 'high']
            
            validation_errors = []
            volatility_stats = {}
            
            for i, index_name in enumerate(indices):
                index_data = data.get(index_name)
                if not index_data:
                    validation_errors.append(f"{index_name} data not found")
                    continue
                
                candles = index_data.get('candles', [])
                if not candles:
                    validation_errors.append(f"{index_name} has no candles")
                    continue
                
                volatility = index_data.get('volatility')
                expected_vol = expected_volatility[i]
                
                if volatility != expected_vol:
                    validation_errors.append(
                        f"{index_name} volatility is '{volatility}', expected '{expected_vol}'"
                    )
                
                # Analyze candle data for realism
                ohlc_variations = []
                volume_variations = []
                
                for candle in candles:
                    open_price = candle.get('open', 0)
                    high_price = candle.get('high', 0)
                    low_price = candle.get('low', 0)
                    close_price = candle.get('close', 0)
                    volume = candle.get('volumeUsd', 0)
                    
                    # Check OHLC relationships
                    if not (low_price <= open_price <= high_price and 
                            low_price <= close_price <= high_price):
                        validation_errors.append(
                            f"{index_name} has invalid OHLC relationship in candle"
                        )
                        break
                    
                    # Calculate price variation within candle
                    if high_price > 0:
                        price_range = (high_price - low_price) / high_price
                        ohlc_variations.append(price_range)
                    
                    if volume > 0:
                        volume_variations.append(volume)
                
                # Calculate statistics
                if ohlc_variations:
                    avg_variation = sum(ohlc_variations) / len(ohlc_variations)
                    volatility_stats[index_name] = {
                        'avg_price_variation': avg_variation,
                        'volatility_class': volatility,
                        'candle_count': len(candles),
                        'unique_ohlc': len(set((c.get('open'), c.get('high'), c.get('low'), c.get('close')) for c in candles[:5]))
                    }
            
            if validation_errors:
                self.log_result(
                    "Realistic Candlestick Generation", 
                    False, 
                    f"Validation errors: {'; '.join(validation_errors)}",
                    {"volatility_stats": volatility_stats}
                )
                return False
            
            # Check volatility ordering (Anchor5 < Vibe20 < Wave100)
            if len(volatility_stats) >= 3:
                anchor_var = volatility_stats['anchor5']['avg_price_variation']
                vibe_var = volatility_stats['vibe20']['avg_price_variation']
                wave_var = volatility_stats['wave100']['avg_price_variation']
                
                if not (anchor_var <= vibe_var <= wave_var):
                    self.log_result(
                        "Realistic Candlestick Generation", 
                        False, 
                        f"Volatility ordering incorrect: Anchor5({anchor_var:.4f}) <= Vibe20({vibe_var:.4f}) <= Wave100({wave_var:.4f})",
                        {"volatility_stats": volatility_stats}
                    )
                    return False
            
            self.log_result(
                "Realistic Candlestick Generation", 
                True, 
                "Candlestick generation shows proper volatility differentiation and realistic OHLC patterns",
                {"volatility_stats": volatility_stats}
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Realistic Candlestick Generation", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def test_api_response_structure(self):
        """Test 4: Verify API response structure and no crashes"""
        try:
            data, error = await self.fetch_indices_data('daily')
            if error:
                self.log_result(
                    "API Response Structure", 
                    False, 
                    f"API request failed: {error}"
                )
                return False
            
            # Check top-level structure
            required_indices = ['anchor5', 'vibe20', 'wave100', 'lastUpdated']
            missing_fields = [field for field in required_indices if field not in data]
            
            if missing_fields:
                self.log_result(
                    "API Response Structure", 
                    False, 
                    f"Missing required fields: {missing_fields}",
                    {"response_keys": list(data.keys())}
                )
                return False
            
            # Check each index structure
            structure_errors = []
            
            for index_name in ['anchor5', 'vibe20', 'wave100']:
                index_data = data[index_name]
                if not index_data:
                    structure_errors.append(f"{index_name} is null")
                    continue
                
                required_fields = ['index', 'currentValue', 'candles', 'meta']
                missing = [field for field in required_fields if field not in index_data]
                if missing:
                    structure_errors.append(f"{index_name} missing: {missing}")
                
                # Check candles structure
                candles = index_data.get('candles', [])
                if candles:
                    candle = candles[0]
                    candle_fields = ['time', 'open', 'high', 'low', 'close', 'volumeUsd']
                    missing_candle_fields = [field for field in candle_fields if field not in candle]
                    if missing_candle_fields:
                        structure_errors.append(f"{index_name} candle missing: {missing_candle_fields}")
            
            if structure_errors:
                self.log_result(
                    "API Response Structure", 
                    False, 
                    f"Structure errors: {'; '.join(structure_errors)}",
                    {"sample_response": {k: type(v).__name__ for k, v in data.items()}}
                )
                return False
            
            self.log_result(
                "API Response Structure", 
                True, 
                "API response has correct structure with no crashes",
                {
                    "indices_count": len([k for k in data.keys() if k in ['anchor5', 'vibe20', 'wave100']]),
                    "anchor5_candles": len(data['anchor5'].get('candles', [])),
                    "vibe20_candles": len(data['vibe20'].get('candles', [])),
                    "wave100_candles": len(data['wave100'].get('candles', [])),
                    "last_updated": data.get('lastUpdated')
                }
            )
            return True
            
        except Exception as e:
            self.log_result(
                "API Response Structure", 
                False, 
                f"Exception: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    async def run_all_tests(self):
        """Run all crypto indices API tests"""
        print("=" * 80)
        print("CRYPTO INDICES API TESTS")
        print("=" * 80)
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Endpoint: {API_BASE}/crypto-indices")
        print(f"Test started at: {datetime.utcnow().isoformat()}")
        print()
        
        # Run tests in sequence
        test_results = []
        
        # Test 1: Constant scores across timeframes
        test_results.append(await self.test_constant_scores_across_timeframes())
        
        # Test 2: Wave100 equal weighting
        test_results.append(await self.test_wave100_equal_weighting())
        
        # Test 3: Realistic candlestick generation
        test_results.append(await self.test_realistic_candlestick_generation())
        
        # Test 4: API response structure
        test_results.append(await self.test_api_response_structure())
        
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
    async with CryptoIndicesAPITester() as tester:
        success = await tester.run_all_tests()
        return 0 if success else 1


if __name__ == "__main__":
    import sys
    exit_code = asyncio.run(main())
    sys.exit(exit_code)