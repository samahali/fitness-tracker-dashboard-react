/**
 * Middleware Index File.
 *
 * This module imports and exports all middleware functions, making them
 * easily accessible throughout the application.
 *
 * @module middlewares
 *
 * @requires ./auth.middleware.js - Middleware for authentication handling.
 * @requires ./error.middleware.js - Middleware for centralized error handling.
 *
 * @example
 * import { authMiddleware, errorMiddleware } from "./middlewares";
 * app.use(authMiddleware);
 * app.use(errorMiddleware);
 */
import authMiddleware from "./auth.middleware.js";
import errorMiddleware from "./error.middleware.js";

export {
  authMiddleware,
  errorMiddleware,
};
