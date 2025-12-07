import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { Button, Card, CardBody, Badge } from '../components/ui';

/**
 * Simple Product Detail Page
 * 
 * Simplified version for debugging
 */
export const ProductDetailPageSimple = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container-custom">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </Button>

        {/* Simple Product View */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <Card>
            <CardBody>
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                <span className="text-9xl">🎧</span>
              </div>
            </CardBody>
          </Card>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="info" className="mb-2">Electronics</Badge>
              <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                Wireless Headphones Pro Max
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Premium sound with active noise cancellation
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                $299.99
              </div>
              <Badge variant="success">Save $100 (25% OFF)</Badge>
            </div>

            <div className="space-y-3">
              <Button variant="success" size="lg" fullWidth>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="primary" size="lg" fullWidth>
                Buy Now
              </Button>
              <Button variant="ghost" fullWidth>
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            <Card>
              <CardBody>
                <h3 className="font-heading font-semibold mb-3">Key Features:</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ Active Noise Cancellation</li>
                  <li>✓ 40-hour battery life</li>
                  <li>✓ Premium sound quality</li>
                  <li>✓ Bluetooth 5.3</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="text-center mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p className="text-gray-600 dark:text-gray-400">
            Product ID: {id}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This is a simplified version. Full version loading...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPageSimple;

