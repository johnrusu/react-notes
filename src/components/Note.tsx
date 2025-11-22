import React, { useMemo } from "react";

// mui
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  CardHeader,
  Box,
} from "@mui/material";

// mui icons
import GradeIcon from "@mui/icons-material/Grade";

// types
import type { NoteDefault } from "../types";

// components
import NoteContent from "./NoteContent";
import DeleteNote from "./DeleteNote";

// constants
import { NOTES_LABELS } from "../constants";

// utils
import {
  isLightColor,
  hexToRgba,
  generateHigherContrastColor,
  isNilOrEmpty,
} from "../utils";

// types
interface NoteProps extends NoteDefault {
  onTextChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  style?: React.CSSProperties;
}

const Note: React.FC<NoteProps> = ({
  text,
  color,
  id,
  highlighted,
  onDelete,
  onTextChange,
  style,
}): React.ReactElement => {
  const title: string = NOTES_LABELS.note(id);

  // Function to determine if a color is light or dark
  const textColor = isLightColor(color) ? "#000000" : "#ffffff";
  const rgbaColor: { r: number; g: number; b: number; a: number } | null =
    hexToRgba(textColor, 0.3);

  const contrastColor = useMemo(() => {
    return !isNilOrEmpty(color) ? generateHigherContrastColor(color) : null;
  }, [color]);

  return (
    <Card
      id={`note-${id}-0`}
      sx={{
        backgroundColor: color,
        color: textColor,
        border: `1px solid ${contrastColor}`,
      }}
      onMouseOver={(e) => {
        if (contrastColor) {
          const thisEl = e.currentTarget;
          if (!isNilOrEmpty(contrastColor) && !isNilOrEmpty(thisEl)) {
            thisEl.style.backgroundColor = contrastColor;
          }
        }
      }}
      onMouseOut={(e) => {
        if (contrastColor) {
          const thisEl = e.currentTarget;
          thisEl.style.backgroundColor = color;
        }
      }}
      style={style}
      className="note shadow-sm!"
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
              <GradeIcon sx={{ color: "#ffffff" }} />
            </Box>
          ) : null
        }
      />
      <CardContent className="note-content">
        <NoteContent text={text} onTextChange={onTextChange} id={id} />
      </CardContent>
      <CardActions className="flex justify-end">
        <DeleteNote
          onDeleteNote={() => onDelete(id)}
          textColor={textColor}
          id={id}
        />
      </CardActions>
    </Card>
  );
};
export default Note;
