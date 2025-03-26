/**
 * Goals Controller.
 *
 * This module handles CRUD operations for user goals, including:
 * - Fetching all goals for the logged-in user.
 * - Adding new goals.
 * - Updating existing goals.
 * - Deleting goals.
 *
 * @module goalsController
 *
 * @requires ../models/index.js - Goal model for database operations.
 * @requires ../../utils/index.js - Logger utility for error tracking.
 *
 * @function getGoals - Retrieves all goals for the authenticated user.
 * @function addGoal - Creates a new goal for the user.
 * @function updateGoal - Updates an existing goal.
 * @function deleteGoal - Deletes a specified goal.
 *
 * @example
 * import { getGoals, addGoal, updateGoal, deleteGoal } from "./goalsController";
 * 
 * router.get("/", authMiddleware, getGoals);
 * router.post("/", authMiddleware, addGoal);
 * router.put("/:id", authMiddleware, updateGoal);
 * router.delete("/:id", authMiddleware, deleteGoal);
 */

import { Goal } from "../models/index.js";
import { logger } from '../../utils/index.js';

/**
 * Fetch all goals for the current user.
 *
 * @async
 * @function
 * @param {Object} req - Express request object containing the user ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Returns an array of goal objects.
 */
const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.userId }); // Find goals related to the logged-in user
    res.json(goals);
  } catch (error) {
    logger.error(`Error deleting goal: ${error.message}`);
    next(error);
  }
};

/**
 * Add a new goal for the user.
 *
 * @async
 * @function
 * @param {Object} req - Express request object containing goal details.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Returns the newly created goal.
 */
const addGoal = async (req, res, next) => {
  const { goalType, targetValue, unit, deadline } = req.body;

  if (!goalType || !targetValue || !unit) {
    return next({ status: 400, message: "Goal type, target value, and unit are required" });
  }

  try {
    const newGoal = new Goal({
      goalType,
      targetValue,
      unit,
      deadline,
      user: req.user.userId, // Attach the logged-in user to the goal
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    logger.error(`Error deleting goal: ${error.message}`);
    next(error);
  }
};

/**
 * Update an existing goal.
 *
 * @async
 * @function
 * @param {Object} req - Express request object containing updated goal details.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Returns the updated goal object.
 */
const updateGoal = async (req, res, next) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() }, // Update with new data
      { new: true }
    );
    if (!updatedGoal) {
      return next({ status: 404, message: "Goal not found" });
    }
    res.json(updatedGoal);
  } catch (error) {
    logger.error(`Error deleting goal: ${error.message}`);
    next(error);
  }
};

/**
 * Delete a goal by ID.
 *
 * @async
 * @function
 * @param {Object} req - Express request object containing goal ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {void} Returns a 204 status on successful deletion.
 */
const deleteGoal = async (req, res, next) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) {
      return next({ status: 404, message: "Goal not found" });
    }
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting goal: ${error.message}`);
    next(error);
  }
};

export {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
};
