import axios from 'axios';
import { API_URL } from '../config.ts';

const adminService = {
  getAllOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/order/all`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении всех заказов';
    }
  },
  
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/all`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении пользователей';
    }
  }
};

export default adminService;
