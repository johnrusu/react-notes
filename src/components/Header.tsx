import React from "react";

// mui
import { Typography, Box } from "@mui/material";

// constants
import { NOTES_LABELS } from "../constants";

// component
import ThemeSwitcher from "./ThemeSwitcher";

const Header: React.FC = (): React.ReactElement => {
  return (
    <Box
      className="header"
      flexDirection="row"
      justifyContent="space-between"
      alignContent="center"
      alignItems="center"
      display="flex"
    >
      <Typography variant="h5">{NOTES_LABELS.title}</Typography>
      <ThemeSwitcher />
    </Box>
  );
};
export default Header;
