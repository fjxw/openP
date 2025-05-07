import api from './api';
import { Order, OrderStatus } from '../types';

interface CreateOrderRequest {
  address: string;
  phone: string;
}

export const orderService = {
  createOrder: async (orderData: CreateOrderRequest) => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const response = await api.patch<Order>(`/orders/${id}`, { status });
    return response.data;
  },
  
  // Admin only
  getAllOrders: async () => {
    const response = await api.get<Order[]>('/admin/orders');
    return response.data;
  }
};
