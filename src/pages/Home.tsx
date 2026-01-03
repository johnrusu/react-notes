import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

// mui
import { Box } from "@mui/material";

// constants
import { NOTES_TYPE, NOTE_COLORS } from "../constants/index";

// components
import { AnimationsLoader } from "../components";

const NotesCounter = React.lazy(() => import("../components/NotesCounter"));
const CreateNote = React.lazy(() => import("../components/CreateNote"));
const Notes = React.lazy(() => import("../components/Notes"));
const PreviewNotes = React.lazy(() => import("../components/PreviewNotes"));
const FilterNotes = React.lazy(() => import("../components/FilterNotes"));

// state
import {
  addNote,
  resetFilteredNotes,
  setFilteredType,
  filterNotesByText,
  filterNotes,
  createNote,
} from "../features/notesSlice";

// types
import type { NoteDefault, NotesType } from "../types";
import type { RootState } from "../store/store";

// hooks
import { useLoading } from "../contexts/LoadingContext.hooks";

// animations
import loadingAnimation from "../assets/animations/loading.json";
import { isArrayNotEmpty, isNilOrEmpty } from "../utils";
import { useAccessToken } from "../hooks/useAccessToken";
import { useAuth0 } from "@auth0/auth0-react";

// Memoized selector to avoid unnecessary re-renders
const selectSortedNotes = createSelector(
  [(state: RootState) => state.notes.notes],
  (notes) => {
    if (!notes || !Array.isArray(notes)) return [];
    return [...notes].sort(
      (a, b) => Number(b.highlighted) - Number(a.highlighted),
    );
  },
);

const Home = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { getToken } = useAccessToken();
  const { isAuthenticated } = useAuth0();
  const { isLoading } = useLoading();

  const filterText = useSelector((state: RootState) => state.notes.filterText);
  const notes = useSelector(selectSortedNotes);
  const filteredNotes = useSelector(
    (state: RootState) => state.notes.filteredNotes,
  );
  const wasReset = useSelector((state: RootState) => state.notes.wasReset);
  const notesType = useSelector((state: RootState) => state.notes.filteredBy);
  const simpleNotes = notes.filter((note) => !note.highlighted);
  const highlightedNotes = notes.filter((note) => note.highlighted);

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

  const handleNoteAdd = async (note: NoteDefault) => {
    if (isAuthenticated) {
      try {
        const token = await getToken();
        // Generate ID for the note before sending to API
        const lastNoteId =
          notes.length > 0
            ? Math.max(...notes.map((n) => Number(n.id) || 0))
            : 0;
        const noteId = lastNoteId > 0 ? `${lastNoteId + 1}` : `${Date.now()}`;
        const noteWithId = {
          ...note,
          id: noteId,
          text: note.text || "",
          color: note.color || NOTE_COLORS[0],
          highlighted: note.highlighted || false,
          height: note?.height || 128,
          orderId: notes.length + 1,
          isHtml: note.isHtml || false,
          collapsed: note.collapsed || false,
        };
        dispatch(createNote({ noteData: noteWithId, token }) as any);
      } catch (error) {
        console.error("Error creating note:", error);
        // Fallback to local-only add
        dispatch(addNote(note));
      }
    } else {
      dispatch(addNote(note));
    }
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

  return (
    <>
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
              onNoteAdd={handleNoteAdd}
              onNoteHighlightedNote={handleNoteAdd}
              isLoading={isLoading}
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
    </>
  );
};

export default Home;
