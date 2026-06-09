const Tesseract = require('tesseract.js');
const path = require('path');

async function testTesseract() {
  try {
    // Use the uploaded test image if it exists
    const testImages = [
      'C:\\Users\\KRISHNA PAUL\\OneDrive\\Desktop\\ScreenshotColorPicker\\server\\uploads\\1780423788432.png',
      'C:\\Users\\KRISHNA PAUL\\Downloads\\test.png'
    ];

    let imagePath = null;
    for (const img of testImages) {
      if (require('fs').existsSync(img)) {
        imagePath = img;
        break;
      }
    }

    if (!imagePath) {
      console.log('No test image found. Testing with URL instead...');
      imagePath = 'https://raw.githubusercontent.com/naptha/tesseract.js/master/examples/img/euro_en.png';
    }

    console.log('Testing Tesseract with image:', imagePath);
    console.log('---');

    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(`Progress: ${Math.round(m.progress * 100)}%`)
    });

    console.log('\n=== RESULT STRUCTURE ===');
    console.log('Result keys:', Object.keys(result));
    console.log('\nData keys:', result.data ? Object.keys(result.data) : 'NO DATA');
    
    if (result.data) {
      console.log('\nData content:');
      console.log('- text:', result.data.text ? result.data.text.substring(0, 100) : 'N/A');
      console.log('- lines:', Array.isArray(result.data.lines) ? result.data.lines.length + ' lines' : 'N/A');
      console.log('- words:', Array.isArray(result.data.words) ? result.data.words.length + ' words' : 'N/A');
      console.log('- paragraphs:', Array.isArray(result.data.paragraphs) ? result.data.paragraphs.length + ' paragraphs' : 'N/A');
      
      // Show first few items
      if (result.data.lines && result.data.lines.length > 0) {
        console.log('\nFirst line:', JSON.stringify(result.data.lines[0], null, 2).substring(0, 200));
      }
      
      if (result.data.words && result.data.words.length > 0) {
        console.log('\nFirst word:', JSON.stringify(result.data.words[0], null, 2));
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

testTesseract();
