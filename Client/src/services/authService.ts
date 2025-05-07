import api from './api';
import { User, UserRole } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<User>('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post<User>('/auth/register', { username, email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  getUserRole: async () => {
    const response = await api.get<{ role: UserRole }>('/auth/role');
    return response.data.role;
  },

  deleteAccount: async () => {
    const response = await api.delete('/auth/delete-account');
    return response.data;
  }
};
