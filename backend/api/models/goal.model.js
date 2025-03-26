/**
 * Mongoose Schema for User Goals.
 *
 * This schema defines the structure for storing user fitness goals,
 * including goal type, target value, unit, deadline, and status.
 * Each goal is associated with a user.
 *
 * @module Goal
 *
 * @requires mongoose - MongoDB ODM for Node.js.
 *
 * @constant {mongoose.Schema} goalSchema - Schema definition for user fitness goals.
 *
 * @example
 * import Goal from './models/goal.js';
 * const goal = new Goal({ user: userId, goalType: 'weight_loss', targetValue: 10, unit: 'kg' });
 * await goal.save();
 */
import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
      index: true, // Indexing for faster queries
    },
    goalType: {
      type: String,
      required: true,
      enum: ["weight_loss", "muscle_gain", "endurance", "strength", "flexibility", "custom"],
    },
    targetValue: {
      type: Number,
      required: true, // Example: Target weight (kg), target running distance (km)
    },
    unit: {
      type: String,
      required: true, // Example: "kg", "km", "minutes"
      default: function () {
        switch (this.goalType) {
          case "weight_loss":
          case "muscle_gain":
            return "kg"; // Default for weight-related goals
          case "endurance":
            return "km"; // Default for endurance
          case "strength":
            return "reps"; // Default for strength training
          case "flexibility":
            return "minutes"; // Default for flexibility goals
          default:
            return ""; // No default for custom goals
        }
      },
    },
    deadline: {
      type: Date,
      required: false, // Optional: Deadline for achieving the goal
    },
    status: {
      type: String,
      enum: ["in_progress", "achieved", "failed"],
      default: "in_progress",
    },
  },
  { timestamps: true } // Automatically adds `createdAt` & `updatedAt`
);

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
