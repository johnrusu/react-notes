// validation tools
import { anyPass, has, is, isEmpty, isNil } from "ramda";

export { isEmpty, anyPass, isNil, is };

/**
 * Checks if an object has a specific property
 *
 * @param {Object} object  - the object to be verified
 * @param {String} property - the string property of the object
 * @returns {Boolean} - true or false depending on the condition
 */
export const checkObjectProperty = (
  object: { [key: string]: unknown },
  property: string,
): unknown | undefined => {
  return object && has(property, object) ? object[property] : undefined;
};

/**
 * Checks if array is not empty
 *
 * @param {Array} value - the array argument
 * @returns {Boolean} - false or true, depending on the value of the array
 */
export const isArrayNotEmpty = (array: unknown[]): boolean =>
  !isNilOrEmpty(array) && Array.isArray(array) && array.length > 0;

/**
 * Returns `true` if the given value is its type's empty value, `null` or `undefined`.
 *
 * @func isNilOrEmpty
 * @memberOf Validator
 * @category Validator
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link http://ramdajs.com/docs/#isEmpty|isEmpty}, {@link http://ramdajs.com/docs/#isNil|isNil}
 * @example
 *
 * Validator.isNilOrEmpty([1, 2, 3]); //=> false
 * Validator.isNilOrEmpty([]); //=> true
 * Validator.isNilOrEmpty(''); //=> true
 * Validator.isNilOrEmpty(null); //=> true
 * Validator.isNilOrEmpty(undefined): //=> true
 * Validator.isNilOrEmpty({}); //=> true
 * Validator.isNilOrEmpty({length: 0}); //=> false
 */
export const isNilOrEmpty = anyPass([isNil, isEmpty]);

/**
 * Checks if all props in a object exists in another
 * @param {Object} objModel
 * @param {Object} objToCompare
 * @return {Boolean} - true of false depending on the condition
 */
export const allObjectPropsExists = (
  objModel: object = {},
  objToCompare: object = {},
): boolean => {
  return (
    is(Object, objModel) &&
    is(Object, objToCompare) &&
    Object.keys(objModel).every((key) => has(key, objToCompare))
  );
};

/**
 * Generates a random string based of a number
 *
 * @param {number} length  - length of a string
 * @returns {string} - the string based on the number
 */
export const randomString = (length?: number): string => {
  length = !isNilOrEmpty(length) && length ? length : 8;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength)),
    );
  }
  return result.join("");
};

/**
 * Capitalize first letter of a string
 *
 * @param {string} string - string to be capitalize
 * @returns string
 */
export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Copies the window url to the clipboard
 *
 * @returns {boolean} - returns true / false depending on the browser capabilities
 */
export const copyUrl = () => {
  const url = window.location.href;
  if (!isNilOrEmpty(url)) {
    navigator.clipboard.writeText(url);
    return true;
  }
  return false;
};

/**
 * Converts a camel case to underscore case
 *
 * @param {string} string - string to be converted
 * @returns {string}  - converted string
 */
export const camelToUnderscore = (string: string): string =>
  !isNilOrEmpty(string)
    ? string
        .split(/\.?(?=[A-Z])/)
        .join("_")
        .toLowerCase()
    : string;

/**
 * Converst snake case to camel case
 * @param {string} str  - string to be converted to camel case
 * @returns {string}  - a camel case string
 */
export const snakeToCamel = (str: string = ""): string =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", ""),
    );
/**
 * Formats a string to be a friendly slugify
 *
 * @param {string} str - string to be formated to slugify
 * @returns {string} - slugify string
 */
export const slugify = (str: string = ""): string => {
  return String(str)
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
};

/**
 * Scroll to an element
 *
 * @param {string} elementIdentifier  - id or class
 * @returns {void}
 */
export const scrollToElement = (element: Element): void => {
  if (!isNilOrEmpty(element)) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }
};

/**
 * Check for an element to be observable using MutationObserver
 *
 * @param {string} selector  - id or class
 * @returns {object} - returns the element
 */
export const waitForElm = (selector: string): Promise<unknown> => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, { childList: true, subtree: true });
  });
};
/**
 * Removes the object duplicates from an array
 *
 * @param {array} arr  - array to scan for duplicates
 * @returns {array} - returns an array of non duplicate objects
 */
export const removeArrObjectsDuplicates = (arr: unknown[] = []): unknown[] => {
  if (isArrayNotEmpty(arr)) {
    try {
      const setObj = new Set(arr.map((item) => JSON.stringify(item)));
      if (!isNilOrEmpty(setObj)) {
        return Array.from(setObj).map((item) => JSON.parse(item));
      }
    } catch (err) {
      console.error(err);
    }
  }
  return arr;
};

/**
 * Checks if a string is a valid json
 *
 * @param {string} value - string to be validated
 * @returns {boolean} - returns bool if a string is a valid json
 */
export const isValidJSON = (value: string = ""): boolean => {
  const stringIsObject = (function (value: string) {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(error);
      return false;
    }
  })(value);
  return is(Object, stringIsObject) ? true : false;
};

/**
 * Checks if a hex color is light or dark
 * @param {string} hexColor - hex color string
 * @returns {boolean} - true if light, false if dark
 *
 * @example
 * isLightColor("#FFFFFF"); // returns true
 * isLightColor("#000000"); // returns false
 */
export const isLightColor = (hexColor: string): boolean => {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if light (luminance > 0.5)
  return luminance > 0.5;
};

