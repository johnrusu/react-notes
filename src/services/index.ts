import { API_ROUTES } from "@/constants/routes";
import type { Note } from "@/types";

interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface UserData {
  auth0Id: string;
  email: string;
  name?: string;
}

interface User extends UserData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteData {
  id?: string;
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
}

interface NoteUpdateData {
  text?: string;
  color?: string;
  highlighted?: boolean;
}

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint URL (full URL from API_ROUTES)
 * @param {ApiRequestOptions} options - Fetch options (method, headers, body, etc.)
 * @param {string | null} token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
const apiRequest = async (
  endpoint: string,
  options: ApiRequestOptions = {},
  token: string | null = null,
): Promise<any> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    console.error("API Request failed:", {
      endpoint,
      status: response.status,
      error,
      requestBody: config.body,
    });
    throw new Error(
      error.message || `Request failed with status ${response.status}`,
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/**
 * Create or update user
 * POST /api/users
 */
export const createOrUpdateUser = async (
  userData: UserData,
  token: string,
): Promise<User> => {
  return apiRequest(
    API_ROUTES.CREATE_OR_UPDATE_USER.url,
    {
      method: API_ROUTES.CREATE_OR_UPDATE_USER.method,
      body: JSON.stringify(userData),
    },
    token,
  );
};

/**
 * Get current user
 * GET /api/users/me
 */
export const getCurrentUser = async (token: string): Promise<User> => {
  return apiRequest(
    API_ROUTES.GET_CURRENT_USER.url,
    {
      method: API_ROUTES.GET_CURRENT_USER.method,
    },
    token,
  );
};

/**
 * Get all notes for current user
 * GET /api/notes
 */
export const getAllNotes = async (token: string): Promise<Note[]> => {
  return apiRequest(
    API_ROUTES.GET_ALL_NOTES.url,
    {
      method: API_ROUTES.GET_ALL_NOTES.method,
    },
    token,
  );
};

/**
 * Import notes for current user
 * POST /api/notes/import
 */
export const importNotes = async (
  notes: Note[],
  token: string,
): Promise<any> => {
  return apiRequest(
    API_ROUTES.IMPORT_NOTES.url,
    {
      method: API_ROUTES.IMPORT_NOTES.method,
      body: JSON.stringify({ notes }),
    },
    token,
  );
};

/**
 * Create a new note
 * POST /api/notes
 */
export const createNote = async (
  noteData: NoteData,
  token: string,
): Promise<Note> => {
  return apiRequest(
    API_ROUTES.CREATE_NOTE.url,
    {
      method: API_ROUTES.CREATE_NOTE.method,
      body: JSON.stringify(noteData),
    },
    token,
  );
};

/**
 * Update the height of a specific note
 * PATCH /api/notes/:noteId/height
 * @param noteId - The ID of the note to update
 * @param height - The new height value
 * @param token - Auth0 JWT token
 * @returns The updated note
 */

export const updateNoteHeight = async (
  noteId: string,
  height: number,
  token: string,
): Promise<Note> => {
  return apiRequest(
    API_ROUTES.UPDATE_NOTE_HEIGHT.url.replace(":noteId", noteId),
    {
      method: API_ROUTES.UPDATE_NOTE.method,
      body: JSON.stringify({ height }),
    },
    token,
  );
};

/**
 * Update an existing note
 * PUT /api/notes/:noteId
 */
export const updateNote = async (
  noteId: string,
  updateData: NoteUpdateData,
  token: string,
): Promise<Note> => {
  return apiRequest(
    API_ROUTES.UPDATE_NOTE.url.replace(":noteId", noteId),
    {
      method: API_ROUTES.UPDATE_NOTE.method,
      body: JSON.stringify(updateData),
    },
    token,
  );
};

/**
 * Bulk update notes (for reordering)
 * PUT /api/notes/bulk
 */
export const bulkUpdateNotes = async (
  notes: Note[],
  token: string,
): Promise<{
  success: boolean;
  modifiedCount: number;
  matchedCount: number;
}> => {
  return apiRequest(
    API_ROUTES.BULK_UPDATE_NOTES.url,
    {
      method: API_ROUTES.BULK_UPDATE_NOTES.method,
      body: JSON.stringify({ notes }),
    },
    token,
  );
};

/**
 * Delete a specific note
 * DELETE /api/notes/:noteId
 */
export const deleteNote = async (
  noteId: string,
  token: string,
): Promise<void> => {
  return apiRequest(
    API_ROUTES.DELETE_NOTE.url.replace(":noteId", noteId),
    {
      method: API_ROUTES.DELETE_NOTE.method,
    },
    token,
  );
};

/**
 * Delete all notes for current user
 * DELETE /api/notes
 */
export const deleteAllNotes = async (token: string): Promise<void> => {
  return apiRequest(
    API_ROUTES.DELETE_ALL_NOTES.url,
    {
      method: API_ROUTES.DELETE_ALL_NOTES.method,
    },
    token,
  );
};

export const exportNotes = async (token: string): Promise<Note[]> => {
  return apiRequest(
    API_ROUTES.EXPORT_NOTES.url,
    {
      method: API_ROUTES.EXPORT_NOTES.method,
    },
    token,
  );
};

/**
 * Test protected route
 * GET /protected
 */
export const testProtectedRoute = async (
  token: string,
): Promise<{ message: string }> => {
  return apiRequest(
    API_ROUTES.PROTECTED_TEST.url,
    {
      method: API_ROUTES.PROTECTED_TEST.method,
    },
    token,
  );
};

/**
 * Get all themes for current user
 * GET /api/theme
 */
export const getTheme = async (
  token: string,
): Promise<{ theme: string; _id: string }> => {
  return apiRequest(
    API_ROUTES.GET_THEME.url,
    {
      method: API_ROUTES.GET_THEME.method,
    },
    token,
  );
};

/**
 * Create a new theme
 * POST /api/theme
 */
export const createTheme = async (
  themeData: { theme: string },
  token: string,
): Promise<any> => {
  return apiRequest(
    API_ROUTES.CREATE_THEME.url,
    {
      method: API_ROUTES.CREATE_THEME.method,
      body: JSON.stringify(themeData),
    },
    token,
  );
};
