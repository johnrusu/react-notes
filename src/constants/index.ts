import type { NotesType } from "../types";

const NOTE_COLORS = ["#FFEB3B", "#FFCDD2", "#C8E6C9", "#BBDEFB", "#D1C4E9"];

const NOTE_DEFAULT = {
  id: "",
  text: "",
  color: NOTE_COLORS[0],
  highlighted: false,
};

const NOTES_LABELS = {
  title: "Notes application",
  createNotePlaceholder: "Create a new note...",
  addButton: "Add Note",
  deleteButton: "Delete",
  updateButton: "Update",
  addHighlightedNote: "Add highlighted node",
  note: (id: string) => `Note ${id ? id : NOTE_DEFAULT.id}`,
  darkMode: "dark",
  lightMode: "light",
  simpleNotes: "Simple Notes",
  highlightedNotes: "Highlighted Notes",
  resetFilteredNotes: "Reset Filters",
  notesCounterTitle: "Filter notes by type",
  previewNotesTitle: "Preview of notes",
  reorderNotes: "Reorder Notes",
  applyOrderButton: "Apply Order",
  warningReorderNotes:
    "Simple notes can only be reordered among other simple notes, and highlighted notes can only be reordered among other highlighted notes.",
};

const NOTES_TYPE: { [key in NotesType]: NotesType } = {
  simple: "simple",
  highlighted: "highlighted",
  allNotes: "allNotes",
};

const ITEM_TYPES = {
  CARD: "card",
  NOTE: "note",
};

const THEMES = {
  DARK: "dark-theme",
  LIGHT: "light-theme",
};

export {
  NOTE_COLORS,
  NOTES_LABELS,
  NOTE_DEFAULT,
  NOTES_TYPE,
  ITEM_TYPES,
  THEMES,
};