export const hexToRgb = (
  hex: string,
): { r: number; g: number; b: number } | null => {
  // Remove the leading '#' if present
  const cleanedHex = hex.replace(/^#/, "");
  // Check for shorthand hex format (e.g., #03F)
  const fullHex =
    cleanedHex.length === 3
      ? cleanedHex
          .split("")
          .map((char) => char + char)
          .join("")
      : cleanedHex;
  // Ensure the hex code is valid
  if (!/^([0-9A-Fa-f]{6})$/.test(fullHex)) {
    return null;
  }
  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);
  return { r, g, b };
};

export const hexToRgba = (
  hex: string,
  alpha: number,
): { r: number; g: number; b: number; a: number } | null => {
  const rgb = hexToRgb(hex);
  return rgb ? { ...rgb, a: alpha } : null;
};

export const stringToJSON = (str: string): object | false | null => {
  try {
    const obj = JSON.parse(str);
    return is(Object, obj) ? obj : null;
  } catch (error) {
    console.error("Invalid JSON string:", error);
    return false;
  }
};

/**
 * Converts RGB values to hex string
 *
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} - Hex color string
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Generates a color with slightly higher contrast than the original
 * For light colors, it makes them darker; for dark colors, it makes them lighter
 *
 * @param {string} hexColor - The original hex color (e.g., "#ff0000")
 * @param {number} contrastAmount - Amount of contrast to add (0-1, default: 0.15)
 * @returns {string} - New hex color with higher contrast
 */
export const generateHigherContrastColor = (
  hexColor: string,
  contrastAmount: number = 0.15,
): string => {
  const rgb = hexToRgb(hexColor);

  if (!rgb) {
    console.warn(`Invalid hex color: ${hexColor}`);
    return hexColor; // Return original if invalid
  }

  const { r, g, b } = rgb;

  // Check if the color is light or dark
  const isLight = isLightColor(hexColor);

  // Calculate the contrast adjustment
  const adjustment = contrastAmount * 255;

  let newR: number, newG: number, newB: number;

  if (isLight) {
    // For light colors, make them darker
    newR = Math.max(0, r - adjustment);
    newG = Math.max(0, g - adjustment);
    newB = Math.max(0, b - adjustment);
  } else {
    // For dark colors, make them lighter
    newR = Math.min(255, r + adjustment);
    newG = Math.min(255, g + adjustment);
    newB = Math.min(255, b + adjustment);
  }

  return rgbToHex(newR, newG, newB);
};

const getElementStyle = (element: HTMLElement, styleProp: string): string => {
  return window.getComputedStyle(element).getPropertyValue(styleProp);
};

export { getElementStyle };

const rgbaStringToObject = (
  rgbaString: string,
): { r: number; g: number; b: number; a: number } | null => {
  const regex =
    /rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)/i;
  const matches = rgbaString.match(regex);
  if (matches) {
    const r = parseInt(matches[1], 10);
    const g = parseInt(matches[2], 10);
    const b = parseInt(matches[3], 10);
    const a = matches[4] !== undefined ? parseFloat(matches[4]) : 1;
    return { r, g, b, a };
  }
  return null;
};

const rgbaToHex = (r: number, g: number, b: number, a: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  const alpha = Math.round(a * 255);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`;
};

const compareHexColors = (hex1: string, hex2: string): boolean => {
  const normalizeHex = (hex: string) => {
    let cleanedHex = hex.replace("#", "");
    if (cleanedHex.length === 3) {
      cleanedHex = cleanedHex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    return cleanedHex.toLowerCase();
  };
  return normalizeHex(hex1) === normalizeHex(hex2);
};

export { rgbaToHex, rgbaStringToObject, compareHexColors };

/**
 * Checks if an image URL is valid and loads successfully
 * @param imageSrc - The source URL of the image
 * @returns A promise that resolves with the HTMLImageElement if successful, or null if the source is empty
 */
export const checkImage = (
  imageSrc: string = "",
  retries: number = 3,
  delay: number = 1000,
): Promise<HTMLImageElement | null> => {
  if (isNilOrEmpty(imageSrc)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve, reject) => {
    const attemptLoad = (attemptsLeft: number, attemptNumber: number) => {
      const image = new Image();
      image.crossOrigin = "anonymous";

      image.onload = () => {
        // Clean up handlers to avoid memory leaks
        image.onload = null;
        image.onerror = null;
        resolve(image);
      };

      image.onerror = () => {
        if (attemptsLeft > 0) {
          attemptsLeft -= 1;
          console.warn(
            `Image load failed, retrying... (${attemptsLeft} attempts left)`,
          );
          setTimeout(() => {
            attemptLoad(attemptsLeft, attemptNumber + 1);
          }, delay * attemptNumber); // Linear backoff
        } else {
          // Clean up handlers to avoid memory leaks
          image.onload = null;
          image.onerror = null;
          reject(new Error("could not load image after retries"));
        }
      };

      image.src = imageSrc;
    };
    attemptLoad(retries, 1);
  });
};

/**
 * Helper function to build full URL with base path
 * @param basePath - The base path to append to the origin
 * @returns The full URL with base path
 */
export const buildFullUrl = (basePath: string): string => {
  return `${window.location.origin}${basePath ? `/${basePath}` : ""}`;
};

/**
 * Helper function to build router basename
 * @param basePath - The base path for the router
 * @returns The router basename
 */
export const buildRouterBasename = (basePath: string): string => {
  return basePath ? `/${basePath}` : "/";
};

/**
 * Debounces a function, delaying its execution until after a specified wait time
 * @param func - The function to debounce
 * @param waitFor - The amount of time to wait before executing the function
 * @returns A debounced version of the original function
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
) => {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
};
