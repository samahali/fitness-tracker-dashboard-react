const mongoose = require("mongoose");

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

module.exports = Goal;
