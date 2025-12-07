import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Star, ArrowRight } from 'lucide-react';
import { Card, CardBody, Badge, Button } from '../ui';

interface SimilarProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  isAiPick?: boolean;
}

interface SimilarProductsProps {
  currentProductId: string;
  products: SimilarProduct[];
  title?: string;
  subtitle?: string;
}

/**
 * Similar Products Component
 * 
 * AI-powered product recommendations carousel.
 * Shows products similar to current one or complementary items.
 */
export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  currentProductId,
  products,
  title = 'Similar Items You May Like',
  subtitle = 'Curated by our AI based on your preferences',
}) => {
  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          </div>
          <Link to="/products">
            <Button variant="ghost">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/products/${product.id}`}>
              <Card hover className="group cursor-pointer h-full">
                <CardBody className="p-0">
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-xl flex items-center justify-center overflow-hidden">
                    <motion.span
                      className="text-8xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {product.image}
                    </motion.span>
                    {product.isAiPick && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="info" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                          AI Pick
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${product.price}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SimilarProducts;

