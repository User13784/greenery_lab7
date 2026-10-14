import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { purchasesAPI } from '../../services/api';

export const fetchPurchases = createAsyncThunk(
  'purchases/fetchPurchases',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await purchasesAPI.getAll(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const createPurchase = createAsyncThunk(
  'purchases/createPurchase',
  async (data, { rejectWithValue }) => {
    try {
      return await purchasesAPI.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deletePurchase = createAsyncThunk(
  'purchases/deletePurchase',
  async (id, { rejectWithValue }) => {
    try {
      await purchasesAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const initialState = {
  items: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null
};

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  }
});

export const selectPurchases = (state) => state.purchases.items;
export const selectPurchasesLoading = (state) => state.purchases.loading;
export const selectPurchasesError = (state) => state.purchases.error;
export const selectPurchasesPagination = (state) => ({
  totalItems: state.purchases.totalItems,
  totalPages: state.purchases.totalPages,
  currentPage: state.purchases.currentPage
});

export default purchasesSlice.reducer;