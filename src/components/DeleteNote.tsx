import React, { useState } from "react";

// constants
import { NOTES_LABELS } from "../constants";

// mui
import { Box, Button, Typography } from "@mui/material";

// mui icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelIcon from "@mui/icons-material/Cancel";

// types
interface DeleteNoteProps {
  onDeleteNote: () => void;
  textColor?: string;
  id?: string;
}

const DeleteNote: React.FC<DeleteNoteProps> = ({
  onDeleteNote,
  textColor = "#000000",
  id = "",
}): React.ReactElement => {
  const [showButtonGroup, setShowButtonGroup] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteClick = () => {
    setIsDeleting(true);
    onDeleteNote();
    setShowButtonGroup(false);
  };

  const handleCancelClick = () => {
    setIsDeleting(false);
    setShowButtonGroup(false);
  };

  return !showButtonGroup ? (
    <Button
      aria-label={NOTES_LABELS.deleteButton}
      variant="text"
      sx={{ color: textColor }}
      onClick={setShowButtonGroup.bind(null, true)}
      startIcon={<DeleteForeverIcon />}
    >
      {NOTES_LABELS.deleteButton}
    </Button>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        maxWidth: 300,
      }}
    >
      <Typography
        sx={{
          color: textColor,
          fontWeight: "bold",
        }}
      >
        {`${NOTES_LABELS.confirmTitleDeleteNote} ${NOTES_LABELS.note(id)}`}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={handleCancelClick}
          disabled={isDeleting}
          sx={{ color: textColor }}
          startIcon={<CancelIcon />}
        >
          {NOTES_LABELS.cancel}
        </Button>
        <Button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          sx={{ color: textColor }}
          loading={isDeleting}
          startIcon={<DeleteForeverIcon />}
        >
          {NOTES_LABELS.yes}
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteNote;
