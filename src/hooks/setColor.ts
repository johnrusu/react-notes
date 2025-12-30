import { useState } from "react";

const useColor = (color: string) => {
  const [currentColor, setCurrentColor] = useState<string>(color);
  return {
    currentColor,
    setCurrentColor,
  };
};

export { useColor };
