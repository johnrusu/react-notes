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
import { NOTES_LABELS, NOTES_TYPE, THEMES } from "./constants/index";

// components
import CreateNote from "./components/CreateNote";
import Notes from "./components/Notes";
import Header from "./components/Header";
const NotesCounter = React.lazy(() => import("./components/NotesCounter"));
const PreviewNotes = React.lazy(() => import("./components/PreviewNotes"));

// state
import {
  addNote,
  filterNotes,
  resetFilteredNotes,
  setFilteredType,
} from "./features/notesSlice";
import { setTheme } from "./features/themeSlice";

// types
import type { NoteDefault, NotesThemeState, NotesType } from "./types";

// Define the root state type
interface RootState {
  theme: NotesThemeState;
}

const App = (): React.ReactElement => {
  const [notesType, setNotesType] = React.useState<NotesType>(
    NOTES_TYPE.allNotes,
  );
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.theme);

  const handelNoteAdd = (note: NoteDefault) => {
    dispatch(addNote(note));
    handleFilteredNotesClick(notesType);
  };

  const handelHighlightedNoteAdd = (note: NoteDefault) => {
    dispatch(addNote(note));
    handleFilteredNotesClick(notesType);
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
    currentTheme === NOTES_LABELS.darkMode ? THEMES.DARK : THEMES.LIGHT
  }`;

  const handleFilteredNotesClick = (notesType: NotesType) => {
    if (notesType === NOTES_TYPE.allNotes) {
      dispatch(resetFilteredNotes());
    } else {
      dispatch(filterNotes(notesType));
    }
    setNotesType(notesType);
    dispatch(setFilteredType(notesType));
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Box className={notesContainerClass}>
          <Box className="create-note-container">
            <CreateNote
              onNoteAdd={handelNoteAdd}
              onNoteHightlightedNote={handelHighlightedNoteAdd}
            />
          </Box>
          <Box className="notes-grid">
            <Notes />
          </Box>
          <Box className="preview-counter-section">
            <PreviewNotes />
            <NotesCounter
              onNotesClick={handleFilteredNotesClick}
              notesType={notesType}
            />
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;
