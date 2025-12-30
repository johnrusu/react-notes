import React, { useEffect } from "react";

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// types
interface InputFileUploadProps {
  onFilesSelected?: (files: FileList | null) => void;
  label: string;
  multiple?: boolean;
  acceptTypes?: string[];
  reset?: boolean;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload({
  onFilesSelected,
  label,
  multiple = false,
  acceptTypes = [],
  reset = false,
}: InputFileUploadProps): React.ReactElement {
  useEffect(() => {
    if (reset) {
      const inputElement = document.getElementById(
        "file-input",
      ) as HTMLInputElement | null;
      if (inputElement) {
        inputElement.value = "";
      }
    }
  }, [reset]);

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      {label}
      <VisuallyHiddenInput
        id="file-input"
        type="file"
        onChange={(event) => onFilesSelected?.(event.target.files)}
        multiple={multiple}
        accept={acceptTypes.join(",")}
      />
    </Button>
  );
}
