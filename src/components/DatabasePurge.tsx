import React, { useState } from "react";
import { pathOr } from "ramda";

// mui
import { Alert, Button } from "@mui/material";

// mui icons
import DeleteIcon from "@mui/icons-material/Delete";

// auth0-hooks
import { useAuth0 } from "@auth0/auth0-react";

// hooks
import { useLoading } from "../contexts/LoadingContext.hooks";
import { useAccessToken } from "../hooks/useAccessToken";

// types
interface DatabasePurgeProps {
  description: string;
}

// constants
import { NOTES_LABELS } from "@/constants";

// redux
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { deleteAllNotesAsync, fetchNotes } from "@/features/notesSlice";

// components
import ConfirmDialog from "./ConfirmDialog";

// utils
import { isNilOrEmpty } from "@/utils";

const DatabasePurge: React.FC<DatabasePurgeProps> = (
  props,
): React.ReactElement => {
  const description: string = pathOr(
    "No description available",
    ["description"],
    props,
  );
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purged, setPurged] = useState<boolean>(false);

  const { getToken } = useAccessToken();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth0();
  const { setIsLoading } = useLoading();

  const handleConfirmImportNotes = async () => {
    if (isAuthenticated) {
      try {
        const token = await getToken();
        setIsLoading(true);
        const response = await dispatch(deleteAllNotesAsync(token));
        const success = pathOr(false, ["payload", "success"], response);
        const error = pathOr(null, ["error"], response);
        if (success) {
          await dispatch(fetchNotes(token));
          setError(null);
          setPurged(true);
          return;
        }
        if (!isNilOrEmpty(error)) {
          setError(`Error purging notes: ${JSON.stringify(error)}`);
          setPurged(false);
        }
      } catch (error) {
        console.error("Error purging all notes:", error);
        setError(`Error purging notes: ${error}`);
        setPurged(false);
      } finally {
        setIsLoading(false);
      }
    }
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <p className="mb-4">{description}</p>

      <Button
        startIcon={<DeleteIcon />}
        onClick={() => {
          setError(null);
          setPurged(false);
          setConfirmDialogOpen(true);
        }}
        variant="contained"
        color="error"
      >
        {NOTES_LABELS.purge}
      </Button>

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

      {purged && (
        <Alert
          severity="success"
          className="mt-4"
          onClose={() => setPurged(false)}
        >
          {NOTES_LABELS.purgeSuccess}
        </Alert>
      )}

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onConfirmButtonClick={handleConfirmImportNotes}
        onClose={() => setConfirmDialogOpen(false)}
        title={NOTES_LABELS.confirmTitleImportNotes}
        message={NOTES_LABELS.confirmMessageImportNotes}
        labels={{ yes: NOTES_LABELS.yes, no: NOTES_LABELS.no }}
      />
    </>
  );
};

export default DatabasePurge;
