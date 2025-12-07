import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, Grid, List, Star } from 'lucide-react';
import { Card, CardBody, Badge, Button, Input } from '../components/ui';

export const NewProducts = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample products (will be replaced with real data from API)
  const products = [
    { id: 1, name: 'Smartphone Pro Max', price: 999.99, rating: 4.5, category: 'electronics', stock: 50, image: '📱' },
    { id: 2, name: 'Wireless Headphones', price: 299.99, rating: 4.8, category: 'electronics', stock: 100, image: '🎧' },
    { id: 3, name: 'Designer Watch', price: 599.99, rating: 4.7, category: 'accessories', stock: 30, image: '⌚' },
    { id: 4, name: 'Laptop Ultra Slim', price: 1299.99, rating: 4.6, category: 'electronics', stock: 25, image: '💻' },
    { id: 5, name: 'Running Shoes', price: 129.99, rating: 4.4, category: 'clothing', stock: 200, image: '👟' },
    { id: 6, name: 'Backpack Pro', price: 89.99, rating: 4.9, category: 'accessories', stock: 150, image: '🎒' },
    { id: 7, name: 'Smart Speaker', price: 199.99, rating: 4.3, category: 'electronics', stock: 75, image: '🔊' },
    { id: 8, name: 'Sunglasses', price: 149.99, rating: 4.6, category: 'accessories', stock: 120, image: '🕶️' },
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'electronics', name: 'Electronics', count: products.filter(p => p.category === 'electronics').length },
    { id: 'clothing', name: 'Clothing', count: products.filter(p => p.category === 'clothing').length },
    { id: 'accessories', name: 'Accessories', count: products.filter(p => p.category === 'accessories').length },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            All Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover {filteredProducts.length} amazing products
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardBody>
                <div className="flex items-center space-x-2 mb-4">
                  <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white">
                    Filters
                  </h3>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Category
                  </h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({category.count})
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">$0</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${priceRange[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Minimum Rating
                  </h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <button
                        key={rating}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{rating} & up</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button variant="ghost" size="sm" fullWidth className="mt-6">
                  Clear All Filters
                </Button>
              </CardBody>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
              </p>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Best Rating</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card hover className="group cursor-pointer h-full">
                    <CardBody className={viewMode === 'grid' ? 'p-0' : 'p-0 flex flex-row'}>
                      {/* Product Image */}
                      <div className={
                        viewMode === 'grid'
                          ? 'aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-xl flex items-center justify-center relative'
                          : 'w-40 aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-l-xl flex items-center justify-center relative flex-shrink-0'
                      }>
                        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                          {product.image}
                        </span>
                        {product.stock < 50 && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="warning" size="sm">
                              Low Stock
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex-1">
                        <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center space-x-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                            ({product.rating})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${product.price}
                          </span>
                          <Badge variant={product.stock > 50 ? 'success' : 'warning'} size="sm">
                            {product.stock > 50 ? 'In Stock' : `Only ${product.stock} left`}
                          </Badge>
                        </div>

                        {viewMode === 'list' && (
                          <div className="mt-4">
                            <Button variant="primary" size="sm" fullWidth>
                              Add to Cart
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="secondary" size="lg">
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProducts;

