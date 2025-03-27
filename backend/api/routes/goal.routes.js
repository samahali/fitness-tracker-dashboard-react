/**
 * Express Goals Router Configuration.
 *
 * This module sets up an Express router for goal-related routes.
 * It includes endpoints for retrieving, adding, updating, and deleting goals.
 * All routes are protected by authentication middleware to ensure only
 * authenticated users can access them.
 *
 * @module goalsRouter
 *
 * @requires express - A fast web framework for Node.js.
 * @requires ../controllers/index.js - Goal controllers handling user actions.
 * @requires ../middlewares/index.js - Middleware for authentication handling.
 *
 * @constant {express.Router} router - Configured Express goals router instance.
 *
 * @example
 * import goalsRouter from './goals.routes.js';
 * app.use('/goals', goalsRouter);
 */
import express from "express";
import {goalController} from "../controllers/index.js";

import { authMiddleware} from "../middlewares/index.js";

const router = express.Router();

// Routes for goals
router.get('', authMiddleware, goalController.getGoals); // Get all goals for the logged-in user
router.post('', authMiddleware, goalController.addGoal); // Add a new goal
router.put('/:id', authMiddleware, goalController.updateGoal); // Update a goal
router.delete('/:id', authMiddleware, goalController.deleteGoal); // Delete a goal

export default router;
