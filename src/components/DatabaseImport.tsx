import React, { useState } from "react";
import { pathOr } from "ramda";

// auth0-hooks
import { useAuth0 } from "@auth0/auth0-react";

// mui
import { Alert } from "@mui/material";

// hooks
import { useLoading } from "../contexts/LoadingContext.hooks";
import { useAccessToken } from "../hooks/useAccessToken";

// redux
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { importNotesAsync } from "@/features/notesSlice";
import { fetchNotes } from "@/features/notesSlice";

// types
import type { SectionDatabaseComponentProps, NoteDefault } from "@/types";

// utils
import { isNilOrEmpty, isValidJSON } from "@/utils";

// constants
import { NOTE_DEFAULT, NOTES_LABELS } from "@/constants";

// components
import InputFileUpload from "./InputFileUpload";
import ConfirmDialog from "./ConfirmDialog";

const DatabaseImport: React.FC<SectionDatabaseComponentProps> = ({
  description,
}): React.ReactElement => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reset, setReset] = useState<boolean>(false);
  const [importedNotes, setImportedNotes] = useState<NoteDefault[]>([]);
  const [imported, setImported] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAccessToken();
  const { isAuthenticated } = useAuth0();
  const { setIsLoading } = useLoading();

  const isMatchingStructure = (
    importedData: any,
    referenceData: any,
  ): boolean => {
    if (Array.isArray(importedData) && Array.isArray(referenceData)) {
      if (importedData.length === 0) return true; // Empty array is considered matching
      return isMatchingStructure(importedData[0], referenceData[0]);
    } else if (
      typeof importedData === "object" &&
      typeof referenceData === "object"
    ) {
      for (const key in referenceData) {
        if (!(key in importedData)) {
          return false;
        }
        if (!isMatchingStructure(importedData[key], referenceData[key])) {
          return false;
        }
      }
      return true;
    } else {
      return typeof importedData === typeof referenceData;
    }
  };

  const handleImportFile = (files: FileList | null): void => {
    setError(null);
    setReset(false);
    setImportedNotes([]);
    setImported(false);
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result;
          if (typeof result === "string") {
            if (!isValidJSON(result)) {
              console.error("Invalid JSON file.");
              const errorMessage = `${NOTES_LABELS.importErrorInvalidJSON}`;
              setError(errorMessage);
              return;
            }

            const parsedData = JSON.parse(result);
            setReset(true);
            setImportedNotes([]);

            // Check if it has the expected wrapper structure
            if (!parsedData.notes || !Array.isArray(parsedData.notes)) {
              console.error(NOTES_LABELS.importErrorInvalidJSON);
              const errorMessage = `${NOTES_LABELS.importErrorInvalidJSON}
              <p>${NOTES_LABELS.structureMustMatch}</p>
              <pre>${JSON.stringify({ success: true, notes: [NOTE_DEFAULT] }, null, 2)}</pre>`;
              setError(errorMessage);
              return;
            }

            // Check if each note matches the expected structure
            if (
              parsedData.notes.length > 0 &&
              !isMatchingStructure(parsedData.notes[0], NOTE_DEFAULT)
            ) {
              console.error(NOTES_LABELS.importErrorInvalidJSON);
              const errorMessage = `${NOTES_LABELS.importErrorInvalidJSON}
              <p>${NOTES_LABELS.structureMustMatch}</p>
              <pre>${JSON.stringify({ success: true, notes: [NOTE_DEFAULT] }, null, 2)}</pre>`;
              setError(errorMessage);
              return;
            }

            const importedNotes: NoteDefault[] = parsedData.notes;
            // Here you would typically dispatch an action or call a function
            // to update the state with the imported notes.
            setImportedNotes(importedNotes);
            setConfirmDialogOpen(true);
          }
        } catch (error) {
          console.error("Error parsing imported file:", error);
          setError(`Error parsing imported file: ${error as string}`);
          setReset(true);
          setImportedNotes([]);
          setConfirmDialogOpen(false);
          setImported(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmImportNotes = async () => {
    if (isAuthenticated) {
      try {
        const token = await getToken();
        setIsLoading(true);
        const response = await dispatch(
          importNotesAsync({ notes: importedNotes, token }),
        );
        const success = pathOr(false, ["payload", "success"], response);
        const error = pathOr(null, ["error"], response);
        if (success) {
          await dispatch(fetchNotes(token));
          setImported(true);
          setError(null);
          return;
        }
        if (!isNilOrEmpty(error)) {
          setError(`Error importing notes: ${JSON.stringify(error)}`);
        }
      } catch (error) {
        console.error("Error importing all notes:", error);
        setError(`Error importing notes: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }
    setConfirmDialogOpen(false);
  };

  return (
    <div>
      <p className="mb-4">{description}</p>
      <InputFileUpload
        label={NOTES_LABELS.import}
        multiple={false}
        acceptTypes={[NOTES_LABELS.acceptTypesJSON]}
        onFilesSelected={handleImportFile}
        reset={reset}
      />
      {!isNilOrEmpty(error) && (
        <Alert
          severity="error"
          className="mt-4"
          onClose={() => {
            setError(null);
            setReset(true);
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: error as string }} />
        </Alert>
      )}

      {imported && (
        <Alert
          severity="success"
          className="mt-4"
          onClose={() => setImported(false)}
        >
          {NOTES_LABELS.importedNotes}
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
    </div>
  );
};

export default DatabaseImport;
