import React, { useState, useRef } from "react";

// mui
import { Box, Typography, Switch } from "@mui/material";

// components
import ColorPickerWithoutColor from "./ColorPickerWithoutColor";

// utils
import { debounce } from "../utils";

// constants
import { NOTES_LABELS, NOTE_COLORS } from "../constants";

// types
interface SettingsOfNoteProps {
  isHtmlContent?: boolean;
  noteColor?: string;
  onHtmlContentChange?: (isHtml: boolean) => void;
  onColorChange?: (color: string) => void;
}

const SettingsOfNote: React.FC<SettingsOfNoteProps> = ({
  isHtmlContent = false,
  noteColor = NOTE_COLORS[0],
  onHtmlContentChange = () => {},
  onColorChange = () => {},
}): React.ReactElement => {
  const [isHtml, setIsHtml] = useState<boolean>(isHtmlContent);
  const [selectedColor, setSelectedColor] = useState<string>(noteColor);

  const debounceColorChange = useRef(
    debounce((value: string) => {
      setSelectedColor(value);
      onColorChange(value);
    }, 1000),
  ).current;

  const handleHtmlToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsHtml(newValue);
    onHtmlContentChange(newValue);
  };

  const handleColorClick = (color: string) => {
    debounceColorChange(color);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: { sm: 500, xs: "100%" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
        }}
      >
        <Box className="note-html-changer flex flex-col gap-2">
          <Typography variant="subtitle1">
            {NOTES_LABELS.enableRichTextContent}:
          </Typography>
          <Typography variant="subtitle2">
            {NOTES_LABELS.enableRichTextContentDescription}
          </Typography>
          <Switch checked={isHtml} onChange={handleHtmlToggle} />
        </Box>

        <Box className="note-color-picker flex flex-col gap-2">
          <Typography variant="subtitle1">{NOTES_LABELS.noteColor}:</Typography>
          <Typography variant="subtitle2">
            {NOTES_LABELS.noteColorDescription}
          </Typography>
          <ColorPickerWithoutColor
            color={selectedColor}
            changeColorFromProps={true}
            onClick={(customColor: string = "") =>
              handleColorClick(customColor)
            }
            triggerOnClick={false}
            iconFontSize="medium"
            className="w-10! h-10!"
            iconClass="w-4! h-4!"
            inputClass="w-10! h-10!"
          />
        </Box>
      </Box>
    </Box>
  );
};
export default SettingsOfNote;
