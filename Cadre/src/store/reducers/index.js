import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  reportIndex: 0,
  reportCoord: null,
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
    setReportCoord: (state, action) => {
      state.reportCoord = action.payload;
    },
  },
});

export const { setToken, setReportIndex, setReportPointId, setReportCoord } = rootSlice.actions;

// Selectors
export const selectToken = (state) => state.root.token;
export const selectReportIndex = (state) => state.root.reportIndex;
export const selectReportCoord = (state) => state.root.reportCoord;

export default rootSlice.reducer;
