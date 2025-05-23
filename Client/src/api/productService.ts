import axios from 'axios';
import { API_URL } from '../config.ts';

const imageCache: Record<number, string> = {};

const productService = {
  getProducts: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`${API_URL}/api/product`, { 
        params: { pageNumber, pageSize } 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении товаров';
    }
  },

  getProductById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/api/product/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Товар не найден';
    }
  },

  getProductsByCategory: async (category: string, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`${API_URL}/api/product/category/${category}`, {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении товаров по категории';
    }
  },

  getProductsByPriceRange: async (minPrice: number, maxPrice: number, category?: string, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`${API_URL}/api/product/price`, {
        params: { minPrice, maxPrice, category, pageNumber, pageSize }
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении товаров по цене';
    }
  },

  searchProducts: async (name: string, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`${API_URL}/api/product/search`, {
        params: { name, pageNumber, pageSize }
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при поиске товаров';
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/product/categories`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении категорий';
    }
  },

  createProduct: async (productData: any) => {
    try {
      const response = await axios.post(`${API_URL}/api/product`, productData, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при создании товара';
    }
  },

  updateProduct: async (id: number, productData: any) => {
    try {
      const response = await axios.patch(`${API_URL}/api/product/${id}`, productData, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при обновлении товара';
    }
  },

  deleteProduct: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/api/product/${id}`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при удалении товара';
    }
  },

  uploadProductImage: async (id: number, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      console.log(`Загрузка файла ${id}`, imageFile);
      const response = await axios.post(`${API_URL}/api/product/${id}/image`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Ответ сервера:', response.data);
      delete imageCache[id]; 
      return response.data;
    } catch (error: any) {
      console.error('Ошибка:', error);
      throw error.response?.data?.message || 'Ошибка при загрузке изображения';
    }
  },
  
  getProductImage: (id: number) => {
    if (!imageCache[id]) {
      const timestamp = new Date().getTime();
      imageCache[id] = `${API_URL}/api/product/${id}/image?t=${timestamp}`;
    }
    return imageCache[id];
  }
};

export default productService;
