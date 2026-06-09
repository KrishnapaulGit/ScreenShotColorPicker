// Simple test image creator that doesn't require external dependencies
// This creates a basic PNG with text using canvas-like drawing

const fs = require('fs');
const path = require('path');

// Simple PNG creator with text - we'll use the server's sharp module
const rootDir = require('path').dirname(__dirname);
const processImageWithServer = async () => {
  try {
    // Create an SVG string with our test content
    const svg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="white"/>
      <rect x="40" y="80" width="120" height="60" fill="#FFFF99" stroke="#FF6600" stroke-width="3"/>
      <text x="50" y="115" font-size="24" font-family="Arial" fill="black" font-weight="bold">AUTO</text>
      <rect x="190" y="55" width="180" height="110" fill="#FF9999" stroke="#AA0000" stroke-width="3"/>
      <text x="210" y="115" font-size="24" font-family="Arial" fill="black" font-weight="bold">REPAIR</text>
      <rect x="385" y="55" width="220" height="110" fill="#BB99CC" stroke="#6600AA" stroke-width="3"/>
      <text x="405" y="115" font-size="24" font-family="Arial" fill="black" font-weight="bold">INVOICE</text>
      <rect x="40" y="200" width="150" height="50" fill="#FF9999" stroke="#AA0000" stroke-width="2"/>
      <text x="50" y="230" font-size="16" font-family="Arial" fill="black">Invoice No.</text>
      <rect x="200" y="200" width="150" height="50" fill="#5577FF" stroke="#0000AA" stroke-width="2"/>
      <text x="220" y="230" font-size="18" font-family="Arial" fill="black" font-weight="bold">10000</text>
      <rect x="40" y="260" width="150" height="50" fill="#FF99CC" stroke="#AA0055" stroke-width="2"/>
      <text x="50" y="290" font-size="16" font-family="Arial" fill="black">Amount:</text>
      <rect x="200" y="260" width="150" height="50" fill="#99FF99" stroke="#00AA00" stroke-width="2"/>
      <text x="220" y="290" font-size="18" font-family="Arial" fill="black" font-weight="bold">$1500.00</text>
    </svg>`;

    // Save SVG first
    const svgPath = path.join(__dirname, 'test_invoice.svg');
    fs.writeFileSync(svgPath, svg);
    console.log(`Created SVG: ${svgPath}`);
    
    // Now use server's sharp to convert
    const projectRoot = path.join(__dirname, '..');
    const serverModules = path.join(projectRoot, 'server', 'node_modules');
    const sharp = require(path.join(serverModules, 'sharp'));
    
    const outputPath = path.join(__dirname, 'test_invoice.png');
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Test image created: ${outputPath}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

processImageWithServer();
