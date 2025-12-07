import api from './api';
import { Product } from '../types';

interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface ProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const productsService = {
  async getAll(params?: ProductsParams): Promise<ProductsResponse> {
    const { data } = await api.get('/products', { params });
    return data;
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get(`/products/${id}`);
    return data.product;
  },

  async create(product: Partial<Product>): Promise<Product> {
    const { data } = await api.post('/products', product);
    return data.product;
  },
};

