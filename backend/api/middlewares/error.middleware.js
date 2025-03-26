/**
 * Error Handling Middleware.
 *
 * This middleware captures and logs errors that occur during request processing.
 * It sends a JSON response with the error status and message, ensuring a consistent
 * error-handling mechanism across the application.
 *
 * @module errorMiddleware
 *
 * @requires ../../utils/index.js - Utility module containing the logger instance.
 *
 * @function errorMiddleware
 * @param {Object} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} 500 - If no specific status is provided, defaults to Internal Server Error.
 *
 * @example
 * import errorMiddleware from './middlewares/error.middleware.js';
 * app.use(errorMiddleware);
 */
import { logger } from "../../utils/index.js";
const errorMiddleware = (err, req, res, next) => {
    logger.error(`Error: ${err}`);
    res.status(err.status || 500).json({
      error: true,
      message: err.message || "Internal Server Error",
    });
  };
  
export default errorMiddleware;
  