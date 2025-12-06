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

// Validate Auth0 configuration
if (!VITE_AUTH0_DOMAIN || VITE_AUTH0_DOMAIN.trim() === "") {
  throw new Error(
    "Auth0 configuration error: VITE_AUTH0_DOMAIN environment variable is required but not set or is empty. Please set it in your .env file.",
  );
}

if (!VITE_AUTH0_CLIENT_ID || VITE_AUTH0_CLIENT_ID.trim() === "") {
  throw new Error(
    "Auth0 configuration error: VITE_AUTH0_CLIENT_ID environment variable is required but not set or is empty. Please set it in your .env file.",
  );
}

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={VITE_AUTH0_DOMAIN}
    clientId={VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: `${window.location.origin}${BASE_NAME}`,
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
  >
    <Provider store={store}>
      <StrictMode>
        <BrowserRouter basename={`/${BASE_NAME.replace(/\/$/, "")}`}>
          <App />
        </BrowserRouter>
      </StrictMode>
    </Provider>
  </Auth0Provider>,
);
