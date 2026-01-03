const mongoose = require("mongoose");

// constants
const { DB_URI, NOTE_DEFAULT } = require("../constants/index.js");

const initializeDatabase = async () => {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Connecting to MongoDB... (attempt ${attempt}/${maxRetries})`,
      );
      const dbConnection = await mongoose.connect(DB_URI, {
        serverSelectionTimeoutMS: 10000, // Increased to 10 seconds
        socketTimeoutMS: 45000,
      });
      console.log("MongoDB connected successfully");
      return dbConnection;
    } catch (error) {
      lastError = error;
      console.error(
        `MongoDB connection attempt ${attempt} failed:`,
        error.message,
      );

      if (attempt < maxRetries) {
        console.log(`Retrying in 2 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  console.error("MongoDB connection failed after all retries");
  throw lastError;
};

const notesSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: false, default: NOTE_DEFAULT.title },
  text: { type: String, required: false, default: NOTE_DEFAULT.text },
  color: { type: String, required: false, default: NOTE_DEFAULT.color },
  highlighted: {
    type: Boolean,
    required: false,
    default: NOTE_DEFAULT.highlighted,
  },
  height: { type: Number, required: false, default: NOTE_DEFAULT.height },
  orderId: { type: Number, required: false, default: NOTE_DEFAULT.orderId },
  isHtml: { type: Boolean, required: false, default: NOTE_DEFAULT.isHtml },
  createdAt: { type: Date, required: false, default: NOTE_DEFAULT.createdAt },
  updatedAt: { type: Date, required: false, default: NOTE_DEFAULT.updatedAt },
  collapsed: {
    type: Boolean,
    required: false,
    default: NOTE_DEFAULT.collapsed,
  },
});

const usersSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: false },
  name: { type: String, required: false },
});

const themesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  theme: { type: String, required: true },
});

const users = mongoose.model("User", usersSchema, "users-collection");
const notes = mongoose.model("Note", notesSchema, "notes-collection");
const Theme = mongoose.model("Theme", themesSchema, "theme-collection");

// User database methods
const createOrUpdateUser = async (userData) => {
  const { auth0Id, email, name } = userData;

  try {
    const existingUser = await users.findOne({ auth0Id });

    if (existingUser) {
      // Update existing user
      existingUser.email = email;
      existingUser.name = name;
      await existingUser.save();
      return existingUser;
    } else {
      // Create new user
      const newUser = new users({
        userId: auth0Id, // Use auth0Id as userId
        auth0Id,
        email,
        name,
      });
      await newUser.save();
      return newUser;
    }
  } catch (error) {
    throw new Error(`Error creating/updating user: ${error.message}`);
  }
};

