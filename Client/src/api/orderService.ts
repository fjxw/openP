import axios from 'axios';
import { API_URL } from '../config.ts';

const orderService = {
  getOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/order`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении заказов';
    }
  },

  getAllOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/order/all`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении заказов';
    }
  },

  getOrderById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/api/order/${id}`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Заказ не найден';
    }
  },

  createOrder: async (orderData: { 
    address: string, 
    phone: string, 
    items: Array<{ productId: number, quantity: number }> 
  }) => {
    try {
      const response = await axios.post(`${API_URL}/api/order`, orderData, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при создании заказа';
    }
  },

  createOrderFromCart: async (orderData: { 
    address: string, 
    phone: string 
  }) => {
    try {
      const response = await axios.post(`${API_URL}/api/order/from-cart`, orderData, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при создании заказа из корзины';
    }
  },

  updateOrder: async (id: number, orderData: { 
    Address?: string, 
    PhoneNumber?: string, 
    Status?: string 
  }) => {
    try {
      const response = await axios.patch(`${API_URL}/api/order/${id}`, orderData, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при обновлении заказа';
    }
  },

  deleteOrder: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/api/order/${id}`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при удалении заказа';
    }
  }
};

export default orderService;
