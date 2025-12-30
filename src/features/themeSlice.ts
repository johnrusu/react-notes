import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// mui
import { type PaletteMode } from "@mui/material/styles";

// types
import type { NotesThemeState } from "../types";

// constants
import { NOTES_LABELS } from "../constants";

// services
import * as api from "../services";

const initialState: NotesThemeState = {
  theme: NOTES_LABELS.darkMode as PaletteMode,
  isLoading: false,
};

// Async thunks

export const createTheme = createAsyncThunk(
  "theme/createTheme",
  async ({ theme, token }: { theme: string; token: string }) => {
    const response = await api.createTheme({ theme }, token);
    return response;
  },
);

export const themeSlice = createSlice({
  name: NOTES_LABELS.theme,
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<PaletteMode>) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create theme
      .addCase(createTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTheme.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createTheme.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
