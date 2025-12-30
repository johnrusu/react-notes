import React, { useState } from "react";
import { createPortal } from "react-dom";

// constants
import { NOTES_LABELS } from "../constants";

// mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// mui icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// types
interface DeleteNoteProps {
  onDeleteNote: () => void;
  textColor?: string;
  id?: string;
  onClick?: () => void;
}

const DeleteNote: React.FC<DeleteNoteProps> = ({
  onDeleteNote,
  onClick,
  id = "",
}): React.ReactElement => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Close menu after dialog closes
    onClick?.();
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
    onDeleteNote();
    setOpenDialog(false);
    setIsDeleting(false);
    // Close menu after delete
    onClick?.();
  };

  return (
    <>
      <>
        <ListItemIcon onClick={handleOpenDialog}>
          <DeleteForeverIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText onClick={handleOpenDialog}>
          {NOTES_LABELS.delete}
        </ListItemText>
      </>

      {createPortal(
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="delete-dialog-title"
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle id="delete-dialog-title">
            {NOTES_LABELS.confirmTitleDeleteNote}
          </DialogTitle>
          <DialogContent>
            <Typography>{`${NOTES_LABELS.confirmMessageDeleteNote}`}</Typography>
            <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
              {NOTES_LABELS.note(id)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isDeleting}>
              {NOTES_LABELS.cancel}
            </Button>
            <Button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              color="error"
              variant="contained"
              startIcon={<DeleteForeverIcon />}
            >
              {NOTES_LABELS.deleteButton}
            </Button>
          </DialogActions>
        </Dialog>,
        document.body,
      )}
    </>
  );
};

export default DeleteNote;
