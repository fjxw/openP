export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  createdAt: string;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  totalCount: number;
  categories?: string[];
  totalPages: number; 
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

export interface CartItem {
  productId: number;
  quantity: number;
  price?: number; 
  product?: Product; 
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  totalPrice: number 
  error: string | null;
}

export interface User {
  userId: number; 
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
  orderId: number;
  userId: number;
  items: CartItem[];
  totalPrice: number;
  status: string;
  address: string;  
  phoneNumber: string;
  orderDate: string; 
}

export interface OrderWithProductDetails extends Order {
  items: CartItemWithProduct[];
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
  userId: number;
  email: string;
  username: string; 
  role: string;
}

export interface ResetPasswordDto {
  email: string;
  newPassword: string;
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
  category?: string;
  quantity?: number;
}