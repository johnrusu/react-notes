const NOTES_LABELS = {
  title: "Notes application",
  createNotePlaceholder: "Create a new note...",
  addButton: "Add Note",
  deleteButton: "Delete",
  updateButton: "Update",
};

const NOTE_COLORS = ["#FFEB3B", "#FFCDD2", "#C8E6C9", "#BBDEFB", "#D1C4E9"];

const NOTE_DEFAULT = {
  id: "",
  text: "",
  color: NOTE_COLORS[0],
};

export { NOTE_COLORS, NOTES_LABELS, NOTE_DEFAULT };
