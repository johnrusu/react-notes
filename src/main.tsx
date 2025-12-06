import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import "./assets/css/index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

import { pathOr } from "ramda";

const VITE_AUTH0_DOMAIN = pathOr(
  "",
  ["VITE_AUTH0_DOMAIN"],
  import.meta.env,
) as string;
const VITE_AUTH0_CLIENT_ID = pathOr(
  "",
  ["VITE_AUTH0_CLIENT_ID"],
  import.meta.env,
) as string;
const BASE_NAME = pathOr("", ["VITE_BASE_NAME"], import.meta.env) as string;

// Normalize BASE_NAME: ensure no leading or trailing slashes
const normalizedBaseName = BASE_NAME.replace(/^\/+|\/+$/g, "");

// Helper function to build full URL with base path
const buildFullUrl = (basePath: string): string => {
  return `${window.location.origin}${basePath ? `/${basePath}` : ""}`;
};

// Helper function to build router basename
const buildRouterBasename = (basePath: string): string => {
  return basePath ? `/${basePath}` : "/";
};

// Helper function to validate required environment variables
const isEmptyOrWhitespace = (value: string): boolean => {
  return !value || value.trim() === "";
};

// Validate Auth0 configuration
if (isEmptyOrWhitespace(VITE_AUTH0_DOMAIN)) {
  throw new Error(
    "Auth0 configuration error: VITE_AUTH0_DOMAIN environment variable is required but not set or is empty. Please set it in your .env file.",
  );
}

if (isEmptyOrWhitespace(VITE_AUTH0_CLIENT_ID)) {
  throw new Error(
    "Auth0 configuration error: VITE_AUTH0_CLIENT_ID environment variable is required but not set or is empty. Please set it in your .env file.",
  );
}

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={VITE_AUTH0_DOMAIN}
    clientId={VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: buildFullUrl(normalizedBaseName),
    }}
    // Note: Using localStorage for token storage provides convenience but is vulnerable to XSS attacks.
    // Ensure comprehensive XSS protection measures are in place throughout the application.
    cacheLocation="localstorage"
    useRefreshTokens={true}
  >
    <Provider store={store}>
      <StrictMode>
        <BrowserRouter basename={buildRouterBasename(normalizedBaseName)}>
          <App />
        </BrowserRouter>
      </StrictMode>
    </Provider>
  </Auth0Provider>,
);
