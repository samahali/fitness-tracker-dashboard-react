import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import workoutReducer from "./slices/workoutSlice"
import goalReducer from "./slices/goalSlice"
import themeReducer from "./slices/themeSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workouts: workoutReducer,
    goals: goalReducer,
    theme: themeReducer,
  },
})

