import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import api from "./api/index.js";
import { dbInstance, port, corsOptions } from "./api/config/index.js";
import { logger } from "./utils/index.js";
import { errorMiddleware } from "./api/middlewares/index.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API Routes
app.use("/api", api);

// Healthcheck Route
app.get("/", (req, res) => {
  logger.info("Healthcheck route accessed");
  res.status(200).json({ message: "Fitness Tracker API Running!" });
});

// Global Error Handling Middleware
app.use(errorMiddleware);

let server;

const startServer = async () => {
  await dbInstance.connect();
  if (process.env.NODE_ENV !== "test") {
    server = app.listen(port, () => logger.info(`Server running on port ${port}`));
  }
};

const stopServer = async () => {
  if (server && server.listening) {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    logger.info("Server stopped successfully.");
  }

  if (dbInstance.disconnect) {
    await dbInstance.disconnect();
    logger.info("Database connection closed.");
  }
};

// Start the server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app, startServer, stopServer };
