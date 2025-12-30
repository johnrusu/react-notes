import React, { useState } from "react";
import { pathOr } from "ramda";

// mui
import {
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

// mui icons
import SettingsIcon from "@mui/icons-material/Settings";

// components
const SettingsOfNote = React.lazy(() => import("./SettingsOfNote"));

// constants
import { NOTES_LABELS } from "../constants";

// types
interface NoteSettingsProps {
  onClick?: () => void;
  onHtmlContentChange?: (id: string, isHtml: boolean) => void;
  onColorChange?: (id: string, color: string) => void;
  id?: string;
  isHtmlContent?: boolean;
  noteColor?: string;
}

const NoteSettings: React.FC<NoteSettingsProps> = (
  props,
): React.ReactElement => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const onClick = pathOr(() => {}, ["onClick"], props);
  const onHtmlContentChange: (id: string, isHtml: boolean) => void = pathOr(
    () => {},
    ["onHtmlContentChange"],
    props,
  );
  const onColorChange: (id: string, color: string) => void = pathOr(
    () => {},
    ["onColorChange"],
    props,
  );
  const id: string | undefined = pathOr("", ["id"], props);
  const isHtmlContent: boolean | undefined = pathOr(
    false,
    ["isHtmlContent"],
    props,
  );
  const noteColor: string | undefined = pathOr("", ["noteColor"], props);

  const handleOnClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    onClick?.();
  };

  const handleHtmlContentChange = (isHtml: boolean) => {
    onHtmlContentChange(id, isHtml);
  };

  const handleColorChange = (color: string) => {
    onColorChange(id, color);
  };

  return (
    <>
      <ListItemIcon onClick={handleOnClick}>
        <SettingsIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText onClick={handleOnClick}>
        {NOTES_LABELS.settings}
      </ListItemText>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="note-settings-dialog-title"
        aria-describedby="note-settings-dialog-description"
      >
        <DialogTitle id="note-settings-dialog-title">
          {NOTES_LABELS.settings}
        </DialogTitle>
        <DialogContent>
          <React.Suspense fallback={<div>{NOTES_LABELS.loading}</div>}>
            <SettingsOfNote
              onHtmlContentChange={handleHtmlContentChange}
              onColorChange={handleColorChange}
              noteColor={noteColor}
              isHtmlContent={isHtmlContent}
            />
          </React.Suspense>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>{NOTES_LABELS.close}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default NoteSettings;
