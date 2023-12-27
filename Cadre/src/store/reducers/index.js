import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  reportIndex: 0,
  reportCoord: null,
  boardIndex: 0,
};

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
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

export const { setUser, setReportIndex, setReportPointId, setReportCoord, setBoardIndex } = rootSlice.actions;

// Selectors
export const selectUser = (state) => state.root.user;
export const selectReportIndex = (state) => state.root.reportIndex;
export const selectReportCoord = (state) => state.root.reportCoord;
export const selectBoardIndex = (state) => state.root.boardIndex;

export default rootSlice.reducer;
