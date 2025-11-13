import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

// state
import { deleteNote, updateNote } from "../features/notesSlice";

// components
import Note from "./Note";

// utils
import { isArrayNotEmpty, isNilOrEmpty } from "../utils";

// Memoized selector to avoid unnecessary re-renders

const selectSortedNotes = createSelector(
  [
    (state: RootState) => state.notes.notes,
    (state: RootState) => state.notes.filteredNotes,
    (state: RootState) => state.notes.filterText,
  ],
  (notes, filteredNotes, filterText) => {
    const hasFilteredNotes = isArrayNotEmpty(filteredNotes);
    const filterTextLower = filterText.toLowerCase();

    // Determine which notes to use
    let notesToUse = notes;
    if (!filterTextLower) {
      notesToUse = hasFilteredNotes ? filteredNotes : notes;
    } else {
      // If we have filter text, try filtering filteredNotes first
      if (hasFilteredNotes) {
        const filteredByText = filteredNotes.filter((note) =>
          note.text.toLowerCase().includes(filterTextLower),
        );
        // If filtering filteredNotes results in empty array, fall back to filtering all notes
        notesToUse = isArrayNotEmpty(filteredByText)
          ? filteredByText
          : notes.filter((note) =>
              note.text.toLowerCase().includes(filterTextLower),
            );
      } else {
        // No filtered notes, filter all notes
        notesToUse = notes.filter((note) =>
          note.text.toLowerCase().includes(filterTextLower),
        );
      }
    }

    // Sort the notes
    return [...notesToUse].sort(
      (a, b) => Number(b.highlighted) - Number(a.highlighted),
    );
  },
);

const Notes: React.FC = (): React.ReactElement | null => {
  const notes = useSelector(selectSortedNotes);
  const lastAddedNote = useSelector(
    (state: RootState) => state.notes.lastAddedNote,
  );
  const dispatch = useDispatch();

  const onDelete = (id: string) => {
    dispatch(deleteNote(id));
  };

  const onTextChange = (id: string, text: string) => {
    // dispatch update note action
    dispatch(updateNote({ noteId: id, text }));
  };

  useEffect(() => {
    if (!isNilOrEmpty(lastAddedNote) && lastAddedNote) {
      // Find the newly added note element
      const findAndScrollToNote = () => {
        // Try multiple possible selectors for the note
        const selectors = [
          `#note-${lastAddedNote.id}-0`,
          `[data-note-id="${lastAddedNote.id}"]`,
          `.note[data-id="${lastAddedNote.id}"]`,
        ];

        let element: HTMLElement | null = null;

        for (const selector of selectors) {
          element = document.querySelector(selector);
          if (element) break;
        }

        if (element) {
          // Add a smooth scroll with better timing
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });

          // Add a subtle highlight effect
          element.style.transition = "box-shadow 0.3s ease-in-out";
          element.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.5)";

          // Remove highlight after animation
          setTimeout(() => {
            element!.style.boxShadow = "";
          }, 1500);
        }
        dispatch({ type: "notes/deleteLastdAddedNote" });
      };

      // Wait for DOM updates and animations to complete
      setTimeout(findAndScrollToNote, 500);
    }
  }, [lastAddedNote, dispatch]);

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
