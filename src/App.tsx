import React, { useEffect } from "react";
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
import { Box } from "@mui/material";

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
      // You can add additional user feedback here (e.g., toast notification)
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
      // You can add additional user feedback here (e.g., toast notification)
    }
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
      </ThemeProvider>
    </>
  );
};

export default App;
