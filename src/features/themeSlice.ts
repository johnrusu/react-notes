import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// mui
import { type PaletteMode } from "@mui/material/styles";

// types
import type { NotesThemeState } from "../types";

// constants
import { NOTES_LABELS } from "../constants";

const initialState: NotesThemeState = {
  theme: NOTES_LABELS.darkMode as PaletteMode,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<PaletteMode>) => {
      state.theme = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
