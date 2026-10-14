import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pharmaciesAPI } from '../../services/api';

export const fetchPharmacies = createAsyncThunk(
  'pharmacies/fetchPharmacies',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await pharmaciesAPI.getAll(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const createPharmacy = createAsyncThunk(
  'pharmacies/createPharmacy',
  async (data, { rejectWithValue }) => {
    try {
      return await pharmaciesAPI.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const updatePharmacy = createAsyncThunk(
  'pharmacies/updatePharmacy',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await pharmaciesAPI.update(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deletePharmacy = createAsyncThunk(
  'pharmacies/deletePharmacy',
  async (id, { rejectWithValue }) => {
    try {
      await pharmaciesAPI.delete(id);
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

const pharmaciesSlice = createSlice({
  name: 'pharmacies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPharmacies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPharmacies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPharmacies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPharmacy.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updatePharmacy.fulfilled, (state, action) => {
        const idx = state.items.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePharmacy.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  }
});

export const selectPharmacies = (state) => state.pharmacies.items;
export const selectPharmaciesLoading = (state) => state.pharmacies.loading;
export const selectPharmaciesError = (state) => state.pharmacies.error;
export const selectPharmaciesPagination = (state) => ({
  totalItems: state.pharmacies.totalItems,
  totalPages: state.pharmacies.totalPages,
  currentPage: state.pharmacies.currentPage
});

export default pharmaciesSlice.reducer;