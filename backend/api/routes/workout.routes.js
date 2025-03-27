/**
 * Express Workout Router Configuration.
 *
 * This module sets up an Express router for workout-related routes.
 * It includes endpoints for retrieving, adding, updating, and deleting workouts.
 * Authentication middleware ensures only logged-in users can access these routes.
 *
 * @module workoutRouter
 *
 * @requires express - A fast web framework for Node.js.
 * @requires ../controllers/index.js - Workout controllers handling workout-related actions.
 * @requires ../middlewares/index.js - Middleware for authentication handling.
 *
 * @constant {express.Router} router - Configured Express workout router instance.
 *
 * @example
 * import workoutRouter from './workout.routes.js';
 * app.use('/workouts', workoutRouter);
 */
import express from "express";
import {workoutController} from "../controllers/index.js";
import {authMiddleware} from "../middlewares/index.js"; // Ensure the user is authenticated

const router = express.Router();

// Routes for workouts
router.get('/', authMiddleware, workoutController.getWorkouts); // Get all workouts for logged-in user
router.post('/', authMiddleware, workoutController.addWorkout); // Add a new workout
router.put('/:id', authMiddleware, workoutController.updateWorkout); // Update a workout
router.delete('/:id', authMiddleware, workoutController.deleteWorkout); // Delete a workout

export default router