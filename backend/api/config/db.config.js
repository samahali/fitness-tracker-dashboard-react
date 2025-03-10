const mongoose = require("mongoose");
const { logger } = require("../../utils");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // No extra options needed in Mongoose 6+
    logger.info(`MongoDB Connected Successfully! ${process.env.MONGO_URI}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit if DB connection fails
  }
};

// Handle MongoDB events
mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB Disconnected! Retrying...");
  connectDB();
});

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB Error: ${err.message}`);
});

module.exports = { connectDB };
