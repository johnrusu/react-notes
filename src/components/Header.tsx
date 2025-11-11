import React, { useState } from "react";

// mui
import { Typography, Box, Button, Popover } from "@mui/material";

// componentns
import ConfirmDialog from "./ConfirmDialog";

// utils
import useStorage from "../hooks/useStorage";

//mui icons
import DeleteIcon from "@mui/icons-material/Delete";

// constants
import { NOTES_LABELS, DEFAULT_TIMEOUT_FOR_RELOADING_PAGE } from "../constants";

// component
import ThemeSwitcher from "./ThemeSwitcher";

const Header: React.FC = (): React.ReactElement => {
  const { clearStorage } = useStorage();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<number | null>(
    DEFAULT_TIMEOUT_FOR_RELOADING_PAGE,
  );

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearStorage = (event: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmDialogOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleConfirmClearStorage = () => {
    clearStorage();
    setConfirmDialogOpen(false);
    setOpen(true);
    initTimer();
  };

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
        {NOTES_LABELS.localStorageCleared}{" "}
        {NOTES_LABELS.refreshingPage(time || 0)}
      </>
    );
  };
  const id = open ? "clear-storage-popover-confirmation" : undefined;
  return (
    <>
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
            onClick={(event) => handleClearStorage(event)}
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
            <Typography sx={{ p: 2 }}>{popOverMessage()}</Typography>
          </Popover>
        </Box>
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
export default Header;
