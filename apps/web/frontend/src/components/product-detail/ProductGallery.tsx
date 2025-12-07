import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  hasVideo?: boolean;
}

/**
 * Product Gallery Component
 * 
 * Image gallery with zoom, navigation, and video support.
 * Features smooth transitions and responsive design.
 */
export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  hasVideo = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <motion.span
              className="text-9xl"
              animate={{ scale: isZoomed ? 1.5 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {images[selectedIndex]}
            </motion.span>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>

        {/* Video Badge */}
        {hasVideo && selectedIndex === 0 && (
          <div className="absolute bottom-4 left-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
              <Play className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Watch Video
              </span>
            </button>
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-5 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
              selectedIndex === index
                ? 'ring-4 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600'
            }`}
          >
            <span className="text-3xl">{image}</span>
          </button>
        ))}
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
        <span>Hover to zoom</span>
        <span>•</span>
        <span>Click thumbnails to change</span>
      </div>
    </div>
  );
};

export default ProductGallery;

