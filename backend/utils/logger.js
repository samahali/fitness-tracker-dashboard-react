const winston = require("winston");
require("winston-daily-rotate-file");

// Define a transport for rotating log files
const transport = new winston.transports.DailyRotateFile({
  filename: "logs/application-%DATE%.log", // Log file name format
  datePattern: "YYYY-MM-DD", // New file per day
  zippedArchive: true, // Compress old logs
  maxSize: "20m", // Max file size before rotating
  maxFiles: "14d", // Keep logs for 14 days
});

// Create a Winston logger instance
const logger = winston.createLogger({
  level: "info", // Log level (info, error, warn, debug, etc.)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    transport, // File logging
    new winston.transports.Console(), // Console logging
  ],
});

module.exports = logger;
