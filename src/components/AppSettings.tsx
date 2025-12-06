import React, { useState } from "react";

// mui
import { Box, Button } from "@mui/material";

// constants
import {
  NOTES_LABELS,
  DEFAULT_TIMEOUT_FOR_RELOADING_PAGE,
} from "../constants/index";

// MUI icons
import DeleteIcon from "@mui/icons-material/Delete";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

// components
import ConfirmDialog from "./ConfirmDialog";

// utils
import useStorage from "../hooks/useStorage";

// component
import ThemeSwitcher from "./ThemeSwitcher";

const Settings: React.FC = () => {
  const { removeFromStorage } = useStorage();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<number | null>(
    DEFAULT_TIMEOUT_FOR_RELOADING_PAGE,
  );

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const id = open ? "clear-storage-popover-confirmation" : undefined;
  const initTimer = () => {
    const newTime = setInterval(() => {
      setTime((prevTime: number | null) => {
        if (prevTime && typeof prevTime === "number" && prevTime <= 1000) {
          clearInterval(newTime);
          setOpen(false);
          window.location.reload();
          return null;
        }
        return (prevTime as number) - 1000;
      });
    }, 1000);
    return () => clearInterval(newTime);
  };

  const popOverMessage = () => {
    return (
      <>
        {NOTES_LABELS.localStorageCleared}
        <p>{NOTES_LABELS.refreshingPage(time || 0)}</p>
      </>
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearStorage = (event: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmDialogOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleConfirmClearStorage = () => {
    removeFromStorage("notes");
    setConfirmDialogOpen(false);
    setOpen(true);
    initTimer();
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        justifyContent={"space-between"}
      >
        <ThemeSwitcher />
        <Button
          startIcon={<DeleteIcon className="text-white" />}
          className="clear-storage-button "
          onClick={(event) => handleClearStorage(event)}
        >
          <span className="max-md:hidden text-white">
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
          <Typography sx={{ p: 2 }}>{popOverMessage()}</Typography>
        </Popover>
      </Box>
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onConfirmButtonClick={handleConfirmClearStorage}
        onClose={() => setConfirmDialogOpen(false)}
        title={NOTES_LABELS.confirmTitleClearLocalStorage}
        message={NOTES_LABELS.confirmMessageClearLocalStorage}
        labels={{ yes: NOTES_LABELS.yes, no: NOTES_LABELS.no }}
      />
    </>
  );
};

export default Settings;
