import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  reportIndex: 0,
  reportCoord: null,
  boardIndex: 0,
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
    setBoardIndex: (state, action) => {
      state.boardIndex = action.payload;
    },
  },
});

export const { setToken, setReportIndex, setReportPointId, setReportCoord, setBoardIndex } = rootSlice.actions;

// Selectors
export const selectToken = (state) => state.root.token;
export const selectReportIndex = (state) => state.root.reportIndex;
export const selectReportCoord = (state) => state.root.reportCoord;
export const selectBoardIndex = (state) => state.root.boardIndex;

export default rootSlice.reducer;
