import api from './api';
import { User, UserRole } from '../types';

export const userService = {
  // Admin only
  getAllUsers: async () => {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  },
  
  // Admin only
  getUserById: async (id: string) => {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  },
  
  // Admin only
  createUser: async (userData: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    const response = await api.post<User>('/admin/users', userData);
    return response.data;
  },
  
  // Admin only
  updateUserRole: async (id: string, role: UserRole) => {
    const response = await api.patch<User>(`/admin/users/${id}`, { role });
    return response.data;
  },
  
  // Admin only
  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }
};
