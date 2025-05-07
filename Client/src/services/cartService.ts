import api from './api';
import { CartItem } from '../types';

export const cartService = {
  getCart: async () => {
    const response = await api.get<{ items: CartItem[], totalPrice: number }>('/cart');
    return response.data;
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const response = await api.post<{ items: CartItem[], totalPrice: number }>(
      '/cart', 
      { productId, quantity }
    );
    return response.data;
  },

  updateCartItem: async (productId: string, quantity: number) => {
    const response = await api.put<{ items: CartItem[], totalPrice: number }>(
      '/cart',
      { productId, quantity }
    );
    return response.data;
  },

  removeFromCart: async (productId: string) => {
    const response = await api.delete<{ items: CartItem[], totalPrice: number }>(
      `/cart/${productId}`
    );
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete<{ items: CartItem[], totalPrice: number }>('/cart');
    return response.data;
  }
};
