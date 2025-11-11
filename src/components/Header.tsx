import React from "react";

// mui
import { Typography, Box, Button, Popover } from "@mui/material";

// utils
import useStorage from "../hooks/useStorage";

//mui icons
import DeleteIcon from "@mui/icons-material/Delete";

// constants
import { NOTES_LABELS } from "../constants";

// component
import ThemeSwitcher from "./ThemeSwitcher";

const Header: React.FC = (): React.ReactElement => {
  const { clearStorage } = useStorage();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
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
      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        justifyContent={"space-between"}
      >
        <ThemeSwitcher />
        <Button
          startIcon={<DeleteIcon />}
          className="clear-storage-button"
          onClick={(event) => {
            clearStorage();
            handleClick(event);
          }}
        >
          <span className="max-md:hidden">
            {NOTES_LABELS.clearLocalStorage}
          </span>
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Typography sx={{ p: 2 }}>
            {NOTES_LABELS.localStorageCleared}
          </Typography>
        </Popover>
      </Box>
    </Box>
  );
};
export default Header;
