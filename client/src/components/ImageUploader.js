import React, { useRef } from 'react';
import './ImageUploader.css';

function ImageUploader({ onImageUpload, loading }) {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    onImageUpload(file);
  };

  return (
    <div
      className="uploader-container"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        disabled={loading}
        style={{ display: 'none' }}
      />

      <div className="uploader-content">
        <div className="upload-icon">📤</div>
        <h2>Drop your image here</h2>
        <p>or click to browse</p>
        <p className="file-info">Supported: PNG, JPG, GIF, WEBP (Max 10MB)</p>
      </div>

      {loading && <div className="uploader-overlay">Processing...</div>}
    </div>
  );
}

export default ImageUploader;
