import React from "react";

// mui
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  IconButton,
  CardHeader,
  Box,
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

// utils
import { isLightColor, hexToRgba } from "../utils";

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
  const textColor = isLightColor(color) ? "#000000" : "#ffffff";
  const rgbaColor: { r: number; g: number; b: number; a: number } | null =
    hexToRgba(textColor, 0.5);

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
        action={
          highlighted ? (
            <Box
              sx={{
                backgroundColor: `rgba(${rgbaColor?.r}, ${rgbaColor?.g}, ${rgbaColor?.b}, ${rgbaColor?.a})`,
                borderRadius: "50%",
                padding: "4px",
              }}
            >
              <GradeIcon color="warning" />
            </Box>
          ) : null
        }
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
