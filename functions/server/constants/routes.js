// API Routes Configuration
const ROUTES = {
  // Public routes
  ROOT: {
    method: "GET",
    path: "/",
    protected: false,
    description: "Welcome endpoint",
  },

  PROTECTED_TEST: {
    method: "GET",
    path: "/protected",
    protected: true,
    description: "Test protected route",
  },

  // User routes
  CREATE_OR_UPDATE_USER: {
    method: "POST",
    path: "/api/users",
    protected: true,
    description: "Create or update user after Auth0 login",
  },

  GET_CURRENT_USER: {
    method: "GET",
    path: "/api/users/me",
    protected: true,
    description: "Get current authenticated user",
  },

  // Notes routes
  GET_ALL_NOTES: {
    method: "GET",
    path: "/api/notes",
    protected: true,
    description: "Get all notes for authenticated user",
  },

  CREATE_NOTE: {
    method: "POST",
    path: "/api/notes",
    protected: true,
    description: "Create new note",
  },

  UPDATE_NOTE_HEIGHT: {
    method: "PUT",
    path: "/api/notes/:noteId/height",
    protected: true,
    description: "Update note height",
  },

  UPDATE_NOTE: {
    method: "PUT",
    path: "/api/notes/:noteId",
    protected: true,
    description: "Update existing note",
  },

  BULK_UPDATE_NOTES: {
    method: "PUT",
    path: "/api/notes/bulk",
    protected: true,
    description: "Bulk update all notes (for reordering)",
  },

  DELETE_NOTE: {
    method: "DELETE",
    path: "/api/notes/:noteId",
    protected: true,
    description: "Delete specific note",
  },

  DELETE_ALL_NOTES: {
    method: "DELETE",
    path: "/api/notes",
    protected: true,
    description: "Delete all notes for authenticated user",
  },

  EXPORT_NOTES: {
    method: "GET",
    path: "/api/notes/export",
    protected: true,
    description: "Export all notes for authenticated user",
  },

  IMPORT_NOTES: {
    method: "POST",
    path: "/api/notes/import",
    protected: true,
    description: "Import notes for authenticated user",
  },

  // Theme routes
  GET_THEME: {
    method: "GET",
    path: "/api/theme",
    protected: true,
    description: "Get all themes for authenticated user",
  },

  CREATE_THEME: {
    method: "POST",
    path: "/api/theme",
    protected: true,
    description: "Create new theme",
  },

  UPDATE_THEME: {
    method: "PUT",
    path: "/api/theme",
    protected: true,
    description: "Update existing theme",
  },
};

module.exports = { ROUTES };
