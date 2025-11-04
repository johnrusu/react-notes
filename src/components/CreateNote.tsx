import React from "react";
import { pathOr } from "ramda";

// mui
import { Box } from "@mui/material";

// types
import type { CreateNoteProps, NoteDefault } from "../types";

// components
import ColorPicker from "./ColorPicker";
import ColorPickerWithoutColor from "./ColorPickerWithoutColor";
import AddNote from "./AddNote";

// constants
import { NOTE_COLORS, NOTE_DEFAULT } from "../constants";

// hooks
import { useColor } from "../hooks/setColor";

// utils
import { isArrayNotEmpty } from "../utils";

const CreateNote: React.FC<CreateNoteProps> = (props) => {
  const { currentColor, setCurrentColor } = useColor(NOTE_COLORS[0]);

  const onNoteAdd: (note: NoteDefault) => void = pathOr(
    () => {},
    ["onNoteAdd"],
    props,
  );
  const onNoteHightlightedNote: (note: NoteDefault) => void = pathOr(
    () => {},
    ["onNoteHightlightedNote"],
    props,
  );

  const handelNoteAdd = () => {
    const color: string = currentColor;
    onNoteAdd({ ...NOTE_DEFAULT, color, highlighted: false });
  };

  const handelHighlightedNoteAdd = () => {
    const color: string = currentColor;
    onNoteHightlightedNote({
      ...NOTE_DEFAULT,
      color,
      highlighted: true,
    });
  };

  const handleSetColor = (noteColor: string) => {
    setCurrentColor(noteColor);
  };

  return isArrayNotEmpty(NOTE_COLORS) ? (
    <Box className="create-note">
      <AddNote
        onNoteAdd={handelNoteAdd}
        onNoteHightlightedNote={handelHighlightedNoteAdd}
      />
      <Box>
        {NOTE_COLORS.map((noteColor: string, noteColorIndex: number) => (
          <ColorPicker
            key={`color-picker-${noteColorIndex}`}
            color={noteColor}
            isSelected={currentColor === noteColor}
            onClick={() => handleSetColor(noteColor)}
          />
        ))}

        <ColorPickerWithoutColor
          onClick={(customColor: string = "") => handleSetColor(customColor)}
          color={currentColor as string}
        />
      </Box>
    </Box>
  ) : null;
};
export default CreateNote;
