import React, { useEffect, useState } from "react";
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
import { Box, Snackbar, Alert } from "@mui/material";

// utils
import { stringToJSON } from "./utils";

// constants
import { NOTES_LABELS, THEMES } from "./constants/index";

// components
import { Header } from "./components";

// pages
import Home from "./pages/Home";
import Account from "./pages/Account";
import About from "./pages/About";

// state
import { setTheme } from "./features/themeSlice";

// types
import type { RootState } from "./store/store";

// hooks
import { isNilOrEmpty } from "./utils";
import useStorage from "./hooks/useStorage";
import { useAuth0 } from "@auth0/auth0-react";

const convertedStoredTheme = (storedTheme: string = ""): object | null => {
  let parsedTheme = stringToJSON(storedTheme);
  if (parsedTheme === false) return null;
  if (parsedTheme === null) {
    parsedTheme = stringToJSON(storedTheme);
  }
  return !isNilOrEmpty(parsedTheme) && is(Object, parsedTheme) && parsedTheme
    ? parsedTheme
    : null;
};

const App = (): React.ReactElement => {
  const { loginWithRedirect, logout } = useAuth0();
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

  const storageCurrentTheme: (key: string) => string | null = pathOr(
    () => null,
    ["getFromStorage"],
    useStorage(),
  );

  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  let storedTheme = storageCurrentTheme(NOTES_LABELS.theme);

  if (!isNilOrEmpty(storedTheme)) {
    const storageThemeValue = storageCurrentTheme(NOTES_LABELS.theme);
    storedTheme = pathOr(
      NOTES_LABELS.darkMode,
      [NOTES_LABELS.theme],
      convertedStoredTheme(storageThemeValue || ""),
    );
  }

  const currentMode: PaletteMode = !isNilOrEmpty(storedTheme)
    ? (storedTheme as PaletteMode)
    : (NOTES_LABELS.darkMode as PaletteMode);
  const darkTheme = createTheme({
    palette: {
      mode: currentMode,
    },
  });

  const notesContainerClass = `notes-container ${
    currentTheme === NOTES_LABELS.darkMode ? THEMES.DARK : THEMES.LIGHT
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
      await logout({
        logoutParams: {
          returnTo: window.location.origin,
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

  useEffect(() => {
    dispatch(setTheme(currentMode));
  }, [dispatch, currentMode]);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header onLoginClick={handleLogin} onLogoutClick={handleLogout} />
        <Box className={notesContainerClass}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/account" element={<Account />} />
          </Routes>
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
