import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  reportIndex: 0,
  reportCoord: null,
  boardIndex: 0,
  boardId: null,
  selectedWards: [],
  sendMailStatus: true,
  formLicenseReq: { start_date: new Date().toISOString(), end_date: new Date().toISOString() },
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
    setSelectedWards: (state, action) => {
      state.selectedWards = action.payload;
    },
    setSendMailStatus: (state, action) => {
      state.sendMailStatus = action.payload;
    },
    setFormLicenseReq: (state, action) => {
      state.formLicenseReq = { ...state.formLicenseReq, ...action.payload };
    },
    removeFormLicenseReq: (state, action) => {
      state.formLicenseReq = { start_date: new Date().toISOString(), end_date: new Date().toISOString() };
    },
  },
});

export const {
  setUser,
  setReportIndex,
  setReportPointId,
  setReportCoord,
  setBoardIndex,
  setBoardId,
  setSelectedWards,
  setSendMailStatus,
  setFormLicenseReq,
  removeFormLicenseReq,
} = rootSlice.actions;

// Selectors
export const selectUser = (state) => state.root.user;
export const selectReportIndex = (state) => state.root.reportIndex;
export const selectReportCoord = (state) => state.root.reportCoord;
export const selectBoardIndex = (state) => state.root.boardIndex;
export const selectBoardId = (state) => state.root.boardId;
export const selectSelectedWards = (state) => state.root.selectedWards;
export const selectSendMailStatus = (state) => state.root.sendMailStatus;
export const selectFormLicenseReq = (state) => state.root.formLicenseReq;

export default rootSlice.reducer;
