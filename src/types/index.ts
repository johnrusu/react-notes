import { type PaletteMode } from "@mui/material";

type NoteDefault = {
  id: string;
  text: string;
  color: string;
  highlighted: boolean;
};

type ColorPickerProps = {
  color: string;
  isSelected?: boolean;
  onClick: (color?: string) => void;
};

type Note = {
  id: string;
  text: string;
  color: string;
  highlighted: boolean;
};

interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
}

interface NotesThemeState {
  theme: PaletteMode;
}

interface AddNoteProps {
  onNoteAdd: (note: Note) => void;
  onNoteHightlightedNote: (note: Note) => void;
}

interface CreateNoteProps {
  onNoteAdd: (note: Note) => void;
  onNoteHightlightedNote: (note: Note) => void;
}

interface NotesCounterProps {
  onNotesClick?: (arg: NotesType) => void;
  notesType?: NotesType;
}

type NotesType = "simple" | "highlighted" | "allNotes";

export type {
  ColorPickerProps,
  Note,
  NotesState,
  CreateNoteProps,
  AddNoteProps,
  NoteDefault,
  NotesThemeState,
  NotesCounterProps,
  NotesType,
};
