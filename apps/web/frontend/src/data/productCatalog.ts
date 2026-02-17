/**
 * Shared product catalog used by Home (Trending, Personalization) and All Products page.
 * Single source of truth so every product on the site appears on the All Products page.
 */
import type { Product } from '../components/products/ProductCard';

export const ALL_PRODUCTS: Product[] = [
  // 1–12: original all-products list
  { id: '1', name: 'Wireless Headphones Pro Max', price: 299.99, originalPrice: 399.99, rating: 4.8, reviews: 1234, image: '🎧', category: 'Electronics', stock: 100, badge: 'Best Seller', brand: 'Apple', deliveryDays: 1, isAiRecommended: true, isTrending: true },
  { id: '2', name: 'Smart Watch Ultra', price: 599.99, rating: 4.9, reviews: 892, image: '⌚', category: 'Electronics', stock: 50, badge: 'New Arrival', brand: 'Apple', deliveryDays: 1, isNew: true },
  { id: '3', name: 'Designer Backpack Premium', price: 129.99, originalPrice: 179.99, rating: 4.7, reviews: 2103, image: '🎒', category: 'Accessories', stock: 8, brand: 'Nike', deliveryDays: 2, isTrending: true },
  { id: '4', name: 'Premium Bluetooth Speaker', price: 449.99, rating: 4.6, reviews: 567, image: '🔊', category: 'Electronics', stock: 75, brand: 'Sony', deliveryDays: 2, isAiRecommended: true },
  { id: '5', name: 'Laptop Pro 15" MacBook Style', price: 1299.99, rating: 4.9, reviews: 745, image: '💻', category: 'Electronics', stock: 30, badge: "Editor's Choice", brand: 'Apple', deliveryDays: 2 },
  { id: '6', name: 'Fitness Tracker Band', price: 89.99, originalPrice: 129.99, rating: 4.5, reviews: 1891, image: '📊', category: 'Fitness', stock: 200, brand: 'Nike', deliveryDays: 2 },
  { id: '7', name: 'Wireless Gaming Mouse RGB', price: 79.99, rating: 4.7, reviews: 3210, image: '🖱️', category: 'Electronics', stock: 150, brand: 'Dell', deliveryDays: 1, isTrending: true },
  { id: '8', name: 'Premium Phone Case Leather', price: 34.99, rating: 4.6, reviews: 5432, image: '📱', category: 'Accessories', stock: 300, brand: 'Samsung', deliveryDays: 2 },
  { id: '9', name: 'Wireless Keyboard Mechanical', price: 149.99, rating: 4.8, reviews: 987, image: '⌨️', category: 'Electronics', stock: 60, brand: 'HP', deliveryDays: 2, isAiRecommended: true },
  { id: '10', name: 'Smart Home Camera 4K', price: 199.99, originalPrice: 249.99, rating: 4.7, reviews: 654, image: '📷', category: 'Electronics', stock: 45, badge: 'Hot Deal', brand: 'Canon', deliveryDays: 3 },
  { id: '11', name: 'Running Shoes Pro Elite', price: 159.99, rating: 4.9, reviews: 2345, image: '👟', category: 'Clothing', stock: 120, brand: 'Adidas', deliveryDays: 2, isNew: true },
  { id: '12', name: 'Sunglasses Polarized UV400', price: 89.99, rating: 4.5, reviews: 876, image: '🕶️', category: 'Accessories', stock: 95, brand: 'Sony', deliveryDays: 3 },
  // 13–20: products shown on home (personalization / dynamic sections) so they appear on All Products too
  { id: '13', name: 'Nimbus Run Pro Shoes', price: 118.99, rating: 4.8, reviews: 620, image: '👟', category: 'Clothing', stock: 12, badge: 'Trending near you', brand: 'Nike', deliveryDays: 2, isTrending: true },
  { id: '14', name: 'AeroFit Windbreaker', price: 89.5, rating: 4.7, reviews: 445, image: '🧥', category: 'Clothing', stock: 55, badge: 'New arrival', brand: 'Adidas', deliveryDays: 2, isNew: true },
  { id: '15', name: 'Skyline Messenger Bag', price: 159.99, rating: 4.9, reviews: 890, image: '👜', category: 'Accessories', stock: 0, badge: 'Staff pick', brand: 'Sony', deliveryDays: 3 },
  { id: '16', name: 'Lumen Smart Lamp', price: 134.0, rating: 4.6, reviews: 320, image: '💡', category: 'Electronics', stock: 40, badge: 'Seasonal drop', brand: 'Dell', deliveryDays: 2 },
  { id: '17', name: 'Pro Noise-Canceling Earbuds', price: 249.99, rating: 4.8, reviews: 1100, image: '🎧', category: 'Electronics', stock: 0, badge: 'Best seller', brand: 'Apple', deliveryDays: 1 },
  { id: '18', name: 'Minimalist Leather Wallet', price: 64.99, rating: 4.5, reviews: 780, image: '👛', category: 'Accessories', stock: 0, brand: 'Samsung', deliveryDays: 3 },
  { id: '19', name: 'CloudComfort Memory Foam Pillow', price: 49.99, rating: 4.7, reviews: 2100, image: '🛏️', category: 'Accessories', stock: 200, badge: 'Best seller', brand: 'Nike', deliveryDays: 2, isTrending: true },
  { id: '20', name: 'AquaStride Water Bottle 1L', price: 29.99, rating: 4.6, reviews: 450, image: '🥤', category: 'Accessories', stock: 500, badge: 'Eco-friendly', brand: 'Adidas', deliveryDays: 2 },
];
