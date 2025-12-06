import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import "./assets/css/index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

import { pathOr } from "ramda";

const VITE_AUTH0_DOMAIN = pathOr("", ["VITE_AUTH0_DOMAIN"], import.meta.env);
const VITE_AUTH0_CLIENT_ID = pathOr(
  "",
  ["VITE_AUTH0_CLIENT_ID"],
  import.meta.env,
);
const BASE_NAME = pathOr("", ["VITE_BASE_NAME"], import.meta.env);

// Validate required Auth0 environment variables
if (!VITE_AUTH0_DOMAIN || !VITE_AUTH0_CLIENT_ID) {
  const missingVars = [];
  if (!VITE_AUTH0_DOMAIN) missingVars.push("VITE_AUTH0_DOMAIN");
  if (!VITE_AUTH0_CLIENT_ID) missingVars.push("VITE_AUTH0_CLIENT_ID");
  throw new Error(
    `Missing required Auth0 environment variables: ${missingVars.join(", ")}. ` +
      `Please ensure these variables are set in your environment configuration.`,
  );
}

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={VITE_AUTH0_DOMAIN || ""}
    clientId={VITE_AUTH0_CLIENT_ID || ""}
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
