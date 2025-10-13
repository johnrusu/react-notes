import React from "react";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";

// state
import { deleteNote } from "../features/notesSlice";

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

  return isArrayNotEmpty(notes) ? (
    <div>
      {notes.map(({ text, id, color }, index) => {
        const zIndex: number = 10 + notes.length + index;
        return (
          <Note
            key={`note-${id}-${index}`}
            text={text}
            color={color}
            id={id}
            onDelete={onDelete}
            style={{ zIndex }}
          />
        );
      })}
    </div>
  ) : null;
};
export default Notes;
