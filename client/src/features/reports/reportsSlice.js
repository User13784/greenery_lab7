import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportsAPI } from '../../services/api';

// Асинхронный thunk — загрузка отчёта по заявкам за год
export const fetchOrdersReport = createAsyncThunk(
  'reports/fetchOrdersReport',
  async (year, { rejectWithValue }) => {
    try {
      return await reportsAPI.getOrdersReport(year);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const initialState = {
  data: null,       // { year, report: [...], grandTotal, grandQuantity }
  loading: false,
  error: null,
  year: new Date().getFullYear()
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setYear(state, action) {
      state.year = action.payload;
    },
    clearReport(state) {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.year = action.payload.year;
      })
      .addCase(fetchOrdersReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setYear, clearReport } = reportsSlice.actions;

export const selectReportData = (state) => state.reports.data;
export const selectReportLoading = (state) => state.reports.loading;
export const selectReportError = (state) => state.reports.error;
export const selectReportYear = (state) => state.reports.year;

export default reportsSlice.reducer;