const getUserByAuth0Id = async (auth0Id) => {
  try {
    return await users.findOne({ auth0Id });
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// Themes database methods
const createOrUpdateTheme = async (themeData) => {
  const { theme, userId } = themeData;

  try {
    // Use findOneAndUpdate with upsert to avoid race conditions
    const updatedTheme = await Theme.findOneAndUpdate(
      { userId }, // filter
      { theme }, // update
      {
        new: true, // return the updated document
        upsert: true, // create if doesn't exist
        runValidators: true, // run schema validators
      },
    );

    return updatedTheme;
  } catch (error) {
    throw new Error(`Error creating/updating theme: ${error.message}`);
  }
};

const getThemeByUserId = async (userId) => {
  try {
    const currentTheme = await Theme.findOne({ userId }).sort({ _id: -1 });
    return currentTheme;
  } catch (error) {
    throw new Error(`Error fetching theme: ${error.message}`);
  }
};

// Notes database methods
const createNote = async (noteData) => {
  const {
    id = NOTE_DEFAULT.id,
    userId,
    title = NOTE_DEFAULT.title,
    text = NOTE_DEFAULT.text,
    color = NOTE_DEFAULT.color,
    highlighted = NOTE_DEFAULT.highlighted,
    height = NOTE_DEFAULT.height,
    orderId = NOTE_DEFAULT.orderId,
    isHtml = NOTE_DEFAULT.isHtml,
    createdAt = NOTE_DEFAULT.createdAt,
    updatedAt = NOTE_DEFAULT.updatedAt,
    collapsed = NOTE_DEFAULT.collapsed,
  } = noteData;

  try {
    const newNote = new notes({
      id,
      userId,
      title,
      text,
      color,
      highlighted,
      height,
      orderId,
      isHtml,
      createdAt,
      updatedAt,
      collapsed,
    });
    await newNote.save();
    return newNote;
  } catch (error) {
    throw new Error(`Error creating note: ${error.message}`);
  }
};

const getNotesByUserId = async (userId) => {
  try {
    const userNotes = await notes.find({ userId }).sort({ orderId: 1 });
    return userNotes;
  } catch (error) {
    throw new Error(`Error fetching notes: ${error.message}`);
  }
};

const updateNote = async (noteId, userId, updateData) => {
  try {
    const note = await notes.findOne({ id: noteId, userId });

    if (!note) {
      throw new Error("Note not found or unauthorized");
    }

    // Update fields
    if (updateData.title !== undefined) note.title = updateData.title;
    if (updateData.text !== undefined) note.text = updateData.text;
    if (updateData.color !== undefined) note.color = updateData.color;
    if (updateData.highlighted !== undefined)
      note.highlighted = updateData.highlighted;
    if (updateData.height !== undefined) note.height = updateData.height;
    if (updateData.orderId !== undefined) note.orderId = updateData.orderId;
    if (updateData.isHtml !== undefined) note.isHtml = updateData.isHtml;
    if (updateData.updatedAt !== undefined)
      note.updatedAt = updateData.updatedAt;
    if (updateData.collapsed !== undefined)
      note.collapsed = updateData.collapsed;

    await note.save();
    return note;
  } catch (error) {
    throw new Error(`Error updating note: ${error.message}`);
  }
};

const deleteNote = async (noteId, userId) => {
  try {
    const result = await notes.deleteOne({ id: noteId, userId });

    if (result.deletedCount === 0) {
      throw new Error("Note not found or unauthorized");
    }

    return { success: true, message: "Note deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting note: ${error.message}`);
  }
};

const deleteAllNotesByUserId = async (userId) => {
  try {
    const result = await notes.deleteMany({ userId });
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    throw new Error(`Error deleting notes: ${error.message}`);
  }
};

const bulkUpdateNotes = async (userId, notesArray) => {
  try {
    // Ensure all notes belong to the user
    const bulkOps = notesArray.map((note) => {
      const {
        text = NOTE_DEFAULT.text,
        id = NOTE_DEFAULT.id,
        title = NOTE_DEFAULT.title,
        color = NOTE_DEFAULT.color,
        highlighted = NOTE_DEFAULT.highlighted,
        height = NOTE_DEFAULT.height,
        orderId = NOTE_DEFAULT.orderId,
        isHtml = NOTE_DEFAULT.isHtml,
        collapsed = NOTE_DEFAULT.collapsed,
        createdAt = NOTE_DEFAULT.createdAt,
        updatedAt = Date.now(), // Always update timestamp for bulk operations
      } = note;

      return {
        updateOne: {
          filter: { id, userId },
          update: {
            $set: {
              userId,
              title,
              text,
              color,
              highlighted,
              ...(height !== undefined && { height }),
              orderId,
              isHtml,
              collapsed,
              createdAt,
            },
            $currentDate: {
              updatedAt: true, // This forces MongoDB to always update the timestamp
            },
          },
          upsert: true,
        },
      };
    });

    const result = await notes.bulkWrite(bulkOps);
    console.log("Bulk update result:", {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      upsertedCount: result.upsertedCount,
    });

    return {
      success: true,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      upsertedCount: result.upsertedCount,
    };
  } catch (error) {
    console.error("Bulk update error:", error);
    throw new Error(`Error bulk updating notes: ${error.message}`);
  }
};

const closeDatabase = async () => {
  await mongoose.connection.close();
};

module.exports = {
  initializeDatabase,
  closeDatabase,
  notes,
  users,
  // User methods
  createOrUpdateUser,
  getUserByAuth0Id,
  // Notes methods
  createNote,
  getNotesByUserId,
  updateNote,
  deleteNote,
  deleteAllNotesByUserId,
  bulkUpdateNotes,
  // Themes methods
  createOrUpdateTheme,
  getThemeByUserId,
};
