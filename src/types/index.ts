type NoteDefault = {
  id: string;
  text: string;
  color: string;
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
};

interface NotesState {
  notes: Note[];
}

interface AddNoteProps {
  onNoteAdd: (note: Note) => void;
}

interface CreateNoteProps {
  onNoteAdd: (note: Note) => void;
}

export type {
  ColorPickerProps,
  Note,
  NotesState,
  CreateNoteProps,
  AddNoteProps,
  NoteDefault,
};
