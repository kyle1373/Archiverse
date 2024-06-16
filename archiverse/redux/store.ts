// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { mergeCommunityData, mergePostData } from './merge';

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    data: {},
    error: null,
  },
  reducers: {
    setData: (state, action) => {
      const { key, data } = action.payload;
      if (key.startsWith('communities')) {
        mergeCommunityData(state, data);
      }
      else if (key.startsWith('posts')) {
        mergePostData(state, data);
      }
      state.data[key] = data;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
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