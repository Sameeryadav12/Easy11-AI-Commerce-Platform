export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'ANALYST';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface RecommendationMetadata {
  title: string;
  subtitle?: string;
  price: number;
  currency: string;
  image?: string;
  category?: string;
  tags?: string[];
  badges?: string[];
  product_url?: string;
}

export interface Recommendation {
  productId: string;
  score: number;
  reason?: string;
  explanation?: string;
  metadata: RecommendationMetadata;
}

export interface RecommendationResponse {
  userId: string;
  algo: string;
  modelVersion: string;
  generatedAt: string;
  metrics: Record<string, number | string | Record<string, string>>;
  recommendations: Recommendation[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

