import React, { useState } from 'react';
import { FiUpload, FiImage, FiLoader } from 'react-icons/fi';
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
      <h3 className="text-lg font-medium mb-3">Add Items by Photo</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto mb-4 rounded"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview('');
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="text-center">
            <FiImage className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Supported formats: JPG, PNG, WEBP
            </p>
          </div>
        )}
      </div>

      {preview && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md flex items-center ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" />
                Analyze Image
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
};

export default ImageAnalysis;
