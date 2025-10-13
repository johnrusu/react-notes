import React from "react";

// mui
import { Typography } from "@mui/material";

// constants
import { NOTES_LABELS } from "../constants";

const Header: React.FC = (): React.ReactElement => {
  return (
    <div className="header">
      <Typography variant="h5">{NOTES_LABELS.title}</Typography>
    </div>
  );
};
export default Header;
