# Models
This folder contains all Mongoose schemas defining the database structure.

## 📌 Files
- `user.model.js` - Stores user details (name, email, password)
- `workout.model.js` - Logs workouts (exercise, duration, calories burned)
- `goal.model.js` - Stores user fitness goals

## 📍Example Model
```javascript
import mongoose from "mongoose";
const WorkoutSchema = new mongoose.Schema({
  type: String,
  duration: Number,
  caloriesBurned: Number,
});
module.exports = mongoose.model("Workout", WorkoutSchema);
