import { createSlice, createSelector } from '@reduxjs/toolkit';
import { initialProducts } from '../../data/initialData';

const initialState = {
  items: initialProducts,     
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'all',
  sortBy: 'default'
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action) {
      state.items.push(action.payload);
    },

    updateProduct(state, action) {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },

    deleteProduct(state, action) {
      state.items = state.items.filter(p => p.id !== action.payload);
    },

    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    }
  }
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  setSearchTerm,
  setCategory,
  setSortBy,
  setError
} = productsSlice.actions;

export const selectAllProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectSearchTerm = (state) => state.products.searchTerm;
export const selectCategory = (state) => state.products.selectedCategory;
export const selectSortBy = (state) => state.products.sortBy;

export const selectFilteredProducts = createSelector(
  [
    (state) => state.products.items,
    (state) => state.products.searchTerm,
    (state) => state.products.selectedCategory,
    (state) => state.products.sortBy
  ],
  (items, searchTerm, selectedCategory, sortBy) => {
    let filtered = items.filter(p => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = !search ||
        (p.name?.en?.toLowerCase() || '').includes(search) ||
        (p.name?.ru?.toLowerCase() || '').includes(search);
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating-desc') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'name-asc') filtered = [...filtered].sort((a, b) =>
      (a.name?.en || '').localeCompare(b.name?.en || '')
    );

    return filtered;
  }
);

export default productsSlice.reducer;