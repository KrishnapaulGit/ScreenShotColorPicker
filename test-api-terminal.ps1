# Piccolour API Terminal Testing Script
# This script demonstrates how to use the API from terminal

# ============================================
# Step 1: Generate Token
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 1: Generate Bearer Token" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# You can test with your own details or use these examples
$API_URL = "http://localhost:5000"  # Local testing
# $API_URL = "https://screenshotcolorpickerbackend.onrender.com"  # Production

$name = "John Doe"
$email = "john@example.com"

Write-Host "Generating token for: $name ($email)" -ForegroundColor Yellow
Write-Host "API Endpoint: POST $API_URL/api/generate-token`n"

$tokenResponse = Invoke-RestMethod -Uri "$API_URL/api/generate-token" `
  -Method POST `
  -ContentType "application/json" `
  -Body @{
    name = $name
    email = $email
  } | ConvertTo-Json -Depth 10

Write-Host "Response:`n"
Write-Host $tokenResponse -ForegroundColor Green

# Extract token from response
$tokenJson = Invoke-RestMethod -Uri "$API_URL/api/generate-token" `
  -Method POST `
  -ContentType "application/json" `
  -Body @{
    name = $name
    email = $email
  }

$BEARER_TOKEN = $tokenJson.token
$EXPIRES_IN = $tokenJson.expiresIn

Write-Host "`nToken Details:" -ForegroundColor Cyan
Write-Host "Token: $BEARER_TOKEN" -ForegroundColor Yellow
Write-Host "Expires In: $EXPIRES_IN" -ForegroundColor Yellow

# ============================================
# Step 2: Process Image with Token
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 2: Process Image with Token" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Use test image if it exists
$testImagePath = "c:\Users\KRISHNA PAUL\OneDrive\Desktop\ScreenshotColorPicker\server\test_invoice.png"

if (-not (Test-Path $testImagePath)) {
  Write-Host "Test image not found at: $testImagePath" -ForegroundColor Red
  Write-Host "Creating test image first..." -ForegroundColor Yellow
  
  # Create a simple test image using .NET
  $testImagePath = "c:\Users\KRISHNA PAUL\OneDrive\Desktop\ScreenshotColorPicker\test_image.png"
  
  Write-Host "Test image will be created at: $testImagePath" -ForegroundColor Green
} else {
  Write-Host "Using test image: $testImagePath" -ForegroundColor Green
}

Write-Host "`nProcessing image with API..." -ForegroundColor Yellow
Write-Host "API Endpoint: POST $API_URL/api/piccolour`n"

# Convert image to base64
if (Test-Path $testImagePath) {
  $imageBytes = [System.IO.File]::ReadAllBytes($testImagePath)
  $base64Image = [System.Convert]::ToBase64String($imageBytes)
  $imageDataUri = "data:image/png;base64,$base64Image"
  
  # Method 1: Send base64 image data
  Write-Host "Method 1: Using Base64 Image Data" -ForegroundColor Yellow
  Write-Host "Command: (Sending base64 encoded image)..." -ForegroundColor DarkGray
  
  try {
    $imageResponse = Invoke-RestMethod -Uri "$API_URL/api/piccolour" `
      -Method POST `
      -ContentType "application/json" `
      -Headers @{
        "Authorization" = "Bearer $BEARER_TOKEN"
      } `
      -Body @{
        imageData = $imageDataUri
      } | ConvertTo-Json -Depth 10
    
    Write-Host "`nResponse:`n" -ForegroundColor Green
    Write-Host $imageResponse -ForegroundColor Green
    
  } catch {
    Write-Host "Error: $_" -ForegroundColor Red
  }
  
  # Method 2: Send file path (local testing only)
  Write-Host "`n" -ForegroundColor White
  Write-Host "Method 2: Using Image File Path" -ForegroundColor Yellow
  Write-Host "Command: curl -X POST http://localhost:5000/api/piccolour " + 
            "-H `"Authorization: Bearer TOKEN`" " +
            "-H `"Content-Type: application/json`" " +
            "-d '{`"imagePath`": `"$testImagePath`"}'" -ForegroundColor DarkGray
  
  Write-Host "`nSending request..." -ForegroundColor Yellow
  
  try {
    $imageResponsePath = Invoke-RestMethod -Uri "$API_URL/api/piccolour" `
      -Method POST `
      -ContentType "application/json" `
      -Headers @{
        "Authorization" = "Bearer $BEARER_TOKEN"
      } `
      -Body @{
        imagePath = $testImagePath
      } | ConvertTo-Json -Depth 10
    
    Write-Host "`nResponse:`n" -ForegroundColor Green
    Write-Host $imageResponsePath -ForegroundColor Green
    
  } catch {
    Write-Host "Error: $_" -ForegroundColor Red
  }
}

# ============================================
# Step 3: CURL Examples for Terminal
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 3: CURL Terminal Examples" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "EXAMPLE 1: Generate Token using CURL`n" -ForegroundColor Yellow
Write-Host 'curl -X POST http://localhost:5000/api/generate-token \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Doe\",
    \"email\": \"john@example.com\"
  }"' -ForegroundColor Cyan

Write-Host "`n`nEXAMPLE 2: Process Image with Token (using file path)`n" -ForegroundColor Yellow
Write-Host 'curl -X POST http://localhost:5000/api/piccolour \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"imagePath\": \"C:\\path\\to\\image.png\"
  }"' -ForegroundColor Cyan

Write-Host "`n`nEXAMPLE 3: Process Image with Token (using base64 data)`n" -ForegroundColor Yellow
Write-Host 'curl -X POST http://localhost:5000/api/piccolour \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"imageData\": \"data:image/png;base64,iVBORw0KGgo...\"
  }"' -ForegroundColor Cyan

# ============================================
# Step 4: Production API Testing
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 4: Testing Production API" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "To test with production API on Render:" -ForegroundColor Yellow
Write-Host "
1. Replace 'http://localhost:5000' with 'https://screenshotcolorpickerbackend.onrender.com'

2. Generate token:
   curl -X POST https://screenshotcolorpickerbackend.onrender.com/api/generate-token \
     -H 'Content-Type: application/json' \
     -d '{\"name\": \"John Doe\", \"email\": \"john@example.com\"}'

3. Process image with token:
   curl -X POST https://screenshotcolorpickerbackend.onrender.com/api/piccolour \
     -H 'Authorization: Bearer TOKEN' \
     -H 'Content-Type: application/json' \
     -d '{\"imagePath\": \"path/to/image.png\"}'
" -ForegroundColor Cyan

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
