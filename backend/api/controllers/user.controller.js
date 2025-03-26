/**
 * User Controller.
 *
 * This module handles user-related operations, including:
 * - User registration.
 * - Profile updates.
 * - Avatar uploads.
 * - Fetching user details.
 *
 * @module userController
 *
 * @requires ../models/index.js - User model for database operations.
 * @requires ../config/index.js - Cloudinary config for image uploads.
 * @requires path - Node.js path module for file handling.
 * @requires fs - Node.js file system module for async operations.
 * @requires url - URL module to get the directory path.
 * @requires ../../utils/index.js - Logger utility for debugging.
 */

import { User } from "../models/index.js";
import { cloudinary } from "../config/index.js";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { logger } from "../../utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create a new user account.
 *
 * @async
 * @function
 * @param {Object} req - Express request object containing user details.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Returns success message and user object (without password).
 */
const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, age, gender, weight, height } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next({ status: 400, message: "Email already in use" });
    }

    // Create and save the new user
    const newUser = new User({ firstName, lastName, email, password, age, gender, weight, height });
    await newUser.save();

    // Remove password before sending response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    next(error); // Pass error to middleware
  }
};

/**
 * Update user profile details.
 *
 * @async
 * @function
 * @param {Object} req - Express request object containing user update data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Returns updated user details.
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, age, gender, weight, height } = req.body;

    if (req.body.email !== req.user.email) {
      return next({ status: 400, message: "Email cannot be changed." });
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, age, gender, weight, height },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next({ status: 404, message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(`Error updating profile: ${error.message}`);
    next(error);
  }
};

/**
 * Upload and update user profile avatar.
 *
 * @async
 * @function
 * @param {Object} req - Express request object containing image file.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Returns success message and new profile image URL.
 */
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next({ status: 400, message: "No file uploaded!" });
    }

    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return next({ status: 404, message: "User not found!" });
    }

    // **Delete old image from Cloudinary if exists**
    if (user.profileImage) {
      try {
        const oldImagePublicId = user.profileImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`profile_pictures/${oldImagePublicId}`);
        logger.info(`Deleted old image: ${oldImagePublicId}`);
      } catch (deleteError) {
        logger.error(`Failed to delete old image: ${deleteError}`);
      }
    }

    // **Ensure 'uploads' directory exists**
    const uploadDir = path.join(__dirname, "../uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // **Save buffer to a temporary file**
    const tempPath = path.join(uploadDir, req.file.originalname);
    await fs.writeFile(tempPath, req.file.buffer);

    // **Upload to Cloudinary**
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "profile_pictures",
      timeout: 60000,
    });

    // **Delete the temporary file**
    await fs.unlink(tempPath);
    logger.info(`Cloudinary Upload Success: ${result.secure_url}`);

    // **Update user with new profile image**
    user.profileImage = result.secure_url;
    await user.save();

    res.status(200).json({ message: "Uploaded Successfully!", profileImage: result.secure_url });

  } catch (error) {
    logger.error(`Upload error: ${error.message}`);
    next(error);
  }
};

/**
 * Get user details.
 *
 * @function
 * @param {Object} req - Express request object containing user information.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Returns the logged-in user's details.
 */
const getUserDetails = (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

export { createUser, updateProfile, getUserDetails, uploadAvatar };
