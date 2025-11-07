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

type Note = NoteDefault;

interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
  filteredBy: NotesType;
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

interface DraggableNoteProps {
  id: string;
  text?: string;
  index: number;
  moveNote: (dragIndex: number, hoverIndex: number) => void;
  className?: string;
  color?: string;
  highlighted?: boolean;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

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
  DraggableNoteProps,
  DragItem,
};
