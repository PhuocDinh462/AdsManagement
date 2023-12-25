import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  reportIndex: 0,
  reportPointId: null,
};

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setReportPointId: (state, action) => {
      state.reportPointId = action.payload;
    },
    setReportIndex: (state, action) => {
      state.reportIndex = action.payload;
    },
  },
});

export const { setToken, setReportIndex, setReportPointId } = rootSlice.actions;

// Selectors
export const selectToken = (state) => state.root.token;
export const selectReportIndex = (state) => state.root.reportIndex;
export const selectReportPointId = (state) => state.root.reportPointId;

export default rootSlice.reducer;
