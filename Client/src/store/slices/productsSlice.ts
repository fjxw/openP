import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../api/productService';
import type { ProductState, CreateProductRequest, UpdateProductDto } from '../../types';

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  totalCount: 0,
  totalPages: 0,   
  currentPage: 1,   
  isLoading: false,
  error: null
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ pageNumber = 1, pageSize = 10 }: { pageNumber?: number, pageSize?: number } = {}, { rejectWithValue }) => {
    try {
      return await productService.getProducts(pageNumber, pageSize);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await productService.getProductById(id);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ category, pageNumber = 1, pageSize = 10 }: { category: string, pageNumber?: number, pageSize?: number }, { rejectWithValue }) => {
    try {
      return await productService.getProductsByCategory(category, pageNumber, pageSize);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProductsByPriceRange = createAsyncThunk(
  'products/fetchProductsByPriceRange',
  async ({ minPrice, maxPrice, category, pageNumber = 1, pageSize = 10 }: 
         { minPrice: number, maxPrice: number, category?: string, pageNumber?: number, pageSize?: number }, { rejectWithValue }) => {
    try {
      return await productService.getProductsByPriceRange(minPrice, maxPrice, category, pageNumber, pageSize);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ name, pageNumber = 1, pageSize = 10 }: { name: string, pageNumber?: number, pageSize?: number }, { rejectWithValue }) => {
    try {
      return await productService.searchProducts(name, pageNumber, pageSize);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getCategories();
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: CreateProductRequest, { rejectWithValue }) => {
    try {
      return await productService.createProduct(productData);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }: { id: number, productData: UpdateProductDto }, { rejectWithValue }) => {
    try {
      await productService.updateProduct(id, productData);
      const updatedProduct = await productService.getProductById(id);
      return updatedProduct;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const uploadProductImage = createAsyncThunk(
  'products/uploadProductImage',
  async ({ id, imageFile }: { id: number, imageFile: File }, { rejectWithValue }) => {
    try {
      await productService.uploadProductImage(id, imageFile);
      return id;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
     
      .addCase(fetchProductsByPriceRange.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByPriceRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByPriceRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
     
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        (state as any).categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
    
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
     
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(product => product.productId === action.payload.productId);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct && state.currentProduct.productId === action.payload.productId) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
    
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(product => product.productId !== action.payload);
        if (state.currentProduct && state.currentProduct.productId === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
     
      .addCase(uploadProductImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProductImage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
