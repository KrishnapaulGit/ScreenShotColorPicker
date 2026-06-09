# Screenshot Color Picker API Documentation

## Overview
The API now supports token-based authentication using Bearer tokens. Two new endpoints have been added:

1. **Generate Token** - Create a Bearer token from name and email
2. **Piccolour** - Process images with authentication

---

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your-token-here>
```

---

## Endpoints

### 1. Generate Token
**Generate a Bearer token for API access**

```
POST /api/generate-token
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Response (Success)
```json
{
  "success": true,
  "message": "Token generated successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24 hours",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Response (Error)
```json
{
  "success": false,
  "message": "Name and email are required"
}
```

#### Status Codes
- `200` - Token generated successfully
- `400` - Missing or invalid input (name, email, or invalid email format)
- `500` - Server error

#### Notes
- Token expires after 24 hours
- Valid email format is required
- Generate a new token when the current one expires

---

### 2. Piccolour
**Process image with OCR and color extraction (requires authentication)**

```
POST /api/piccolour
Authorization: Bearer <token>
```

#### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

#### Request Body
```json
{
  "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
}
```

#### Response (Success)
```json
{
  "success": true,
  "message": "Image processed successfully",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "iat": 1686752400
  },
  "data": {
    "text": [
      {
        "text": "Sample",
        "confidence": 0.95,
        "bbox": {
          "x0": 10,
          "y0": 20,
          "x1": 100,
          "y1": 50
        }
      },
      ...
    ],
    "colors": [
      {
        "colorName": "Red",
        "rgb": {
          "r": 255,
          "g": 0,
          "b": 0
        },
        "hex": "#FF0000",
        "bbox": {
          "x0": 150,
          "y0": 60,
          "x1": 200,
          "y1": 100
        }
      },
      ...
    ]
  }
}
```

#### Response (Error - No Token)
```json
{
  "success": false,
  "message": "No token provided. Please provide a Bearer token in Authorization header."
}
```

#### Response (Error - Invalid Token)
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": "jwt expired"
}
```

#### Response (Error - No Image Data)
```json
{
  "success": false,
  "message": "No image data provided. Send imageData as base64 string in request body."
}
```

#### Status Codes
- `200` - Image processed successfully
- `400` - Missing image data
- `401` - Missing token
- `403` - Invalid or expired token
- `500` - Server error

#### Response Data Fields
- **text**: Array of extracted text with bounding boxes
  - `text`: Recognized text
  - `confidence`: OCR confidence (0-1)
  - `bbox`: Bounding box coordinates (x0, y0, x1, y1)

- **colors**: Array of detected colors with bounding boxes
  - `colorName`: Named color (Red, Blue, Green, etc.)
  - `rgb`: RGB values (r, g, b)
  - `hex`: Hex color code
  - `bbox`: Bounding box coordinates

---

## Usage Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Step 1: Generate token
async function getToken() {
  const response = await axios.post(`${API_URL}/api/generate-token`, {
    name: 'John Doe',
    email: 'john@example.com'
  });
  return response.data.token;
}

// Step 2: Process image with token
async function processImage(token, imageBase64) {
  const response = await axios.post(
    `${API_URL}/api/piccolour`,
    { imageData: imageBase64 },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
}

// Complete workflow
(async () => {
  try {
    const token = await getToken();
    console.log('Token:', token);
    
    // Read image and convert to base64
    const fs = require('fs');
    const imageData = fs.readFileSync('screenshot.png');
    const imageBase64 = `data:image/png;base64,${imageData.toString('base64')}`;
    
    const result = await processImage(token, imageBase64);
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
})();
```

### cURL
```bash
# Step 1: Generate Token
curl -X POST http://localhost:5000/api/generate-token \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'

# Save the token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Step 2: Process Image
curl -X POST http://localhost:5000/api/piccolour \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "imageData": "data:image/png;base64,iVBORw0KGgoAAAANS..."
  }'
```

### Python
```python
import requests
import base64
import json

API_URL = 'http://localhost:5000'

# Step 1: Generate token
def get_token(name, email):
    response = requests.post(
        f'{API_URL}/api/generate-token',
        json={'name': name, 'email': email}
    )
    return response.json()['token']

# Step 2: Process image
def process_image(token, image_path):
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode()
    
    response = requests.post(
        f'{API_URL}/api/piccolour',
        json={'imageData': f'data:image/png;base64,{image_data}'},
        headers={'Authorization': f'Bearer {token}'}
    )
    return response.json()

# Complete workflow
token = get_token('John Doe', 'john@example.com')
print(f'Token: {token}')

result = process_image(token, 'screenshot.png')
print(json.dumps(result, indent=2))
```

---

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

---

## Other Endpoints

### GET /api/health
Health check endpoint

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-06-10T12:30:45.123Z"
}
```

### POST /api/process (Legacy)
Original endpoint (without authentication)

```
POST /api/process
Content-Type: multipart/form-data

[image file]
```

### POST /api/export (Legacy)
Export processed results

```
POST /api/export
Content-Type: application/json

{
  "format": "json|csv|excel",
  "results": {...}
}
```

---

## Common Issues

### 401 - No token provided
- **Problem**: Authorization header is missing
- **Solution**: Add `Authorization: Bearer <token>` to request headers

### 403 - Invalid or expired token
- **Problem**: Token is invalid or has expired (24-hour limit)
- **Solution**: Generate a new token using `/api/generate-token`

### 400 - Invalid email format
- **Problem**: Email in token generation request is invalid
- **Solution**: Use a valid email format (e.g., user@example.com)

### 400 - No image data provided
- **Problem**: imageData field is missing in request body
- **Solution**: Send image as base64 in `imageData` field: `{"imageData": "data:image/png;base64,..."}`

---

## Security Notes

1. **Change JWT_SECRET in Production**: The default secret should be changed to a strong random string
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Expiration**: Tokens expire after 24 hours. Implement refresh token logic if needed
4. **Rate Limiting**: Consider adding rate limiting for token generation endpoint
5. **CORS Configuration**: Update CORS_ORIGIN in .env for your specific domains

---

## Testing

Use the provided examples above to test the API:

```bash
# Test with Node.js
node -e "
const axios = require('axios');
(async () => {
  const token = (await axios.post('http://localhost:5000/api/generate-token', {
    name: 'Test User',
    email: 'test@example.com'
  })).data.token;
  console.log('Token:', token);
})();
"
```

---

**Version**: 1.0.0  
**Last Updated**: June 10, 2024
