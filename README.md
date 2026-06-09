# Screenshot Color Picker 📸

A full-stack application that extracts text, bounding boxes, and color information from screenshots and images using OCR (Tesseract).

## Features

✨ **Core Functionality:**
- 📤 Drag-and-drop image upload
- 🔍 OCR text detection with Tesseract
- 📍 Bounding box coordinates extraction
- 🎨 Automatic color extraction (RGB, HEX)
- 📊 Export results to JSON, CSV, and Excel
- 🎯 Visual preview with detected boxes and text labels

## Architecture

```
Screenshot Color Picker
├── Frontend (React)
│   ├── Image uploader with drag-drop
│   ├── Real-time preview with bounding boxes
│   ├── Results display with expandable details
│   └── Export functionality
│
└── Backend (Node.js + Tesseract.js)
    ├── OCR processing
    ├── Color extraction from regions
    ├── Export to multiple formats
    └── REST API endpoints
```

## Project Structure

```
ScreenshotColorPicker/
├── server/                      # Node.js backend
│   ├── index.js                # Main server file
│   ├── package.json
│   ├── .env.example
│   └── uploads/               # Temporary upload directory
│
├── client/                      # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── components/
│   │       ├── ImageUploader.js
│   │       ├── ImagePreview.js
│   │       ├── ResultsDisplay.js
│   │       └── [component styles]
│   └── package.json
│
├── package.json               # Root package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 14+ and npm
- Modern web browser

### Setup

1. **Install root dependencies:**
```bash
npm install
```

2. **Install server and client dependencies:**
```bash
npm run install-all
```

## Usage

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Production Build

```bash
npm run build
```

### Backend Only

```bash
npm run server
```

### Frontend Only

```bash
npm run client
```

## API Endpoints

### POST /api/process
Upload and process an image for OCR and color extraction.

**Request:**
- Form data with `image` file

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "text": "AUTO",
      "backgroundColor": "#FFFF99",
      "rgb": [255, 255, 153],
      "bbox": {
        "x": 250,
        "y": 70,
        "width": 120,
        "height": 40
      },
      "confidence": 0.95
    },
    {
      "text": "REPAIR",
      "backgroundColor": "#FF9999",
      "rgb": [255, 153, 153],
      "bbox": {...},
      "confidence": 0.92
    }
  ],
  "count": 2,
  "timestamp": "2024-06-02T10:30:00.000Z"
}
```

### POST /api/export
Export extraction results to JSON, CSV, or Excel format.

**Request:**
```json
{
  "data": [...],  // Array of extracted items
  "format": "json" // or "csv", "excel"
}
```

**Response:** File download

### GET /api/health
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-06-02T10:30:00.000Z"
}
```

## Data Format

Each extracted item contains:

| Field | Type | Description |
|-------|------|-------------|
| `text` | string | Extracted text |
| `backgroundColor` | string | HEX color of background |
| `rgb` | array | RGB values [R, G, B] |
| `bbox` | object | Bounding box coordinates |
| `bbox.x` | number | X coordinate |
| `bbox.y` | number | Y coordinate |
| `bbox.width` | number | Width in pixels |
| `bbox.height` | number | Height in pixels |
| `confidence` | number | OCR confidence (0-1) |

## Export Formats

### JSON
Complete structured data with all fields preserved.

### CSV
Tabular format with headers:
- Text
- X, Y, Width, Height
- Background Color
- RGB values
- Confidence percentage

### Excel
Same as CSV format, compatible with Microsoft Excel.

## Technology Stack

### Frontend
- **React** 18.2.0 - UI framework
- **Axios** - HTTP client
- **CSS3** - Styling with gradients and animations

### Backend
- **Express.js** - Web framework
- **Multer** - File upload handling
- **Tesseract.js** - OCR engine
- **Sharp** - Image processing
- **CORS** - Cross-origin requests

## Features Explained

### 1. Image Upload
- Drag-and-drop or click to upload
- Supports PNG, JPG, GIF, WEBP
- Maximum 10MB file size

### 2. OCR Processing
- Uses Tesseract.js for text recognition
- Extracts text and bounding box coordinates
- Provides confidence scores

### 3. Color Extraction
- Analyzes pixels within each text region
- Calculates dominant/average color
- Provides both RGB and HEX formats

### 4. Visual Preview
- Displays image with detected boxes
- Shows extracted text as labels
- Color-coded bounding boxes

### 5. Results Display
- Expandable list of extracted items
- Copy-to-clipboard for each field
- Statistics (total items, average confidence)

### 6. Export Options
- JSON for programmatic use
- CSV for spreadsheet analysis
- Excel for business reporting

## Performance Considerations

- **Optimization Tips:**
  - Image size affects processing time
  - Larger images take longer for OCR
  - Color extraction is fast with image processing

- **Tested with:**
  - Images up to 10MB
  - Typical processing time: 2-5 seconds

## Troubleshooting

### Backend issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Port already in use
```bash
# Change port in server/index.js or use:
PORT=3001 npm run server
```

### CORS errors
Check that both frontend and backend are running on correct ports (3000 and 5000).

## Future Enhancements

- [ ] Multiple language support (OCR)
- [ ] Batch processing
- [ ] Custom color palette extraction
- [ ] Image preprocessing options
- [ ] Cloud storage integration
- [ ] Database for results history
- [ ] Advanced image filtering
- [ ] Real-time preview optimization

## License

MIT

## Author

Screenshot Color Picker v1.0.0

## Support

For issues or questions, please check:
1. That all dependencies are installed
2. That Node.js version is 14+
3. That ports 3000 and 5000 are available
4. Browser console for client-side errors
