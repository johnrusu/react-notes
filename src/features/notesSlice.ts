import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// types
import type { NotesState, Note } from "../types";

const initialState: NotesState = {
  notes: [],
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes = [
        ...state.notes,
        { ...action.payload, id: `${state.notes.length + 1}` },
      ];
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    updateNote: (
      state,
      action: PayloadAction<{ noteId: string; text: string }>,
    ) => {
      const { noteId, text } = action.payload;
      const noteIndex = state.notes.findIndex((note) => note.id === noteId);
      if (noteIndex !== -1) {
        state.notes[noteIndex].text = text;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addNote, deleteNote, updateNote } = notesSlice.actions;

export default notesSlice.reducer;
