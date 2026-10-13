import { createSlice } from '@reduxjs/toolkit';
import { initialFavorites } from '../../data/initialData';

const initialState = {
  items: initialFavorites,
  loading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action) {
      const exists = state.items.find(i => i.productId === action.payload.productId);
      if (!exists) {
        state.items.push({
          ...action.payload,
          id: Date.now().toString()
        });
      }
    },

    updateFavorite(state, action) {
      const { id, data } = action.payload;
      const index = state.items.findIndex(i => i.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...data };
      }
    },

    removeFavorite(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },

    clearFavorites(state) {
      state.items = [];
    },

    setError(state, action) {
      state.error = action.payload;
    }
  }
});

export const {
  addFavorite,
  updateFavorite,
  removeFavorite,
  clearFavorites,
  setError
} = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesCount = (state) => state.favorites.items.length;
export const selectFavoritesLoading = (state) => state.favorites.loading;

export default favoritesSlice.reducer;