import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api"

// Async thunks
export const fetchGoals = createAsyncThunk("goals/fetchGoals", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/goals")
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch goals")
  }
})

export const addGoal = createAsyncThunk("goals/addGoal", async (goalData, { rejectWithValue }) => {
  try {
    const response = await api.post("/goals", goalData)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add goal")
  }
})

export const updateGoal = createAsyncThunk("goals/updateGoal", async ({ id, goalData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/goals/${id}`, goalData)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update goal")
  }
})

export const updateGoalStatus = createAsyncThunk(
  "goals/updateGoalStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/goals/${id}`, { status })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update goal status")
    }
  },
)

export const deleteGoal = createAsyncThunk("goals/deleteGoal", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/goals/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete goal")
  }
})

// Goal slice
const goalSlice = createSlice({
  name: "goals",
  initialState: {
    goals: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearGoalError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false
        state.goals = action.payload
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Add goal
      .addCase(addGoal.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.loading = false
        state.goals.push(action.payload)
      })
      .addCase(addGoal.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update goal
      .addCase(updateGoal.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.loading = false
        const index = state.goals.findIndex((goal) => goal._id === action.payload._id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update goal status
      .addCase(updateGoalStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateGoalStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.goals.findIndex((goal) => goal._id === action.payload._id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
      })
      .addCase(updateGoalStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete goal
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.loading = false
        state.goals = state.goals.filter((goal) => goal._id !== action.payload)
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Selectors
export const selectGoals = (state) => state.goals.goals

export const selectGoalsByStatus = (state) => {
  const goals = state.goals.goals
  const statusCounts = {
    in_progress: 0,
    achieved: 0,
    failed: 0,
  }

  goals.forEach((goal) => {
    statusCounts[goal.status]++
  })

  return statusCounts
}

export const selectActiveGoals = (state) => {
  return state.goals.goals.filter((goal) => goal.status === "in_progress")
}

export const { clearGoalError } = goalSlice.actions
export default goalSlice.reducer

