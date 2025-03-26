/**
 * Authentication Middleware.
 *
 * This middleware verifies the JSON Web Token (JWT) provided in the request headers.
 * If the token is valid, the decoded user data is attached to `req.user`, allowing 
 * access to protected routes. If invalid or expired, an unauthorized error is returned.
 *
 * @module authenticate
 *
 * @requires jsonwebtoken - Library for signing and verifying JWTs.
 * @requires ../config/index.js - Configuration file containing the JWT secret key.
 *
 * @function authenticate
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} 401 - If no token is provided or if the token is invalid/expired.
 *
 * @example
 * import authenticate from './middlewares/auth.middleware.js';
 * app.get('/protected-route', authenticate, (req, res) => {
 *   res.json({ message: "You have access", user: req.user });
 * });
 */
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/index.js";

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;
