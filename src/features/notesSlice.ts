import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// types
import type { NotesState, Note, NoteDefault, NotesType } from "../types";

// constants
import { NOTES_TYPE, NOTES_LABELS, NOTE_DEFAULT } from "../constants";
import { isNilOrEmpty } from "../utils";

// services
import * as api from "@/services";

const initialState: NotesState = {
  filteredBy: NOTES_TYPE.allNotes,
  notes: [],
  filteredNotes: [],
  filterText: "",
  wasReset: false,
  lastAddedNote: null,
  isLoading: false,
};

// Async thunks for API calls
export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (token: string) => {
    const response = await api.getAllNotes(token);
    // API returns { success: true, notes: [...] }
    return (response as any).notes || response;
  },
);

export const createNote = createAsyncThunk(
  "notes/createNote",
  async ({ noteData, token }: { noteData: Note; token: string }) => {
    const response = await api.createNote(noteData, token);
    // API returns { success: true, note: {...} }
    return (response as any).note || response;
  },
);

export const updateNoteHeightAsync = createAsyncThunk(
  "notes/updateNoteHeight",
  async ({
    noteId,
    height,
    token,
  }: {
    noteId: string;
    height: number;
    token: string;
  }) => {
    const response = await api.updateNoteHeight(noteId, height, token);
    // API returns { success: true, note: {...} }
    return (response as any).note || response;
  },
);

export const updateNoteAsync = createAsyncThunk(
  "notes/updateNote",
  async ({
    noteId,
    updateData,
    token,
  }: {
    noteId: string;
    updateData: {
      text?: string;
      color?: string;
      highlighted?: boolean;
      height?: number;
      title?: string;
      isHtml?: boolean;
      orderId?: number;
    };
    token: string;
  }) => {
    const response = await api.updateNote(noteId, updateData, token);
    // API returns { success: true, note: {...} }
    return (response as any).note || response;
  },
);

export const deleteNoteAsync = createAsyncThunk(
  "notes/deleteNote",
  async ({ noteId, token }: { noteId: string; token: string }) => {
    await api.deleteNote(noteId, token);
    return noteId;
  },
);

export const deleteAllNotesAsync = createAsyncThunk(
  "notes/deleteAllNotes",
  async (token: string) => {
    const response = await api.deleteAllNotes(token);
    return response;
  },
);

export const reorderNotesAsync = createAsyncThunk(
  "notes/reorderNotes",
  async ({ notes, token }: { notes: Note[]; token: string }) => {
    await api.bulkUpdateNotes(notes, token);
    return notes;
  },
);

export const importNotesAsync = createAsyncThunk(
  "notes/importNotes",
  async ({ notes, token }: { notes: Note[]; token: string }) => {
    const response = await api.importNotes(notes, token);
    // API returns { success: true, modifiedCount, matchedCount, upsertedCount }
    return response;
  },
);

