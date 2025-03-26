import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api"

// Async thunks
export const loginUser = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", { email, password })
    const { token, user } = response.data

    // Store token in localStorage
    localStorage.setItem("token", token)
    api.setAuthToken(token)

    return user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed")
  }
})

export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/register", userData)
    const { token, user } = response.data

    // Store token in localStorage
    localStorage.setItem("token", token)
    api.setAuthToken(token)

    return user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed")
  }
})

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return null
    }

    api.setAuthToken(token)
    const response = await api.get("/users/me")
    return response.data
  } catch (err) {
    // Don't remove the token on error - this helps with page refreshes
    // Only remove token if it's an authentication error (401)
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token")
      api.removeAuthToken()
    }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch user")
  }
})

export const updateUserProfile = createAsyncThunk("auth/updateProfile", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.put("/users/profile", userData)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Profile update failed")
  }
})

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    loading: true, // Start with loading true
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token")
      api.removeAuthToken()
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = !!action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        // Don't set isAuthenticated to false here - let the PrivateRoute handle this
      })

      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

