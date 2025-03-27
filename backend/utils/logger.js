/**
 * Logger Configuration using Winston and Daily Rotate File.
 *
 * This module sets up a Winston logger with the following features:
 * - Logs messages to both console and rotating log files.
 * - Uses the `winston-daily-rotate-file` transport to create new log files daily.
 * - Compresses old log files to save space.
 * - Maintains log files for 14 days before deletion.
 * - Formats logs with timestamps and a readable message structure.
 *
 * @module logger
 *
 * @requires winston - A logging library for Node.js.
 * @requires winston-daily-rotate-file - A Winston transport for rotating log files.
 *
 * @constant {winston.Logger} logger - Configured Winston logger instance.
 *
 * @example
 * import { logger } from './logger.js';
 * logger.info('Application started');
 * logger.error('An error occurred');
 */
import winston from "winston";
import "winston-daily-rotate-file";

// Define a transport for rotating log files
const transport = new winston.transports.DailyRotateFile({
  filename: "logs/application-%DATE%.log", // Log file name format
  datePattern: "YYYY-MM-DD", // New file per day
  zippedArchive: true, // Compress old logs
  maxSize: "20m", // Max file size before rotating
  maxFiles: "14d", // Keep logs for 14 days
});

// Create a Winston logger instance
export const logger = winston.createLogger({
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
