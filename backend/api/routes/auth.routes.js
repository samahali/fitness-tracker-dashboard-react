/**
 * Express Authentication Router Configuration.
 *
 * This module sets up an Express router for authentication-related routes.
 * It includes endpoints for user registration, login, and logout,
 * utilizing authentication middleware where necessary.
 *
 * @module authRouter
 *
 * @requires express - A fast web framework for Node.js.
 * @requires ../controllers/index.js - Authentication controllers handling user actions.
 * @requires ../middlewares/index.js - Middleware for authentication handling.
 *
 * @constant {express.Router} router - Configured Express authentication router instance.
 *
 * @example
 * import authRouter from './auth.routes.js';
 * app.use('/auth', authRouter);
 */
import express from "express";
import {authController} from "../controllers/index.js";

import {authMiddleware} from "../middlewares/index.js"; // Import authentication middleware

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);

export default router;
