import React from "react";
import { pathOr } from "ramda";

// mui
import { Box, IconButton } from "@mui/material";

// mui icons
import AddIcon from "@mui/icons-material/Add";

// types
import type { AddNoteProps } from "../types";

const AddNote: React.FC<AddNoteProps> = (props) => {
  const onNoteAdd = pathOr(() => {}, ["onNoteAdd"], props);

  return (
    <Box className="add-note">
      <IconButton onClick={onNoteAdd}>
        <AddIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};
export default AddNote;
