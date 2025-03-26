/**
 * Application Configuration Index.
 *
 * This module consolidates and exports all configuration settings, including:
 * - Server settings (port, CORS options)
 * - Database connection utility
 * - JWT authentication settings
 * - Cloudinary configuration
 *
 * @module configIndex
 *
 * @requires ./server.config.js - Server-related configurations.
 * @requires ./db.config.js - Database connection settings.
 * @requires ./jwt.config.js - JWT authentication configurations.
 * @requires ./cloudinary.config.js - Cloudinary integration settings.
 *
 * @exports {number} port - The port number on which the server runs.
 * @exports {Object} corsOptions - CORS configuration settings.
 * @exports {Function} connectDB - Function to establish a MongoDB connection.
 * @exports {string} jwtSecret - Secret key for signing JWTs.
 * @exports {string} jwtExpiresIn - Expiration time for JWTs.
 * @exports {Object} cloudinary - Cloudinary instance for media uploads.
 *
 * @example
 * import { port, connectDB } from "./config/index.js";
 * connectDB();
 * app.listen(port, () => console.log(`Server running on port ${port}`));
 */
import { port, corsOptions } from "./server.config.js";
import dbInstance from "./db.config.js";
import { jwtSecret, jwtExpiresIn } from "./jwt.config.js";
import cloudinary from "./cloudinary.config.js";

export {
  port,
  corsOptions,
  dbInstance,
  jwtSecret,
  jwtExpiresIn,
  cloudinary,
}