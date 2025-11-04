import React from "react";

// mui
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  IconButton,
  CardHeader,
} from "@mui/material";

// mui icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import GradeIcon from "@mui/icons-material/Grade";

// types
import type { NoteDefault } from "../types";

// components
import NoteContent from "./NoteContent";

// constants
import { NOTES_LABELS } from "../constants";

// types
interface NoteProps extends NoteDefault {
  onTextChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

const Note: React.FC<NoteProps> = ({
  text,
  color,
  id,
  highlighted,
  onDelete,
  onTextChange,
}): React.ReactElement => {
  const title: string = NOTES_LABELS.note(id);

  // Function to determine if a color is light or dark
  const isLightColor = (hexColor: string): boolean => {
    // Remove # if present
    const hex = hexColor.replace("#", "");

    // Convert hex to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance using relative luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true if light (luminance > 0.5)
    return luminance > 0.5;
  };

  const textColor = isLightColor(color) ? "#000000" : "#ffffff";

  return (
    <Card
      sx={{
        backgroundColor: color,
        color: textColor,
      }}
      className="note"
    >
      <CardHeader
        title={<Typography variant="subtitle1">{title}</Typography>}
        action={highlighted ? <GradeIcon color="warning" /> : null}
      />
      <CardContent className="note-content">
        <NoteContent text={text} onTextChange={onTextChange} id={id} />
      </CardContent>
      <CardActions className="flex justify-end">
        <IconButton aria-label="delete note" onClick={() => onDelete(id)}>
          <DeleteForeverIcon sx={{ color: textColor }} />
        </IconButton>
      </CardActions>
    </Card>
  );
};
export default Note;
