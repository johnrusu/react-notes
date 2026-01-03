import { type PaletteMode } from "@mui/material";
import type { LottieOptions } from "lottie-react";
import type React from "react";

type NoteDefault = {
  id: string;
  text: string;
  color: string;
  highlighted: boolean;
  height?: number;
  orderId?: number;
  title?: string;
  isHtml?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  collapsed?: boolean;
};

interface NoteProps extends NoteDefault {
  isHtml?: boolean;
  onTextChange: (id: string, text: string) => void;
  onEditSaveTitle?: (id: string, title: string) => void;
  isTitleDisabled?: boolean;
  setNoteHeight: (id: string, height: number) => void;
  onDelete: (id: string) => void;
  style?: React.CSSProperties;
  height?: number;
  orderId?: number;
  onToggleHighlightedNote?: (id: string) => void;
  title?: string;
  onHtmlContentChange?: (id: string, isHtml: boolean) => void;
  onColorChange?: (id: string, color: string) => void;
  noteColor?: string;
  collapsed?: boolean;
  onToggleCollapsed?: (id: string) => void;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

type ColorPickerProps = {
  triggerOnClick?: boolean;
  changeColorFromProps?: boolean;
  color: string;
  isSelected?: boolean;
  onClick: (color?: string) => void;
  iconClass?: string;
  inputClass?: string;
  iconFontSize?: "small" | "medium" | "large" | "inherit";
  [key: string]: any;
};

type Note = NoteDefault;

interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
  filteredBy: NotesType;
  filterText: string;
  wasReset: boolean;
  lastAddedNote: NoteDefault | null;
  isLoading: boolean;
}

interface NotesThemeState {
  theme: PaletteMode;
  isLoading: boolean;
}

interface AddNoteProps {
  onNoteAdd: (note: Note) => void;
  onNoteHighlightedNote: (note: Note) => void;
  disabled?: boolean;
}

interface CreateNoteProps {
  onNoteAdd: (note: Note) => void;
  onNoteHighlightedNote: (note: Note) => void;
  isLoading?: boolean;
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
  isLoading?: boolean;
}

interface SectionDatabaseComponentProps {
  description?: string;
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
  SectionDatabaseComponentProps,
  NoteProps,
};
