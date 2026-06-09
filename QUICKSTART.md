# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ installed
- npm 6+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Start the Application

#### Option 1: Run Both Frontend and Backend (Recommended)
```bash
cd ScreenshotColorPicker
npm run dev
```

This will automatically start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd ScreenshotColorPicker/server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd ScreenshotColorPicker/client
npm start
```

#### Option 3: Production Build
```bash
cd ScreenshotColorPicker
npm run build
```

## 📖 How to Use

1. **Open the Application**
   - Navigate to http://localhost:3000 in your browser

2. **Upload an Image**
   - Drag and drop an image, or click to browse
   - Supported formats: PNG, JPG, GIF, WEBP
   - Maximum file size: 10MB

3. **Wait for Processing**
   - OCR processing typically takes 2-5 seconds
   - Progress indicator shows processing status

4. **View Results**
   - Image preview with bounding boxes and text labels
   - Expandable list of extracted items
   - Click any item to see details

5. **Copy & Export**
   - Click copy button (📋) to copy any field
   - Export as JSON, CSV, or Excel format

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run server
```

### Clear Cache & Reinstall
```bash
cd ScreenshotColorPicker
rm -rf node_modules package-lock.json
npm install
npm run install-all
```

### Check API Health
```bash
curl http://localhost:5000/api/health
```

## 📚 API Examples

### Upload Image for Processing
```bash
curl -X POST -F "image=@photo.jpg" http://localhost:5000/api/process
```

### Export Results
```bash
curl -X POST http://localhost:5000/api/export \
  -H "Content-Type: application/json" \
  -d '{"data":[...],"format":"json"}'
```

## 🎯 Features Overview

| Feature | Details |
|---------|---------|
| **Upload** | Drag-drop or click to upload images |
| **OCR** | Extract text with Tesseract.js |
| **Colors** | Detect background and dominant colors |
| **Coordinates** | Get bounding box positions |
| **Export** | JSON, CSV, Excel formats |
| **Preview** | Visual overlay with detected boxes |

## 📊 Project Structure

```
ScreenshotColorPicker/
├── server/          # Node.js + Express backend
├── client/          # React frontend
├── package.json     # Root dependencies
└── README.md        # Full documentation
```

## 💡 Tips

- **Large images** may take longer to process
- **Best results** with clear, well-lit text
- **Color accuracy** depends on image quality
- **Confidence scores** indicate OCR accuracy (0-1)

## 🆘 Support

Check [README.md](./README.md) for comprehensive documentation.

---

**Version**: 1.0.0  
**Last Updated**: June 2, 2026
