import { type PaletteMode } from "@mui/material";
import type { LottieOptions } from "lottie-react";
import type React from "react";

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
  filterText: string;
  wasReset: boolean;
  lastAddedNote: NoteDefault | null;
}

interface NotesThemeState {
  theme: PaletteMode;
}

interface AddNoteProps {
  onNoteAdd: (note: Note) => void;
  onNoteHighlightedNote: (note: Note) => void;
}

interface CreateNoteProps {
  onNoteAdd: (note: Note) => void;
  onNoteHighlightedNote: (note: Note) => void;
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

interface AnimationsLoaderProps {
  options: LottieOptions<"svg"> | null;
}

interface FilterNotesProps {
  onFilterClick: (filter: string) => void;
  wasReset?: boolean;
  filterText?: string;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  labels?: {
    yes: string;
    no: string;
  };
  onConfirmButtonClick: () => void;
  onClose: () => void;
}

interface FooterProps {
  children: React.ReactNode | string;
}

interface IHeader {
  onLoginClick: () => void;
  onLogoutClick: () => void;
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
  AnimationsLoaderProps,
  FilterNotesProps,
  ConfirmDialogProps,
  FooterProps,
  IHeader,
};
