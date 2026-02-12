#!/bin/bash

# API Testing Script for Career Gap Architect Backend

BASE_URL="http://localhost:5000"
API_URL="$BASE_URL/api"

echo "========================================"
echo "Career Gap Architect - API Test Suite"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to check if server is running
check_server() {
    if ! curl -s "$BASE_URL/health" > /dev/null; then
        echo -e "${RED}❌ Server is not running on $BASE_URL${NC}"
        echo "Please start the server with: npm run dev"
        exit 1
    fi
}

# Test 1: Health Check
test_health() {
    echo "Test 1: Health Check Endpoint"
    echo "------------------------------"
    
    RESPONSE=$(curl -s "$BASE_URL/health")
    STATUS=$(echo "$RESPONSE" | grep -o '"status":"OK"')
    
    if [ -n "$STATUS" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        echo "Response: $RESPONSE"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response: $RESPONSE"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Test 2: Analysis - Cache Miss
test_analysis_cache_miss() {
    echo "Test 2: Analysis Endpoint (Cache Miss)"
    echo "---------------------------------------"
    
    START_TIME=$(date +%s%N)
    RESPONSE=$(curl -s -X POST "$API_URL/analyze" \
        -H "Content-Type: application/json" \
        -d @test-data.json)
    END_TIME=$(date +%s%N)
    
    DURATION=$(( (END_TIME - START_TIME) / 1000000 ))
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true')
    CACHED=$(echo "$RESPONSE" | grep -o '"cached":false')
    
    if [ -n "$SUCCESS" ] && [ -n "$CACHED" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        echo "Duration: ${DURATION}ms"
        echo "Cache status: MISS (expected)"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response: $RESPONSE"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Test 3: Analysis - Cache Hit
test_analysis_cache_hit() {
    echo "Test 3: Analysis Endpoint (Cache Hit)"
    echo "--------------------------------------"
    
    START_TIME=$(date +%s%N)
    RESPONSE=$(curl -s -X POST "$API_URL/analyze" \
        -H "Content-Type: application/json" \
        -d @test-data.json)
    END_TIME=$(date +%s%N)
    
    DURATION=$(( (END_TIME - START_TIME) / 1000000 ))
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true')
    CACHED=$(echo "$RESPONSE" | grep -o '"cached":true')
    
    if [ -n "$SUCCESS" ] && [ -n "$CACHED" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        echo "Duration: ${DURATION}ms"
        echo "Cache status: HIT (expected)"
        
        if [ $DURATION -lt 1000 ]; then
            echo -e "${GREEN}⚡ Response time < 1 second (excellent!)${NC}"
        fi
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response: $RESPONSE"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Test 4: Stats Endpoint
test_stats() {
    echo "Test 4: Stats Endpoint"
    echo "----------------------"
    
    RESPONSE=$(curl -s "$API_URL/stats")
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true')
    
    if [ -n "$SUCCESS" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        echo "Response: $RESPONSE"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response: $RESPONSE"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Test 5: Validation - Invalid Resume (Too Short)
test_validation_short_resume() {
    echo "Test 5: Validation - Short Resume (Should Fail)"
    echo "------------------------------------------------"
    
    RESPONSE=$(curl -s -X POST "$API_URL/analyze" \
        -H "Content-Type: application/json" \
        -d '{
            "resumeText": "Short resume",
            "jobDescriptionText": "This is a job description with more than 20 characters"
        }')
    
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":false')
    ERROR=$(echo "$RESPONSE" | grep -o '"error":"Validation failed"')
    
    if [ -n "$SUCCESS" ] && [ -n "$ERROR" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        echo "Validation error caught correctly"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response: $RESPONSE"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Test 6: Validation - Missing Field
test_validation_missing_field() {
    echo "Test 6: Validation - Missing Field (Should Fail)"
    echo "-------------------------------------------------"
    
    RESPONSE=$(curl -s -X POST "$API_URL/analyze" \
        -H "Content-Type: application/json" \
        -d '{
            "resumeText": "This is a valid resume with more than 50 characters in it for testing purposes"
        }')
    
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":false')
    
    if [ -n "$SUCCESS" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        echo "Missing field validation caught correctly"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response: $RESPONSE"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Test 7: 404 Not Found
test_not_found() {
    echo "Test 7: 404 Not Found"
    echo "---------------------"
    
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/nonexistent")
    
    if [ "$STATUS_CODE" = "404" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        echo "404 response for non-existent route"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Expected 404, got $STATUS_CODE"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Run all tests
main() {
    check_server
    
    test_health
    test_analysis_cache_miss
    test_analysis_cache_hit
    test_stats
    test_validation_short_resume
    test_validation_missing_field
    test_not_found
    
    # Summary
    echo "========================================"
    echo "Test Summary"
    echo "========================================"
    TOTAL=$((TESTS_PASSED + TESTS_FAILED))
    echo "Total Tests: $TOTAL"
    echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
    
    if [ $TESTS_FAILED -gt 0 ]; then
        echo -e "${RED}Failed: $TESTS_FAILED${NC}"
        exit 1
    else
        echo -e "${GREEN}All tests passed! 🎉${NC}"
        exit 0
    fi
}

# Run tests
main
