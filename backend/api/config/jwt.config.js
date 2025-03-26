/**
 * JWT Configuration.
 *
 * This module defines and exports configuration settings for JSON Web Tokens (JWT).
 * It retrieves the secret key from environment variables and sets the token expiration time.
 *
 * @module jwtConfig
 *
 * @constant {string} jwtSecret - The secret key used for signing JWTs, retrieved from environment variables.
 * @constant {string} jwtExpiresIn - The expiration time for JWTs (default: "1h").
 *
 * @example
 * import { jwtSecret, jwtExpiresIn } from './config/jwt.js';
 * jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
 */
const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
const jwtExpiresIn = "1h";

export { jwtSecret, jwtExpiresIn };
