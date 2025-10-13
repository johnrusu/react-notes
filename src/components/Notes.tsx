import React from "react";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";

// state
import { deleteNote, updateNote } from "../features/notesSlice";

// components
import Note from "./Note";

// utils
import { isArrayNotEmpty } from "../utils";

const Notes: React.FC = (): React.ReactElement | null => {
  const notes = useSelector((state: RootState) => state.notes.notes);
  const dispatch = useDispatch();

  const onDelete = (id: string) => {
    dispatch(deleteNote(id));
  };

  const onTextChange = (id: string, text: string) => {
    // dispatch update note action
    dispatch(updateNote({ noteId: id, text }));
  };

  return isArrayNotEmpty(notes) ? (
    <div className="w-full">
      {notes.map(({ text, id, color }, index) => {
        return (
          <Note
            key={`note-${id}-${index}`}
            text={text}
            color={color}
            id={id}
            onDelete={onDelete}
            onTextChange={onTextChange}
          />
        );
      })}
    </div>
  ) : null;
};
export default Notes;
