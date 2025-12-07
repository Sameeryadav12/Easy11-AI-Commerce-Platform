import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui';
import ProductGallery from '../components/product-detail/ProductGallery';
import ProductInfo from '../components/product-detail/ProductInfo';
import TrustBadges from '../components/product-detail/TrustBadges';
import ProductTabs from '../components/product-detail/ProductTabs';
import SimilarProducts from '../components/product-detail/SimilarProducts';

/**
 * Product Detail Page (PDP)
 * 
 * Complete product detail page with:
 * - Image gallery with zoom
 * - Product information and pricing
 * - Trust badges
 * - Tabbed details (Overview, Specs, Reviews, Q&A)
 * - AI-powered similar products
 * - Complete the look suggestions
 * 
 * Features AI personalization and professional UX.
 */
export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample product data (will be fetched from API)
  const product = {
    id: id || '1',
    name: 'Wireless Headphones Pro Max',
    tagline: 'Premium sound with active noise cancellation',
    category: 'Electronics',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 1234,
    stock: 100,
    images: ['🎧', '🎵', '🎼', '🎤', '🎸'],
    description:
      'Experience premium sound quality with our flagship wireless headphones. Featuring active noise cancellation, 40-hour battery life, and exceptional comfort for all-day wear. Designed for audiophiles and professionals who demand the best.',
    features: [
      'Active Noise Cancellation (ANC) with adaptive technology',
      '40-hour battery life on a single charge',
      'Premium Hi-Res audio quality with custom drivers',
      'Ultra-comfortable over-ear design with memory foam',
      'Bluetooth 5.3 for stable connectivity',
      'Quick charge: 5 minutes = 2 hours playback',
      'Multi-device pairing (connect 2 devices simultaneously)',
      'Foldable design with premium carrying case',
    ],
    specifications: {
      Brand: 'Easy11',
      Model: 'HP-Pro-Max-2024',
      Weight: '250g',
      'Battery Life': '40 hours',
      Connectivity: 'Bluetooth 5.3',
      'Driver Size': '45mm',
      'Frequency Response': '20Hz - 40kHz',
      Impedance: '32Ω',
      'Charging Time': '2 hours',
      'Charging Port': 'USB-C',
      Warranty: '2 years',
      'In the Box': 'Headphones, USB-C cable, Carrying case, Audio cable',
    },
    reviews: [
      {
        id: 1,
        author: 'Sarah Johnson',
        rating: 5,
        date: '2 days ago',
        comment:
          'Absolutely amazing! The sound quality is incredible and the noise cancellation really works. Best headphones I\'ve ever owned. Battery lasts forever!',
        verified: true,
        helpful: 234,
      },
      {
        id: 2,
        author: 'Michael Chen',
        rating: 5,
        date: '1 week ago',
        comment:
          'Great for work-from-home. The ANC blocks out all distractions. Comfortable for 8+ hour sessions. Worth every penny!',
        verified: true,
        helpful: 189,
      },
      {
        id: 3,
        author: 'Emily Rodriguez',
        rating: 4,
        date: '2 weeks ago',
        comment:
          'Excellent sound quality and build. Only minor complaint is they can get a bit warm after prolonged use, but overall fantastic product.',
        verified: true,
        helpful: 156,
      },
      {
        id: 4,
        author: 'David Park',
        rating: 5,
        date: '3 weeks ago',
        comment:
          'The AI assistant helped me choose these and I\'m so glad! Perfect for my music production work. Crystal clear audio.',
        verified: true,
        helpful: 98,
      },
    ],
    faq: [
      {
        question: 'How long does the battery last?',
        answer:
          'The battery lasts up to 40 hours on a single charge with ANC off, or 30 hours with ANC on. Quick charge gives you 2 hours of playback from just 5 minutes of charging.',
        helpful: 456,
      },
      {
        question: 'Are they comfortable for long wear?',
        answer:
          'Yes! The memory foam ear cushions and padded headband make them extremely comfortable for all-day wear. Many users report wearing them for 8+ hours without discomfort.',
        helpful: 321,
      },
      {
        question: 'Can I use them wired?',
        answer:
          'Absolutely! An audio cable is included in the box, so you can use them wired when the battery runs out or when you need the absolute best audio quality.',
        helpful: 287,
      },
      {
        question: 'Do they work with iPhone and Android?',
        answer:
          'Yes, they work with any Bluetooth-enabled device including iPhone, Android, tablets, laptops, and more. You can pair with 2 devices simultaneously.',
        helpful: 412,
      },
    ],
    isAiRecommended: true,
    aiRelevanceScore: 92,
  };

  // Similar products (will be fetched from ML service)
  const similarProducts = [
    { id: '2', name: 'Wireless Earbuds Pro', price: 199.99, rating: 4.7, image: '🎵', isAiPick: true },
    { id: '3', name: 'Premium Bluetooth Speaker', price: 449.99, rating: 4.6, image: '🔊' },
    { id: '4', name: 'Studio Headphones Wired', price: 349.99, rating: 4.9, image: '🎤', isAiPick: true },
    { id: '5', name: 'Noise Cancelling Earbuds', price: 279.99, rating: 4.8, image: '🎶' },
  ];

  // Complete the look (bundle suggestions)
  const bundleProducts = [
    { id: '6', name: 'Premium Headphone Stand', price: 39.99, rating: 4.5, image: '🏆', isAiPick: true },
    { id: '7', name: 'USB-C Fast Charger', price: 29.99, rating: 4.7, image: '🔌' },
    { id: '8', name: 'Headphone Cleaning Kit', price: 19.99, rating: 4.6, image: '🧼' },
    { id: '9', name: 'Travel Adapter Universal', price: 24.99, rating: 4.8, image: '🔋', isAiPick: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container-custom">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Button>
        </motion.div>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Side - Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProductGallery
              images={product.images}
              productName={product.name}
              hasVideo
            />
          </motion.div>

          {/* Right Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProductInfo product={product} />
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TrustBadges />
        </motion.div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <ProductTabs product={product} />
        </motion.div>

        {/* Similar Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <SimilarProducts
            currentProductId={product.id}
            products={similarProducts}
          />
        </motion.div>

        {/* Complete the Look */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <SimilarProducts
            currentProductId={product.id}
            products={bundleProducts}
            title="Complete the Look"
            subtitle="Accessories that pair perfectly with this product"
          />
        </motion.div>

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-8 text-center text-white overflow-hidden relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
              className="w-full h-full"
            />
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl font-heading font-bold mb-3">
              🎁 Special Offer
            </h3>
            <p className="text-xl text-teal-50 mb-6">
              Use code <span className="font-bold bg-white/20 px-3 py-1 rounded">EASY11FIRST</span> for 10% off your first order!
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="px-3 py-1 bg-white/20 rounded-full">
                Expires in: 2 days 14 hours
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

