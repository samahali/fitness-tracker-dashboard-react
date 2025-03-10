const express = require("express");
const userRoutes = require("./user.routes");
// const workoutRoutes = require("./workout.routes");
// const goalRoutes = require("./goal.routes");
// const authRoutes = require("./auth.routes");

const router = express.Router();

router.use("/users", userRoutes);
// router.use("/workouts", workoutRoutes);
// router.use("/goals", goalRoutes);
// router.use("/auth", authRoutes);

module.exports = router;
