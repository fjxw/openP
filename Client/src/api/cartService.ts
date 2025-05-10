import axios from 'axios';
import { API_URL } from '../config.ts';

const cartService = {
  getCart: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении корзины';
    }
  },

  getCartItems: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart/items`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении товаров корзины';
    }
  },

  addItemToCart: async (productId: number, quantity: number) => {
    try {
      await axios.post(`${API_URL}/api/cart/items`, {
        productId,
        quantity
      }, { withCredentials: true });
      
      // После успешного добавления, получаем обновленную корзину
      const response = await axios.get(`${API_URL}/api/cart`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при добавлении товара в корзину';
    }
  },

  updateItemQuantity: async (productId: number, quantity: number) => {
    try {
      // Отправляем number напрямую, а не как строку JSON
      const response = await axios.put(
        `${API_URL}/api/cart/items/${productId}`, 
        quantity, 
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      // После успешного обновления, получаем актуальную корзину
      const cartResponse = await axios.get(`${API_URL}/api/cart`, { 
        withCredentials: true 
      });
      return cartResponse.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при обновлении количества товара';
    }
  },

  removeItemFromCart: async (productId: number) => {
    try {
      const response = await axios.delete(`${API_URL}/api/cart/items/${productId}`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при удалении товара из корзины';
    }
  },

  clearCart: async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/cart/clear`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при очистке корзины';
    }
  },

  getCartTotal: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart/total`, { 
        withCredentials: true 
      });
      return response.data.total;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении суммы корзины';
    }
  }
};

export default cartService;
