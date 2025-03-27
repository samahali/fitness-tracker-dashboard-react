/**
 * Express API Router Configuration.
 *
 * This module sets up the main Express router, integrating different
 * route modules for user management, workouts, goals, and authentication.
 *
 * @module apiRouter
 *
 * @requires express - A fast web framework for Node.js.
 * @requires ./user.routes.js - Routes for user-related operations.
 * @requires ./workout.routes.js - Routes for workout-related operations.
 * @requires ./goal.routes.js - Routes for goal-related operations.
 * @requires ./auth.routes.js - Routes for authentication operations.
 *
 * @constant {express.Router} router - Configured Express API router instance.
 *
 * @example
 * import apiRouter from './api/routes/index.js';
 * app.use('/api', apiRouter);
 */
import express from "express";
import userRoutes from "./user.routes.js";
import workoutRoutes from "./workout.routes.js";
import goalRoutes from "./goal.routes.js";
import authRoutes from "./auth.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/workouts", workoutRoutes);
router.use("/goals", goalRoutes);
router.use("/auth", authRoutes);

export default router;
