import { configureStore, createSlice } from "@reduxjs/toolkit";
import { mergeCommunityData, mergePostData } from "./merge";

const apiSlice = createSlice({
  name: "api",
  initialState: {
    data: {},
    errors: {},
  },
  reducers: {
    setData: (state, action) => {
      const { key, data, append, prepend } = action.payload;
      if (key.startsWith("communities")) {
        mergeCommunityData(state, data);
      } else if (key.startsWith("posts")) {
        mergePostData(state, data);
      }
      state.data[key] = data;
      state.errors[key] = null;
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
