/**
 * MongoDB Connection Singleton Utility.
 *
 * Ensures only a single instance of MongoDB connection is established using Mongoose.
 * Handles automatic reconnection in case of disconnection.
 *
 * @module connectDB
 *
 * @requires mongoose - MongoDB object modeling tool.
 * @requires ../../utils/index.js - Utility module containing the logger instance.
 *
 * @function getDBInstance
 * @async
 * @throws {Error} If the database connection fails, the process exits with status 1.
 *
 * @example
 * import dbInstance from './config/db.config.js';
 * await dbInstance.connect();
 */
import mongoose from "mongoose";
import { logger } from "../../utils/index.js";

class MongoDBSingleton {
  constructor() {
    if (!MongoDBSingleton.instance) {
      this.connect();
      MongoDBSingleton.instance = this;
    }
    return MongoDBSingleton.instance;
  }

  async connect() {
    if (this.connection) return this.connection; // Return existing connection

    if (!process.env.MONGO_URI) {
      logger.error("Missing MongoDB connection string (MONGO_URI)");
      process.exit(1);
    }

    try {
      this.connection = await mongoose.connect(process.env.MONGO_URI);
      logger.info(`MongoDB Connected: ${process.env.MONGO_URI}`);
    } catch (error) {
      logger.error(`MongoDB Connection Error: ${error.message}`);
      process.exit(1);
    }

    this.handleEvents();
    return this.connection;
  }

  handleEvents() {
    mongoose.connection.on("disconnected", async () => {
      logger.warn("MongoDB Disconnected! Retrying...");
      await this.connect();
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB Error: ${err.message}`);
    });
  }
}

// Export a **single instance** of MongoDB connection
const dbInstance = new MongoDBSingleton();
export default dbInstance;
