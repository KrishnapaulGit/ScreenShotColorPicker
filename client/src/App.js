import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';
import ImagePreview from './components/ImagePreview';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const canvasRef = useRef(null);

  const handleImageUpload = async (file) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Read image file
      const reader = new FileReader();
      reader.onload = async (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Process image
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError('Failed to process image');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error processing image');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.post('/api/export', 
        { data: results, format },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `results.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Export failed: ' + err.message);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📸 Screenshot Color Picker</h1>
        <p>Extract text, colors, and bounding boxes from images</p>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="upload-section">
            <ImageUploader onImageUpload={handleImageUpload} loading={loading} />
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading">Processing image... This may take a moment.</div>}
          </div>

          <div className="content-section">
            {selectedImage && (
              <div className="preview-column">
                <h3>Image Preview</h3>
                <ImagePreview 
                  imageSrc={selectedImage}
                  results={results}
                  canvasRef={canvasRef}
                />
              </div>
            )}

            {results && results.length > 0 && (
              <div className="results-column">
                <h3>Extracted Data ({results.length} items)</h3>
                <div className="export-buttons">
                  <button onClick={() => handleExport('json')} className="export-btn json-btn">
                    📄 Export JSON
                  </button>
                  <button onClick={() => handleExport('csv')} className="export-btn csv-btn">
                    📊 Export CSV
                  </button>
                  <button onClick={() => handleExport('excel')} className="export-btn excel-btn">
                    📈 Export Excel
                  </button>
                </div>
                <ResultsDisplay results={results} />
              </div>
            )}

            {selectedImage && !results && !loading && (
              <div className="empty-state">
                <p>Upload an image to see extraction results</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Screenshot Color Picker v1.0.0 • Powered by Tesseract OCR</p>
      </footer>
    </div>
  );
}

export default App;
