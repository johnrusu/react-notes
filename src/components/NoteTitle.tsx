import React, { useState } from "react";

// mui
import {
  Typography,
  IconButton,
  InputBase,
  Paper,
  Divider,
} from "@mui/material";

// mui icons
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

// types
interface NoteTitleProps {
  title: string;
  onEditSaveTitle?: (id: string, title: string) => void;
  textColor?: string;
  disabled?: boolean;
  id?: string;
}

// utils
import { isNilOrEmpty } from "../utils";

const NoteTitle: React.FC<NoteTitleProps> = ({
  title: initialTitle = "",
  onEditSaveTitle = () => {},
  textColor = "",
  disabled = false,
  id = "",
}): React.ReactElement => {
  const [edit, setEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(initialTitle);

  const handleEditSave = () => {
    onEditSaveTitle(id, title);
    setEdit(false);
  };

  const handleCancel = () => {
    if (initialTitle !== title) {
      setTitle(initialTitle);
    }
    setEdit(false);
  };

  const handleEditTitle = () => {
    if (!disabled) {
      setEdit(true);
    }
  };

  // styles
  const PAPER_STYLE: React.CSSProperties = {
    padding: "4px",
    display: "flex",
    alignItems: "center",
    gap: 1,
    cursor: "text",
  };

  const EDIT_CONDITION = !isNilOrEmpty(title) && title !== initialTitle;

  return !edit ? (
    <Paper
      elevation={0}
      component="form"
      sx={{
        ...PAPER_STYLE,
        width: { sm: 500, xs: "100%" },
        backgroundColor: "transparent",
      }}
      onClick={handleEditTitle}
    >
      <Typography variant="h6" component="div" sx={{ color: textColor }}>
        {title}
      </Typography>
      <IconButton>
        <EditIcon fontSize="small" sx={{ color: textColor }} />
      </IconButton>
    </Paper>
  ) : (
    <>
      <Paper
        component="form"
        sx={{
          ...PAPER_STYLE,
          width: { sm: 500, xs: "100%" },
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          autoFocus
          disabled={disabled}
        />

        {EDIT_CONDITION && (
          <>
            <IconButton onClick={handleEditSave}>
              <SaveIcon fontSize="small" />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          </>
        )}
        <IconButton onClick={handleCancel}>
          <CancelIcon fontSize="small" />
        </IconButton>
      </Paper>
    </>
  );
};

export default NoteTitle;
