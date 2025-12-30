import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { pathOr, is } from "ramda";

import {
  ThemeProvider,
  createTheme,
  type PaletteMode,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// mui
import { Box, Snackbar, Alert, Typography } from "@mui/material";

// utils
import { stringToJSON, buildFullUrl } from "./utils";

// config
import { normalizedBaseName } from "./config";

// constants
import { NOTES_LABELS, THEMES } from "./constants/index";

// components
import { Header, ProtectedRoute, Footer } from "./components";

// pages
import Home from "./pages/Home";
import Account from "./pages/Account";
import About from "./pages/About";

// state
import { createTheme as createThemeAction } from "@/features/themeSlice";
import { setTheme } from "./features/themeSlice";
import { fetchNotes } from "./features/notesSlice";

// types
import type { RootState } from "./store/store";

// hooks
import { isNilOrEmpty } from "./utils";
import useStorage from "./hooks/useStorage";
import { useAuth0 } from "@auth0/auth0-react";
import { useLoading } from "./contexts/LoadingContext.hooks";

// services
import {
  createOrUpdateUser as apiCreateOrUpdateUser,
  getTheme,
} from "./services/";

const convertedStoredTheme = (storageTheme: string = ""): object | null => {
  let parsedTheme = stringToJSON(storageTheme);
  if (parsedTheme === false) return null;
  if (parsedTheme === null) {
    parsedTheme = stringToJSON(storageTheme);
  }
  return !isNilOrEmpty(parsedTheme) && is(Object, parsedTheme) && parsedTheme
    ? parsedTheme
    : null;
};

const App = (): React.ReactElement => {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    getAccessTokenSilently,
    user,
  } = useAuth0();
  const {
    removeFromStorage,
    getFromStorage: storageCurrentTheme = () => null,
  } = useStorage();
  const { isLoading, setIsLoading } = useLoading();
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "success" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  let storageTheme = storageCurrentTheme(NOTES_LABELS.theme);
  if (!isNilOrEmpty(storageTheme)) {
    storageTheme = pathOr(
      NOTES_LABELS.darkMode,
      [NOTES_LABELS.theme],
      convertedStoredTheme(storageTheme || ""),
    );
  }
  const storedStateTheme = useSelector((state: RootState) => state.theme.theme);

  const rawMode = !isNilOrEmpty(storageTheme)
    ? (storageTheme as unknown)
    : (NOTES_LABELS.darkMode as unknown);

  const sanitizeMode = (mode: unknown): PaletteMode => {
    if (mode === NOTES_LABELS.lightMode || mode === NOTES_LABELS.darkMode) {
      return mode as PaletteMode;
    }
    return NOTES_LABELS.darkMode as PaletteMode;
  };

  const currentMode: PaletteMode = sanitizeMode(rawMode);

  const APP_THEME = createTheme({
    palette: {
      mode: currentMode,
    },
  });

  const notesContainerClass = `notes-container ${
    currentMode === NOTES_LABELS.darkMode ? THEMES.DARK : THEMES.LIGHT
  }`;

  const handleLogin = async (): Promise<void> => {
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error("Login failed:", error);
      setSnackbar({
        open: true,
        message: "Login failed. Please try again.",
        severity: "error",
      });
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      removeFromStorage(NOTES_LABELS.notes);
      removeFromStorage(NOTES_LABELS.theme);
      setSnackbar({
        open: true,
        message: NOTES_LABELS.loggedOut,
        severity: "success",
      });
      await logout({
        logoutParams: {
          returnTo: buildFullUrl(normalizedBaseName),
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setSnackbar({
        open: true,
        message: "Logout failed. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const createThemeHandler = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });
      // Always use createThemeAction - it handles both create and update
      await dispatch(createThemeAction({ theme: currentMode, token }) as any);
    } catch (error) {
      console.error("Error syncing theme with server:", error);
    }
  }, [getAccessTokenSilently, dispatch, currentMode]);

  useEffect(() => {
    if (isAuthenticated && !isNilOrEmpty(user) && user) {
      setIsLoading(true);

      const getCurrentThemeFromDb = async () => {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
          const themeFromDb = await getTheme(token);
          const success = pathOr(false, ["success"], themeFromDb);
          const theme: { theme: string; _id: string } | null = pathOr(
            null,
            ["theme"],
            themeFromDb,
          );
          if (success) {
            return theme;
          }
          return null;
        } catch (error) {
          console.error("Error fetching themes from server:", error);
          setIsLoading(false);
          return null;
        }
      };

      const createOrUpdateUser = async () => {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
          const userPayload = {
            auth0Id: user.sub!,
            email: user.email!,
            name: user.name,
          };
          const responseCreateOrUpdateUser = await apiCreateOrUpdateUser(
            userPayload,
            token,
          );
          if (
            isNilOrEmpty(responseCreateOrUpdateUser) ||
            !responseCreateOrUpdateUser
          ) {
            setSnackbar({
              open: true,
              message: "Failed to sync user data",
              severity: "error",
            });
            setIsLoading(false);
            setTimeout(() => handleLogout(), 1000);

            return;
          }

          // Fetch notes after user is created/updated
          setIsLoading(false);
          dispatch(fetchNotes(token) as any);
          setSnackbar({
            open: true,
            message: NOTES_LABELS.loggedIn,
            severity: "success",
          });

          getCurrentThemeFromDb().then((themeFromDb) => {
            if (!isNilOrEmpty(themeFromDb) && themeFromDb) {
              const currentThemeFromDb = pathOr(
                "",
                ["theme"],
                themeFromDb,
              ) as PaletteMode;

              if (
                !isNilOrEmpty(currentThemeFromDb) &&
                (currentThemeFromDb === NOTES_LABELS.lightMode ||
                  currentThemeFromDb === NOTES_LABELS.darkMode)
              ) {
                setIsLoading(false);
                dispatch(setTheme(currentThemeFromDb));
                return;
              }
            } else {
              setIsLoading(false);
              createThemeHandler();
            }
          });
        } catch (error) {
          setIsLoading(false);
          console.error("Error during login:", error);
          setSnackbar({
            open: true,
            message: "Failed to sync user data",
            severity: "error",
          });
          setTimeout(() => handleLogout(), 1000);
        }
      };

      createOrUpdateUser();
    } else {
      dispatch(setTheme(storedStateTheme));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch]);

  return (
    <>
      <ThemeProvider theme={APP_THEME}>
        <CssBaseline />
        <Header
          onLoginClick={handleLogin}
          onLogoutClick={handleLogout}
          isLoading={isLoading}
        />
        <Box className={notesContainerClass}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer>
            <Typography variant="body2" color="textSecondary" align="center">
              {NOTES_LABELS.copyright()}
            </Typography>
          </Footer>
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </>
  );
};

export default App;
