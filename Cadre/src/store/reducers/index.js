import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  reportIndex: 0,
};

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setReportIndex: (state, action) => {
      state.reportIndex = action.payload;
    },
  },
});

export const { setToken, setReportIndex } = rootSlice.actions;

// Selectors
export const selectToken = (state) => state.root.token;
export const selectReportIndex = (state) => state.root.reportIndex;

export default rootSlice.reducer;
