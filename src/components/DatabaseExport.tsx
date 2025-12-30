import React, { useState } from "react";

// mui
import { Button, Alert } from "@mui/material";

// mui icons
import IosShareIcon from "@mui/icons-material/IosShare";

// services
import { exportNotes } from "@/services";

// types
import type { SectionDatabaseComponentProps } from "@/types";

// utils
import { isNilOrEmpty } from "@/utils";

// hooks
import { useLoading } from "../contexts/LoadingContext.hooks";
import { useAuth0 } from "@auth0/auth0-react";

// constants
import { NOTES_LABELS } from "@/constants";

const DatabaseExport: React.FC<SectionDatabaseComponentProps> = ({
  description,
}): React.ReactElement => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [exporting, setExporting] = useState<boolean>(false);
  const [exported, setExported] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { setIsLoading } = useLoading();

  const handleExport = async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);
      setExporting(true);
      setExported(false);
      setError(null);
      const token = await getAccessTokenSilently();
      const notes = await exportNotes(token);

      const url = URL.createObjectURL(
        new Blob([JSON.stringify(notes)], { type: "application/json" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "notes.json";
      a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
      setExported(true);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      setExporting(false);
      setExported(false);
      setIsLoading(false);
      setError(`Error exporting notes: ${error}`);
      console.error("Error exporting notes:", error);
    }
  };

  return (
    <div>
      <p className="mb-4">{description}</p>
      <Button
        variant="contained"
        startIcon={<IosShareIcon />}
        onClick={handleExport}
      >
        {NOTES_LABELS.export}
      </Button>
      {exporting && (
        <Alert severity="info" className="mt-4">
          {NOTES_LABELS.exportingNotes}
        </Alert>
      )}
      {exported && (
        <Alert
          severity="success"
          className="mt-4"
          onClose={() => setExported(false)}
        >
          {NOTES_LABELS.exportedNotes}
        </Alert>
      )}

      {!isNilOrEmpty(error) && (
        <Alert
          severity="error"
          className="mt-4"
          onClose={() => {
            setError(null);
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: error as string }} />
        </Alert>
      )}
    </div>
  );
};

export default DatabaseExport;
