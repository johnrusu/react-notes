const express = require("express");
const router = express.Router();

const { pathOr } = require("ramda");

// Constants
const { APP_NAME } = require("../constants/index.js");
const { ROUTES } = require("../constants/routes.js");

// Auth middleware
const { checkJwt } = require("../middleware/auth.js");

// utils
const { isNilOrEmpty } = require("../utils/index.js");

// Database functions
const {
  createOrUpdateUser,
  getUserByAuth0Id,
  createNote,
  getNotesByUserId,
  updateNote,
  deleteNote,
  deleteAllNotesByUserId,
  bulkUpdateNotes,
  createOrUpdateTheme,
  getThemeByUserId,
} = require("../database/index.js");

// Root route - Public
router[ROUTES.ROOT.method.toLowerCase()](ROUTES.ROOT.path, async (req, res) => {
  res.json({ message: `Welcome to ${APP_NAME}` });
});

router[ROUTES.PROTECTED_TEST.method.toLowerCase()](
  ROUTES.PROTECTED_TEST.path,
  checkJwt,
  async (req, res) => {
    res.json({ message: `You have accessed a protected route in ${APP_NAME}` });
  },
);

// ===== USER ROUTES =====

// Create or update user (called after Auth0 login)
router[ROUTES.CREATE_OR_UPDATE_USER.method.toLowerCase()](
  ROUTES.CREATE_OR_UPDATE_USER.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const email = pathOr(null, ["body", "email"], req);
      const name = pathOr(null, ["body", "name"], req);

      if (isNilOrEmpty(auth0Id) || isNilOrEmpty(email)) {
        return res.status(400).json({ error: "Missing required user data" });
      }

      const user = await createOrUpdateUser({ auth0Id, email, name });
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Get current user
router[ROUTES.GET_CURRENT_USER.method.toLowerCase()](
  ROUTES.GET_CURRENT_USER.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await getUserByAuth0Id(auth0Id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// ===== NOTES ROUTES =====

// Protected route - Requires authentication
router[ROUTES.EXPORT_NOTES.method.toLowerCase()](
  ROUTES.EXPORT_NOTES.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const notes = await getNotesByUserId(auth0Id);
      if (Array.isArray(notes) && notes.length > 0) {
        res.status(200).json({
          success: true,
          notes: notes.map((note) => ({
            id: note.id,
            text: note.text,
            highlighted: note.highlighted,
            color: note.color,
            height: note.height,
            orderId: note.orderId,
            title: note.title,
            isHtml: note.isHtml,
            collapsed: note.collapsed,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
          })),
        });
        return;
      }
      res.status(200).json({ success: true, notes: [] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

router[ROUTES.IMPORT_NOTES.method.toLowerCase()](
  ROUTES.IMPORT_NOTES.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const { notes } = req.body;

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!Array.isArray(notes) || notes.length === 0) {
        return res.status(400).json({ error: "Notes array is required" });
      }

      const result = await bulkUpdateNotes(auth0Id, notes);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error("Bulk update error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// Get all notes for current user
router[ROUTES.GET_ALL_NOTES.method.toLowerCase()](
  ROUTES.GET_ALL_NOTES.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const notes = await getNotesByUserId(auth0Id);
      res.status(200).json({ success: true, notes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Create new note
router[ROUTES.CREATE_NOTE.method.toLowerCase()](
  ROUTES.CREATE_NOTE.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const {
        id,
        title,
        text,
        color,
        highlighted,
        height,
        orderId,
        isHtml,
        collapsed,
      } = req.body;

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNilOrEmpty(id)) {
        return res
          .status(400)
          .json({ error: "Missing required note data: id" });
      }

      // text can be empty, so only check if it's undefined/null
      if (text === undefined || text === null) {
        return res
          .status(400)
          .json({ error: "Missing required note data: text" });
      }

      const now = new Date();
      const note = await createNote({
        id,
        userId: auth0Id,
        title,
        text,
        color,
        highlighted,
        height,
        orderId,
        isHtml,
        collapsed,
        createdAt: now,
      });

      res.status(201).json({ success: true, note });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Bulk update notes (for reordering)
// IMPORTANT: This route must come BEFORE UPDATE_NOTE to avoid matching "bulk" as :noteId
router[ROUTES.BULK_UPDATE_NOTES.method.toLowerCase()](
  ROUTES.BULK_UPDATE_NOTES.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const { notes } = req.body;

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!Array.isArray(notes) || notes.length === 0) {
        return res.status(400).json({ error: "Notes array is required" });
      }

      const result = await bulkUpdateNotes(auth0Id, notes);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error("Bulk update error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// Update note height
router[ROUTES.UPDATE_NOTE_HEIGHT.method.toLowerCase()](
  ROUTES.UPDATE_NOTE_HEIGHT.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const noteId = pathOr(null, ["params", "noteId"], req);
      const { height } = req.body;

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNilOrEmpty(noteId)) {
        return res.status(400).json({ error: "Note ID is required" });
      }

      if (typeof height !== "number") {
        return res.status(400).json({ error: "Height must be a number" });
      }

      const note = await updateNote(noteId, auth0Id, {
        height,
        updatedAt: new Date(),
      });

      res.status(200).json({ success: true, note });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Update note
router[ROUTES.UPDATE_NOTE.method.toLowerCase()](
  ROUTES.UPDATE_NOTE.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const noteId = pathOr(null, ["params", "noteId"], req);
      const {
        title,
        text,
        color,
        highlighted,
        isHtml,
        height,
        orderId,
        collapsed,
      } = req.body;

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNilOrEmpty(noteId)) {
        return res.status(400).json({ error: "Note ID is required" });
      }

      const note = await updateNote(noteId, auth0Id, {
        title,
        text,
        color,
        highlighted,
        height,
        orderId,
        isHtml,
        collapsed,
        updatedAt: new Date(),
      });

      res.status(200).json({ success: true, note });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Delete note
router[ROUTES.DELETE_NOTE.method.toLowerCase()](
  ROUTES.DELETE_NOTE.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const noteId = pathOr(null, ["params", "noteId"], req);

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNilOrEmpty(noteId)) {
        return res.status(400).json({ error: "Note ID is required" });
      }

      const result = await deleteNote(noteId, auth0Id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Delete all notes for current user
router[ROUTES.DELETE_ALL_NOTES.method.toLowerCase()](
  ROUTES.DELETE_ALL_NOTES.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await deleteAllNotesByUserId(auth0Id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// ===== THEME ROUTES =====

// Get all themes for current user
router[ROUTES.GET_THEME.method.toLowerCase()](
  ROUTES.GET_THEME.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const theme = await getThemeByUserId(auth0Id);
      res.status(200).json({ success: true, theme: theme ?? "" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Create or update theme
router[ROUTES.CREATE_THEME.method.toLowerCase()](
  ROUTES.CREATE_THEME.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const { theme } = req.body;

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNilOrEmpty(theme)) {
        return res.status(400).json({ error: "Missing required theme data" });
      }

      const savedTheme = await createOrUpdateTheme({
        theme,
        userId: auth0Id,
      });

      res.status(200).json({ success: true, theme: savedTheme });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

module.exports = router;
