const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');
const {
  exportJSON,
  exportCSV,
  exportExcel
} = require('../exportService');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Tesseract to use CDN for WASM files (fixes Vercel deployment)
Tesseract.setLogging(false);

// Configure CORS with environment variable support
const corsOptions = {
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

const upload = multer({
  storage: multer.memoryStorage()
});

function getColorName(r, g, b) {

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const delta = max - min;

  let h = 0;
  let s = 0;
  let v = max;

  if (delta !== 0) {

    s = delta / max;

    switch (max) {

      case r:
        h =
          ((g - b) / delta) % 6;
        break;

      case g:
        h =
          (b - r) / delta + 2;
        break;

      case b:
        h =
          (r - g) / delta + 4;
        break;
    }

    h *= 60;

    if (h < 0) {
      h += 360;
    }
  }

  // Grayscale
  if (s < 0.15) {

    if (v < 0.15)
      return 'Black';

    if (v < 0.4)
      return 'Dark Gray';

    if (v < 0.8)
      return 'Gray';

    return 'White';
  }

  // Hue based colors

  if (h < 15)
    return 'Red';

  if (h < 40)
    return 'Orange';

  if (h < 65)
    return 'Yellow';

  if (h < 90)
    return 'Lime';

  if (h < 150)
    return 'Green';

  if (h < 180)
    return 'Cyan';

  if (h < 210)
    return 'Light Blue';

  if (h < 250)
    return 'Blue';

  if (h < 280)
    return 'Purple';

  if (h < 320)
    return 'Pink';

  if (h < 345)
    return 'Magenta';

  return 'Red';
}
/**
 * Extract dominant color from a region of an image
 */





async function detectColoredRegions(imageBuffer) {

  const { data, info } =
    await sharp(imageBuffer)
      .raw()
      .toBuffer({
        resolveWithObject: true
      });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  const visited =
    new Uint8Array(width * height);

  const regions = [];

  function isColored(r, g, b) {

    // Ignore dark text
    if (
      r < 80 &&
      g < 80 &&
      b < 80
    ) {
      return false;
    }

    // Ignore white background
    if (
      r > 245 &&
      g > 245 &&
      b > 245
    ) {
      return false;
    }

    const max =
      Math.max(r, g, b);

    const min =
      Math.min(r, g, b);

    const saturation =
      max - min;

    return (
      saturation > 15 &&
      (
        r > 120 ||
        g > 120 ||
        b > 120
      )
    );
  }

  function floodFill(startX, startY) {

    const queue = [
      [startX, startY]
    ];

    let minX = startX;
    let minY = startY;
    let maxX = startX;
    let maxY = startY;

    let count = 0;

    while (queue.length) {

      const [x, y] =
        queue.pop();

      if (
        x < 0 ||
        y < 0 ||
        x >= width ||
        y >= height
      ) {
        continue;
      }

      const idx =
        y * width + x;

      if (visited[idx]) {
        continue;
      }

      visited[idx] = 1;

      const pixelIndex =
        idx * channels;

      const r =
        data[pixelIndex];

      const g =
        data[pixelIndex + 1];

      const b =
        data[pixelIndex + 2];

      if (
        !isColored(r, g, b)
      ) {
        continue;
      }

      count++;

      minX =
        Math.min(minX, x);

      minY =
        Math.min(minY, y);

      maxX =
        Math.max(maxX, x);

      maxY =
        Math.max(maxY, y);

      const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
      ];

      for (const [dx, dy] of directions) {

        const nx = x + dx;
        const ny = y + dy;

        if (
          nx < 0 ||
          ny < 0 ||
          nx >= width ||
          ny >= height
        ) {
          continue;
        }

        const nPixelIndex =
          (ny * width + nx) *
          channels;

        const nr =
          data[nPixelIndex];

        const ng =
          data[nPixelIndex + 1];

        const nb =
          data[nPixelIndex + 2];

        // Connect only similar colors
        if (
          Math.abs(nr - r) < 20 &&
          Math.abs(ng - g) < 20 &&
          Math.abs(nb - b) < 20
        ) {
          queue.push([
            nx,
            ny
          ]);
        }
      }
    }

    const regionWidth =
      maxX - minX;

    const regionHeight =
      maxY - minY;

    const aspectRatio =
      regionWidth /
      Math.max(regionHeight, 1);

    // Ignore merged super-wide regions
    if (
      aspectRatio > 4
    ) {
      return null;
    }

    // Ignore tiny regions
    if (
      count < 250 ||
      regionWidth < 25 ||
      regionHeight < 15
    ) {
      return null;
    }

    console.log(
      `Region Found -> x:${minX}, y:${minY}, w:${regionWidth}, h:${regionHeight}, pixels:${count}`
    );

    return {
      x: minX,
      y: minY,
      width: regionWidth,
      height: regionHeight
    };
  }

  // Detect regions
  for (
    let y = 0;
    y < height;
    y++
  ) {

    for (
      let x = 0;
      x < width;
      x++
    ) {

      const idx =
        y * width + x;

      if (
        visited[idx]
      ) {
        continue;
      }

      const pixelIndex =
        idx * channels;

      const r =
        data[pixelIndex];

      const g =
        data[pixelIndex + 1];

      const b =
        data[pixelIndex + 2];

      if (
        isColored(r, g, b)
      ) {

        const region =
          floodFill(x, y);

        if (region) {
          regions.push(region);
        }
      }
    }
  }

  // Remove overlapping duplicate regions
  const filteredRegions = [];

  for (const region of regions) {

    const regionArea =
      region.width *
      region.height;

    let shouldAdd = true;

    for (
      let i = 0;
      i < filteredRegions.length;
      i++
    ) {

      const existing =
        filteredRegions[i];

      const existingArea =
        existing.width *
        existing.height;

      const overlapX =
        Math.max(
          0,
          Math.min(
            region.x + region.width,
            existing.x + existing.width
          ) -
          Math.max(
            region.x,
            existing.x
          )
        );

      const overlapY =
        Math.max(
          0,
          Math.min(
            region.y + region.height,
            existing.y + existing.height
          ) -
          Math.max(
            region.y,
            existing.y
          )
        );

      const overlapArea =
        overlapX * overlapY;

      const overlapRatio =
        overlapArea /
        Math.min(
          regionArea,
          existingArea
        );

      if (
        overlapRatio > 0.8
      ) {

        if (
          regionArea <
          existingArea
        ) {

          filteredRegions[i] =
            region;
        }

        shouldAdd = false;
        break;
      }
    }

    if (shouldAdd) {
      filteredRegions.push(region);
    }
  }

  filteredRegions.sort((a, b) => {

    const rowTolerance = 15;

    if (
      Math.abs(a.y - b.y) <
      rowTolerance
    ) {
      return a.x - b.x;
    }

    return a.y - b.y;
  });

  console.log(
    'Detected Regions:'
  );

  console.log(
    JSON.stringify(
      filteredRegions,
      null,
      2
    )
  );

  return filteredRegions;
}

