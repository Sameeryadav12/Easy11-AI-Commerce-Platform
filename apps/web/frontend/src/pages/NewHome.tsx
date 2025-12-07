import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap, Heart } from 'lucide-react';
import { Button, Card, CardBody, Badge } from '../components/ui';

export const NewHome = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-500 via-blue-600 to-blue-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span className="text-sm font-medium">AI-Powered Shopping Experience</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold mb-6 leading-tight">
                Shop Smarter.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-300">
                  Personalized by AI.
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl">
                Discover products tailored just for you with our intelligent recommendation engine. 
                Trusted by thousands of happy shoppers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  variant="success"
                  onClick={() => window.location.href = '/products'}
                  className="group"
                >
                  Start Shopping
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => window.location.href = '/products?featured=true'}
                  className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 text-white"
                >
                  View Deals
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-teal-300" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-teal-300" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-teal-300" />
                  <span>Free Returns</span>
                </div>
              </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="hidden lg:block animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-sky-400 rounded-3xl blur-3xl opacity-30 animate-pulse" />
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Placeholder for product images */}
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-white/20 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                      >
                        <span className="text-6xl">🛍️</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="currentColor"
              className="text-gray-50 dark:text-gray-900"
            />
          </svg>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explore our curated collections
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Electronics */}
            <Link to="/products?category=electronics">
              <Card hover className="group cursor-pointer h-full">
                <CardBody>
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-7xl">💻</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    Electronics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Latest gadgets and tech essentials
                  </p>
                  <div className="flex items-center text-blue-500 font-semibold group-hover:translate-x-2 transition-transform">
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </CardBody>
              </Card>
            </Link>

            {/* Clothing */}
            <Link to="/products?category=clothing">
              <Card hover className="group cursor-pointer h-full">
                <CardBody>
                  <div className="aspect-video bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-7xl">👕</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    Clothing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Trendy fashion for every occasion
                  </p>
                  <div className="flex items-center text-blue-500 font-semibold group-hover:translate-x-2 transition-transform">
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </CardBody>
              </Card>
            </Link>

            {/* Accessories */}
            <Link to="/products?category=accessories">
              <Card hover className="group cursor-pointer h-full">
                <CardBody>
                  <div className="aspect-video bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-800 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-7xl">⌚</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    Accessories
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Complete your style with perfect accents
                  </p>
                  <div className="flex items-center text-blue-500 font-semibold group-hover:translate-x-2 transition-transform">
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </CardBody>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="section bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-8 h-8 text-teal-500" />
                <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                  Trending Now
                </h2>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Popular products loved by our customers
              </p>
            </div>
            <Link to="/products?sort=trending">
              <Button variant="ghost">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sample Product Cards */}
            {[
              { name: 'Wireless Headphones', price: 299.99, rating: 4.8, badge: 'Best Seller' },
              { name: 'Smart Watch Pro', price: 599.99, rating: 4.9, badge: 'New Arrival' },
              { name: 'Designer Backpack', price: 129.99, rating: 4.7, badge: 'Trending' },
              { name: 'Premium Speaker', price: 449.99, rating: 4.6, badge: 'Hot Deal' },
            ].map((product, index) => (
              <Link key={index} to="/products/1">
                <Card hover className="group cursor-pointer h-full">
                  <CardBody className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-xl flex items-center justify-center relative overflow-hidden">
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                        📦
                      </span>
                      <div className="absolute top-3 right-3">
                        <Badge variant="success" size="sm">
                          {product.badge}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${product.price}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Why Shop with Easy11?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              We're not just another e-commerce store
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Recommendations */}
            <Card className="text-center">
              <CardBody>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                  AI-Powered Recommendations
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our smart AI learns your preferences and suggests products you'll love
                </p>
              </CardBody>
            </Card>

            {/* Secure Shopping */}
            <Card className="text-center">
              <CardBody>
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                  100% Secure Payments
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Shop with confidence using our encrypted payment system
                </p>
              </CardBody>
            </Card>

            {/* Fast Delivery */}
            <Card className="text-center">
              <CardBody>
                <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                  Lightning Fast Delivery
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get your orders delivered quickly with real-time tracking
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-500 to-teal-600 py-16">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and discover your perfect products today
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => window.location.href = '/products'}
            className="bg-white text-teal-600 hover:bg-gray-50"
          >
            Browse All Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default NewHome;

