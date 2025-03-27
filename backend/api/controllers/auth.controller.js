/**
 * Authentication Controller.
 *
 * This module handles user authentication-related operations, including:
 * - Registering new users
 * - Logging in existing users
 * - Logging out users
 *
 * @module authController
 *
 * @requires ../models/index.js - User model for database operations.
 * @requires jsonwebtoken - For generating and verifying JWT tokens.
 * @requires ../config/index.js - Configuration settings (JWT secret, expiration time).
 * @requires ../../utils/index.js - Logger utility for error logging.
 *
 * @function register - Handles user registration.
 * @function login - Authenticates users and returns JWT token.
 * @function logout - Logs out users by removing tokens.
 *
 * @example
 * import { register, login, logout } from "./authController";
 *
 * router.post("/register", register);
 * router.post("/login", login);
 * router.post("/logout", authMiddleware, logout);
 */

import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import { jwtSecret, jwtExpiresIn } from "../config/index.js";
import { logger } from "../../utils/index.js";

/**
 * Register a new user.
 * 
 * @async
 * @function
 * @param {Object} req - Express request object containing user details.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Returns a JWT token and user details (excluding password).
 */
export const register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      weight,
      height,
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next({ status: 400, message: "Email is already in use" });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password, // This will be hashed in the user model before saving
      age,
      gender,
      weight,
      height,
    });

    await newUser.save();

    // Remove password before sending response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, ...userResponse },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`)
    next(error); // Pass the error to errorMiddleware
  }
};

/**
 * Log in an existing user.
 *
 * @async
 * @function
 * @param {Object} req - Express request object containing email and password.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Returns a JWT token and user details (excluding password).
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email }).select("+password"); // Include password field

    if (!user) {
      return next({ status: 401, message: "Invalid email or password" });
    }

    // Check if the password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next({ status: 401, message: "Invalid email or password" });
    }

    // Remove password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, ...userResponse }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });

    res.status(200).json({ token, user: userResponse });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
};

/**
 * Log out a user.
 *
 * @async
 * @function
 * @param {Object} req - Express request object containing the authorization token.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Returns a success message upon logout.
 */
export const logout = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return next({ status: 400, message: "No token provided" });

    // Remove the token from the database (If you're storing it)
    await AuthToken.findOneAndDelete({ token });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    next(error);
  }
};
