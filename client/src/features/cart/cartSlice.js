import { createSlice } from '@reduxjs/toolkit';
import { initialCart } from '../../data/initialData';

const initialState = {
  items: initialCart,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          id: Date.now().toString(),
          quantity: 1
        });
      }
    },

    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
    },

    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },

    clearCart(state) {
      state.items = [];
    },

    setError(state, action) {
      state.error = action.payload;
    }
  }
});

export const {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  setError
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartLoading = (state) => state.cart.loading;

export default cartSlice.reducer;