import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ThemeProvider,
  createTheme,
  type PaletteMode,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// mui
import { Box } from "@mui/material";

// constants
import { NOTES_LABELS } from "./constants";

// components
import CreateNote from "./components/CreateNote";
import Notes from "./components/Notes";
import Header from "./components/Header";
import NotesCart from "./components/NotesCart";

// state
import { addNote } from "./features/notesSlice";
import { setTheme } from "./features/themeSlice";

// types
import type { NoteDefault, NotesThemeState } from "./types";

// Define the root state type
interface RootState {
  theme: NotesThemeState;
}

const App = (): React.ReactElement => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.theme);

  const handelNoteAdd = (note: NoteDefault) => {
    dispatch(addNote(note));
  };

  const handelHighlightedNoteAdd = (note: NoteDefault) => {
    dispatch(addNote(note));
  };

  const dark: PaletteMode = NOTES_LABELS.darkMode as PaletteMode;

  const darkTheme = createTheme({
    palette: {
      mode: currentTheme,
    },
  });

  useEffect(() => {
    dispatch(setTheme(dark));
  }, [dispatch, dark]);

  const notesContainerClass = `notes-container ${
    currentTheme === NOTES_LABELS.darkMode ? "dark-theme" : "light-theme"
  }`;

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Box className={notesContainerClass}>
          <CreateNote
            onNoteAdd={handelNoteAdd}
            onNoteHightlightedNote={handelHighlightedNoteAdd}
          />
          <div className="notes-grid">
            <Notes />
          </div>
        </Box>
        <NotesCart />
      </ThemeProvider>
    </>
  );
};

export default App;
