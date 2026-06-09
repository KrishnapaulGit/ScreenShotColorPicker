const sharp = require('./server/node_modules/sharp');
const path = require('path');

async function createTestImage() {
  try {
    // Create a simple SVG with text and colors
    const svg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="600" height="400" fill="white"/>
      
      <!-- Yellow box with AUTO text -->
      <rect x="40" y="80" width="120" height="60" fill="#FFFF99" stroke="#FF6600" stroke-width="3"/>
      <text x="50" y="115" font-size="24" font-family="Arial" fill="black" font-weight="bold">AUTO</text>
      
      <!-- Red box with REPAIR text -->
      <rect x="190" y="55" width="180" height="110" fill="#FF9999" stroke="#AA0000" stroke-width="3"/>
      <text x="210" y="115" font-size="24" font-family="Arial" fill="black" font-weight="bold">REPAIR</text>
      
      <!-- Purple box with INVOICE text -->
      <rect x="385" y="55" width="220" height="110" fill="#BB99CC" stroke="#6600AA" stroke-width="3"/>
      <text x="405" y="115" font-size="24" font-family="Arial" fill="black" font-weight="bold">INVOICE</text>
      
      <!-- Invoice No label -->
      <rect x="40" y="200" width="150" height="50" fill="#FF9999" stroke="#AA0000" stroke-width="2"/>
      <text x="50" y="230" font-size="16" font-family="Arial" fill="black">Invoice No.</text>
      
      <!-- Invoice No value -->
      <rect x="200" y="200" width="150" height="50" fill="#5577FF" stroke="#0000AA" stroke-width="2"/>
      <text x="220" y="230" font-size="18" font-family="Arial" fill="black" font-weight="bold">10000</text>
      
      <!-- Amount label -->
      <rect x="40" y="260" width="150" height="50" fill="#FF99CC" stroke="#AA0055" stroke-width="2"/>
      <text x="50" y="290" font-size="16" font-family="Arial" fill="black">Amount:</text>
      
      <!-- Amount value -->
      <rect x="200" y="260" width="150" height="50" fill="#99FF99" stroke="#00AA00" stroke-width="2"/>
      <text x="220" y="290" font-size="18" font-family="Arial" fill="black" font-weight="bold">$1500.00</text>
      
      <!-- Date -->
      <rect x="360" y="200" width="200" height="50" fill="#FFFFCC" stroke="#CCAA00" stroke-width="2"/>
      <text x="375" y="230" font-size="16" font-family="Arial" fill="black">Date: 01/12/2024</text>
    </svg>`;

    const outputPath = path.join(process.cwd(), 'test_invoice.png');
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Test image created: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error creating test image:', error);
    process.exit(1);
  }
}

createTestImage();
