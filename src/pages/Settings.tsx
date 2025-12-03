import React from "react";

// utils
import useStorage from "../hooks/useStorage";

// component
import ThemeSwitcher from "./ThemeSwitcher"

const Settings: React.FC = () => {
    const { clearStorage } = useStorage();
    const id = open ? "clear-storage-popover-confirmation" : undefined;
  return <Box
  
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
      />>;
};

export default Settings;
