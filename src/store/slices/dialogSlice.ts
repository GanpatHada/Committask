import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StateType {
  isOpen: boolean;
  mode?: 'ADD_TODO' | 'EDIT_TODO' | 'VIEW_TODO';
  id?: string;
}

const initialState: StateType = {
  isOpen: false,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openDialog(state, action: PayloadAction<{ id?: string,mode?: "ADD_TODO" | "EDIT_TODO" | 'VIEW_TODO' }>) {
      state.isOpen = true;
      if (action?.payload.id) state.id = action.payload.id;
      if (action?.payload.mode) state.mode = action.payload.mode;
    },
    closeDialog(state) {
      state.isOpen = false;
      state.mode = undefined;
      state.id = undefined;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
