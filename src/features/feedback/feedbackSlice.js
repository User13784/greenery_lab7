import { createSlice } from '@reduxjs/toolkit';
import { initialFeedback } from '../../data/initialData';

const initialState = {
  items: initialFeedback,
  loading: false,
  error: null
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    addFeedback(state, action) {
      state.items.push(action.payload);
    },

    updateFeedback(state, action) {
      const index = state.items.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },

    deleteFeedback(state, action) {
      state.items = state.items.filter(f => f.id !== action.payload);
    },

    setError(state, action) {
      state.error = action.payload;
    }
  }
});

export const {
  addFeedback,
  updateFeedback,
  deleteFeedback,
  setError
} = feedbackSlice.actions;

export const selectFeedback = (state) => state.feedback.items;
export const selectFeedbackLoading = (state) => state.feedback.loading;

export default feedbackSlice.reducer;