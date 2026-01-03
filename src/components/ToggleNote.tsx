import React from "react";

// constants
import { NOTES_LABELS } from "../constants";

// mui
import { ListItemIcon, ListItemText } from "@mui/material";

// mui icons
import ExpandIcon from "@mui/icons-material/Expand";
import CompressIcon from "@mui/icons-material/Compress";

// types
interface ToggleNoteProps {
  isToggled?: boolean;
  onToggle?: (id: string) => void;
  id?: string;
  onClick?: () => void;
}

const ToggleNote = ({
  isToggled = false,
  onToggle = () => {},
  onClick = () => {},
  id = "",
}: ToggleNoteProps): React.ReactElement => {
  const handleToggle = () => {
    if (onToggle) {
      onToggle(id);
      onClick?.();
    }
  };

  return (
    <>
      <ListItemIcon onClick={handleToggle}>
        {!isToggled ? (
          <CompressIcon fontSize="small" />
        ) : (
          <ExpandIcon fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText onClick={handleToggle}>
        {!isToggled ? NOTES_LABELS.collapse : NOTES_LABELS.expand}
      </ListItemText>
    </>
  );
};

export default ToggleNote;
