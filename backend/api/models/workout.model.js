/**
 * Mongoose Schema for Workouts.
 *
 * This schema defines the structure for storing user workouts, including 
 * type, exercise, duration, calories burned, and optional notes.
 * Each workout is associated with a user.
 *
 * @module Workout
 *
 * @requires mongoose - MongoDB ODM for Node.js.
 *
 * @constant {mongoose.Schema} workoutSchema - Schema definition for workouts.
 *
 * @example
 * import Workout from './models/workout.model.js';
 * const workout = new Workout({ user: userId, type: 'cardio', exercise: 'Running', duration: 30 });
 * await workout.save();
 */
import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["cardio", "strength", "flexibility", "balance", "other"], // Predefined workout types
    },
    exercise: {
      type: String,
      required: true, // Example: "Running", "Bench Press", "Yoga"
      trim: true, // Removes extra spaces
    },
    duration: {
      type: Number,
      required: true, // Duration in minutes
      min: [1, "Duration must be at least 1 minute"], // Prevents negative or 0 values
    },
    caloriesBurned: {
      type: Number,
      default: 0, // Avoids `undefined` values
    },
    notes: {
      type: String,
      trim: true, // Ensures clean input
    },
  },
  { timestamps: true } // Automatically adds `createdAt` & `updatedAt`
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
