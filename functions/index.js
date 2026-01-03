// Firebase Functions v2 - Notes App API v1.0.1
const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration - allow all origins
const corsMiddleware = cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route (before database initialization)
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Notes API is running" });
});

// Import database initialization
const { initializeDatabase } = require("./server/database/index.js");

// Initialize database
let dbInitialized = false;
let dbInitializing = false;

const ensureDbConnection = async () => {
  if (dbInitialized) return;
  if (dbInitializing) {
    // Wait for ongoing initialization
    while (dbInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return;
  }

  dbInitializing = true;
  try {
    console.log("Initializing database...");
    await initializeDatabase();
    dbInitialized = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  } finally {
    dbInitializing = false;
  }
};

// Import routes
const routes = require("./server/routes/index.js");

// Wrap routes with database initialization check
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await ensureDbConnection();
      next();
    } catch (err) {
      console.error("Database connection error:", err);
      return res.status(503).json({
        error: "Database temporarily unavailable",
        details: err.message,
      });
    }
  } else {
    next();
  }
});

app.use(routes);

// For local testing/emulator
if (process.env.FUNCTIONS_EMULATOR) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Export the Express app as a Firebase 2nd gen Function
exports.api = onRequest(
  {
    maxInstances: 10,
    timeoutSeconds: 60,
    memory: "512MiB",
    invoker: "public",
  },
  app,
);
