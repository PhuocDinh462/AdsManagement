import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
};

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setToken } = rootSlice.actions;

// Selectors
export const selectToken = (state) => state.root.token;

export default rootSlice.reducer;
