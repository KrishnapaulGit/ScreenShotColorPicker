const sharp = require('sharp');
const path = require('path');

async function createBetterTestImage() {
  try {
    // Create a better SVG with larger, clearer text
    const svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <!-- White background -->
      <rect width="800" height="600" fill="white"/>
      
      <!-- Title -->
      <text x="50" y="50" font-size="40" font-family="Arial, sans-serif" font-weight="bold" fill="black">INVOICE</text>
      
      <!-- Yellow section - AUTO -->
      <rect x="50" y="100" width="200" height="80" fill="#FFFF99" stroke="#FF6600" stroke-width="2"/>
      <text x="75" y="150" font-size="32" font-family="Arial, sans-serif" font-weight="bold" fill="black">AUTO</text>
      
      <!-- Red section - REPAIR -->
      <rect x="300" y="100" width="200" height="80" fill="#FF9999" stroke="#AA0000" stroke-width="2"/>
      <text x="325" y="150" font-size="32" font-family="Arial, sans-serif" font-weight="bold" fill="black">REPAIR</text>
      
      <!-- Purple section - INVOICE -->
      <rect x="550" y="100" width="200" height="80" fill="#BB99CC" stroke="#6600AA" stroke-width="2"/>
      <text x="575" y="150" font-size="32" font-family="Arial, sans-serif" font-weight="bold" fill="black">INVOICE</text>
      
      <!-- Invoice details -->
      <text x="50" y="230" font-size="16" font-family="Arial, sans-serif" font-weight="bold" fill="black">Invoice No:</text>
      <rect x="250" y="210" width="150" height="40" fill="#E8F4F8" stroke="#333" stroke-width="1"/>
      <text x="260" y="235" font-size="20" font-family="Arial, sans-serif" font-weight="bold" fill="black">10000</text>
      
      <text x="50" y="310" font-size="16" font-family="Arial, sans-serif" font-weight="bold" fill="black">Amount:</text>
      <rect x="250" y="290" width="150" height="40" fill="#E8F4F8" stroke="#333" stroke-width="1"/>
      <text x="260" y="315" font-size="20" font-family="Arial, sans-serif" font-weight="bold" fill="black">$1500.00</text>
      
      <text x="50" y="390" font-size="16" font-family="Arial, sans-serif" font-weight="bold" fill="black">Invoice Date:</text>
      <rect x="250" y="370" width="150" height="40" fill="#E8F4F8" stroke="#333" stroke-width="1"/>
      <text x="260" y="395" font-size="18" font-family="Arial, sans-serif" fill="black">01/12/2024</text>
      
      <text x="50" y="470" font-size="16" font-family="Arial, sans-serif" font-weight="bold" fill="black">Due Date:</text>
      <rect x="250" y="450" width="150" height="40" fill="#E8F4F8" stroke="#333" stroke-width="1"/>
      <text x="260" y="475" font-size="18" font-family="Arial, sans-serif" fill="black">02/12/2024</text>
    </svg>`;

    const outputPath = path.join(__dirname, 'test_invoice_better.png');
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Better test image created: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error creating test image:', error.message);
    process.exit(1);
  }
}

createBetterTestImage();
