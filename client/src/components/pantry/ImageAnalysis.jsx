import React, { useState } from 'react';
import { FiUpload, FiImage, FiLoader, FiX, FiAlertCircle, FiCamera } from 'react-icons/fi';
import { analyzeFoodImage } from '../../utils/geminiAPI';

const ImageAnalysis = ({ onAnalysisComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const fileInputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please upload an image file');
      return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!preview) return;

    setIsLoading(true);
    setError('');
    
    // Show a loading message with a hint about the processing
    setError('Analyzing image... This may take a moment.');

    try {
      // Convert base64 to blob for API
      const base64Data = preview.split(',')[1];
      const response = await analyzeFoodImage(base64Data);
      
      if (response && response.items && response.items.length > 0) {
        // Only keep the item names and units, let user add quantities later
        const processedItems = response.items.map(item => ({
          name: item.name,
          unit: item.unit || 'pcs',
          quantity: '' // Empty quantity for user to fill in
        }));
        
        onAnalysisComplete(processedItems);
        setPreview('');
        setError(''); // Clear any previous messages
      } else {
        setError('Could not identify any food items in the image.');
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please try again.');
      setPreview(''); // Clear preview on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center mb-3">
        <FiCamera className="w-5 h-5 mr-2 text-blue-500" />
        <h3 className="text-lg font-medium">Add Items by Photo</h3>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        aria-label="Upload food image"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto mb-4 rounded-lg shadow-sm"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview('');
                setError('');
              }}
              className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-gray-800/90 text-red-500 rounded-full shadow hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              aria-label="Remove image"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            <div className="mx-auto w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiUpload className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Drag & drop a photo
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                or click to browse (JPG, PNG, WEBP)
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md flex items-start">
          <FiAlertCircle className="flex-shrink-0 mt-0.5 mr-2 w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageAnalysis;
