import React from "react";
import { pathOr } from "ramda";

// mui
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// mui icons
import AddIcon from "@mui/icons-material/Add";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";

// constants
import { NOTES_LABELS } from "../constants";

// types
import type { AddNoteProps } from "../types";

const AddNote: React.FC<AddNoteProps> = (props) => {
  const onNoteAdd = pathOr(() => {}, ["onNoteAdd"], props);
  const onNoteHighlightedNote = pathOr(
    () => {},
    ["onNoteHighlightedNote"],
    props,
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddNote = (): void => {
    onNoteAdd();
    handleClose();
  };

  const handleAddHighlightedNote = (): void => {
    onNoteHighlightedNote();
    handleClose();
  };

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={handleAddNote}>
          <ListItemIcon>
            <NoteAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{NOTES_LABELS.addButton}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAddHighlightedNote}>
          <ListItemIcon>
            <StickyNote2Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{NOTES_LABELS.addHighlightedNote}</ListItemText>
        </MenuItem>
      </Menu>
      <Box className="add-note">
        <IconButton
          onClick={handleClickMenu}
          name="add-note-button"
          aria-label="Add new note"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <AddIcon fontSize="large" />
        </IconButton>
      </Box>
    </>
  );
};
export default AddNote;