async function extractTextFromRegion(
  imageBuffer,
  region
) {

  const buffer =
    await sharp(imageBuffer)

      .extract({
        left: region.x,
        top: region.y,
        width: region.width,
        height: region.height
      })

      .resize({
        width:
          Math.max(
            region.width * 8,
            300
          )
      })

      .grayscale()

      .normalize()

      .sharpen()

      .png()

      .toBuffer();

  // Add timeout to OCR to prevent hanging
  const ocrTimeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('OCR timeout')), 15000)
  );

  // Create worker with CDN configuration for WASM files
//  const worker = await Tesseract.createWorker('eng', 1, {
//   workerPath:
//     'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',

//   corePath:
//     'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core-simd.wasm.js',

//   langPath:
//     'https://tessdata.projectnaptha.com/4.0.0'
// });

const worker = await Tesseract.createWorker('eng');
  try {
    const result = await Promise.race([
  (async () => {
    return await worker.recognize(buffer);
  })(),
  ocrTimeoutPromise
]);

    const cleanedText =
      result.data.text

        .replace(
          /[^a-zA-Z0-9.:/_\-\s]/g,
          ''
        )

        .replace(/\s+/g, ' ')

        .trim();

    return {

      text: cleanedText,

      confidence:
        Math.round(
          result.data.confidence
        )
    };
  } finally {
    await worker.terminate();
  }
}

