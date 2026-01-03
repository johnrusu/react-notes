import type { NotesType } from "../types";

const NOTE_COLORS = ["#FFEB3B", "#FFCDD2", "#C8E6C9", "#BBDEFB", "#D1C4E9"];

const NOTE_DEFAULT = {
  id: "",
  text: "",
  color: NOTE_COLORS[0],
  highlighted: false,
  height: 200,
  orderId: 0,
  title: "",
  isHtml: false,
  createdAt: "",
  updatedAt: "",
  collapsed: false,
};

const NOTES_LABELS = {
  expand: "Expand",
  collapse: "Collapse",
  createdAt: "Created at:",
  updatedAt: "Updated at:",
  close: "Close",
  save: "Save",
  delete: "Delete",
  settings: "Settings",
  enableRichTextContent: "Enable Rich Text Content",
  enableRichTextContentDescription:
    "Toggle to enable or disable rich text formatting in your notes.",
  noteColorDescription: "Select a color for your note.",
  noteColor: "Note Color",
  purgeSuccess: "All notes were purged successfully.",
  totalNotes: "Total Notes",
  toggleHighlight: "Toggle Highlight",
  importedNotes: "Notes imported successfully.",
  confirmTitleImportNotes: "Confirm Import Notes:",
  confirmMessageImportNotes:
    "Importing notes will replace your current notes. Do you want to continue?",
  structureMustMatch: "Structure should match:",
  importErrorInvalidJSON: "The imported file contains invalid JSON.",
  exportingNotes: "Exporting notes...",
  exportedNotes: "Notes exported successfully.",
  acceptTypesJSON: ".json,application/json",
  import: "Import Notes",
  export: "Export Notes",
  purge: "Purge All Notes",
  purgeDescription:
    "Permanently delete all notes from your account. This action cannot be undone.",
  importDescription:
    "Import notes from a JSON file. This will replace your current notes.",
  exportDescription: "Export your notes to a JSON file for backup or sharing.",
  chooseFile: "Choose JSON File",
  importButton: "Import",
  exportButton: "Export",
  importSuccess: "Notes imported successfully.",
  importError: "Failed to import notes. Please check the file format.",
  loggedOut: "Successfully logged out.",
  theme: "theme",
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
  filterNotes: "Search Notes by Text",
  loading: "Loading...",
  title: "Notes",
  createNotePlaceholder: "Note content...",
  addButton: "Add Note",
  updateButton: "Update",
  addHighlightedNote: "Add highlighted node",
  note: (id: string) => `Note #${id ? id : NOTE_DEFAULT.id}`,
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
  loggedIn: "Successfully logged in.",
  notes: "notes",
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
  pageTitle: "React Notes",
  subtitle: `A modern, feature-rich notes application built with React, Redux, Material-UI, and TailwindCSS. Organize, highlight, and manage your notes with ease.`,
  sectionsTitle: {
    features: "Features",
    technologies: "Technologies",
    capabilities: "Key Capabilities",
    developer: "About the Developer",
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
    "Auth0",
    "Jest & React Testing Library",
    "MongoDB Atlas",
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
  developer: {
    name: "Ionut Rusu",
    title: "Fullstack Developer",
    description: [
      "Ionut Rusu is a passionate Fullstack Developer based in Romania, specializing in Vue.js, Node.js, React.js, and UI/UX design. With expertise in modern web technologies and a keen eye for user experience, Ionut creates efficient and elegant solutions for complex problems.",
      "This Notes application showcases the power of modern JavaScript frameworks and demonstrates a commitment to building practical, user-friendly tools with enterprise-grade security and scalability.",
    ],
    links: [
      {
        label: "Visit Portfolio",
        url: "https://rusu-ionut.ro",
        icon: "language",
        color: "primary",
      },
      {
        label: "GitHub",
        url: "https://github.com/johnrusu",
        icon: "github",
        color: "primary",
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/ionut-rusu-1035b112",
        icon: "linkedin",
        color: "primary",
      },
    ],
  },
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
    appSettings: "Settings",
    appDatabase: "Database",
    notesSummary: "Notes Summary",
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
