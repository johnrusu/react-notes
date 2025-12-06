import type { NotesType } from "../types";

const NOTE_COLORS = ["#FFEB3B", "#FFCDD2", "#C8E6C9", "#BBDEFB", "#D1C4E9"];

const NOTE_DEFAULT = {
  id: "",
  text: "",
  color: NOTE_COLORS[0],
  highlighted: false,
};

const NOTES_LABELS = {
  login: "Login",
  logout: "Logout",
  confirmTitleDeleteNote: "Confirm deletion of note:",
  confirmMessageDeleteNote:
    "Are you sure you want to delete this note? This action cannot be undone.",
  deleteButton: "Delete",
  yes: "Yes",
  no: "No",
  cancel: "Cancel",
  copyright: () =>
    `© ${new Date().getFullYear()} Rusu Ionut. All rights reserved.`,
  refreshingPage: (time: number) =>
    `Refreshing page in ${time / 1000} seconds...`,
  confirmAction: "Confirm Action",
  confirmTitleClearNotes: "Confirm deletion of all notes:",
  confirmMessageClearNotes:
    "Are you sure you want to delete all notes? This action cannot be undone.",
  clearNotes: "Clear notes",
  notesCleared: "All notes were removed successfully.",
  theme: "theme",
  filterNotes: "Search Notes by Text",
  loading: "Loading...",
  title: "Notes",
  createNotePlaceholder: "Note content...",
  addButton: "Add Note",
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
  themeSettings: "Theme",
  clearNotesSettings: "Clear All Notes",
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

const SETTINGS_PATHS = [
  { name: "Account", path: "/account", icon: "settings", method: undefined },
  { name: "Logout", path: "", icon: "logout", method: "logout" },
];

const ROUTER_PATHS: {
  path: string;
  name: string;
  icon: string;
}[] = [
  {
    path: "/",
    name: "Home",
    icon: "home",
  },
  {
    path: "/about",
    name: "About",
    icon: "about",
  },
];

const ABOUT_PAGE = {
  pageTitle: "About React Notes",
  subtitle: "A modern, feature-rich note-taking application",
  sectionsTitle: {
    features: "Features",
    technologies: "Technologies",
    capabilities: "Key Capabilities",
    openSource: "Open Source",
  },
  features: [
    {
      title: "Modern Stack",
      description: "Built with React 19, TypeScript, and Redux Toolkit",
    },
    {
      title: "Fast & Responsive",
      description: "Optimized with Vite build tool and hash-based caching",
    },
    {
      title: "Persistent Storage",
      description: "Automatic localStorage sync for data persistence",
    },
  ],
  technologies: [
    "React 19",
    "TypeScript",
    "Redux Toolkit",
    "Material-UI",
    "TailwindCSS",
    "Vite",
    "react-dnd",
  ],
  capabilities: [
    "Create, edit, and delete notes with a clean interface",
    "Color-code your notes for better organization",
    "Drag and drop to reorder notes",
    "Search and filter notes instantly",
    "Dark/Light theme support",
    "Automatic data persistence with localStorage",
    "Responsive design for mobile and desktop",
  ],
  openSource: {
    title: "Open Source",
    description: "This project is open source and available on GitHub",
    linkText: "View on GitHub",
    repoUrl: "https://github.com/johnrusu/react-notes",
  },
  footer: (year: number) => `Created by Rusu Ionut • ${year}`,
};

const ACCOUNT_PAGE = {
  pageTitle: "Account",
  loginRequired: "Please log in to view your account",
  sections: {
    profile: "Profile Information",
    additionalInfo: "Additional Information",
    appSettings: "App Settings",
  },
  labels: {
    verified: "Verified",
    lastUpdated: "Last updated:",
    userId: "User ID:",
  },
};

export {
  ROUTER_PATHS,
  NOTE_COLORS,
  NOTES_LABELS,
  NOTE_DEFAULT,
  NOTES_TYPE,
  ITEM_TYPES,
  THEMES,
  DEFAULT_TIMEOUT_FOR_RELOADING_PAGE,
  ABOUT_PAGE,
  ACCOUNT_PAGE,
  SETTINGS_PATHS,
};
