import axios from 'axios';
import { API_URL } from '../config.ts';

const authService = {
  register: async (email: string, username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        username,
        password
      }, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при регистрации';
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      }, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при входе';
    }
  },

  logout: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/logout`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при выходе';
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }
};

export default authService;
