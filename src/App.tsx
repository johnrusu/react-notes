import React from "react";

// mui
import { Box, Grid } from "@mui/material";

// components
import CreateNote from "./components/CreateNote";
import Notes from "./components/Notes";
import Header from "./components/Header";

// types
import type { NoteDefault } from "./types";

const App = (): React.ReactElement => {
  const [notes, setNotes] = React.useState<NoteDefault[]>([]);

  const handelNoteAdd = (note: NoteDefault) => {
    setNotes((prevNotes) => [
      ...prevNotes,
      { ...note, id: `${prevNotes.length + 1}` },
    ]);
  };

  return (
    <Box>
      <Header />
      <Box className="notes-container">
        <CreateNote onNoteAdd={handelNoteAdd} />
        <Grid container spacing={2} marginTop={2}>
          <Notes />
        </Grid>
      </Box>
    </Box>
  );
};

export default App;
