import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CartState, CartItem } from '../../types';
import cartService from "../../api/cartService";

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number; quantity: number }, { dispatch, getState, rejectWithValue }) => {
    try {
      // Оптимистичное обновление перед запросом к серверу
      const state = getState() as { cart: CartState };
      const currentItems = state.cart.items || [];
      
      // Создаем копию текущих элементов
      const updatedItems: CartItem[] = [...currentItems];
      
      // Проверяем, есть ли уже этот товар в корзине
      const existingItemIndex = updatedItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Если товар уже в корзине, увеличиваем количество
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Иначе добавляем новый товар
        updatedItems.push({ productId, quantity });
      }
      
      // Сразу диспатчим локальное обновление корзины
      dispatch(optimisticUpdateCart(updatedItems));
      
      // Затем делаем реальный запрос к серверу
      const response = await cartService.addItemToCart(productId, quantity);
      return {
        items: response.items || [],
        totalPrice: response.totalPrice || 0
      };
    } catch (error: any) {
      // В случае ошибки, восстановим предыдущее состояние через запрос актуальной корзины
      try {
        const response = await cartService.getCart();
        dispatch(fetchCart.fulfilled(response, '', undefined));
      } catch (fetchError) {
        console.error("Failed to restore cart state:", fetchError);
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }: { productId: number; quantity: number }, { dispatch, getState, rejectWithValue }) => {
    try {
      // Оптимистичное обновление перед запросом к серверу
      const state = getState() as { cart: CartState };
      const currentItems = state.cart.items || [];
      
      // Создаем копию текущих элементов
      const updatedItems: CartItem[] = [...currentItems];
      
      // Находим индекс товара в корзине
      const existingItemIndex = updatedItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Обновляем количество
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: quantity
        };
        
        // Сразу диспатчим локальное обновление корзины
        dispatch(optimisticUpdateCart(updatedItems));
      }
      
      // Затем делаем реальный запрос к серверу
      const response = await cartService.updateItemQuantity(productId, quantity);
      return {
        items: response.items || [],
        totalPrice: response.totalPrice || 0
      };
    } catch (error: any) {
      // В случае ошибки, восстановим предыдущее состояние через запрос актуальной корзины
      try {
        const response = await cartService.getCart();
        dispatch(fetchCart.fulfilled(response, '', undefined));
      } catch (fetchError) {
        console.error("Failed to restore cart state:", fetchError);
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: number, { rejectWithValue }) => {
    try {
      return await cartService.removeItemFromCart(productId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.clearCart();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    optimisticUpdateCart: (state, action) => {
      // Локально обновляем состояние корзины без ожидания ответа сервера
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.totalPrice = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, optimisticUpdateCart } = cartSlice.actions;
export default cartSlice.reducer;
