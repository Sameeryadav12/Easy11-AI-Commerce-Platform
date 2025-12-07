import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Search, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Modal } from '../ui';

interface VisualSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisualSearch({ isOpen, onClose }: VisualSearchProps) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSearch = () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsSearching(true);

    // Simulate visual search processing
    setTimeout(() => {
      setIsSearching(false);
      onClose();
      
      // Navigate to results with visual search flag
      navigate('/products?visual_search=true');
      
      toast.success('Found similar products!', {
        icon: '🔍',
        duration: 2000,
      });
      
      // Clear selected image
      setSelectedImage(null);
    }, 1500);
  };

  const handleCameraCapture = () => {
    // Trigger camera on mobile
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Visual Search
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a photo to find similar products using AI
          </p>
        </div>

        {/* Upload Area */}
        {!selectedImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 transition-all ${
              isDragging
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                or
              </p>

              {/* Upload Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </Button>
                <Button variant="secondary" onClick={handleCameraCapture}>
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo
                </Button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Supported: JPG, PNG, WebP (max 5MB)
              </p>
            </div>
          </div>
        ) : (
          /* Image Preview */
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={selectedImage}
                alt="Search image"
                className="w-full h-64 object-contain"
              />
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    AI Visual Search
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Our AI will analyze this image to find visually similar products based on:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                    <li>• Color & style matching</li>
                    <li>• Shape & pattern detection</li>
                    <li>• Product category identification</li>
                    <li>• Brand & material recognition</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Find Similar Products
                </>
              )}
            </Button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </Modal>
  );
}

