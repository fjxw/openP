import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { OrderState, Order, OrderWithProductDetails, CartItemWithProduct, CartItem } from '../../types';
import orderService from '../../api/orderService';
import productService from '../../api/productService';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ address, phone, items }: { 
    address: string; 
    phone: string; 
    items: { productId: number; quantity: number; }[] 
  }, { rejectWithValue }) => {
    try {
      return await orderService.createOrder({ address, phone, items });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось создать заказ');
    }
  }
);

export const createOrderFromCart = createAsyncThunk(
  'orders/createOrderFromCart',
  async ({ address, phone }: { address: string; phone: string }, { rejectWithValue }) => {
    try {
      return await orderService.createOrderFromCart({ address, phone });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось создать заказ из корзины');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const ordersFromApi = await orderService.getOrders();
      
      // Преобразование формата данных API в формат клиента
      const orders = ordersFromApi.map((order: any) => ({
        ...order,
        items: order.orderItems || [],
        totalPrice: order.totalAmount
      })) as Order[];
      
      const ordersWithProducts = await Promise.all(orders.map(async (order: Order) => {
        const itemsWithProducts = await Promise.all(order.items.map(async (item: CartItem) => {
          try {
            const product = await productService.getProductById(item.productId);
            return { ...item, product } as CartItemWithProduct;
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error);
            return item;
          }
        }));
        
        return { ...order, items: itemsWithProducts } as OrderWithProductDetails;
      }));
      
      return ordersWithProducts;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось получить заказы');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: number, { rejectWithValue }) => {
    try {
      const orderFromApi = await orderService.getOrderById(id);
      
      // Преобразование формата данных API в формат клиента
      const order = {
        ...orderFromApi,
        items: orderFromApi.orderItems || [],
        totalPrice: orderFromApi.totalAmount
      } as Order;
      
      const itemsWithProducts = await Promise.all(order.items.map(async (item: CartItem) => {
        try {
          const product = await productService.getProductById(item.productId);
          return { ...item, product } as CartItemWithProduct;
        } catch (error) {
          console.error(`Failed to fetch product ${item.productId}:`, error);
          return item;
        }
      }));
      
      return { ...order, items: itemsWithProducts } as OrderWithProductDetails;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось получить заказ');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      await orderService.updateOrder(id, { Status: status });
      // Возвращаем id и новый статус, так как API не возвращает обновленный объект
      return { orderId: id, status };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось обновить статус');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const ordersFromApi = await orderService.getAllOrders();
      
      // Преобразование формата данных API в формат клиента
      const orders = ordersFromApi.map((order: any) => ({
        ...order,
        items: order.orderItems || [],
        totalPrice: order.totalAmount
      })) as Order[];
      
      const ordersWithProducts = await Promise.all(orders.map(async (order: Order) => {
        const itemsWithProducts = await Promise.all(order.items.map(async (item: CartItem) => {
          try {
            const product = await productService.getProductById(item.productId);
            return { ...item, product } as CartItemWithProduct;
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error);
            return item;
          }
        }));
        
        return { ...order, items: itemsWithProducts } as OrderWithProductDetails;
      }));
      
      return ordersWithProducts;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось получить все заказы');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(createOrderFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderFromCart.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orders.push(action.payload);
      })
      .addCase(createOrderFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<OrderWithProductDetails[]>) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<OrderWithProductDetails>) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<{ orderId: number; status: string }>) => {
        state.isLoading = false;
        const { orderId, status } = action.payload;

        // Обновление заказа в списке заказов
        const index = state.orders.findIndex(order => order.orderId === orderId);
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            status
          };
        }

        // Обновление текущего заказа, если он открыт
        if (state.currentOrder?.orderId === orderId) {
          state.currentOrder = {
            ...state.currentOrder,
            status
          };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action: PayloadAction<OrderWithProductDetails[]>) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
