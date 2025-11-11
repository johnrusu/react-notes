import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { pathOr, is } from "ramda";

import {
  ThemeProvider,
  createTheme,
  type PaletteMode,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// mui
import { Box } from "@mui/material";

// utils
import { stringToJSON } from "./utils";

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
import type { NoteDefault, NotesType } from "./types";
import type { RootState } from "./store/store";

// animations
import loadingAnimation from "./assets/animations/loading.json";
import { isArrayNotEmpty, isNilOrEmpty } from "./utils";
import useStorage from "./hooks/useStorage";

// Memoized selector to avoid unnecessary re-renders
const selectSortedNotes = createSelector(
  [(state: RootState) => state.notes.notes],
  (notes) =>
    [...notes].sort((a, b) => Number(b.highlighted) - Number(a.highlighted)),
);

const convertedStoredTheme = (storedTheme: string = ""): object | null => {
  let parsedTheme = stringToJSON(storedTheme);
  if (parsedTheme === false) return null;
  if (parsedTheme === null) {
    parsedTheme = stringToJSON(storedTheme);
  }
  return !isNilOrEmpty(parsedTheme) && is(Object, parsedTheme) && parsedTheme
    ? parsedTheme
    : null;
};

const App = (): React.ReactElement => {
  const dispatch = useDispatch();
  const storageCurrentTheme: (key: string) => string | null = pathOr(
    () => null,
    ["getFromStorage"],
    useStorage(),
  );

  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const filterText = useSelector((state: RootState) => state.notes.filterText);
  const notes = useSelector(selectSortedNotes);
  const filteredNotes = useSelector(
    (state: RootState) => state.notes.filteredNotes,
  );
  const wasReset = useSelector((state: RootState) => state.notes.wasReset);
  const notesType = useSelector((state: RootState) => state.notes.filteredBy);
  const simpleNotes = notes.filter((note) => !note.highlighted);
  const highlightedNotes = notes.filter((note) => note.highlighted);
  let storedTheme = storageCurrentTheme(NOTES_LABELS.theme);

  if (!isNilOrEmpty(storedTheme)) {
    const storageThemeValue = storageCurrentTheme(NOTES_LABELS.theme);
    storedTheme = pathOr(
      NOTES_LABELS.darkMode,
      [NOTES_LABELS.theme],
      convertedStoredTheme(storageThemeValue || ""),
    );
  }

  const showPreviewCounterSectionCondition = (): boolean => {
    if (
      !isNilOrEmpty(filterText) &&
      isArrayNotEmpty(filteredNotes) &&
      filteredNotes.length === 1
    ) {
      return false;
    }
    // Show if we have multiple simple notes OR multiple highlighted notes
    const hasMultipleSimpleNotes = simpleNotes.length > 1;
    const hasMultipleHighlightedNotes = highlightedNotes.length > 1;
    // Show if we're filtering and have multiple results
    const hasFilterWithMultipleResults =
      !isNilOrEmpty(filterText) && notes.length > 1;

    return (
      hasMultipleSimpleNotes ||
      hasMultipleHighlightedNotes ||
      hasFilterWithMultipleResults
    );
  };

  const currentMode: PaletteMode = !isNilOrEmpty(storedTheme)
    ? (storedTheme as PaletteMode)
    : (NOTES_LABELS.darkMode as PaletteMode);
  const darkTheme = createTheme({
    palette: {
      mode: currentMode,
    },
  });

  const notesContainerClass = `notes-container ${
    currentTheme === NOTES_LABELS.darkMode ? THEMES.DARK : THEMES.LIGHT
  }`;

  const Loading = () => {
    const style = { width: 150, height: 150 };
    return (
      <AnimationsLoader
        options={{
          animationData: loadingAnimation,
          loop: true,
          autoplay: true,
          style,
          rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
        }}
      />
    );
  };

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
    dispatch(setTheme(currentMode));
  }, [dispatch, currentMode]);

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