export const notesSlice = createSlice({
  name: NOTES_LABELS.notes,
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.wasReset = false;
      const lastNoteId = [...state.notes]
        .map((q) => Number(q.id))
        .reduce((a, b) => Math.max(a, b), 0);
      state.notes = [
        ...state.notes,
        { ...action.payload, id: `${lastNoteId + 1}` },
      ];
      state.filteredNotes = [];
      state.lastAddedNote = { ...action.payload, id: `${lastNoteId + 1}` };
    },

    deleteLastdAddedNote: (state) => {
      if (!isNilOrEmpty(state.lastAddedNote)) {
        state.lastAddedNote = null;
      }
    },

    deleteNote: (state, action: PayloadAction<string>) => {
      state.wasReset = false;
      state.notes = state.notes.filter((note) => note.id !== action.payload);
      state.filteredNotes = state.filteredNotes.filter(
        (note) => note.id !== action.payload,
      );
    },

    // Local-only action for client-side reordering (not persisted to backend)
    // To persist order, backend would need an 'order' field and bulk update endpoint
    setReorderedNotes: (state, action: PayloadAction<NoteDefault[]>) => {
      state.wasReset = false;
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
      state.wasReset = false;
      state.filteredBy = action.payload;
    },

    filterNotes: (state, action: PayloadAction<NotesType>) => {
      state.wasReset = false;
      const notesType = action.payload;
      const filterText: string = state.filterText.toLowerCase();
      const filteredNotes = state.notes.filter((note: NoteDefault) =>
        !isNilOrEmpty(filterText)
          ? note.text.toLowerCase().includes(filterText) &&
            (notesType === NOTES_TYPE.simple
              ? !note.highlighted
              : notesType === NOTES_TYPE.highlighted
                ? note.highlighted
                : true)
          : notesType === NOTES_TYPE.simple
            ? !note.highlighted
            : notesType === NOTES_TYPE.highlighted
              ? note.highlighted
              : true,
      );
      state.filteredNotes = filteredNotes;
    },

    resetFilteredNotes: (state) => {
      state.filteredNotes = [];
      state.filterText = "";
      state.wasReset = true;
      state.filteredBy = NOTES_TYPE.allNotes;
    },

    updateNoteHeight: (
      state,
      action: PayloadAction<{ noteId: string; height: number }>,
    ) => {
      state.wasReset = false;
      const { noteId, height } = action.payload;
      const noteIndex = state.notes.findIndex((note) => note.id === noteId);
      if (noteIndex !== -1) {
        state.notes[noteIndex].height = height;
      }
      const filteredNoteIndex = state.filteredNotes.findIndex(
        (note) => note.id === noteId,
      );
      if (filteredNoteIndex !== -1) {
        state.filteredNotes[filteredNoteIndex].height = height;
      }
    },

    updateNote: (
      state,
      action: PayloadAction<{
        noteId: string;
        text?: string;
        highlighted?: boolean;
        height?: number;
        title?: string;
        isHtml?: boolean;
        orderId?: number;
        color?: string;
      }>,
    ) => {
      state.wasReset = false;
      const {
        noteId,
        text = NOTE_DEFAULT.text,
        highlighted = NOTE_DEFAULT.highlighted,
        height = NOTE_DEFAULT.height,
        title = NOTE_DEFAULT.title,
        isHtml = NOTE_DEFAULT.isHtml,
        orderId = NOTE_DEFAULT.orderId,
        color = NOTE_DEFAULT.color,
      } = action.payload;

      const updateNotesKeys = (notesArray: NoteDefault[]) => {
        if (!isNilOrEmpty(text) && text !== undefined) {
          notesArray[noteIndex].text = text;
        }
        if (!isNilOrEmpty(highlighted) && highlighted !== undefined) {
          notesArray[noteIndex].highlighted = highlighted;
        }
        if (!isNilOrEmpty(height) && height !== undefined) {
          notesArray[noteIndex].height = height;
        }
        if (!isNilOrEmpty(title) && title !== undefined) {
          notesArray[noteIndex].title = title;
        }
        if (!isNilOrEmpty(orderId) && orderId !== undefined) {
          notesArray[noteIndex].orderId = orderId;
        }
        if (!isNilOrEmpty(isHtml) && isHtml !== undefined) {
          notesArray[noteIndex].isHtml = isHtml;
        }
        if (!isNilOrEmpty(color) && color !== undefined) {
          notesArray[noteIndex].color = color;
        }
      };

      const noteIndex = state.notes.findIndex((note) => note.id === noteId);
      const filteredNoteIndex = state.filteredNotes.findIndex(
        (note) => note.id === noteId,
      );

      if (noteIndex !== -1) {
        updateNotesKeys(state.notes);
      }
      if (filteredNoteIndex !== -1) {
        updateNotesKeys(state.filteredNotes);
      }
    },

    filterNotesByText: (state, action: PayloadAction<string>) => {
      state.wasReset = false;
      const filterText = action.payload.toLowerCase();
      state.filterText = action.payload;
      state.filteredNotes = state.notes.filter((note) =>
        note.text.toLowerCase().includes(filterText),
      );
    },
  },
  extraReducers: (builder) => {
    // Fetch notes
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.filteredNotes = [];
        state.wasReset = false;
        state.isLoading = false;
      })
      .addCase(fetchNotes.rejected, (state) => {
        state.isLoading = false;
      });

    // Create note
    builder
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes = [...state.notes, action.payload];
        state.filteredNotes = [];
        state.lastAddedNote = action.payload;
        state.wasReset = false;
        state.isLoading = false;
      })
      .addCase(createNote.rejected, (state) => {
        state.isLoading = false;
      });

    // Update note height
    builder
      .addCase(updateNoteHeightAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateNoteHeightAsync.fulfilled, (state, action) => {
        const updatedNote = action.payload;
        const noteIndex = state.notes.findIndex(
          (note) => note.id === updatedNote.id,
        );
        if (noteIndex !== -1) {
          state.notes[noteIndex] = updatedNote;
        }
        const filteredNoteIndex = state.filteredNotes.findIndex(
          (note) => note.id === updatedNote.id,
        );
        if (filteredNoteIndex !== -1) {
          state.filteredNotes[filteredNoteIndex] = updatedNote;
        }
        state.wasReset = false;
        state.isLoading = false;
      })
      .addCase(updateNoteHeightAsync.rejected, (state) => {
        state.isLoading = false;
      });

    // Update note
    builder
      .addCase(updateNoteAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateNoteAsync.fulfilled, (state, action) => {
        const updatedNote = action.payload;
        const noteIndex = state.notes.findIndex(
          (note) => note.id === updatedNote.id,
        );
        if (noteIndex !== -1) {
          state.notes[noteIndex] = updatedNote;
        }
        const filteredNoteIndex = state.filteredNotes.findIndex(
          (note) => note.id === updatedNote.id,
        );
        if (filteredNoteIndex !== -1) {
          state.filteredNotes[filteredNoteIndex] = updatedNote;
        }
        state.wasReset = false;
        state.isLoading = false;
      })
      .addCase(updateNoteAsync.rejected, (state) => {
        state.isLoading = false;
      });

    // Delete note
    builder
      .addCase(deleteNoteAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNoteAsync.fulfilled, (state, action) => {
        const noteId = action.payload;
        state.notes = state.notes.filter((note) => note.id !== noteId);
        state.filteredNotes = state.filteredNotes.filter(
          (note) => note.id !== noteId,
        );
        state.wasReset = false;
        state.isLoading = false;
      })
      .addCase(deleteNoteAsync.rejected, (state) => {
        state.isLoading = false;
      });

    // Delete all notes
    builder
      .addCase(deleteAllNotesAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAllNotesAsync.fulfilled, (state) => {
        state.notes = [];
        state.filteredNotes = [];
        state.filterText = "";
        state.wasReset = true;
        state.filteredBy = NOTES_TYPE.allNotes;
        state.isLoading = false;
      })
      .addCase(deleteAllNotesAsync.rejected, (state) => {
        state.isLoading = false;
      });

    // Reorder notes
    builder
      .addCase(reorderNotesAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reorderNotesAsync.fulfilled, (state, action) => {
        state.wasReset = false;
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
        state.isLoading = false;
      })
      .addCase(reorderNotesAsync.rejected, (state) => {
        state.isLoading = false;
      });

    // Import notes
    builder
      .addCase(importNotesAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(importNotesAsync.fulfilled, (state) => {
        // Import response doesn't contain notes, just metadata
        // Notes will be fetched separately in the component
        state.wasReset = false;
        state.isLoading = false;
      })
      .addCase(importNotesAsync.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  addNote,
  deleteNote,
  updateNote,
  updateNoteHeight,
  filterNotes,
  resetFilteredNotes,
  setFilteredType,
  setReorderedNotes,
  filterNotesByText,
  deleteLastdAddedNote,
} = notesSlice.actions;

export default notesSlice.reducer;
