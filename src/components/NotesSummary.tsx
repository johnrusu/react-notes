import React, { useMemo } from "react";

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

// mui
import { Box, Paper, Typography, Chip } from "@mui/material";

// mui icons
import StarsIcon from "@mui/icons-material/Stars";
import DescriptionIcon from "@mui/icons-material/Description";

// constants
import { NOTES_LABELS } from "../constants";

const NotesSummary = (): React.ReactElement => {
  const notes = useSelector((state: RootState) => state.notes.notes);

  const totalNotes = useMemo(() => notes?.length || 0, [notes]);

  const highlightedNotes = useMemo(
    () => notes?.filter((note) => note.highlighted).length || 0,
    [notes],
  );

  return (
    <Paper
      elevation={2}
      sx={{
        padding: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderRadius: 2,
        marginBottom: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DescriptionIcon fontSize="large" />
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {NOTES_LABELS.totalNotes}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {totalNotes}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: "1px",
            height: "50px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <StarsIcon fontSize="large" />
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {NOTES_LABELS.highlightedNotes}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {highlightedNotes}
            </Typography>
          </Box>
        </Box>

        {highlightedNotes > 0 && (
          <Chip
            label={`${Math.round((highlightedNotes / totalNotes) * 100)}% highlighted`}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
              marginLeft: "auto",
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default NotesSummary;
