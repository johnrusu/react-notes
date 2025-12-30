import React, { useMemo } from "react";

// mui
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Box,
  Tooltip,
} from "@mui/material";

// mui icons
import SwitchAccessShortcutIcon from "@mui/icons-material/SwitchAccessShortcut";
import StarsIcon from "@mui/icons-material/Stars";

// types
import type { NoteProps } from "../types";

// components
import NoteContent from "./NoteContent";
import DeleteNote from "./DeleteNote";
import NoteBottomBar from "./NoteBottomBar";
import NoteSettings from "./NoteSettings";
import NoteTitle from "./NoteTitle";

// constants
import { NOTE_COLORS, NOTES_LABELS } from "../constants";

// utils
import {
  isLightColor,
  generateHigherContrastColor,
  isNilOrEmpty,
} from "../utils";

const Note: React.FC<NoteProps> = ({
  text,
  title: initialTitle = "",
  color,
  id,
  highlighted,
  onDelete,
  onEditSaveTitle = () => {},
  isTitleDisabled = false,
  onTextChange = () => {},
  setNoteHeight = () => {},
  style,
  height,
  onToggleHighlightedNote = () => {},
  onHtmlContentChange = () => {},
  onColorChange = () => {},
  isHtml = false,
  noteColor = NOTE_COLORS[0],
}): React.ReactElement => {
  const title: string = !isNilOrEmpty(initialTitle)
    ? initialTitle
    : NOTES_LABELS.note(id);

  // Function to determine if a color is light or dark
  const textColor = isLightColor(color) ? "#000000" : "#ffffff";

  const contrastColor = useMemo(() => {
    return !isNilOrEmpty(color) ? generateHigherContrastColor(color) : null;
  }, [color]);

  const icon = highlighted ? (
    <StarsIcon fontSize="large" />
  ) : (
    <SwitchAccessShortcutIcon fontSize="large" />
  );

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
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
        title={
          <NoteTitle
            title={title}
            id={id}
            textColor={textColor}
            disabled={isTitleDisabled}
            onEditSaveTitle={onEditSaveTitle}
          />
        }
        action={
          <Tooltip title={NOTES_LABELS.toggleHighlight} arrow>
            <Box
              onClick={onToggleHighlightedNote.bind(null, id)}
              sx={{
                cursor: "pointer",
              }}
            >
              {icon}
            </Box>
          </Tooltip>
        }
      />
      <CardContent className="note-content">
        <NoteContent
          text={text}
          height={height as number}
          onTextChange={onTextChange}
          id={id}
          setNoteHeight={setNoteHeight}
          isHtml={isHtml}
        />
      </CardContent>
      <CardActions className="relative min-h-16">
        <NoteBottomBar
          textColor={textColor}
          menuItems={[
            <NoteSettings
              id={id}
              onClick={() => console.log("Settings clicked")}
              onHtmlContentChange={onHtmlContentChange}
              onColorChange={onColorChange}
              isHtmlContent={isHtml}
              noteColor={noteColor}
            />,
            <DeleteNote id={id} onDeleteNote={() => onDelete(id)} />,
          ]}
        />
      </CardActions>
    </Card>
  );
};
export default Note;
