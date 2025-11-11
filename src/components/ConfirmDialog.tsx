import React, { useState, useEffect } from "react";
import { pathOr } from "ramda";

// mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";

// types
import type { ConfirmDialogProps } from "../types";

// constants
import { NOTES_LABELS } from "../constants";

const ConfirmDialog: React.FC<ConfirmDialogProps> = (
  props: ConfirmDialogProps,
): React.ReactElement | null => {
  const [open, setOpen] = useState(false);

  const onConfirmButtonClick = pathOr(
    () => {},
    ["onConfirmButtonClick"],
    props,
  );
  const onClose = pathOr(() => {}, ["onClose"], props);
  const title: string = pathOr(NOTES_LABELS.confirmAction, ["title"], props);
  const message: string = pathOr("", ["message"], props);
  const labels = pathOr(
    { yes: NOTES_LABELS.yes, no: NOTES_LABELS.no },
    ["labels"],
    props,
  );
  const isOpen: boolean = pathOr(false, ["isOpen"], props);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleYesButtonClick = () => {
    onConfirmButtonClick();
    handleClose();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{labels.no}</Button>
          <Button onClick={() => handleYesButtonClick()} autoFocus>
            {labels.yes}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ConfirmDialog;
