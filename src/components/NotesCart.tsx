import React from "react";

// mui
// mui
import { Card, Box } from "@mui/material";

// types
import type { RootState } from "../store/store";

// state
import { useSelector } from "react-redux";

// utils
import { isArrayNotEmpty } from "../utils";

// constants
import { NOTES_LABELS } from "../constants";

const NotesCart: React.FC = (): React.ReactElement | null => {
  const notes = useSelector((state: RootState) => state.notes.notes);
  const highlightedNotes = notes.filter((note) => note.highlighted);
  const simpleNotes = notes.filter((note) => !note.highlighted);
  return isArrayNotEmpty(notes) ? (
    <Card className="notes-cart fixed bottom-10 right-10 p-1">
      <Box display={"flex"} flexDirection={"column"} gap={1} p={2}>
        {isArrayNotEmpty(simpleNotes) ? (
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems="center"
            justifyContent="space-between"
          >
            <span className="mr-10">{NOTES_LABELS.simpleNotes} </span>
            <span>{simpleNotes.length}</span>
          </Box>
        ) : null}
        {isArrayNotEmpty(highlightedNotes) ? (
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems="center"
            justifyContent="space-between"
          >
            <span className="mr-10">{NOTES_LABELS.highlightedNotes} </span>
            <span>{highlightedNotes.length}</span>
          </Box>
        ) : null}
      </Box>
    </Card>
  ) : null;
};

export default NotesCart;
