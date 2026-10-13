import { createSlice } from '@reduxjs/toolkit';

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  return user?.id || null;
};

const loadFavoritesFromStorage = () => {
  const userId = getUserId();
  if (!userId) return [];
  const saved = localStorage.getItem(`favorites_${userId}`);
  return saved ? JSON.parse(saved) : [];
};

const saveFavoritesToStorage = (items) => {
  const userId = getUserId();
  if (userId) {
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(items));
  }
};

const initialState = {
  items: loadFavoritesFromStorage(),
  loading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action) {
      const userId = getUserId();
      if (!userId) return;

      const exists = state.items.find(i => i.productId === action.payload.productId);
      if (!exists) {
        state.items.push({
          ...action.payload,
          id: Date.now().toString(),
          userId
        });
        saveFavoritesToStorage(state.items);
      }
    },

    updateFavorite(state, action) {
      const { id, data } = action.payload;
      const index = state.items.findIndex(i => i.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...data };
        saveFavoritesToStorage(state.items);
      }
    },

    removeFavorite(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
      saveFavoritesToStorage(state.items);
    },

    clearFavorites(state) {
      state.items = [];
      saveFavoritesToStorage([]);
    },

    loadUserFavorites(state) {
      state.items = loadFavoritesFromStorage();
    },

    clearFavoritesOnLogout(state) {
      state.items = [];
      state.error = null;
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
  loadUserFavorites,
  clearFavoritesOnLogout,
  setError
} = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesCount = (state) => state.favorites.items.length;
export const selectFavoritesLoading = (state) => state.favorites.loading;

export default favoritesSlice.reducer;