// store/slices/orderSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../service/Api';
import toast from 'react-hot-toast';

export const createOrder = createAsyncThunk(
  'orders/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await orderAPI.createOrder(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'orders/verifyPayment',
  async (data, { rejectWithValue }) => {
    try {
      const res = await orderAPI.verifyPayment(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Payment verification failed');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderAPI.getMyOrders();
      return res.data.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders:           [],
    razorpayOrderData: null,
    currentOrder:     null,
    loading:  false,
    error:    null,
  },
  reducers: {
    clearRazorpayData(state) { state.razorpayOrderData = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(createOrder.fulfilled, (s, { payload }) => {
        s.loading = false; s.razorpayOrderData = payload;
      })
      .addCase(createOrder.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload; toast.error(payload);
      })

      .addCase(verifyPayment.pending,   (s) => { s.loading = true; })
      .addCase(verifyPayment.fulfilled, (s, { payload }) => {
        s.loading = false; s.currentOrder = payload;
        toast.success('Order placed successfully!');
      })
      .addCase(verifyPayment.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload; toast.error(payload || 'Payment failed');
      })

      .addCase(fetchMyOrders.pending,   (s) => { s.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (s, { payload }) => { s.loading = false; s.orders = payload; })
      .addCase(fetchMyOrders.rejected,  (s) => { s.loading = false; });
  },
});

export const { clearRazorpayData } = orderSlice.actions;
export const selectOrders          = (s) => s.orders.orders;
export const selectRazorpayData    = (s) => s.orders.razorpayOrderData;
export const selectCurrentOrder    = (s) => s.orders.currentOrder;
export const selectOrderLoading    = (s) => s.orders.loading;

export default orderSlice.reducer;