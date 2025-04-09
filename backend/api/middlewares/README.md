# Middlewares
This folder contains reusable middleware functions.

## 📌 Files
- `auth.middleware.js` - Protects routes by verifying JWT tokens
- `error.middleware.js` - Handles errors globally

## 📍Example Middleware Usage
```javascript
import authMiddleware from "../middlewares/auth.middleware";
app.use("/api/workouts", authMiddleware, workoutRoutes);
