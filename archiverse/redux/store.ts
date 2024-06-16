import { configureStore, createSlice } from '@reduxjs/toolkit';
import { mergeCommunityData, mergePostData } from './merge';

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    data: {},
    errors: {},
  },
  reducers: {
    setData: (state, action) => {
      const { key, data, append, prepend } = action.payload;
      if (key.startsWith('communities')) {
        if (append) {
          state.data[key] = [...(state.data[key] || []), ...data];
        } else if (prepend) {
          state.data[key] = [...data, ...(state.data[key] || [])];
        } else {
          mergeCommunityData(state, data);
          state.data[key] = data;
        }
      } else if (key.startsWith('posts')) {
        if (append) {
          state.data[key] = [...(state.data[key] || []), ...data];
        } else if (prepend) {
          state.data[key] = [...data, ...(state.data[key] || [])];
        } else {
          mergePostData(state, data);
          state.data[key] = data;
        }
      } else {
        state.data[key] = data;
      }
      state.errors[key] = null; // Clear error on successful fetch
    },
    setError: (state, action) => {
      const { key, error } = action.payload;
      state.errors[key] = error;
    },
  },
});

export const { setData, setError } = apiSlice.actions;

const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
  },
});

export default store;
