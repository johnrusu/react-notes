import React from "react";

// mui
import { Box } from "@mui/material";

// types
import type { ColorPickerProps } from "../types";

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  isSelected,
  onClick,
}): React.ReactElement => {
  return (
    <Box
      className={`color-picker ${isSelected ? "selected" : ""}`}
      sx={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
};
export default ColorPicker;
