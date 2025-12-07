import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card group hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </Link>

      <Link to={`/products/${product.id}`}>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-600">
          {product.name}
        </h3>
      </Link>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-primary-600">
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={handleAddToCart}
          className="btn-primary flex items-center space-x-2"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{product.stock > 0 ? 'Add' : 'Out of Stock'}</span>
        </button>
      </div>

      {product.stock < 10 && product.stock > 0 && (
        <p className="text-sm text-orange-600 mt-2">
          Only {product.stock} left in stock!
        </p>
      )}
    </div>
  );
}

