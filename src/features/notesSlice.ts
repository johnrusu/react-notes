import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// types
import type { NotesState, Note, NoteDefault, NotesType } from "../types";

// constants
import { NOTES_TYPE } from "../constants";

const initialState: NotesState = {
  filteredBy: NOTES_TYPE.allNotes,
  notes: [],
  filteredNotes: [],
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      const lastNoteId = [...state.notes]
        .map((q) => Number(q.id))
        .reduce((a, b) => Math.max(a, b), 0);
      state.notes = [
        ...state.notes,
        { ...action.payload, id: `${lastNoteId + 1}` },
      ];
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
      state.filteredNotes = state.filteredNotes.filter(
        (note) => note.id !== action.payload,
      );
    },
    setReorderedNotes: (state, action: PayloadAction<NoteDefault[]>) => {
      switch (state.filteredBy) {
        default:
        case NOTES_TYPE.allNotes:
          {
            state.notes = action.payload;
            state.filteredNotes = [];
            state.filteredBy = NOTES_TYPE.allNotes;
          }
          break;
        case NOTES_TYPE.simple:
        case NOTES_TYPE.highlighted:
          {
            // Get IDs of reordered notes from payload
            const reorderedIds = action.payload.map((note) => note.id);

            // Get notes that are NOT in the reordered list
            const remainingNotes = state.notes.filter(
              (note) => !reorderedIds.includes(note.id),
            );

            // Concatenate: reordered notes first, then remaining notes
            state.notes = [...action.payload, ...remainingNotes];
            state.filteredNotes = action.payload;
          }
          break;
      }
    },
    setFilteredType: (state, action: PayloadAction<NotesType>) => {
      state.filteredBy = action.payload;
    },

    filterNotes: (state, action: PayloadAction<NotesType>) => {
      const notesType = action.payload;
      state.filteredNotes = state.notes.filter(
        (note: NoteDefault) =>
          notesType ===
          (note?.highlighted ? NOTES_TYPE.highlighted : NOTES_TYPE.simple),
      );
    },
    resetFilteredNotes: (state) => {
      state.filteredNotes = [];
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
      const filteredNoteIndex = state.filteredNotes.findIndex(
        (note) => note.id === noteId,
      );
      if (filteredNoteIndex !== -1) {
        state.filteredNotes[filteredNoteIndex].text = text;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addNote,
  deleteNote,
  updateNote,
  filterNotes,
  resetFilteredNotes,
  setFilteredType,
  setReorderedNotes,
} = notesSlice.actions;

export default notesSlice.reducer;
