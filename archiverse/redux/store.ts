import { configureStore, createSlice } from '@reduxjs/toolkit';

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    data: {},
    error: null,
  },
  reducers: {
    setData: (state, action) => {
      const { key, data } = action.payload;
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