# Piccolour API - Terminal Testing Guide

## Overview
The Piccolour API provides two main endpoints:
1. **Generate Token** - Create a Bearer token valid for 1 year
2. **Piccolour** - Process images with authenticated token

---

## 🔐 API Endpoint 1: Generate Bearer Token

### Endpoint Details
- **URL:** `POST /api/generate-token`
- **Base URL:** 
  - Local: `http://localhost:5000`
  - Production: `https://screenshotcolorpickerbackend.onrender.com`
- **Token Expiry:** 1 year (365 days)

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Response
```json
{
  "success": true,
  "message": "Token generated successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1 year (365 days)",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### CURL Command - Windows PowerShell
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/generate-token" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json
```

### CURL Command - Linux/macOS/WSL
```bash
curl -X POST http://localhost:5000/api/generate-token \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### CURL Command - Windows (cmd.exe)
```cmd
curl -X POST http://localhost:5000/api/generate-token -H "Content-Type: application/json" -d "{\"name\": \"John Doe\", \"email\": \"john@example.com\"}"
```

---

## 🎨 API Endpoint 2: Piccolour (Process Image)

### Endpoint Details
- **URL:** `POST /api/piccolour`
- **Authentication:** Required (Bearer Token)
- **Header:** `Authorization: Bearer <TOKEN>`

### Request Option 1: Using Image File Path (Local Server)
```json
{
  "imagePath": "C:\\path\\to\\image.png"
}
```

### Request Option 2: Using Base64 Image Data
```json
{
  "imageData": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

### Response
```json
{
  "success": true,
  "message": "Image processed successfully",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "data": {
    "text": ["AUTO", "REPAIR", "INVOICE", "Invoice No.", "10000", "..."],
    "colors": [
      {
        "name": "Yellow",
        "r": 255,
        "g": 255,
        "b": 153
      },
      {
        "name": "Red",
        "r": 255,
        "g": 153,
        "b": 153
      }
    ],
    "regions": [...]
  }
}
```

### CURL Command - Method 1: Using Image Path (PowerShell)
```powershell
$token = "YOUR_BEARER_TOKEN_HERE"
$imagePath = "c:\Users\KRISHNA PAUL\OneDrive\Desktop\ScreenshotColorPicker\server\test_invoice.png"

$body = @{
    imagePath = $imagePath
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/piccolour" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{ "Authorization" = "Bearer $token" } `
  -Body $body | ConvertTo-Json -Depth 10
```

### CURL Command - Method 1: Using Image Path (Linux/macOS)
```bash
TOKEN="YOUR_BEARER_TOKEN_HERE"
IMAGE_PATH="./server/test_invoice.png"

curl -X POST http://localhost:5000/api/piccolour \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"imagePath\": \"$IMAGE_PATH\"
  }"
```

### CURL Command - Method 2: Using Base64 Image Data (PowerShell)
```powershell
$token = "YOUR_BEARER_TOKEN_HERE"
$imagePath = "c:\Users\KRISHNA PAUL\OneDrive\Desktop\ScreenshotColorPicker\server\test_invoice.png"

# Convert image to base64
$imageBytes = [System.IO.File]::ReadAllBytes($imagePath)
$base64Image = [System.Convert]::ToBase64String($imageBytes)
$imageDataUri = "data:image/png;base64,$base64Image"

