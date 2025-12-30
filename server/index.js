// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// database
const { initializeDatabase, closeDatabase } = require("./database/index.js");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
initializeDatabase()
  .then(() => {
    console.log("Database connected");

    // Load routes only after database is connected
    const routes = require("./routes/index.js");
    app.use(routes);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\nShutting down gracefully...");
      await closeDatabase();
      process.exit(0);
    });
  })
  .catch((err) => {
    console.log({
      message: "Database connection error:",
      error: err.message,
    });
    process.exit(1);
  });
