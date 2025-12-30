import { useEffect, useState } from "react";

// utils
import {
  generateHigherContrastColor,
  getElementStyle,
  rgbToHex,
  rgbaStringToObject,
  compareHexColors,
} from "../utils";

const useChangedColor = (color: string, querySelectorName: string): string => {
  const [changedColor, setChangedColor] = useState<string>(color);

  const getElementBackgroundColor = (element: HTMLElement): string => {
    return getElementStyle(element, "background-color");
  };

  useEffect(() => {
    const checkAndUpdateColor = () => {
      const element = document.querySelector(querySelectorName) as HTMLElement;
      if (!element) return;

      const bgColor = getElementBackgroundColor(element) || "#ffffff";

      // Always update the background color state
      const bgRgba = rgbaStringToObject(bgColor);
      const noteRgba = bgRgba
        ? rgbToHex(bgRgba.r, bgRgba.g, bgRgba.b)
        : "#ffffff";
      const isSameColor = compareHexColors(noteRgba, color);

      if (isSameColor) {
        const newColor = generateHigherContrastColor(color);
        console.log(
          "Color matches background, generating new color:",
          newColor,
        );
        setChangedColor(newColor);
      } else {
        // If colors are different, use the original color
        console.log("Color doesn't match background, using original:", color);
        setChangedColor(color);
      }
    };

    // Initial check
    checkAndUpdateColor();

    // Set up an observer to watch for theme changes
    const observer = new MutationObserver(() => {
      // Add a small delay to ensure CSS has been applied
      setTimeout(checkAndUpdateColor, 10);
    });

    // Watch for class changes on notes-container where theme changes occur
    const notesContainer = document.querySelector(".notes-container");
    if (notesContainer) {
      observer.observe(notesContainer, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    // Also watch body and html as fallback
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    // Also watch the target element if it exists
    const targetElement = document.querySelector(querySelectorName);
    if (targetElement) {
      observer.observe(targetElement, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    return () => observer.disconnect();
  }, [color, querySelectorName]);

  return changedColor;
};

export default useChangedColor;
