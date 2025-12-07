import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Sparkles,
  Scan,
} from 'lucide-react';
import { Button, Card, CardBody, Badge } from '../components/ui';
import { useCartStore } from '../store/cartStore';
import { useCommunityStore } from '../store/communityStore';
import { ReviewSummaryCard } from '../components/community/ReviewSummaryCard';
import { ReviewList } from '../components/community/ReviewList';
import { QuestionAnswerSection } from '../components/community/QuestionAnswerSection';
import { UGCGallery } from '../components/community/UGCGallery';
import usePersonalizationStore from '../store/personalizationStore';
import ARTryOnModal from '../components/ar/ARTryOnModal';

export const NewProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const {
    fetchForProduct,
    reviews,
    reviewSummary,
    questions,
    gallery,
    isLoading,
    error,
  } = useCommunityStore((state) => ({
    fetchForProduct: state.fetchForProduct,
    reviews: state.reviews,
    reviewSummary: state.reviewSummary,
    questions: state.questions,
    gallery: state.gallery,
    isLoading: state.isLoading,
    error: state.error,
  }));
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isArModalOpen, setArModalOpen] = useState(false);

  // Sample product data (will be fetched from API)
  const product = {
    id: 1,
    name: 'Wireless Headphones Pro Max',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 1234,
    stock: 100,
    category: 'Electronics',
    description: 'Experience premium sound quality with our flagship wireless headphones. Featuring active noise cancellation, 40-hour battery life, and exceptional comfort for all-day wear.',
    features: [
      'Active Noise Cancellation (ANC)',
      '40-hour battery life',
      'Premium sound quality',
      'Comfortable over-ear design',
      'Bluetooth 5.3 connectivity',
      'Quick charge support (5min = 2hrs)',
    ],
    images: ['🎧', '🎵', '🎼', '🎤'],
    specs: {
      'Brand': 'Easy11',
      'Model': 'HP-Pro-Max',
      'Weight': '250g',
      'Battery': '40 hours',
      'Connectivity': 'Bluetooth 5.3',
      'Warranty': '2 years',
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
    });
    // Show success toast or navigate to cart
  };

  const productKey = useMemo(() => (id ? id : product.id.toString()), [id, product.id]);
  const sessionId = useMemo(() => {
    const existing = sessionStorage.getItem('easy11-session-id');
    if (existing) return existing;
    const generated = `sess_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('easy11-session-id', generated);
    return generated;
  }, []);

  const {
    pdpSection,
    fetchPDPSection,
    isLoading: personalizationLoading,
    error: personalizationError,
  } = usePersonalizationStore((state) => ({
    pdpSection: state.pdpSection,
    fetchPDPSection: state.fetchPDPSection,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const arCategory = useMemo(() => {
    const lowerCategory = product.category.toLowerCase();
    if (lowerCategory.includes('shoe')) return 'footwear';
    if (lowerCategory.includes('bag')) return 'bags';
    if (lowerCategory.includes('glass')) return 'eyewear';
    if (lowerCategory.includes('hat')) return 'hats';
    return 'home';
  }, [product.category]);

  useEffect(() => {
    fetchForProduct(productKey);
  }, [fetchForProduct, productKey]);

  useEffect(() => {
    fetchPDPSection(productKey, {
      userId: 'guest',
      sessionId,
      device: window.innerWidth < 768 ? 'mobile' : 'desktop',
      category: product.category.toLowerCase(),
      priceBand: product.price > 200 ? 'premium' : 'mid',
    });
  }, [fetchPDPSection, product.category, product.price, productKey, sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8 text-gray-600 dark:text-gray-400">
          <button onClick={() => navigate('/')} className="hover:text-blue-500">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-blue-500">Products</button>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Side - Images */}
          <div>
            {/* Main Image */}
            <Card className="mb-4">
              <CardBody className="p-0">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                  <span className="text-9xl">{product.images[selectedImage]}</span>
                </div>
              </CardBody>
            </Card>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                    selectedImage === index
                      ? 'ring-4 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-4xl">{image}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div>
            {/* Title & Rating */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h1>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Add to favorites"
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {product.rating}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  ({product.reviews} reviews)
                </span>
              </div>

              <Badge variant="info" size="sm">
                {product.category}
              </Badge>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                  ${product.price}
                </span>
                <span className="text-2xl text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
                <Badge variant="success">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-3">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 focus:outline-none bg-transparent"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Stock Available
                  </p>
                  <Badge variant={product.stock > 50 ? 'success' : 'warning'}>
                    {product.stock} units available
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="success"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  className="group"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    handleAddToCart();
                    navigate('/checkout');
                  }}
                >
                  Buy Now
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="group"
                  onClick={() => setArModalOpen(true)}
                >
                  <Scan className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Try in AR
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Truck className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Free Shipping</p>
              </div>
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Shield className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">2 Year Warranty</p>
              </div>
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <RotateCcw className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">30-Day Returns</p>
              </div>
            </div>

            {/* Share */}
            <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share this product</span>
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <Card>
            <CardBody>
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex space-x-8">
                  <button className="pb-4 font-semibold text-blue-500 border-b-2 border-blue-500">
                    Specifications
                  </button>
                  <button className="pb-4 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                    Reviews ({product.reviews})
                  </button>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-600 dark:text-gray-400">{key}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Community Intelligence */}
        <div className="mb-12 space-y-10" id="reviews">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Community intelligence
            </h2>
            {error && (
              <span className="text-xs text-amber-500">
                {error}
              </span>
            )}
          </div>
          {reviewSummary && <ReviewSummaryCard summary={reviewSummary} />}

          <section className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                  What shoppers are saying
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Browse verified reviews, filter by rating, and see photos shared by the community.
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Write a review
              </Button>
            </div>
            {isLoading && !reviews.length ? (
              <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Loading fresh reviews…
              </p>
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </section>

          <QuestionAnswerSection questions={questions} />
        </div>

        <div className="mb-12">
          <UGCGallery looks={gallery} title="Customer gallery" ctaLabel="View community hub" ctaHref="/community" />
        </div>

        {/* AI bundle recommendation */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Complete the experience
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Frequently paired items and smart bundles powered by our session-aware recommender.
              </p>
            </div>
            <Badge variant="info" className="gap-1">
              <Sparkles className="w-4 h-4" />
              AI curated
            </Badge>
          </div>

          {personalizationError && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
              {personalizationError}
            </div>
          )}

          {personalizationLoading && !pdpSection && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`pdp-skeleton-${index}`}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 h-48 animate-pulse bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          )}

          {pdpSection && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {pdpSection.items.map((item) => (
                <Card
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  <CardBody className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="success" size="sm">
                        {(item.score * 100).toFixed(0)}% match
                      </Badge>
                      {item.reason && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 text-right">
                          {item.reason}
                        </span>
                      )}
                    </div>
                    <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-5xl">
                      {item.image ?? '🛍️'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold">
                        {new Intl.NumberFormat(undefined, {
                          style: 'currency',
                          currency: item.currency,
                        }).format(item.price)}
                      </p>
                    </div>
                    <Button variant="ghost" className="gap-2" onClick={() => navigate(item.url)}>
                      View item
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">
            You May Also Like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Link key={i} to={`/products/${i}`}>
                <Card hover className="group cursor-pointer">
                  <CardBody className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-xl flex items-center justify-center">
                      <span className="text-7xl group-hover:scale-110 transition-transform">🎁</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Related Product {i}
                      </h3>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ${(Math.random() * 500 + 100).toFixed(2)}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <ARTryOnModal
        isOpen={isArModalOpen}
        onClose={() => setArModalOpen(false)}
        productName={product.name}
        category={arCategory}
      />
    </div>
  );
};

export default NewProductDetail;

