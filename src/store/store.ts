import { configureStore } from "@reduxjs/toolkit";
// reducers
import notesReducer from "../features/notesSlice";
import themeReducer from "../features/themeSlice";
// utils
import { storage } from "../utils/storage";
// constants
import { NOTES_LABELS } from "@/constants";

// Check if user is authenticated (simplified check)
const isAuthenticated = () => {
  try {
    // Check if Auth0 has stored authentication data
    const auth0Cache = localStorage.getItem(
      `@@auth0spajs@@::${import.meta.env.VITE_AUTH0_CLIENT_ID}::${import.meta.env.VITE_AUTH0_AUDIENCE}::openid profile email`,
    );
    return !!auth0Cache;
  } catch {
    return false;
  }
};

// Load state from localStorage only if not authenticated
const loadStateFromLocalStorage = () => {
  try {
    // Always load theme
    const themeState = storage.getFromStorage("theme");

    // Only load notes if not authenticated
    const notesState = !isAuthenticated()
      ? storage.getFromStorage(NOTES_LABELS.notes)
      : null;

    return {
      notes: notesState ? JSON.parse(notesState) : undefined,
      theme: themeState ? JSON.parse(themeState) : undefined,
    };
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    return {};
  }
};

const preloadedState = loadStateFromLocalStorage();

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    theme: themeReducer,
  },
  preloadedState,
});

// Save state to localStorage whenever it changes
// Only save notes to localStorage if not authenticated
store.subscribe(() => {
  try {
    const state = store.getState();

    // Always save theme
    storage.saveToStorage("theme", JSON.stringify(state.theme));

    // Only save notes if not authenticated
    if (!isAuthenticated()) {
      storage.saveToStorage(NOTES_LABELS.notes, JSON.stringify(state.notes));
    }
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
