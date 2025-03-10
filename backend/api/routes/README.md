# Routes
This folder contains Express route definitions for different API endpoints.

## 📌 Files
- `user.routes.js` - Authentication & user management
- `workout.routes.js` - API endpoints for workout logging
- `goal.routes.js` - API for fitness goals

## 📍Example Route
```javascript
const express = require("express");
const { createWorkout } = require("../controllers/workout.controller");

const router = express.Router();
router.post("/workouts", createWorkout);

module.exports = router;
