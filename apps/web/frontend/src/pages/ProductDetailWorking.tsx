import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Zap,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Leaf,
  Award,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, Card, CardBody, Badge } from '../components/ui';
import { useCartStore } from '../store/cartStore';
import { useRecentlyViewedStore } from '../store/recentlyViewedStore';
import { useWishlistStore } from '../store/wishlistStore';

/**
 * Product Detail Page - Working Version
 * 
 * Complete product detail page with all features.
 * Built to avoid component import issues.
 */
export const ProductDetailWorking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const addToRecentlyViewed = useRecentlyViewedStore((state) => state.addProduct);
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  // Product data (mirror of listing for demo)
  const catalog = [
    { id: '1', name: 'Wireless Headphones Pro Max', tagline: 'Premium sound with active noise cancellation', category: 'Electronics', price: 299.99, originalPrice: 399.99, rating: 4.8, reviews: 1234, stock: 100, images: ['🎧', '🎵', '🎼', '🎤', '🎸'] },
    { id: '2', name: 'Smart Watch Ultra', tagline: 'Health + notifications on your wrist', category: 'Electronics', price: 599.99, rating: 4.9, reviews: 892, stock: 50, images: ['⌚', '📱', '🔋'] },
    { id: '3', name: 'Designer Backpack Premium', tagline: 'Carry with comfort and style', category: 'Accessories', price: 129.99, originalPrice: 179.99, rating: 4.7, reviews: 2103, stock: 8, images: ['🎒', '🧳'] },
    { id: '4', name: 'Premium Bluetooth Speaker', tagline: 'Room-filling sound in a compact body', category: 'Electronics', price: 449.99, rating: 4.6, reviews: 567, stock: 75, images: ['🔊', '🎶'] },
    { id: '5', name: 'Laptop Pro 15\" MacBook Style', tagline: 'Pro power for creators', category: 'Electronics', price: 1299.99, rating: 4.9, reviews: 745, stock: 30, images: ['💻', '⌨️'] },
    { id: '6', name: 'Fitness Tracker Band', tagline: 'Track steps, sleep, and more', category: 'Fitness', price: 89.99, originalPrice: 129.99, rating: 4.5, reviews: 1891, stock: 200, images: ['📊', '🏃'] },
    { id: '7', name: 'Wireless Gaming Mouse RGB', tagline: 'Ultra-low latency precision', category: 'Electronics', price: 79.99, rating: 4.7, reviews: 3210, stock: 150, images: ['🖱️', '🎮'] },
    { id: '8', name: 'Premium Phone Case Leather', tagline: 'Luxury protection for your phone', category: 'Accessories', price: 34.99, rating: 4.6, reviews: 5432, stock: 300, images: ['📱', '🧵'] },
    { id: '9', name: 'Wireless Keyboard Mechanical', tagline: 'Tactile typing experience', category: 'Electronics', price: 149.99, rating: 4.8, reviews: 987, stock: 60, images: ['⌨️', '🔧'] },
    { id: '10', name: 'Smart Home Camera 4K', tagline: 'Crystal-clear home security', category: 'Electronics', price: 199.99, originalPrice: 249.99, rating: 4.7, reviews: 654, stock: 45, images: ['📷', '🔒'] },
    { id: '11', name: 'Running Shoes Pro Elite', tagline: 'Run further with more comfort', category: 'Clothing', price: 159.99, rating: 4.9, reviews: 2345, stock: 120, images: ['👟', '🏅'] },
    { id: '12', name: 'Sunglasses Polarized UV400', tagline: 'Clarity and protection outdoors', category: 'Accessories', price: 89.99, rating: 4.5, reviews: 876, stock: 95, images: ['🕶️', '🌞'] },
    // Personalized recommendation products
    { id: '13', name: 'Nimbus Run Pro Shoes', tagline: 'Run further with more comfort', category: 'Clothing', price: 118.99, rating: 4.9, reviews: 2345, stock: 12, images: ['👟', '🏃'] },
    { id: '14', name: 'AeroFit Windbreaker', tagline: 'Lightweight wind and rain protection', category: 'Clothing', price: 89.50, rating: 4.7, reviews: 890, stock: 45, images: ['🧥', '🌬️'] },
    { id: '15', name: 'Skyline Messenger Bag', tagline: 'Carry with comfort and style', category: 'Accessories', price: 159.99, originalPrice: 189.99, rating: 4.8, reviews: 1203, stock: 0, images: ['👜', '💼'] },
    { id: '16', name: 'Lumen Smart Lamp', tagline: 'Adjustable brightness and color temperature', category: 'Electronics', price: 134.00, rating: 4.6, reviews: 567, stock: 28, images: ['💡', '🔆'] },
    // Additional products (some out of stock for wishlist)
    { id: '17', name: 'Pro Noise-Canceling Earbuds', tagline: 'Crystal-clear audio anywhere', category: 'Electronics', price: 249.99, rating: 4.8, reviews: 432, stock: 0, images: ['🎧', '🔇'] },
    { id: '18', name: 'Minimalist Leather Wallet', tagline: 'Slim design, RFID protection', category: 'Accessories', price: 64.99, rating: 4.5, reviews: 678, stock: 0, images: ['👛', '💳'] },
    { id: '19', name: 'CloudComfort Memory Foam Pillow', tagline: 'Wake up feeling refreshed', category: 'Home', price: 49.99, rating: 4.7, reviews: 2109, stock: 85, images: ['🛏️', '☁️'] },
    { id: '20', name: 'AquaStride Water Bottle 1L', tagline: 'Stay hydrated in style', category: 'Accessories', price: 29.99, rating: 4.6, reviews: 1523, stock: 200, images: ['🥤', '💧'] },
  ];

  const product =
    catalog.find((p) => p.id === (id || '')) ||
    catalog[0];

  // You May Also Like: real products from catalog (same category first, then others), so click opens correct product
  const youMayAlsoLike = (() => {
    const others = catalog.filter((p) => p.id !== product.id);
    const sameCategory = others.filter((p) => p.category === product.category);
    const rest = others.filter((p) => p.category !== product.category);
    const ordered = [...sameCategory, ...rest];
    return ordered.slice(0, 4).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      rating: p.rating ?? 4.5,
      image: p.images[0] ?? '✨',
    }));
  })();

  // Track product view
  useEffect(() => {
    addToRecentlyViewed({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
    });
  }, [product.id]);

  const hasDiscount = product.originalPrice != null && product.originalPrice > product.price;
  const savings = hasDiscount ? product.originalPrice! - product.price : 0;
  const discountPercentage = hasDiscount ? Math.round((savings / product.originalPrice!) * 100) : 0;
  const inStock = (product as { stock?: number }).stock !== undefined ? (product as { stock?: number }).stock! > 0 : true;
  const isFavorite = isInWishlist(product.id);

  const handleAddToWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      inStock,
    });
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container-custom">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Button>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card>
              <CardBody className="p-0">
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center overflow-hidden group">
                  <motion.span
                    className="text-9xl"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    {product.images[selectedImage]}
                  </motion.span>

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Counter */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-lg text-white text-sm">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                    selectedImage === index
                      ? 'ring-4 ring-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-3xl">{img}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <Badge variant="info">{product.category}</Badge>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{product.tagline}</p>
            </div>

            {/* AI Badge */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Great Match for You!
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    AI estimates <strong className="text-blue-600">92% relevance</strong> to your interests
                  </p>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
              <span className="font-semibold text-gray-900 dark:text-white ml-2">
                {product.rating}
              </span>
              <span className="text-gray-600 dark:text-gray-400">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
              <div className="flex items-baseline space-x-4 mb-3">
                <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                  ${product.price}
                </span>
                {hasDiscount && (
                  <span className="text-2xl text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              {hasDiscount && (
                <Badge variant="success" size="lg">
                  Save ${savings} ({discountPercentage}% OFF)
                </Badge>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center space-x-2">
              {inStock ? (
                <>
                  <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" />
                  <span className="text-teal-700 dark:text-teal-300 font-semibold">
                    In Stock - Ships in 1 day
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="text-amber-700 dark:text-amber-300 font-semibold">
                    Out of stock - Add to wishlist for restock alert
                  </span>
                </>
              )}
            </div>

            {/* Quantity - only when in stock */}
            {inStock && (
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden w-40">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg font-semibold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center py-3 font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min((product as { stock?: number }).stock ?? 99, quantity + 1))}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {inStock ? (
                <>
                  <Button variant="success" size="lg" fullWidth onClick={handleAddToCart}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="primary" size="lg" fullWidth onClick={handleBuyNow}>
                    <Zap className="w-5 h-5 mr-2" />
                    Buy Now - Fast Checkout
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="lg" fullWidth onClick={handleAddToWishlist} className="bg-amber-600 hover:bg-amber-500">
                  <Heart className="w-5 h-5 mr-2 fill-current" />
                  Add to Wishlist for Restock Alert
                </Button>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="ghost" onClick={handleAddToWishlist}>
                  <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
                <Button variant="ghost">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Payment Icons */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Secure payment with:</p>
              <div className="flex space-x-4">
                {['💳', '🅿️', '🍎'].map((icon, i) => (
                  <div key={i} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-2xl">
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {[
            { icon: <Truck className="w-6 h-6" />, title: 'Free 2-Day Delivery', color: 'from-blue-500 to-blue-600' },
            { icon: <Shield className="w-6 h-6" />, title: 'Secure Checkout', color: 'from-teal-500 to-teal-600' },
            { icon: <RotateCcw className="w-6 h-6" />, title: '30-Day Returns', color: 'from-sky-500 to-sky-600' },
            { icon: <Leaf className="w-6 h-6" />, title: 'Eco-Friendly', color: 'from-emerald-500 to-emerald-600' },
            { icon: <Award className="w-6 h-6" />, title: '2-Year Warranty', color: 'from-purple-500 to-purple-600' },
            { icon: <Star className="w-6 h-6" />, title: '4.8/5 Rating', color: 'from-amber-500 to-amber-600' },
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3`}>
                {badge.icon}
              </div>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{badge.title}</h4>
            </motion.div>
          ))}
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-12">
          <CardBody>
            {/* Tab Headers */}
            <div className="border-b-2 border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex space-x-8">
                {['overview', 'specs', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-semibold capitalize relative ${
                      activeTab === tab
                        ? 'text-blue-500'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-2xl font-heading font-bold mb-4">Product Description</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                  Experience premium sound quality with our flagship wireless headphones. Featuring active noise
                  cancellation, 40-hour battery life, and exceptional comfort for all-day wear.
                </p>
                <h4 className="text-xl font-heading font-bold mb-4">Key Features</h4>
                <ul className="space-y-3">
                  {[
                    'Active Noise Cancellation (ANC)',
                    '40-hour battery life',
                    'Premium sound quality',
                    'Bluetooth 5.3 connectivity',
                    'Quick charge support',
                    'Multi-device pairing',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <Check className="w-6 h-6 text-teal-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 dark:text-gray-300 text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h3 className="text-2xl font-heading font-bold mb-6">Technical Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries({
                    Brand: 'Easy11',
                    Model: 'HP-Pro-Max',
                    Weight: '250g',
                    'Battery Life': '40 hours',
                    Connectivity: 'Bluetooth 5.3',
                    'Driver Size': '45mm',
                    Warranty: '2 years',
                  }).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between py-4 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="font-medium text-gray-600 dark:text-gray-400">{key}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* AI Summary */}
                <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl">
                  <h4 className="font-heading font-bold mb-3 flex items-center">
                    <Star className="w-5 h-5 text-blue-500 mr-2" />
                    AI Review Summary
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>92%</strong> of buyers praised battery life and sound quality. Most common keywords:
                    "excellent", "comfortable", "worth it".
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="w-4 h-4 text-teal-500" />
                      <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                        1134 Positive
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[
                    {
                      author: 'Sarah Johnson',
                      rating: 5,
                      date: '2 days ago',
                      comment: 'Absolutely amazing! Best headphones I\'ve ever owned.',
                    },
                    {
                      author: 'Michael Chen',
                      rating: 5,
                      date: '1 week ago',
                      comment: 'Great sound quality, comfortable for long sessions.',
                    },
                  ].map((review, i) => (
                    <Card key={i}>
                      <CardBody>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">{review.author}</span>
                          <Badge variant="success" size="sm">Verified</Badge>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(review.rating)].map((_, j) => (
                            <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Similar Products */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              You May Also Like
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {youMayAlsoLike.map((item) => (
              <Link key={item.id} to={`/products/${item.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl">
                <Card hover className="group cursor-pointer h-full">
                  <CardBody className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-xl flex items-center justify-center">
                      <motion.span className="text-8xl" whileHover={{ scale: 1.1, rotate: 5 }}>
                        {item.image}
                      </motion.span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm ml-1">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailWorking;

