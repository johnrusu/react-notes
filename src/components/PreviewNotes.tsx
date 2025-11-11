import React, { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// mui
import { Paper, Box, Typography, Button } from "@mui/material";
// icons

// state
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

// state
import { setReorderedNotes } from "../features/notesSlice";

// utils
import { isArrayNotEmpty } from "../utils";

// constants
import { NOTES_LABELS } from "../constants";

// components
import DraggableNote from "./DraggableNote";

// types
import type { RootState } from "../store/store";
import type { NoteDefault } from "../types";

// Memoized selector to avoid unnecessary re-renders
const selectSortedNotes = createSelector(
  [
    (state: RootState) => state.notes.notes,
    (state: RootState) => state.notes.filteredNotes,
  ],
  (notes, filteredNotes) => {
    const notesToUse = isArrayNotEmpty(filteredNotes) ? filteredNotes : notes;
    return [...notesToUse].sort(
      (a, b) => Number(b.highlighted) - Number(a.highlighted),
    );
  },
);

const PreviewCounter: React.FC = (): React.ReactElement | null => {
  const dispatch = useDispatch();

  const notes = useSelector(selectSortedNotes);
  const simpleNotes = notes.filter((note) => !note.highlighted);
  const highlightedNotes = notes.filter((note) => note.highlighted);

  const [reorderedNotes, setStateReorderedNotes] = useState<NoteDefault[]>([]);

  const handleNotesReMapped = () => {
    dispatch(setReorderedNotes(reorderedNotes));
  };

  const showCondition: boolean =
    (isArrayNotEmpty(simpleNotes) && simpleNotes.length > 1) ||
    (isArrayNotEmpty(highlightedNotes) && highlightedNotes.length > 1);

  const moveNote = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (isArrayNotEmpty(notes)) {
        setStateReorderedNotes((prevCards: NoteDefault[]) => {
          const newCards = [...prevCards];
          const draggedCard = newCards.splice(dragIndex, 1)[0];
          newCards.splice(hoverIndex, 0, draggedCard);
          return newCards;
        });
      }
    },
    [notes],
  );

  useEffect(() => {
    setStateReorderedNotes(notes);
  }, [notes]);

  return showCondition ? (
    <DndProvider backend={HTML5Backend}>
      <Paper className="preview-notes">
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          <span className="[&&]:text-gray-400">
            {NOTES_LABELS.previewNotesTitle}
          </span>
        </Typography>

        <Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            className="overflow-x-auto preview-notes-container max-h-60 "
          >
            {reorderedNotes.map((note, noteIndex) => (
              <DraggableNote
                moveNote={moveNote}
                text={`Note #${note.id}`}
                color={note.color}
                highlighted={note.highlighted}
                index={noteIndex}
                key={`note-preview-${note.id}`}
                id={`note-preview-${note.id}`}
                className="p-4 w-full rounded-md cursor-move note-preview-item flex items-center justify-center flex-col"
              />
            ))}
          </Box>
        </Box>

        <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
          <span className="[&&]:text-gray-400">
            {NOTES_LABELS.warningReorderNotes}
          </span>
        </Typography>

        {isArrayNotEmpty(reorderedNotes) && (
          <Box>
            <Button
              variant="contained"
              onClick={handleNotesReMapped}
              className="apply-order-button w-full"
            >
              {NOTES_LABELS.applyOrderButton}
            </Button>
          </Box>
        )}
      </Paper>
    </DndProvider>
  ) : null;
};

export default PreviewCounter;
