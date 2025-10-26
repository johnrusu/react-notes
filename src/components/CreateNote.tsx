import { useState } from "react";
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

// utils
import { isArrayNotEmpty } from "../utils";

const CreateNote: React.FC<CreateNoteProps> = (props) => {
  const onNoteAdd: (note: NoteDefault) => void = pathOr(
    () => {},
    ["onNoteAdd"],
    props,
  );
  const [color, setColor] = useState<string>(NOTE_COLORS[0]);

  const handelNoteAdd = () => {
    onNoteAdd({ ...NOTE_DEFAULT, color });
  };

  return isArrayNotEmpty(NOTE_COLORS) ? (
    <Box className="create-note">
      <AddNote onNoteAdd={handelNoteAdd} />
      <Box>
        {NOTE_COLORS.map((noteColor: string, noteColorIndex: number) => (
          <ColorPicker
            key={`color-picker-${noteColorIndex}`}
            color={noteColor}
            isSelected={color === noteColor}
            onClick={() => setColor(noteColor)}
          />
        ))}
        <ColorPickerWithoutColor
          onClick={(customColor: string = "") => setColor(customColor)}
          color={color}
        />
      </Box>
    </Box>
  ) : null;
};
export default CreateNote;
