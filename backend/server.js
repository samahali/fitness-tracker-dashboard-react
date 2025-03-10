const express = require("express");
const cors = require("cors");
require("dotenv").config();
const api = require("./api"); // Import API
const { connectDB, port, corsOptions } = require("./api/config"); // Import DB connection, server port
const { logger } = require("./utils")
const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Use API Routes
app.use("/api", api);

// Healthcheck Route
app.get("/healthcheck", (req, res) => {
  logger.info("Healthcheck route accessed"); // Log access
  res.status(200).json({ message: "Fitness Tracker API Running!" });
});

// Connect to MongoDB and then start the server
const startServer = async () => {
  await connectDB(); // No need for `.then()` since connectDB already handles errors
  app.listen(port, () => logger.info(`Server running on port ${port}`));
};

// Start the server
startServer();
// app.listen(port, () => logger.info(`Server running on port ${port}`));
