// store/slices/cartSlice.js - Shopping cart state management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../service/Api';
import toast from 'react-hot-toast';

// ---- Async Thunks ----

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await cartAPI.getCart();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (data, { rejectWithValue }) => {
  try {
    const res = await cartAPI.addToCart(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add item');
  }
});

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await cartAPI.updateItem(cartItemId, quantity);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const res = await cartAPI.removeItem(cartItemId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await cartAPI.clearCart();
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
  }
});

// ---- Slice ----
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartData:   null,   // full CartResponse from backend
    loading:    false,
    error:      null,
  },
  reducers: {
    resetCart(state) { state.cartData = null; },
  },
  extraReducers: (builder) => {
    const setLoading = (s) => { s.loading = true; s.error = null; };
    const setError   = (s, { payload }) => { s.loading = false; s.error = payload; };
    const setCart    = (s, { payload }) => { s.loading = false; s.cartData = payload; };

    builder
      .addCase(fetchCart.pending,    setLoading)
      .addCase(fetchCart.fulfilled,  setCart)
      .addCase(fetchCart.rejected,   setError)

      .addCase(addToCart.pending,    setLoading)
      .addCase(addToCart.fulfilled,  (s, a) => {
        setCart(s, a);
        toast.success('Added to cart!');
      })
      .addCase(addToCart.rejected,   (s, a) => { setError(s, a); toast.error(a.payload); })

      .addCase(updateCartItem.pending,   setLoading)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(updateCartItem.rejected,  (s, a) => { setError(s, a); toast.error(a.payload); })

      .addCase(removeFromCart.pending,   setLoading)
      .addCase(removeFromCart.fulfilled, (s, a) => {
        setCart(s, a);
        toast.success('Item removed');
      })
      .addCase(removeFromCart.rejected,  (s, a) => { setError(s, a); toast.error(a.payload); })

      .addCase(clearCart.pending,   setLoading)
      .addCase(clearCart.fulfilled, (s) => { s.loading = false; s.cartData = null; })
      .addCase(clearCart.rejected,  setError);
  },
});

export const { resetCart } = cartSlice.actions;

// Selectors
export const selectCart       = (s) => s.cart.cartData;
export const selectCartItems  = (s) => s.cart.cartData?.items || [];
export const selectCartCount  = (s) => s.cart.cartData?.totalItems || 0;
export const selectCartTotal  = (s) => s.cart.cartData?.totalAmount || 0;
export const selectCartLoading = (s) => s.cart.loading;

export default cartSlice.reducer;