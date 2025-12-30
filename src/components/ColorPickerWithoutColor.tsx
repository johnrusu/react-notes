import React, { useState, useCallback } from "react";

// mui
import { Box } from "@mui/material";

// types
import type { ColorPickerProps } from "../types";

// mui icons
import ColorizeIcon from "@mui/icons-material/Colorize";

const ColorPickerWithoutColor: React.FC<ColorPickerProps> = ({
  changeColorFromProps = false,
  triggerOnClick = true,
  onClick,
  color,
  iconClass = "",
  inputClass = "",
  iconFontSize = "large",
  className = "",
  ...restOfProps
}): React.ReactElement => {
  const [pickerColor, setPickerColor] = useState<string>(
    changeColorFromProps ? color : "#000000",
  );

  const handleColorChange = useCallback(
    (newColor: string) => {
      setPickerColor(newColor);
      onClick(newColor);
    },
    [onClick],
  );

  const iconClasses = `z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white ${iconClass}`;
  const inputClasses = `absolute w-15 h-15 rounded-full z-11 opacity-0 cursor-pointer ${inputClass}`;

  return (
    <Box
      className={`color-picker custom-color relative ${color === pickerColor ? "selected" : ""} ${className}`}
      style={{ backgroundColor: pickerColor }}
      onClick={
        triggerOnClick
          ? () => (pickerColor ? onClick(pickerColor) : null)
          : undefined
      }
      {...restOfProps}
    >
      <>
        <ColorizeIcon fontSize={iconFontSize} className={iconClasses} />
        <input
          type="color"
          name="color-picker-input"
          aria-label="color-picker-input"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleColorChange(e.target.value)
          }
          value={pickerColor}
          className={inputClasses}
        />
      </>
    </Box>
  );
};

export default ColorPickerWithoutColor;
