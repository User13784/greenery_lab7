import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { medicinesAPI } from '../../services/api';

export const fetchMedicines = createAsyncThunk(
  'medicines/fetchMedicines',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await medicinesAPI.getAll(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const createMedicine = createAsyncThunk(
  'medicines/createMedicine',
  async (data, { rejectWithValue }) => {
    try {
      return await medicinesAPI.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 👇 ДОБАВИТЬ, если нет
export const updateMedicine = createAsyncThunk(
  'medicines/updateMedicine',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await medicinesAPI.update(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteMedicine = createAsyncThunk(
  'medicines/deleteMedicine',
  async (id, { rejectWithValue }) => {
    try {
      await medicinesAPI.delete(id);
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

const medicinesSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // 👇 ДОБАВИТЬ, если нет
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const idx = state.items.findIndex(m => m.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.items = state.items.filter(m => m.id !== action.payload);
      });
  }
});

export const selectMedicines = (state) => state.medicines.items;
export const selectMedicinesLoading = (state) => state.medicines.loading;
export const selectMedicinesError = (state) => state.medicines.error;
export const selectMedicinesPagination = (state) => ({
  totalItems: state.medicines.totalItems,
  totalPages: state.medicines.totalPages,
  currentPage: state.medicines.currentPage
});

export default medicinesSlice.reducer;