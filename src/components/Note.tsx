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

// types
import type { NoteDefault } from "../types";

// components
import NoteContent from "./NoteContent";

// types
interface NoteProps extends NoteDefault {
  onTextChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

const Note: React.FC<NoteProps> = ({
  text,
  color,
  id,
  onDelete,
  onTextChange,
}): React.ReactElement => {
  const title: string = `Note #${id}`;

  return (
    <Card sx={{ backgroundColor: color }} className="note">
      <CardHeader
        title={<Typography variant="subtitle1">{title}</Typography>}
      />
      <CardContent className="note-content">
        <NoteContent text={text} onTextChange={onTextChange} id={id} />
      </CardContent>
      <CardActions className="flex justify-end">
        <IconButton aria-label="delete note" onClick={() => onDelete(id)}>
          <DeleteForeverIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
export default Note;
