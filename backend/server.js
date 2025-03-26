import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import api from "./api/index.js"; // Import API
import { dbInstance, port, corsOptions } from "./api/config/index.js"; // Import DB connection, server port
import { logger } from "./utils/index.js";
import { errorMiddleware } from "./api/middlewares/index.js";
const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API Routes
app.use("/api", api);

// Healthcheck Route
app.get("/", (req, res) => {
  logger.info("Healthcheck route accessed"); // Log access
  res.status(200).json({ message: "Fitness Tracker API Running!" });
});

// Global Error Handling Middleware (MUST be last middleware)
app.use(errorMiddleware);


// Connect to MongoDB and then start the server
const startServer = async () => {
  await dbInstance.connect(); // Ensures a single MongoDB connection
  if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => logger.info(`Server running on port ${port}`));
    // app.listen(port, () => console.log(`Server running on port ${port}`));
  }
};

// Start the server
startServer();
export default app;
