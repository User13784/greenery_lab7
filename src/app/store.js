import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import authReducer from '../features/auth/authSlice';
import feedbackReducer from '../features/feedback/feedbackSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    feedback: feedbackReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;