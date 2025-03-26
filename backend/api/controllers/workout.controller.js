import {Workout} from "../models/index.js";
import { logger } from "../../utils/index.js";

/**
 * Fetch all workouts for the logged-in user.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} List of workouts.
 */
const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user.userId }); // Find workouts for the authenticated user
    res.status(200).json(workouts);
  } catch (error) {
    logger.error(`Error fetching workouts: ${error.message}`);
    next(error);  
  }
};

/**
 * Add a new workout for the logged-in user.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} The created workout.
 */
const addWorkout = async (req, res, next) => {
  try {
    const { type, exercise, duration, caloriesBurned, notes } = req.body;
    
    const newWorkout = new Workout({
      user: req.user.userId, // Attach the user ID from the authenticated user
      type,
      exercise,
      duration,
      caloriesBurned,
      notes,
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout); // Return the created workout
  } catch (error) {
    logger.error(`Error adding workout: ${error.message}`);
    next(error);
  }
};

/**
 * Update an existing workout.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} The updated workout.
 */
const updateWorkout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, exercise, duration, caloriesBurned, notes } = req.body;

    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: id, user: req.user.userId }, // Ensure the workout belongs to the logged-in user
      { type, exercise, duration, caloriesBurned, notes },
      { new: true } // Return the updated workout
    );

    if (!updatedWorkout) {
      return next({ status: 404, message: "Workout not found" });
    }

    res.status(200).json(updatedWorkout);
  } catch (error) {
    logger.error(`Error updating workout: ${error.message}`);
    next(error);
  }
};

/**
 * Delete a workout.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} Deletion confirmation message.
 */
const deleteWorkout = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedWorkout = await Workout.findOneAndDelete({
      _id: id,
      user: req.user.userId, // Ensure the workout belongs to the logged-in user
    });

    if (!deletedWorkout) {
      return next({ status: 404, message: "Workout not found" });
    }

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting workout: ${error.message}`);
    next(error);
  }
};

export {
  getWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout,
};
