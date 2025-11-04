import React from "react";

import { pathOr } from "ramda";

// mui
import { Card, Box, Badge, Button } from "@mui/material";

// types
import type { RootState } from "../store/store";
import type { NotesCounterProps, NotesType } from "../types";

// state
import { useSelector } from "react-redux";

// utils
import { isArrayNotEmpty } from "../utils";

// constants
import { NOTES_LABELS, NOTES_TYPE } from "../constants";

const NotesCounter: React.FC<NotesCounterProps> = (
  props: NotesCounterProps,
): React.ReactElement | null => {
  const notesClick: (arg: NotesType) => void = pathOr(
    () => {},
    ["onNotesClick"],
    props,
  );
  const notesType = pathOr(NOTES_TYPE.allNotes, ["notesType"], props);

  const notes = useSelector((state: RootState) => state.notes.notes);
  const filteredNotes = useSelector(
    (state: RootState) => state.notes.filteredNotes,
  );
  const highlightedNotes = notes.filter((note) => note.highlighted);
  const simpleNotes = notes.filter((note) => !note.highlighted);

  return isArrayNotEmpty(notes) ? (
    <Card className="notes-cart fixed bottom-10 right-10 p-2">
      <Box display={"flex"} flexDirection={"column"} gap={1} p={2}>
        {isArrayNotEmpty(simpleNotes) ? (
          <Box>
            <Badge
              color="primary"
              badgeContent={simpleNotes.length}
              onClick={() => notesClick(NOTES_TYPE.simple)}
              className={`hover:underline cursor-pointer ${
                notesType === NOTES_TYPE.simple ? "underline" : ""
              }`}
            >
              <span className="mr-2">{NOTES_LABELS.simpleNotes}</span>
            </Badge>
          </Box>
        ) : null}
        {isArrayNotEmpty(highlightedNotes) ? (
          <Box>
            <Badge
              color="primary"
              badgeContent={highlightedNotes.length}
              onClick={() => notesClick(NOTES_TYPE.highlighted)}
              className={`hover:underline cursor-pointer ${
                notesType === NOTES_TYPE.highlighted ? "underline" : ""
              }`}
            >
              <span className="mr-2">{NOTES_LABELS.highlightedNotes}</span>
            </Badge>
          </Box>
        ) : null}
      </Box>
      {isArrayNotEmpty(filteredNotes) ? (
        <Button
          variant="text"
          className="w-full"
          onClick={() => notesClick(NOTES_TYPE.allNotes)}
        >
          {NOTES_LABELS.resetFilteredNotes}
        </Button>
      ) : null}
    </Card>
  ) : null;
};

export default NotesCounter;
