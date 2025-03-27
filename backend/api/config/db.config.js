
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

    // Use the correct DB URI based on the environment
    const mongoUri = process.env.NODE_ENV === "test" ? process.env.MONGO_TEST_URI : process.env.MONGO_URI;

    if (!mongoUri) {
      logger.error("Missing MongoDB connection string");
      process.exit(1);
    }

    try {
      this.connection = await mongoose.connect(mongoUri);
      logger.info(`MongoDB Connected: ${mongoUri}`);
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
export default dbInstance ;
