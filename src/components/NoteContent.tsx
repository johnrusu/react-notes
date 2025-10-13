import React, { useState } from "react";

// constants
import { NOTES_LABELS } from "../constants";

const NoteContent: React.FC<{
  text: string;
  onTextChange: (id: string, text: string) => void;
  id: string;
}> = ({ text, onTextChange, id }) => {
  const [editedText, setEditedText] = useState<string>(text);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
  };

  return (
    <textarea
      value={editedText}
      onChange={handleChange}
      className="note-content-textarea"
      onBlur={() => onTextChange(id, editedText)}
      placeholder={NOTES_LABELS.createNotePlaceholder}
    />
  );
};
export default NoteContent;
