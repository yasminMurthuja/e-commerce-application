// store/index.js - Redux store configuration

import { configureStore } from '@reduxjs/toolkit';
import authReducer   from '../slices/AuthSlice';
import cartReducer   from '../slices/CartSlice';
import productReducer from '../slices/ProductSlice';
import orderReducer  from '../slices/OrderSlice';

const store = configureStore({
  reducer: {
    auth:    authReducer,
    cart:    cartReducer,
    products: productReducer,
    orders:  orderReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;