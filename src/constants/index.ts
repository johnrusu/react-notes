import type { NotesType } from "../types";

const NOTE_COLORS = ["#FFEB3B", "#FFCDD2", "#C8E6C9", "#BBDEFB", "#D1C4E9"];

const NOTE_DEFAULT = {
  id: "",
  text: "",
  color: NOTE_COLORS[0],
  highlighted: false,
};

const NOTES_LABELS = {
  copyright: "© 2024 Rusu Ionut - Notes. All rights reserved.",
  refreshingPage: (time: number) =>
    `Refreshing page in ${time / 1000} seconds...`,
  confirmAction: "Confirm Action",
  yes: "Yes",
  no: "No",
  confirmTitleClearLocalStorage: "Confirm deletion of all notes:",
  confirmMessageClearLocalStorage:
    "Are you sure you want to delete all notes? This action cannot be undone",
  clearLocalStorage: "Clear notes",
  localStorageCleared: "All notes were removed successfully.",
  theme: "theme",
  filterNotes: "Search Notes by Text",
  loading: "Loading...",
  title: "Notes",
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
  previewNotesTitle: "Reorder of notes",
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

const DEFAULT_TIMEOUT_FOR_RELOADING_PAGE = 3000;

export {
  NOTE_COLORS,
  NOTES_LABELS,
  NOTE_DEFAULT,
  NOTES_TYPE,
  ITEM_TYPES,
  THEMES,
  DEFAULT_TIMEOUT_FOR_RELOADING_PAGE,
};
