import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

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
import Header from "./components/Header";
import AnimationsLoader from "./components/AnimationsLoader";

const NotesCounter = React.lazy(() => import("./components/NotesCounter"));
const CreateNote = React.lazy(() => import("./components/CreateNote"));
const Notes = React.lazy(() => import("./components/Notes"));
const PreviewNotes = React.lazy(() => import("./components/PreviewNotes"));
const FilterNotes = React.lazy(() => import("./components/FilterNotes"));

// state
import {
  addNote,
  resetFilteredNotes,
  setFilteredType,
  filterNotesByText,
  filterNotes,
} from "./features/notesSlice";
import { setTheme } from "./features/themeSlice";

// types
import type { NoteDefault, NotesThemeState, NotesType } from "./types";

// animations
import loadingAnimation from "./assets/animations/loading.json";
import { isArrayNotEmpty, isNilOrEmpty } from "./utils";

// Define the root state type
interface RootState {
  theme: NotesThemeState;
  notes: any; // Replace 'any' with your actual notes state type
}

// Memoized selector to avoid unnecessary re-renders
const selectSortedNotes = createSelector(
  [(state: RootState) => state.notes.notes],
  (notes) =>
    [...notes].sort((a, b) => Number(b.highlighted) - Number(a.highlighted)),
);

const App = (): React.ReactElement => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const filterText = useSelector((state: RootState) => state.notes.filterText);
  const notes = useSelector(selectSortedNotes);
  const wasReset = useSelector((state: RootState) => state.notes.wasReset);
  const notesType = useSelector((state: RootState) => state.notes.filteredBy);

  const showPreviewCounterSectionCondition = (): boolean => {
    if (
      !isNilOrEmpty(filterText) ||
      (isArrayNotEmpty(notes) && notes.length > 1)
    ) {
      return true;
    }
    return false;
  };

  const dark: PaletteMode = NOTES_LABELS.darkMode as PaletteMode;
  const darkTheme = createTheme({
    palette: {
      mode: currentTheme,
    },
  });

  const notesContainerClass = `notes-container ${
    currentTheme === NOTES_LABELS.darkMode ? THEMES.DARK : THEMES.LIGHT
  }`;

  const Loading = () => (
    <AnimationsLoader
      options={{
        animationData: loadingAnimation,
        loop: true,
        autoplay: true,
        style: { width: "150px", height: "150px" },
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
      }}
    />
  );

  const handelNoteAdd = (note: NoteDefault) => {
    dispatch(addNote(note));
    handleFilteredNotesClick(notesType, !isNilOrEmpty(filterText));
  };

  const handelHighlightedNoteAdd = (note: NoteDefault) => {
    dispatch(addNote(note));
    handleFilteredNotesClick(notesType, !isNilOrEmpty(filterText));
  };

  const handleFilteredNotesClick = (
    notesType: NotesType,
    hasFilterText: boolean,
  ) => {
    if (notesType === NOTES_TYPE.allNotes) {
      dispatch(resetFilteredNotes());
      if (hasFilterText) {
        dispatch(filterNotesByText(filterText));
      }
      return;
    }
    dispatch(filterNotes(notesType));
    dispatch(setFilteredType(notesType));
  };

  const onFilterNotesChange = (filterText: string) => {
    if (!isNilOrEmpty(filterText)) {
      dispatch(filterNotesByText(filterText));
    } else {
      dispatch(resetFilteredNotes());
    }
  };

  useEffect(() => {
    dispatch(setTheme(dark));
  }, [dispatch, dark]);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Box className={notesContainerClass}>
          <React.Suspense fallback={<Loading />}>
            {isArrayNotEmpty(notes) ? (
              <FilterNotes
                onFilterClick={onFilterNotesChange}
                wasReset={wasReset}
                filterText={filterText}
              />
            ) : null}
          </React.Suspense>
          <Box className="notes-grid-and-controls">
            <React.Suspense fallback={<Loading />}>
              <Box className="create-note-container">
                <CreateNote
                  onNoteAdd={handelNoteAdd}
                  onNoteHightlightedNote={handelHighlightedNoteAdd}
                />
              </Box>
            </React.Suspense>
            <React.Suspense fallback={<Loading />}>
              <Box className="notes-grid">
                <Notes />
              </Box>
            </React.Suspense>
            <React.Suspense fallback={<Loading />}>
              {showPreviewCounterSectionCondition() && (
                <Box className="preview-counter-section">
                  <PreviewNotes />
                  <NotesCounter
                    onNotesClick={(type) =>
                      handleFilteredNotesClick(type, !isNilOrEmpty(filterText))
                    }
                    notesType={notesType}
                  />
                </Box>
              )}
            </React.Suspense>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;
