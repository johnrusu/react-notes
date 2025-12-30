import React from "react";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";

// mui
import { Box } from "@mui/material";

// types
import type { CreateNoteProps, NoteDefault } from "../types";
import type { RootState } from "@/store/store";

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
  const isLoadingProp: boolean = pathOr(false, ["isLoading"], props);
  const isLoading =
    useSelector((state: RootState) => state.notes.isLoading) || isLoadingProp;
  const { currentColor, setCurrentColor } = useColor(NOTE_COLORS[0]);

  const onNoteAdd: (note: NoteDefault) => void = pathOr(
    () => {},
    ["onNoteAdd"],
    props,
  );
  const onNoteHighlightedNote: (note: NoteDefault) => void = pathOr(
    () => {},
    ["onNoteHighlightedNote"],
    props,
  );

  const handelNoteAdd = () => {
    const color: string = currentColor;
    onNoteAdd({ ...NOTE_DEFAULT, color, highlighted: false });
  };

  const handelHighlightedNoteAdd = () => {
    const color: string = currentColor;
    onNoteHighlightedNote({
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
        onNoteHighlightedNote={handelHighlightedNoteAdd}
        disabled={isLoading}
      />
      <Box className="color-pickers-container">
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
