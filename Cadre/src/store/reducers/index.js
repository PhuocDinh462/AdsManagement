import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  reportIndex: 0,
  reportCoord: null,
  boardIndex: 0,
  boardId: null,
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
    setBoardId: (state, action) => {
      state.boardId = action.payload;
    },
  },
});

export const { setUser, setReportIndex, setReportPointId, setReportCoord, setBoardIndex, setBoardId } =
  rootSlice.actions;

// Selectors
export const selectUser = (state) => state.root.user;
export const selectReportIndex = (state) => state.root.reportIndex;
export const selectReportCoord = (state) => state.root.reportCoord;
export const selectBoardIndex = (state) => state.root.boardIndex;
export const selectBoardId = (state) => state.root.boardId;

export default rootSlice.reducer;
