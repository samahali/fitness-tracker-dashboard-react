import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api"

// Async thunks
export const fetchWorkouts = createAsyncThunk("workouts/fetchWorkouts", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/workouts")
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch workouts")
  }
})

export const addWorkout = createAsyncThunk("workouts/addWorkout", async (workoutData, { rejectWithValue }) => {
  try {
    const response = await api.post("/workouts", workoutData)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add workout")
  }
})

export const updateWorkout = createAsyncThunk(
  "workouts/updateWorkout",
  async ({ id, workoutData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/workouts/${id}`, workoutData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update workout")
    }
  },
)

export const deleteWorkout = createAsyncThunk("workouts/deleteWorkout", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/workouts/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete workout")
  }
})

// Workout slice
const workoutSlice = createSlice({
  name: "workouts",
  initialState: {
    workouts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWorkoutError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch workouts
      .addCase(fetchWorkouts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.loading = false
        state.workouts = action.payload
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Add workout
      .addCase(addWorkout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addWorkout.fulfilled, (state, action) => {
        state.loading = false
        state.workouts.push(action.payload)
      })
      .addCase(addWorkout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update workout
      .addCase(updateWorkout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateWorkout.fulfilled, (state, action) => {
        state.loading = false
        const index = state.workouts.findIndex((workout) => workout._id === action.payload._id)
        if (index !== -1) {
          state.workouts[index] = action.payload
        }
      })
      .addCase(updateWorkout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete workout
      .addCase(deleteWorkout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.loading = false
        state.workouts = state.workouts.filter((workout) => workout._id !== action.payload)
      })
      .addCase(deleteWorkout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Selectors
export const selectWorkouts = (state) => state.workouts.workouts

export const selectWorkoutStats = (state) => {
  const workouts = state.workouts.workouts
  if (!workouts.length) return { totalWorkouts: 0, totalDuration: 0, totalCalories: 0 }

  const totalWorkouts = workouts.length
  const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0)
  const totalCalories = workouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0)

  return { totalWorkouts, totalDuration, totalCalories }
}

export const selectWorkoutsByType = (state) => {
  const workouts = state.workouts.workouts
  const types = {}

  workouts.forEach((workout) => {
    if (types[workout.type]) {
      types[workout.type]++
    } else {
      types[workout.type] = 1
    }
  })

  return types
}

export const selectRecentWorkouts = (state, limit = 5) => {
  return [...state.workouts.workouts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit)
}

export const { clearWorkoutError } = workoutSlice.actions
export default workoutSlice.reducer

