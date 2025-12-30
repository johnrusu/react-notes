import { pathOr } from "ramda";

const BASE_NAME = pathOr("", ["VITE_BASE_NAME"], import.meta.env) as string;

// Normalize BASE_NAME: ensure no leading or trailing slashes
export const normalizedBaseName = BASE_NAME.replace(/^\/+|\/+$/g, "");
