/**
 * API Routes Configuration
 * This file exports all available API endpoints for the Link Shortener application
 */

// Safe access to import.meta.env for both browser and test environments
const getBaseUrl = () => {
  // Check if import.meta.env exists (browser environment)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env.MODE === "production"
      ? (import.meta.env.VITE_API_BASE_URL as string)
      : (import.meta.env.VITE_API_BASE_URL_LOCAL as string) ||
          "http://localhost:3000";
  }
  // Fallback for test environments
  return "http://localhost:3000";
};

const BASE_URL = getBaseUrl();

// API Routes Configuration (mirrored from server/constants/routes.js)
export const API_ROUTES = {
  // Public routes
  ROOT: {
    method: "GET",
    url: `${BASE_URL}/`,
    protected: false,
    description: "Welcome endpoint",
  },

  PROTECTED_TEST: {
    method: "GET",
    url: `${BASE_URL}/protected`,
    protected: true,
    description: "Test protected route",
  },

  // User routes
  CREATE_OR_UPDATE_USER: {
    method: "POST",
    url: `${BASE_URL}/api/users`,
    protected: true,
    description: "Create or update user after Auth0 login",
  },

  GET_CURRENT_USER: {
    method: "GET",
    url: `${BASE_URL}/api/users/me`,
    protected: true,
    description: "Get current authenticated user",
  },

  // Notes routes
  GET_ALL_NOTES: {
    method: "GET",
    url: `${BASE_URL}/api/notes`,
    protected: true,
    description: "Get all notes for authenticated user",
  },

  CREATE_NOTE: {
    method: "POST",
    url: `${BASE_URL}/api/notes`,
    protected: true,
    description: "Create new note",
  },

  UPDATE_NOTE_HEIGHT: {
    method: "PATCH",
    url: `${BASE_URL}/api/notes/:noteId/height`,
    protected: true,
    description: "Update the height of a specific note",
  },

  UPDATE_NOTE: {
    method: "PUT",
    url: `${BASE_URL}/api/notes/:noteId`,
    protected: true,
    description: "Update existing note",
  },

  BULK_UPDATE_NOTES: {
    method: "PUT",
    url: `${BASE_URL}/api/notes/bulk`,
    protected: true,
    description: "Bulk update all notes (for reordering)",
  },

  DELETE_NOTE: {
    method: "DELETE",
    url: `${BASE_URL}/api/notes/:noteId`,
    protected: true,
    description: "Delete specific note",
  },

  DELETE_ALL_NOTES: {
    method: "DELETE",
    url: `${BASE_URL}/api/notes`,
    protected: true,
    description: "Delete all notes for authenticated user",
  },

  EXPORT_NOTES: {
    method: "GET",
    url: `${BASE_URL}/api/notes/export`,
    protected: true,
    description: "Export all notes for authenticated user",
  },

  IMPORT_NOTES: {
    method: "POST",
    url: `${BASE_URL}/api/notes/import`,
    protected: true,
    description: "Import notes for authenticated user",
  },

  // Theme routes
  GET_THEME: {
    method: "GET",
    url: `${BASE_URL}/api/theme`,
    protected: true,
    description: "Get theme for authenticated user",
  },

  CREATE_THEME: {
    method: "POST",
    url: `${BASE_URL}/api/theme`,
    protected: true,
    description: "Create new theme",
  },

  UPDATE_THEME: {
    method: "PUT",
    url: `${BASE_URL}/api/theme`,
    protected: true,
    description: "Update existing theme",
  },
} as const;
