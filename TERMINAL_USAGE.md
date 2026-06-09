# 🎨 Piccolour API - Terminal Execution Examples

## ✅ What's Ready

### API Endpoints
1. **POST /api/generate-token** - Create 1-year Bearer token
2. **POST /api/piccolour** - Process image with authentication

### Key Features
- ✅ **Token Expiry:** 1 year (365 days)
- ✅ **Authentication:** Bearer token required
- ✅ **Image Support:** File path OR base64 encoded
- ✅ **OCR:** Extract text from images
- ✅ **Colors:** Detect and name colors
- ✅ **Regions:** Identify text regions and bounding boxes

---

## 🚀 Quick Start - Local Testing

### Option 1: Using PowerShell (Windows)

**1️⃣ Generate Token:**
```powershell
$token = (Invoke-RestMethod -Uri "http://localhost:5000/api/generate-token" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{name="John Doe"; email="john@example.com"} | ConvertTo-Json)).token

Write-Host "Your Token: $token"
```

**2️⃣ Process Image:**
```powershell
$result = Invoke-RestMethod -Uri "http://localhost:5000/api/piccolour" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -Body (@{imagePath="C:\path\to\image.png"} | ConvertTo-Json)

# View extracted text
$result.data.text | ForEach-Object { Write-Host "Text: $_" }

# View detected colors
$result.data.colors | ForEach-Object { 
  Write-Host "Color: $($_.name) (RGB: $($_.r),$($_.g),$($_.b))"
}
```

---

### Option 2: Using CURL (Linux/macOS/WSL)

**1️⃣ Generate Token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/generate-token \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}' | jq -r '.token')

echo "Your Token: $TOKEN"
```

**2️⃣ Process Image:**
```bash
curl -X POST http://localhost:5000/api/piccolour \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"imagePath":"/path/to/image.png"}' | jq '.'
```

---

## 🌐 Production Execution (Render)

Replace `http://localhost:5000` with:
```
https://screenshotcolorpickerbackend.onrender.com
```

**Example:**
```bash
# Generate token on production
curl -X POST https://screenshotcolorpickerbackend.onrender.com/api/generate-token \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Process image with token
curl -X POST https://screenshotcolorpickerbackend.onrender.com/api/piccolour \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"imagePath":"/path/to/image.png"}'
```

---

## 📊 Response Examples

### Token Generation Response
```json
{
  "success": true,
  "message": "Token generated successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE3ODEwMzc1NDcyNjQsImV4cCI6MTc4MTA2OTA4MzI2NH0.JDM4kdeoVGZFm0ksuoXDlso1XzfVulj9V8rUGSy_ztM",
  "expiresIn": "1 year (365 days)",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Image Processing Response
```json
{
  "success": true,
  "message": "Image processed successfully",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "data": {
    "text": [
      "AUTO",
      "REPAIR",
      "INVOICE",
      "Invoice No.",
      "10000",
      "Invoice Date:",
      "01/12/2023",
      "Due Date:",
      "02/12/2023"
    ],
    "colors": [
      {
        "name": "Yellow",
        "r": 255,
        "g": 255,
        "b": 153,
        "hex": "#FFFF99"
      },
      {
        "name": "Red",
        "r": 255,
        "g": 153,
        "b": 153,
        "hex": "#FF9999"
      },
      {
        "name": "Purple",
        "r": 187,
        "g": 153,
        "b": 204,
        "hex": "#BB99CC"
      }
    ],
    "regions": [
      {
        "x": 40,
        "y": 80,
        "width": 120,
        "height": 60,
        "text": "AUTO"
      }
    ]
  }
}
```

---

## 📋 Complete Workflow Script (Save as `api-workflow.sh`)

```bash
#!/bin/bash

API_URL="http://localhost:5000"
# API_URL="https://screenshotcolorpickerbackend.onrender.com"  # Production

echo "========================================="
echo "Piccolour API - Complete Workflow"
echo "========================================="
echo ""

# Step 1: Generate Token
echo "Step 1️⃣ Generating Bearer Token..."
TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/api/generate-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }')

TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.token')
EXPIRES=$(echo $TOKEN_RESPONSE | jq -r '.expiresIn')

echo "✅ Token Generated!"
echo "⏰ Expires: $EXPIRES"
echo "🔑 Token: $TOKEN"
echo ""

# Step 2: Process Image
echo "Step 2️⃣ Processing Image..."
IMAGE_RESPONSE=$(curl -s -X POST "$API_URL/api/piccolour" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imagePath": "./server/test_invoice.png"
  }')

echo "✅ Image Processed!"
echo ""
echo "📊 Results:"
echo "$IMAGE_RESPONSE" | jq '.data' 2>/dev/null || echo "$IMAGE_RESPONSE"
```

Run with:
```bash
chmod +x api-workflow.sh
./api-workflow.sh
```

---

## 🔗 API Documentation Files

- **[API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)** - Full API reference with all examples
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Detailed endpoint documentation
- **[test-api-terminal.ps1](test-api-terminal.ps1)** - PowerShell testing script
- **[test-api-terminal.sh](test-api-terminal.sh)** - Bash testing script
- **[server/public/demo.html](server/public/demo.html)** - Interactive browser demo

---

## 🧪 Testing Checklist

- ✅ Token generation works (1-year expiry)
- ✅ Token authentication middleware active
- ✅ Image processing with file path works
- ✅ Image processing with base64 data works
- ✅ OCR extracts text correctly
- ✅ Colors are detected and named
- ✅ Regions/bounding boxes are identified
- ✅ JSON response format is correct
- ✅ Error handling implemented
- ✅ CORS enabled for cross-origin requests

---

## 🚀 Deployment URLs

### Local
- **API Server:** `http://localhost:5000`
- **Demo Page:** `http://localhost:5000/demo.html`
- **Generate Token:** `http://localhost:5000/api/generate-token`
- **Piccolour:** `http://localhost:5000/api/piccolour`

### Production (Render)
- **API Server:** `https://screenshotcolorpickerbackend.onrender.com`
- **Generate Token:** `https://screenshotcolorpickerbackend.onrender.com/api/generate-token`
- **Piccolour:** `https://screenshotcolorpickerbackend.onrender.com/api/piccolour`

---

## 💡 Pro Tips

1. **Save Token as Environment Variable:**
   ```bash
   export TOKEN="your_token_here"
   curl -H "Authorization: Bearer $TOKEN" ...
   ```

2. **Pretty Print JSON Responses:**
   ```bash
   curl ... | jq '.'  # Linux/macOS
   # or
   curl ... | ConvertTo-Json  # PowerShell
   ```

3. **Test Image Path Exists:**
   ```bash
   test -f /path/to/image.png && echo "File exists" || echo "File not found"
   ```

4. **Batch Process Multiple Images:**
   ```bash
   for image in /images/*.png; do
     curl -X POST http://localhost:5000/api/piccolour \
       -H "Authorization: Bearer $TOKEN" \
       -H "Content-Type: application/json" \
       -d "{\"imagePath\": \"$image\"}"
   done
   ```

---

## ✨ You're All Set!

Both APIs are now **production-ready** with complete documentation, testing scripts, and examples. Start testing from the terminal! 🚀
