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
import { path } from "ramda";

const Note: React.FC<
  NoteDefault & { onDelete: (id: string) => void } & {
    style: React.CSSProperties;
  }
> = ({ text, color, id, onDelete, style }): React.ReactElement => {
  const title: string = `Note #${id}`;
  const styleProps = path(["style"], { style }) || {};
  return (
    <Card sx={{ backgroundColor: color, ...styleProps }} className="note">
      <CardHeader title={title} />
      <CardContent className="note-content">
        <Typography variant="body2">{text}</Typography>
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
