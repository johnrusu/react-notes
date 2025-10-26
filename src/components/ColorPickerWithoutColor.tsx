import React, { useState, useCallback } from "react";

// mui
import { Box } from "@mui/material";

// types
import type { ColorPickerProps } from "../types";

// mui icons
import ColorizeIcon from "@mui/icons-material/Colorize";

const ColorPickerWithoutColor: React.FC<ColorPickerProps> = ({
  onClick,
  color,
}): React.ReactElement => {
  const [pickerColor, setPickerColor] = useState<string>("");

  const handleColorChange = useCallback(
    (newColor: string) => {
      setPickerColor(newColor);
      onClick(newColor);
    },
    [onClick],
  );

  return (
    <Box
      className={`color-picker custom-color relative ${color === pickerColor ? "selected" : ""}`}
      style={{ backgroundColor: pickerColor }}
      onClick={() => (pickerColor ? onClick(pickerColor) : null)}
    >
      <>
        <ColorizeIcon
          fontSize="large"
          className="z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <input
          type="color"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleColorChange(e.target.value)
          }
          value={pickerColor}
          className="absolute w-15 h-15 rounded-full z-11 opacity-0 cursor-pointer"
        />
      </>
    </Box>
  );
};

export default ColorPickerWithoutColor;
