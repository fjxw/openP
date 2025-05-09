import axios from 'axios';
import { API_URL } from '../config.ts';

const userService = {
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении данных пользователя';
    }
  },

  getUserById: async (userId: number) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/${userId}`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении данных пользователя';
    }
  },

  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/all`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при получении списка пользователей';
    }
  },

  updateUser: async (userData: { username?: string, email?: string, password?: string }) => {
    try {
      const response = await axios.patch(`${API_URL}/api/user`, userData, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при обновлении данных пользователя';
    }
  },

  updateUserById: async (userId: number, userData: { username?: string, email?: string, password?: string, role?: string}) => {
    try {
      const response = await axios.patch(`${API_URL}/api/user/${userId}`, userData, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при обновлении данных пользователя';
    }
  },

  createUser: async (userData: { username: string, email: string, password: string, role: string }) => {
    try {
      const response = await axios.post(`${API_URL}/api/user`, userData, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при создании пользователя';
    }
  },

  deleteUser: async (userId: number) => {
    try {
      const response = await axios.delete(`${API_URL}/api/user/${userId}`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при удалении пользователя';
    }
  },

  deleteCurrentUser: async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/user`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Ошибка при удалении пользователя';
    }
  }
};

export default userService;
