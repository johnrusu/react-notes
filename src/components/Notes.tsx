import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

// state
import { deleteNote, updateNote } from "../features/notesSlice";

// components
import Note from "./Note";

// utils
import { isArrayNotEmpty } from "../utils";

// Memoized selector to avoid unnecessary re-renders

const selectSortedNotes = createSelector(
  [
    (state: RootState) => {
      const filterText = state.notes.filterText.toLowerCase();
      const hasFilteredNotes = isArrayNotEmpty(state.notes.filteredNotes);

      // No filter text - return all notes or filtered notes
      if (!filterText) {
        return hasFilteredNotes ? state.notes.filteredNotes : state.notes.notes;
      }

      // With filter text - filter the appropriate list
      return state.notes.filteredNotes.filter((note) =>
        note.text.toLowerCase().includes(filterText),
      );
    },
  ],
  (notes) =>
    [...notes].sort((a, b) => Number(b.highlighted) - Number(a.highlighted)),
);

const Notes: React.FC = (): React.ReactElement | null => {
  const notes = useSelector(selectSortedNotes);
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
      {notes.map(({ text, id, color, highlighted }, index) => {
        return (
          <Note
            key={`note-${id}-${index}`}
            text={text}
            color={color}
            highlighted={highlighted}
            id={id}
            onDelete={onDelete}
            onTextChange={onTextChange}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          />
        );
      })}
    </div>
  ) : null;
};
export default Notes;
