import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "../features/notesSlice";
import themeReducer from "../features/themeSlice";
import { storage } from "../utils/storage";

// Load state from localStorage
const loadStateFromLocalStorage = () => {
  try {
    const notesState = storage.getFromStorage("notes");
    const themeState = storage.getFromStorage("theme");

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
store.subscribe(() => {
  try {
    const state = store.getState();
    storage.saveToStorage("notes", JSON.stringify(state.notes));
    storage.saveToStorage("theme", JSON.stringify(state.theme));
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
