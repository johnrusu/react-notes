import React from "react";
import { useDispatch } from "react-redux";

// mui
import { Box } from "@mui/material";

// components
import CreateNote from "./components/CreateNote";
import Notes from "./components/Notes";
import Header from "./components/Header";

// state
import { addNote } from "./features/notesSlice";
// types
import type { NoteDefault } from "./types";

const App = (): React.ReactElement => {
  const dispatch = useDispatch();
  const handelNoteAdd = (note: NoteDefault) => {
    dispatch(addNote(note));
  };

  return (
    <>
      <Header />
      <Box className="notes-container">
        <CreateNote onNoteAdd={handelNoteAdd} />
        <div className="notes-grid">
          <Notes />
        </div>
      </Box>
    </>
  );
};

export default App;
