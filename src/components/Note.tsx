import React, { useEffect, useMemo } from "react";

// mui
import { Card, CardContent, Box, Tooltip } from "@mui/material";

// mui icons
import SwitchAccessShortcutIcon from "@mui/icons-material/SwitchAccessShortcut";
import StarsIcon from "@mui/icons-material/Stars";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";

// types
import type { NoteProps } from "../types";

// components
import NoteContent from "./NoteContent";
import DeleteNote from "./DeleteNote";
import NoteBottomBar from "./NoteBottomBar";
import NoteSettings from "./NoteSettings";
import NoteTitle from "./NoteTitle";
import ToggleNote from "./ToggleNote";

// constants
import { NOTE_COLORS, NOTES_LABELS } from "../constants";

// utils
import {
  isLightColor,
  generateHigherContrastColor,
  isNilOrEmpty,
  hexToRgb,
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
  collapsed = false,
  createdAt,
  updatedAt,
  onToggleCollapsed = () => {},
}): React.ReactElement => {
  const [overlayColor, setOverlayColor] = React.useState<string>("");
  const HEADER_PADDING_TOP_CLASS = collapsed ? "p-4" : "px-4 pt-4 pb-0";
  const ALPHA_OVERLAY = 0.5;

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

  const handleOnToggleCollapsed = (noteId: string) => {
    onToggleCollapsed(noteId);
  };

  const generateOverlayColor = (
    currentColor: string = "",
    alpha: number = 0.4,
  ) => {
    const {
      r = 0,
      g = 0,
      b = 0,
    } = hexToRgb(currentColor) || { r: 0, g: 0, b: 0 };

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  useEffect(() => {
    if (!isNilOrEmpty(contrastColor) && contrastColor) {
      setOverlayColor(generateOverlayColor(contrastColor, ALPHA_OVERLAY));
    }
  }, [contrastColor]);

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
          if (
            !isNilOrEmpty(contrastColor) &&
            !isNilOrEmpty(thisEl) &&
            contrastColor
          ) {
            thisEl.style.backgroundColor = contrastColor;
            setOverlayColor(generateOverlayColor(color, ALPHA_OVERLAY));
          }
        }
      }}
      onMouseOut={(e) => {
        if (contrastColor) {
          const thisEl = e.currentTarget;
          thisEl.style.backgroundColor = color;
          setOverlayColor(generateOverlayColor(contrastColor, ALPHA_OVERLAY));
        }
      }}
      style={style}
      className="note shadow-sm!"
    >
      <Box
        className={`${HEADER_PADDING_TOP_CLASS} flex items-center justify-between gap-2`}
      >
        <NoteTitle
          title={title}
          id={id}
          textColor={textColor}
          disabled={isTitleDisabled}
          onEditSaveTitle={onEditSaveTitle}
        />
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
      </Box>
      {!collapsed && (
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
      )}
      <Box
        className={`p-4 flex items-center justify-between gap-2`}
        style={{ backgroundColor: overlayColor }}
      >
        <Box sx={{ fontSize: "0.75rem", opacity: 0.8, lineHeight: 1.6 }}>
          {createdAt && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AddCircleOutlineIcon sx={{ fontSize: "0.875rem" }} />
              <Box component="span" sx={{ fontWeight: 600 }}>
                {NOTES_LABELS.createdAt}
              </Box>
              <Box component="span">{new Date(createdAt).toLocaleString()}</Box>
            </Box>
          )}
          {updatedAt && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <UpdateOutlinedIcon sx={{ fontSize: "0.875rem" }} />
              <Box component="span" sx={{ fontWeight: 600 }}>
                {NOTES_LABELS.updatedAt}
              </Box>
              <Box component="span">{new Date(updatedAt).toLocaleString()}</Box>
            </Box>
          )}
        </Box>
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
            <ToggleNote
              id={id}
              isToggled={collapsed}
              onClick={() => console.log("Settings clicked")}
              onToggle={handleOnToggleCollapsed}
            />,
            <DeleteNote id={id} onDeleteNote={() => onDelete(id)} />,
          ]}
        />
      </Box>
    </Card>
  );
};
export default Note;
