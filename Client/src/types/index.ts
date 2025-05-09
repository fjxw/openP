export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  quantity: number;
  createdAt: string;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  totalCount: number;
  categories?: string[];
  totalPages: number; // Добавляем свойство
  currentPage: number; // Добавляем свойство
  isLoading: boolean;
  error: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  totalPrice: number 
  error: string | null;
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalPrice: number;
  status: string;
  address: string;  
  phone: string;
  createdAt: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  pageNumber: number;
  pageSize: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  quantity: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  quantity?: number;
}