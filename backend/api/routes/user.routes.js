/**
 * Express User Router Configuration.
 *
 * This module sets up an Express router for user-related routes.
 * It includes endpoints for retrieving user details, updating profiles,
 * and uploading user avatars.
 *
 * @module userRouter
 *
 * @requires express - A fast web framework for Node.js.
 * @requires ../controllers/index.js - User controllers handling user-related actions.
 * @requires ../middlewares/index.js - Middleware for authentication handling.
 * @requires multer - Middleware for handling multipart/form-data (file uploads).
 *
 * @constant {express.Router} router - Configured Express user router instance.
 *
 * @example
 * import userRouter from './user.routes.js';
 * app.use('/users', userRouter);
 */
import express from "express";
import { userController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js"; // Import authentication middleware
import multer from "multer";

// Store the file in memory (can also store in disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Route for user registeration
router.get("/me", authMiddleware, userController.getUserDetails);

// Update user profile
router.put("/profile", authMiddleware, userController.updateProfile);

// upload user avatar 
router.post("/avatar", authMiddleware, upload.single("avatar"), userController.uploadAvatar);

export default router;
