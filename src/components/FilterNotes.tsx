import React, { useState, useEffect } from "react";
import { pathOr } from "ramda";

// mui
import { InputBase, Paper, IconButton } from "@mui/material";

// mui icons
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// constants
import { NOTES_LABELS } from "../constants";

// types
import type { FilterNotesProps } from "../types";

const FilterNotes: React.FC<FilterNotesProps> = (props: FilterNotesProps) => {
  const filterText = pathOr("", ["filterText"], props);
  const [filter, setFilter] = useState(filterText);
  const wasReset = pathOr(false, ["wasReset"], props);
  const onFilterClick: (filter: string) => void = pathOr(
    () => {},
    ["onFilterClick"],
    props,
  );

  const handleFilterClick = () => {
    onFilterClick(filter);
  };

  useEffect(() => {
    if (wasReset) {
      setFilter("");
    }
  }, [wasReset]);

  return (
    <Paper className="filter-notes">
      <InputBase
        placeholder={NOTES_LABELS.filterNotes}
        inputProps={{ "aria-label": NOTES_LABELS.filterNotes }}
        className="filter-notes-input"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filter && (
        <IconButton
          sx={{ color: "#ffffff" }}
          aria-label="clear"
          onClick={() => {
            setFilter("");
            onFilterClick("");
          }}
        >
          <ClearIcon />
        </IconButton>
      )}
      <IconButton
        aria-label="search"
        onClick={handleFilterClick}
        sx={{ color: "#ffffff" }}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
export default FilterNotes;
