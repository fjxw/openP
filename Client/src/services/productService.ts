import api from './api';
import { Product, ProductFilters } from '../types';

interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

export const productService = {
  getAllProducts: async (filters: ProductFilters) => {
    const { category, minPrice, maxPrice, search, page, limit } = filters;
    
    let queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (minPrice !== undefined) queryParams.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice.toString());
    if (search) queryParams.append('search', search);
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    const response = await api.get<ProductsResponse>(`/products?${queryParams}`);
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<string[]>('/products/categories');
    return response.data;
  },

  createProduct: async (productData: FormData) => {
    const response = await api.post<Product>('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateProduct: async (id: string, productData: FormData) => {
    const response = await api.put<Product>(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};
