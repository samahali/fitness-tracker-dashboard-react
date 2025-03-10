const mongoose = require("mongoose");

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

module.exports = Workout;
