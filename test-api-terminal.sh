#!/bin/bash

# Piccolour API Terminal Testing Script
# Bash/CURL version for Unix-like systems (Linux, macOS, WSL)

API_URL="http://localhost:5000"
# API_URL="https://screenshotcolorpickerbackend.onrender.com"  # Production

echo ""
echo "========================================"
echo "STEP 1: Generate Bearer Token"
echo "========================================"
echo ""

NAME="John Doe"
EMAIL="john@example.com"

echo "Generating token for: $NAME ($EMAIL)"
echo "API Endpoint: POST $API_URL/api/generate-token"
echo ""

# Generate token
TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/api/generate-token" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$NAME\",
    \"email\": \"$EMAIL\"
  }")

echo "Response:"
echo "$TOKEN_RESPONSE" | jq '.' 2>/dev/null || echo "$TOKEN_RESPONSE"

# Extract token
BEARER_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.token' 2>/dev/null)
EXPIRES_IN=$(echo "$TOKEN_RESPONSE" | jq -r '.expiresIn' 2>/dev/null)

echo ""
echo "Token Details:"
echo "Token: $BEARER_TOKEN"
echo "Expires In: $EXPIRES_IN"

echo ""
echo "========================================"
echo "STEP 2: Process Image with Token"
echo "========================================"
echo ""

# Test image path
TEST_IMAGE_PATH="./server/test_invoice.png"

if [ ! -f "$TEST_IMAGE_PATH" ]; then
  echo "Test image not found at: $TEST_IMAGE_PATH"
  echo "Please create a test image or provide an existing image path."
  exit 1
fi

echo "Using test image: $TEST_IMAGE_PATH"
echo "API Endpoint: POST $API_URL/api/piccolour"
echo ""

# Method 1: Using file path (local testing)
echo "Method 1: Using Image File Path"
echo ""

curl -s -X POST "$API_URL/api/piccolour" \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"imagePath\": \"$TEST_IMAGE_PATH\"
  }" | jq '.' 2>/dev/null || curl -s -X POST "$API_URL/api/piccolour" \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"imagePath\": \"$TEST_IMAGE_PATH\"
  }"

echo ""
echo ""
echo "========================================"
echo "STEP 3: CURL Terminal Examples"
echo "========================================"
echo ""

echo "EXAMPLE 1: Generate Token"
echo ""
echo "curl -X POST http://localhost:5000/api/generate-token \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"name\": \"John Doe\", \"email\": \"john@example.com\"}'"
echo ""

echo "EXAMPLE 2: Process Image with Token (file path)"
echo ""
echo "curl -X POST http://localhost:5000/api/piccolour \\"
echo "  -H \"Authorization: Bearer YOUR_TOKEN_HERE\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"imagePath\": \"/path/to/image.png\"}'"
echo ""

echo "EXAMPLE 3: Process Image with Token (base64)"
echo ""
echo "curl -X POST http://localhost:5000/api/piccolour \\"
echo "  -H \"Authorization: Bearer YOUR_TOKEN_HERE\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"imageData\": \"data:image/png;base64,...\"}'"
echo ""

echo "========================================"
echo "Testing Complete!"
echo "========================================"
echo ""