function removeDuplicates(
  results
) {

  const unique = [];

  for (const item of results) {

    const exists =
      unique.some(r =>

        String(r.text)
          .toLowerCase()
          .trim() ===

        String(item.text)
          .toLowerCase()
          .trim()

      );

    if (!exists) {

      unique.push(item);
    }
  }

  return unique;
}
async function getDominantColor(
  imageBuffer,
  region
) {

  const { data, info } =
    await sharp(imageBuffer)
      .extract({
        left: Math.max(0, region.x),
        top: Math.max(0, region.y),
        width: Math.max(1, region.width),
        height: Math.max(1, region.height)
      })
      .resize(60, 60)
      .raw()
      .toBuffer({
        resolveWithObject: true
      });

  const histogram = {};

  for (
    let i = 0;
    i < data.length;
    i += info.channels
  ) {

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Ignore dark text
    if (
      r < 70 &&
      g < 70 &&
      b < 70
    ) {
      continue;
    }

    // Ignore near white
    if (
      r > 245 &&
      g > 245 &&
      b > 245
    ) {
      continue;
    }

    // Ignore gray pixels
    const max =
      Math.max(r, g, b);

    const min =
      Math.min(r, g, b);

    const saturation =
      max - min;

    if (
      saturation < 15
    ) {
      continue;
    }

    const qr =
      Math.round(r / 15) * 15;

    const qg =
      Math.round(g / 15) * 15;

    const qb =
      Math.round(b / 15) * 15;

    const key =
      `${qr},${qg},${qb}`;

    histogram[key] =
      (histogram[key] || 0) + 1;
  }

  if (
    Object.keys(histogram)
      .length === 0
  ) {

    return {
      hex: '#FFFFFF',
      rgb: [255, 255, 255],
      colorName: 'White'
    };
  }

  let dominantKey = null;
  let maxCount = 0;

  for (
    const [key, count]
    of Object.entries(histogram)
  ) {

    if (
      count > maxCount
    ) {

      maxCount = count;
      dominantKey = key;
    }
  }

  const [r, g, b] =
    dominantKey
      .split(',')
      .map(Number);

  const hex =
    '#' +
    [r, g, b]
      .map(v =>
        v
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
      .toUpperCase();

  return {
    hex,
    rgb: [r, g, b],
    colorName:
      getColorName(
        r,
        g,
        b
      )
  };
}




async function processImage(imageBuffer) {

  console.log('Detecting colored regions...');

  let regions =
    await detectColoredRegions(
      imageBuffer
    );

  console.log(
    'Detected Regions:',
    JSON.stringify(
      regions,
      null,
      2
    )
  );

  // -----------------------------
  // TABLE MODE
  // -----------------------------
  if (regions.length > 20) {

    console.log(
      'TABLE DETECTED'
    );

    return await processTableMode(
      imageBuffer,
      regions
    );
  }

  // -----------------------------
  // NORMAL MODE
  // -----------------------------
  console.log(
    `Found ${regions.length} regions`
  );

  const results = [];

  for (const region of regions) {

    try {

      console.log(
        'Processing Region:',
        region
      );

      const ocrResult =
        await extractTextFromRegion(
          imageBuffer,
          region
        );

      const text =
        String(
          ocrResult.text || ''
        )
          .replace(
            /[^a-zA-Z0-9.:/_\-\s]/g,
            ''
          )
          .replace(/\s+/g, ' ')
          .trim();

      const confidence =
        Number(
          ocrResult.confidence || 0
        );

      console.log(
        'OCR Result:',
        JSON.stringify(text)
      );

      if (
        !text ||
        text.length < 2
      ) {
        continue;
      }

      if (
        /^[a-z]{1,3}$/i.test(text)
      ) {
        console.log(
          'Skipping OCR garbage:',
          text
        );
        continue;
      }

      const colorData =
        await getDominantColor(
          imageBuffer,
          region
        );

      const item = {

        text,

        confidence,

        backgroundColor:
          colorData.hex,

        colorName:
          colorData.colorName,

        rgb:
          colorData.rgb,

        bbox: {
          x: region.x,
          y: region.y,
          width: region.width,
          height: region.height
        }
      };

      results.push(item);

      console.log(
        `✓ ${text}`
      );

    } catch (err) {

      console.error(
        'Region processing error:',
        err.message
      );
    }
  }

  const uniqueResults = [];

  for (const item of results) {

    const exists =
      uniqueResults.some(r =>

        String(r.text)
          .toLowerCase()
          .trim() ===

        String(item.text)
          .toLowerCase()
          .trim()
      );

    if (!exists) {
      uniqueResults.push(item);
    }
  }

  console.log(
    `✓ Processing complete: ${uniqueResults.length} items`
  );

  return uniqueResults;
}


async function processRegionImage(
  imageBuffer,
  regions
) {

  const results = [];

  for (const region of regions) {

    try {

      console.log(
        'Processing Region:',
        region
      );

      const ocrResult =
        await extractTextFromRegion(
          imageBuffer,
          region
        );

      const text =
        String(
          ocrResult.text || ''
        )

          .replace(
            /[^a-zA-Z0-9.:/_\-\s]/g,
            ''
          )

          .replace(/\s+/g, ' ')

          .trim();

      // Skip empty
      if (
        !text ||
        text.length < 2
      ) {
        continue;
      }

      // Skip garbage OCR
      if (
        /^[a-z]{1,3}$/i.test(text)
      ) {
        console.log(
          'Skipping OCR garbage:',
          text
        );
        continue;
      }

      // Skip table extension column
      if (
        text.toLowerCase() === 'tif'
      ) {
        continue;
      }

      const colorData =
        await getDominantColor(
          imageBuffer,
          region
        );

      const item = {

        text,

        confidence:
          Number(
            ocrResult.confidence || 0
          ),

        backgroundColor:
          colorData.hex,

        colorName:
          colorData.colorName,

        rgb:
          colorData.rgb,

        bbox: {

          x:
            region.x,

          y:
            region.y,

          width:
            region.width,

          height:
            region.height
        }
      };

      results.push(item);

      console.log(
        `✓ ${item.text} (${item.confidence}%)`
      );

    } catch (err) {

      console.error(
        'Region processing error:',
        err.message
      );
    }
  }

  // Remove duplicates
  const uniqueResults = [];

  for (const item of results) {

    const exists =
      uniqueResults.some(r =>

        String(r.text)
          .trim()
          .toLowerCase() ===

        String(item.text)
          .trim()
          .toLowerCase()
      );

    if (!exists) {

      uniqueResults.push(
        item
      );
    }
  }

  console.log(
    `✓ Processing complete: ${uniqueResults.length} items`
  );

  console.log(
    'Final Results:',
    JSON.stringify(
      uniqueResults,
      null,
      2
    )
  );

  return uniqueResults;
}

async function processTableMode(
  imageBuffer,
  regions
) {

  console.log(
    'Running TABLE MODE...'
  );

  // Sort regions
  regions.sort((a, b) => {

    if (
      Math.abs(a.y - b.y) < 15
    ) {
      return a.x - b.x;
    }

    return a.y - b.y;
  });

  // Group into rows
  const rows = [];

  for (const region of regions) {

    let found = false;

    for (const row of rows) {

      if (
        Math.abs(
          row.y - region.y
        ) < 15
      ) {

        row.cells.push(
          region
        );

        found = true;
        break;
      }
    }

    if (!found) {

      rows.push({

        y: region.y,

        cells: [region]
      });
    }
  }

  console.log(
    `Found ${rows.length} rows`
  );

  const results = [];

  for (const row of rows) {

    try {

      row.cells.sort(
        (a, b) => a.x - b.x
      );

      const minX =
        Math.min(
          ...row.cells.map(
            c => c.x
          )
        );

      const maxX =
        Math.max(
          ...row.cells.map(
            c =>
              c.x +
              c.width
          )
        );

      const minY =
        Math.min(
          ...row.cells.map(
            c => c.y
          )
        );

      const maxY =
        Math.max(
          ...row.cells.map(
            c =>
              c.y +
              c.height
          )
        );

      const rowRegion = {

        x: minX,

        y: minY,

        width:
          maxX - minX,

        height:
          maxY - minY
      };

      console.log(
        'OCR Row:',
        rowRegion
      );

      const ocr =
        await extractTextFromRegion(
          imageBuffer,
          rowRegion
        );

      const rowText =
        String(
          ocr.text || ''
        )

          .replace(
            /\s+/g,
            ' '
          )

          .trim();

      console.log(
        'ROW OCR:',
        rowText
      );

      if (
        !rowText ||
        rowText.length < 5
      ) {
        continue;
      }

      const colorData =
        await getDominantColor(
          imageBuffer,
          rowRegion
        );

      // Split OCR text
      const parts =
        rowText.split(' ');

      const fileName =
        parts.find(
          p =>
            p
              .toLowerCase()
              .includes('.tif')
        ) || '';

      const fileSize =
        parts.find(
          p =>
            /^\d{4,}$/.test(p)
        ) || '';

      const status =
        rowText.includes(
          'Completed'
        )
          ? 'Completed'
          : '';

      const batchMatch =
        rowText.match(
          /Batch\s+\d+/i
        );

      const projectMatch =
        rowText.match(
          /Tax\s+Project/i
        );

      const batch =
        batchMatch
          ? batchMatch[0]
          : '';

      const project =
        projectMatch
          ? projectMatch[0]
          : '';

      const invoiceMatch =
        rowText.match(
          /INVOICE[_ ]?SET/i
        );

      const invoiceName =
        invoiceMatch
          ? invoiceMatch[0]
          : '';

      results.push({

        text: rowText,

        fileName,

        fileType:
          fileName
            .split('.')
            .pop(),

        name:
          invoiceName,

        fileSize,

        batch,

        project,

        status,

        confidence:
          Math.round(
            ocr.confidence || 0
          ),

        backgroundColor:
          colorData.hex,

        colorName:
          colorData.colorName,

        rgb:
          colorData.rgb,

        bbox: rowRegion
      });

      console.log(
        `✓ ${rowText}`
      );

    } catch (err) {

      console.error(
        'Row OCR Error:',
        err.message
      );
    }
  }

  console.log(
    `✓ Extracted ${results.length} rows`
  );

  return results;
}

/**
 * Process image: OCR + Color extraction

/**
 * POST /api/process - Upload and process image
 */
app.post('/api/process', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageBuffer = req.file.buffer;

    console.log('Processing image from memory');
    console.log('File info:', { size: req.file.size, mimetype: req.file.mimetype });

    // Set a timeout for processing (55 seconds to leave buffer before 60s serverless timeout)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Image processing timeout - OCR took too long')), 55000)
    );

    const results = await Promise.race([
      processImage(imageBuffer),
      timeoutPromise
    ]);

    console.log('Processing complete. Results:', results.length, 'items');

    res.json({
      success: true,
      data: results,
      count: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Error processing image'
    });
  }
});


