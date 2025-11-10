import React from "react";

import { pathOr } from "ramda";

// mui
import {
  Card,
  Box,
  Badge,
  Button,
  Typography,
  CardActions,
  CardContent,
} from "@mui/material";
// icons
import DeleteIcon from "@mui/icons-material/Delete";

// types
import type { RootState } from "../store/store";
import type { NotesCounterProps, NotesType } from "../types";

// state
import { useSelector } from "react-redux";

// utils
import { isArrayNotEmpty, isNilOrEmpty } from "../utils";

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

  const filterText = useSelector((state: RootState) => state.notes.filterText);

  const notes = useSelector((state: RootState) => state.notes.notes);
  const filteredNotes = useSelector(
    (state: RootState) => state.notes.filteredNotes,
  );
  const highlightedNotes = useSelector(
    (state: RootState) => state.notes.notes,
  ).filter((note) => note.highlighted);

  const simpleNotes = notes.filter((note) => !note.highlighted);
  const showCondition =
    isArrayNotEmpty(simpleNotes) && isArrayNotEmpty(highlightedNotes);

  const simpleNotesFilteredLength = !isNilOrEmpty(filterText)
    ? notes.filter(
        (note) => !note.highlighted && note.text.includes(filterText),
      ).length
    : simpleNotes.length;

  const highlightedNotesFilteredLength = !isNilOrEmpty(filterText)
    ? notes.filter((note) => note.highlighted && note.text.includes(filterText))
        .length
    : highlightedNotes.length;

  return showCondition ? (
    <Card className="notes-counter">
      <CardContent
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Typography gutterBottom sx={{ fontSize: 14 }}>
          <span className="[&&]:text-gray-400">
            {NOTES_LABELS.notesCounterTitle}
          </span>
        </Typography>
        <Box display={"flex"} flexDirection={"column"} gap={1} mt={4} flex={1}>
          {isArrayNotEmpty(simpleNotes) ? (
            <Box>
              <Badge
                color="primary"
                badgeContent={String(simpleNotesFilteredLength)}
                onClick={() => notesClick(NOTES_TYPE.simple)}
                className={`text-white hover:underline cursor-pointer ${
                  notesType === NOTES_TYPE.simple ? "underline" : ""
                }`}
              >
                <span className="mr-3">{NOTES_LABELS.simpleNotes}</span>
              </Badge>
            </Box>
          ) : null}
          {isArrayNotEmpty(highlightedNotes) ? (
            <Box>
              <Badge
                color="primary"
                badgeContent={String(highlightedNotesFilteredLength)}
                onClick={() => notesClick(NOTES_TYPE.highlighted)}
                className={`text-white  hover:underline cursor-pointer ${
                  notesType === NOTES_TYPE.highlighted ? "underline" : ""
                }`}
              >
                <span className="mr-3">{NOTES_LABELS.highlightedNotes}</span>
              </Badge>
            </Box>
          ) : null}
        </Box>
      </CardContent>
      <CardActions>
        {isArrayNotEmpty(filteredNotes) ? (
          <Button
            startIcon={<DeleteIcon />}
            variant="text"
            className="w-full"
            onClick={() => notesClick(NOTES_TYPE.allNotes)}
          >
            {NOTES_LABELS.resetFilteredNotes}
          </Button>
        ) : null}
      </CardActions>
    </Card>
  ) : null;
};

export default NotesCounter;
