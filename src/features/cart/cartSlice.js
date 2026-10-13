import { createSlice } from '@reduxjs/toolkit';

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  return user?.id || null;
};

const loadCartFromStorage = () => {
  const userId = getUserId();
  if (!userId) return [];
  const saved = localStorage.getItem(`cart_${userId}`);
  return saved ? JSON.parse(saved) : [];
};

const saveCartToStorage = (items) => {
  const userId = getUserId();
  if (userId) {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
  }
};

const initialState = {
  items: loadCartFromStorage(),
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const userId = getUserId();
      if (!userId) {
        state.error = 'User not authenticated';
        return;
      }

      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          id: Date.now().toString(),
          userId,
          quantity: 1
        });
      }
      saveCartToStorage(state.items);
    },

    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
        saveCartToStorage(state.items);
      }
    },

    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
      saveCartToStorage(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveCartToStorage([]);
    },

    loadUserCart(state) {
      state.items = loadCartFromStorage();
    },

    clearCartOnLogout(state) {
      state.items = [];
      state.error = null;
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
  loadUserCart,
  clearCartOnLogout,
  setError
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartLoading = (state) => state.cart.loading;

export default cartSlice.reducer;