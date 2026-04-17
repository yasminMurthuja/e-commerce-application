// store/slices/productSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../service/Api';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await productAPI.getAll(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await productAPI.getById(id);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await productAPI.getCategories();
      return res.data.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch categories');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async ({ keyword, params }, { rejectWithValue }) => {
    try {
      const res = await productAPI.search(keyword, params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue('Search failed');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items:       [],
    totalPages:  0,
    totalItems:  0,
    currentPage: 0,
    categories:  [],
    selectedProduct: null,
    loading: false,
    error:   null,
  },
  reducers: {
    clearSelectedProduct(state) { state.selectedProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, { payload }) => {
        s.loading      = false;
        s.items        = payload.content;
        s.totalPages   = payload.totalPages;
        s.totalItems   = payload.totalElements;
        s.currentPage  = payload.number;
      })
      .addCase(fetchProducts.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(fetchProductById.pending,   (s) => { s.loading = true; })
      .addCase(fetchProductById.fulfilled, (s, { payload }) => {
        s.loading = false; s.selectedProduct = payload;
      })
      .addCase(fetchProductById.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(fetchCategories.fulfilled, (s, { payload }) => { s.categories = payload; })

      .addCase(searchProducts.pending,   (s) => { s.loading = true; })
      .addCase(searchProducts.fulfilled, (s, { payload }) => {
        s.loading = false; s.items = payload.content;
        s.totalPages = payload.totalPages; s.totalItems = payload.totalElements;
      })
      .addCase(searchProducts.rejected,  (s) => { s.loading = false; });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export const selectProducts        = (s) => s.products.items;
export const selectProductLoading  = (s) => s.products.loading;
export const selectCategories      = (s) => s.products.categories;
export const selectSelectedProduct = (s) => s.products.selectedProduct;
export const selectTotalPages      = (s) => s.products.totalPages;
export const selectCurrentPage     = (s) => s.products.currentPage;

export default productSlice.reducer;