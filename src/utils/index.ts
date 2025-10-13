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
      // @ts-ignore
      const setObj = new Set(arr.map(JSON.stringify));
      if (!isNilOrEmpty(setObj)) {
        // @ts-ignore
        return Array.from(setObj).map(JSON.parse);
      }
    } catch (err) {}
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
    } catch (err) {
      return false;
    }
  })(value);
  return is(Object, stringIsObject) ? true : false;
};
