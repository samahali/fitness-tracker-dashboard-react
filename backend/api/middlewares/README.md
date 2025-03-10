# Middlewares
This folder contains reusable middleware functions.

## 📌 Files
- `auth.middleware.js` - Protects routes by verifying JWT tokens
- `error.middleware.js` - Handles errors globally

## 📍Example Middleware Usage
```javascript
const authMiddleware = require("../middlewares/auth.middleware");
app.use("/api/workouts", authMiddleware, workoutRoutes);