$body = @{
    imageData = $imageDataUri
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/piccolour" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{ "Authorization" = "Bearer $token" } `
  -Body $body | ConvertTo-Json -Depth 10
```

---

## 📋 Complete Example Workflow

### Step 1: Generate Token
```powershell
# PowerShell
$tokenBody = @{
    name = "John Doe"
    email = "john@example.com"
} | ConvertTo-Json

$tokenResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/generate-token" `
  -Method POST `
  -ContentType "application/json" `
  -Body $tokenBody

$token = $tokenResponse.token
Write-Host "Token: $token"
Write-Host "Expires: $($tokenResponse.expiresIn)"
```

### Step 2: Use Token to Process Image
```powershell
# PowerShell
$imagePath = "c:\Users\KRISHNA PAUL\OneDrive\Desktop\ScreenshotColorPicker\server\test_invoice.png"

$imageBody = @{
    imagePath = $imagePath
} | ConvertTo-Json

$imageResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/piccolour" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{ "Authorization" = "Bearer $token" } `
  -Body $imageBody

Write-Host "Extracted Text:"
$imageResponse.data.text | ForEach-Object { Write-Host "  • $_" }

Write-Host "`nDetected Colors:"
$imageResponse.data.colors | ForEach-Object { 
  Write-Host "  • $($_.name) - RGB($($_.r), $($_.g), $($_.b))"
}
```

---

## 🌐 Production Deployment (Render)

### Generate Token on Production
```bash
curl -X POST https://screenshotcolorpickerbackend.onrender.com/api/generate-token \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Process Image on Production
```bash
TOKEN="YOUR_BEARER_TOKEN"
IMAGE_PATH="/path/to/image.png"

curl -X POST https://screenshotcolorpickerbackend.onrender.com/api/piccolour \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"imagePath\": \"$IMAGE_PATH\"
  }"
```

**Note:** For production, image path should be accessible on the Render server. For external images, use base64 encoding or upload via multipart form data.

---

## ✅ API Validation

### Health Check
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-10T18:05:30.644Z"
}
```

---

## 🔒 Security Notes

1. **Token Valid For:** 1 year (365 days) from generation
2. **Token Format:** JWT (JSON Web Token)
3. **Authentication:** All requests to `/api/piccolour` require valid Bearer token
4. **CORS:** Enabled for cross-origin requests
5. **Rate Limiting:** None configured (can be added if needed)

---

## ❌ Error Responses

### Missing Token
```json
{
  "success": false,
  "message": "No token provided. Please provide a Bearer token in Authorization header."
}
```

### Invalid Token
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": "jwt expired"
}
```

### Missing Image
```json
{
  "success": false,
  "message": "No image data provided. Send either imageData (base64 string) or imagePath (file path) in request body."
}
```

### Invalid Email
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

---

## 📝 Quick Test Script (PowerShell)

Save as `test-api.ps1`:

```powershell
# Configuration
$API_URL = "http://localhost:5000"
$NAME = "John Doe"
$EMAIL = "john@example.com"

Write-Host "🔐 Generating Token..." -ForegroundColor Cyan
$tokenBody = @{ name = $NAME; email = $EMAIL } | ConvertTo-Json
$tokenRes = Invoke-RestMethod -Uri "$API_URL/api/generate-token" `
  -Method POST -ContentType "application/json" -Body $tokenBody

Write-Host "✅ Token: $($tokenRes.token)" -ForegroundColor Green
Write-Host "⏰ Expires: $($tokenRes.expiresIn)`n" -ForegroundColor Green

$token = $tokenRes.token

Write-Host "🎨 Processing Image..." -ForegroundColor Cyan
$imageBody = @{ imagePath = "./server/test_invoice.png" } | ConvertTo-Json
$imageRes = Invoke-RestMethod -Uri "$API_URL/api/piccolour" `
  -Method POST -ContentType "application/json" `
  -Headers @{ "Authorization" = "Bearer $token" } -Body $imageBody

Write-Host "✅ Image Processed!" -ForegroundColor Green
Write-Host "📝 Extracted Text Items: $($imageRes.data.text.Count)" -ForegroundColor Green
Write-Host "🎨 Detected Colors: $($imageRes.data.colors.Count)" -ForegroundColor Green
```

Run with:
```powershell
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

---

## 🚀 Ready to Use!

Both endpoints are now **production-ready** with:
- ✅ 1-year token expiration
- ✅ Bearer token authentication
- ✅ Image path and base64 support
- ✅ Full OCR and color extraction
- ✅ JSON response format

Deploy with confidence! 🎉
