import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { medicinesAPI } from '../../services/api';

// ────────────────────────────────────────────────
// Асинхронные thunk-и
// ────────────────────────────────────────────────

// Загрузка списка лекарств с пагинацией / сортировкой / фильтром / поиском
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

// Загрузка одного лекарства по ID
export const fetchMedicineById = createAsyncThunk(
  'medicines/fetchMedicineById',
  async (id, { rejectWithValue }) => {
    try {
      return await medicinesAPI.getById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Создание нового лекарства
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

// Обновление
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

// Удаление
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

// ────────────────────────────────────────────────
// Slice
// ────────────────────────────────────────────────

const initialState = {
  items: [],
  currentItem: null,
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null
};

const medicinesSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    clearCurrentItem(state) {
      state.currentItem = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchMedicines
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
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

      // fetchMedicineById
      .addCase(fetchMedicineById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedicineById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchMedicineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createMedicine
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createMedicine.rejected, (state, action) => {
        state.error = action.payload;
      })

      // updateMedicine
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const idx = state.items.findIndex(m => m.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      // deleteMedicine
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.items = state.items.filter(m => m.id !== action.payload);
      });
  }
});

export const { clearCurrentItem, clearError } = medicinesSlice.actions;

export const selectMedicines = (state) => state.medicines.items;
export const selectMedicineLoading = (state) => state.medicines.loading;
export const selectMedicineError = (state) => state.medicines.error;
export const selectMedicinePagination = (state) => ({
  totalItems: state.medicines.totalItems,
  totalPages: state.medicines.totalPages,
  currentPage: state.medicines.currentPage
});
export const selectCurrentMedicine = (state) => state.medicines.currentItem;

export default medicinesSlice.reducer;