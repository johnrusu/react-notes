import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

// state
import {
  deleteNote,
  updateNote,
  deleteNoteAsync,
  updateNoteAsync,
  updateNoteHeight,
  updateNoteHeightAsync,
} from "../features/notesSlice";

// constants
import { NOTE_DEFAULT } from "../constants";

// components
import Note from "./Note";

// utils
import { isArrayNotEmpty, isNilOrEmpty } from "../utils";
import { useAccessToken } from "../hooks/useAccessToken";
import { useAuth0 } from "@auth0/auth0-react";

// Memoized selector to avoid unnecessary re-renders
const selectSortedNotes = createSelector(
  [
    (state: RootState) => state.notes.notes,
    (state: RootState) => state.notes.filteredNotes,
    (state: RootState) => state.notes.filterText,
  ],
  (notes, filteredNotes, filterText) => {
    // Ensure notes is an array
    if (!notes || !Array.isArray(notes)) return [];

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
  const isTitleDisabled = useSelector(
    (state: RootState) => state.notes.isLoading,
  );
  const notes = useSelector(selectSortedNotes);
  const lastAddedNote = useSelector(
    (state: RootState) => state.notes.lastAddedNote,
  );
  const dispatch = useDispatch();
  const { getToken } = useAccessToken();
  const { isAuthenticated } = useAuth0();

  const onDelete = async (id: string) => {
    if (isAuthenticated) {
      try {
        const token = await getToken();
        dispatch(deleteNoteAsync({ noteId: id, token }) as any);
      } catch (error) {
        console.error("Error deleting note:", error);
        // Fallback to local-only delete
        dispatch(deleteNote(id));
      }
    } else {
      dispatch(deleteNote(id));
    }
  };

  const onEditSaveTitle = async (id: string, title: string) => {
    if (isAuthenticated) {
      try {
        const token = await getToken();
        dispatch(
          updateNoteAsync({ noteId: id, updateData: { title }, token }) as any,
        );
      } catch (error) {
        console.error("Error updating note:", error);
        // Fallback to local-only update
        dispatch(updateNote({ noteId: id, title }));
      }
    } else {
      dispatch(updateNote({ noteId: id, title }));
    }
  };

  const onTextChange = async (id: string, text: string) => {
    if (isAuthenticated) {
      try {
        const token = await getToken();
        dispatch(
          updateNoteAsync({ noteId: id, updateData: { text }, token }) as any,
        );
      } catch (error) {
        console.error("Error updating note:", error);
        // Fallback to local-only update
        dispatch(updateNote({ noteId: id, text }));
      }
    } else {
      dispatch(updateNote({ noteId: id, text }));
    }
  };

  const setNoteHeight = async (noteId: string, height: number) => {
    if (isAuthenticated) {
      try {
        const token = await getToken();
        dispatch(updateNoteHeightAsync({ noteId, height, token }) as any);
      } catch (error) {
        console.error("Error updating note:", error);
        // Fallback to local-only update
        dispatch(updateNoteHeight({ noteId, height }));
      }
    } else {
      dispatch(updateNoteHeight({ noteId, height }));
    }
  };

  const toggleHighlightedNote = async (id: string) => {
    const note = notes.find((note) => note.id === id);
    if (!note) return;

    const newHighlightedStatus = !note.highlighted;

    if (isAuthenticated) {
      try {
        const token = await getToken();
        dispatch(
          updateNoteAsync({
            noteId: id,
            updateData: { highlighted: newHighlightedStatus },
            token,
          } as any) as any,
        );
      } catch (error) {
        console.error("Error updating note highlight status:", error);
        // Fallback to local-only update
        dispatch(
          updateNote({
            noteId: id,
            highlighted: newHighlightedStatus,
          } as any) as any,
        );
      }
    } else {
      dispatch(
        updateNote({
          noteId: id,
          highlighted: newHighlightedStatus,
        } as any) as any,
      );
    }
  };

  const handleHtmlContentChange = async (id: string, isHtml: boolean) => {
    if (isAuthenticated) {
      try {
        const token = await getToken();
        dispatch(
          updateNoteAsync({ noteId: id, updateData: { isHtml }, token }) as any,
        );
      } catch (error) {
        console.error("Error updating note:", error);
        // Fallback to local-only update
        dispatch(updateNote({ noteId: id, isHtml }));
      }
    } else {
      dispatch(updateNote({ noteId: id, isHtml }));
    }
  };

  const handleColorChange = async (id: string, color: string) => {
    if (isAuthenticated) {
      try {
        const token = await getToken();
        dispatch(
          updateNoteAsync({ noteId: id, updateData: { color }, token }) as any,
        );
      } catch (error) {
        console.error("Error updating note:", error);
        // Fallback to local-only update
        dispatch(updateNote({ noteId: id, color }));
      }
    } else {
      dispatch(updateNote({ noteId: id, color }));
    }
  };

  const handleOnToggleCollapsed = async (noteId: string) => {
    console.log("Toggling collapsed state for note:", noteId);
    const note = notes.find((note) => note.id === noteId);
    if (!note) return;

    const newCollapsedStatus = !note.collapsed;

    if (isAuthenticated) {
      try {
        const token = await getToken();
        dispatch(
          updateNoteAsync({
            noteId,
            updateData: { collapsed: newCollapsedStatus },
            token,
          } as any) as any,
        );
      } catch (error) {
        console.error("Error updating note collapsed status:", error);
        // Fallback to local-only update
        dispatch(
          updateNote({
            noteId,
            collapsed: newCollapsedStatus,
          } as any) as any,
        );
      }
    } else {
      dispatch(
        updateNote({
          noteId,
          collapsed: newCollapsedStatus,
        } as any) as any,
      );
    }
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
      {notes.map(
        (
          {
            text = NOTE_DEFAULT.text,
            id = NOTE_DEFAULT.id,
            color = NOTE_DEFAULT.color,
            highlighted = NOTE_DEFAULT.highlighted,
            height = NOTE_DEFAULT.height,
            orderId = NOTE_DEFAULT.orderId,
            title = NOTE_DEFAULT.title,
            isHtml = NOTE_DEFAULT.isHtml,
            collapsed = NOTE_DEFAULT.collapsed,
            createdAt = NOTE_DEFAULT.createdAt,
            updatedAt = NOTE_DEFAULT.updatedAt,
          },
          index,
        ) => {
          return (
            <Note
              key={`note-${id}-${index}`}
              text={text}
              color={color}
              title={title}
              isHtml={isHtml}
              highlighted={highlighted}
              isTitleDisabled={isTitleDisabled}
              onToggleHighlightedNote={toggleHighlightedNote}
              setNoteHeight={setNoteHeight}
              id={id}
              height={height as number}
              orderId={orderId as number}
              onDelete={onDelete}
              onEditSaveTitle={onEditSaveTitle}
              onTextChange={onTextChange}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
              onHtmlContentChange={handleHtmlContentChange}
              onColorChange={handleColorChange}
              noteColor={color}
              collapsed={collapsed}
              createdAt={createdAt}
              updatedAt={updatedAt}
              onToggleCollapsed={handleOnToggleCollapsed}
            />
          );
        },
      )}
    </div>
  ) : null;
};
export default Notes;