app.post('/api/export', async (req, res) => {

  try {

    const { format, data } = req.body;

    console.log('Export Request');
    console.log('Format:', format);
    console.log('Rows:', data?.length);

    if (!format) {

      return res.status(400).json({
        error: 'Format missing'
      });

    }

    if (
      !data ||
      !Array.isArray(data)
    ) {

      return res.status(400).json({
        error: 'Data missing'
      });

    }

    let fileBuffer;
    let fileName;
    let contentType;

    switch (format) {

      case 'json':

        fileBuffer =
          await exportJSON(data);

        fileName =
          'results.json';

        contentType =
          'application/json';

        break;

      case 'csv':

        fileBuffer =
          await exportCSV(data);

        fileName =
          'results.csv';

        contentType =
          'text/csv';

        break;

      case 'excel':

        fileBuffer =
          await exportExcel(data);

        fileName =
          'results.xlsx';

        contentType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        break;

      default:

        return res.status(400).json({
          error: 'Invalid format'
        });

    }

    res.setHeader(
      'Content-Type',
      contentType
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`
    );

    return res.send(fileBuffer);

  } catch (error) {

    console.error(
      'Export Error:',
      error
    );

    return res.status(500).json({
      error: error.message
    });

  }

});
/**
 * GET /api/health - Health check
 */
app.get('/api/health', (req, res) => {

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });

});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

module.exports = app;