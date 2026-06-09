/**
 * Test Script for Piccolour API Endpoints
 * 
 * Usage:
 *   node test-api.js
 * 
 * This script tests the new token-based API endpoints:
 *   1. POST /api/generate-token - Generate Bearer token
 *   2. POST /api/piccolour - Process image with authentication
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'http://localhost:5000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'cyan');
  log(`${'='.repeat(60)}\n`, 'cyan');
}

async function testGenerateToken() {
  logSection('Test 1: Generate Token');
  
  try {
    log('Sending request to /api/generate-token...', 'blue');
    log('Payload:', 'blue');
    log(JSON.stringify({
      name: 'Test User',
      email: 'test@example.com'
    }, null, 2), 'yellow');
    
    const response = await axios.post(`${API_URL}/api/generate-token`, {
      name: 'Test User',
      email: 'test@example.com'
    });

    log('\n✓ Success! (Status: 200)', 'green');
    log('Response:', 'blue');
    log(JSON.stringify(response.data, null, 2), 'yellow');
    
    return response.data.token;
  } catch (error) {
    log(`✗ Error! (Status: ${error.response?.status})`, 'red');
    log('Response:', 'blue');
    log(JSON.stringify(error.response?.data, null, 2), 'yellow');
    process.exit(1);
  }
}

async function testPiccolourfWithoutToken() {
  logSection('Test 2: Piccolour Without Token (Should Fail)');
  
  try {
    log('Sending request to /api/piccolour WITHOUT token...', 'blue');
    
    const response = await axios.post(`${API_URL}/api/piccolour`, {
      imageData: 'data:image/png;base64,test'
    });

    log('✗ Unexpected success! Should have failed.', 'red');
    log('Response:', 'blue');
    log(JSON.stringify(response.data, null, 2), 'yellow');
  } catch (error) {
    if (error.response?.status === 401) {
      log('✓ Correctly rejected! (Status: 401)', 'green');
      log('Response:', 'blue');
      log(JSON.stringify(error.response?.data, null, 2), 'yellow');
    } else {
      log(`✗ Unexpected error! (Status: ${error.response?.status})`, 'red');
      log('Response:', 'blue');
      log(JSON.stringify(error.response?.data, null, 2), 'yellow');
    }
  }
}

async function testPiccolourfWithInvalidToken() {
  logSection('Test 3: Piccolour With Invalid Token (Should Fail)');
  
  try {
    log('Sending request with invalid token...', 'blue');
    log('Authorization: Bearer invalid.token.here', 'yellow');
    
    const response = await axios.post(`${API_URL}/api/piccolour`, 
      { imageData: 'data:image/png;base64,test' },
      {
        headers: {
          'Authorization': 'Bearer invalid.token.here'
        }
      }
    );

    log('✗ Unexpected success! Should have failed.', 'red');
    log('Response:', 'blue');
    log(JSON.stringify(response.data, null, 2), 'yellow');
  } catch (error) {
    if (error.response?.status === 403) {
      log('✓ Correctly rejected! (Status: 403)', 'green');
      log('Response:', 'blue');
      log(JSON.stringify(error.response?.data, null, 2), 'yellow');
    } else {
      log(`✗ Unexpected error! (Status: ${error.response?.status})`, 'red');
      log('Response:', 'blue');
      log(JSON.stringify(error.response?.data, null, 2), 'yellow');
    }
  }
}

async function testPiccolourfWithoutImageData(token) {
  logSection('Test 4: Piccolour Without Image Data (Should Fail)');
  
  try {
    log('Sending request without imageData field...', 'blue');
    
    const response = await axios.post(`${API_URL}/api/piccolour`, 
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    log('✗ Unexpected success! Should have failed.', 'red');
    log('Response:', 'blue');
    log(JSON.stringify(response.data, null, 2), 'yellow');
  } catch (error) {
    if (error.response?.status === 400) {
      log('✓ Correctly rejected! (Status: 400)', 'green');
      log('Response:', 'blue');
      log(JSON.stringify(error.response?.data, null, 2), 'yellow');
    } else {
      log(`✗ Unexpected error! (Status: ${error.response?.status})`, 'red');
      log('Response:', 'blue');
      log(JSON.stringify(error.response?.data, null, 2), 'yellow');
    }
  }
}

async function testPiccolourfWithTestImage(token) {
  logSection('Test 5: Piccolour With Test Image');
  
  try {
    // Try to load an existing test image
    const testImagePath = path.join(__dirname, 'test_invoice.png');
    
    if (!fs.existsSync(testImagePath)) {
      log(`⚠ Test image not found at ${testImagePath}`, 'yellow');
      log('Skipping image processing test.', 'yellow');
      log('To test with an image, place a test image at:' , 'yellow');
      log(`  ${testImagePath}`, 'yellow');
      return;
    }

    log(`Loading image from: ${testImagePath}`, 'blue');
    const imageBuffer = fs.readFileSync(testImagePath);
    const imageBase64 = imageBuffer.toString('base64');
    const imageData = `data:image/png;base64,${imageBase64}`;

    log(`Image size: ${imageBuffer.length} bytes`, 'blue');
    log('Sending request to /api/piccolour with image...', 'blue');
    
    const response = await axios.post(`${API_URL}/api/piccolour`, 
      { imageData },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000 // 30 second timeout for image processing
      }
    );

    log('✓ Success! (Status: 200)', 'green');
    log('Response:', 'blue');
    const responseData = response.data;
    log(JSON.stringify({
      success: responseData.success,
      message: responseData.message,
      user: responseData.user,
      dataKeys: Object.keys(responseData.data || {}),
      textCount: responseData.data?.text?.length || 0,
      colorCount: responseData.data?.colors?.length || 0
    }, null, 2), 'yellow');

    if (responseData.data?.text?.length > 0) {
      log('\nExtracted Text Samples (first 2):', 'blue');
      responseData.data.text.slice(0, 2).forEach((item, index) => {
        log(`  ${index + 1}. "${item.text}" (confidence: ${(item.confidence * 100).toFixed(1)}%)`, 'yellow');
      });
    }

    if (responseData.data?.colors?.length > 0) {
      log('\nDetected Colors (first 2):', 'blue');
      responseData.data.colors.slice(0, 2).forEach((item, index) => {
        log(`  ${index + 1}. ${item.colorName} (${item.hex})`, 'yellow');
      });
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log(`✗ Connection refused! Is the server running at ${API_URL}?`, 'red');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      log(`✗ Connection timeout! Cannot reach ${API_URL}`, 'red');
    } else {
      log(`✗ Error! (Status: ${error.response?.status || 'N/A'})`, 'red');
      log('Response:', 'blue');
      log(JSON.stringify(error.response?.data || error.message, null, 2), 'yellow');
    }
  }
}

async function testInvalidEmail() {
  logSection('Test 6: Generate Token With Invalid Email (Should Fail)');
  
  try {
    log('Sending request with invalid email format...', 'blue');
    log('Payload:', 'blue');
    log(JSON.stringify({
      name: 'Test User',
      email: 'invalid-email'
    }, null, 2), 'yellow');
    
    const response = await axios.post(`${API_URL}/api/generate-token`, {
      name: 'Test User',
      email: 'invalid-email'
    });

    log('✗ Unexpected success! Should have failed.', 'red');
    log('Response:', 'blue');
    log(JSON.stringify(response.data, null, 2), 'yellow');
  } catch (error) {
    if (error.response?.status === 400) {
      log('✓ Correctly rejected! (Status: 400)', 'green');
      log('Response:', 'blue');
      log(JSON.stringify(error.response?.data, null, 2), 'yellow');
    } else {
      log(`✗ Unexpected error! (Status: ${error.response?.status})`, 'red');
      log('Response:', 'blue');
      log(JSON.stringify(error.response?.data, null, 2), 'yellow');
    }
  }
}

async function runAllTests() {
  log('\n', 'cyan');
  log('╔══════════════════════════════════════════════════════════╗', 'cyan');
  log('║         PICCOLOUR API - ENDPOINT TESTING SUITE            ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════╝', 'cyan');
  log(`\nAPI URL: ${API_URL}\n`, 'cyan');

  try {
    // Test 1: Generate Token
    const token = await testGenerateToken();

    // Test 2: Piccolour without token
    await testPiccolourfWithoutToken();

    // Test 3: Piccolour with invalid token
    await testPiccolourfWithInvalidToken();

    // Test 4: Piccolour without image data
    await testPiccolourfWithoutImageData(token);

    // Test 5: Piccolour with valid token and image
    await testPiccolourfWithTestImage(token);

    // Test 6: Generate token with invalid email
    await testInvalidEmail();

    logSection('Test Summary');
    log('✓ All tests completed!', 'green');
    log(`\nGenerated Token (valid for 24 hours):`, 'blue');
    log(token, 'yellow');
    log(`\nUse this token for subsequent requests:`, 'blue');
    log(`Authorization: Bearer ${token}`, 'yellow');

  } catch (error) {
    log(`\n✗ Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  log(`\nFatal error: ${error.message}`, 'red');
  process.exit(1);
});
