import { describe, it, expect, vi, beforeEach } from "vitest"
import workoutReducer, {
  fetchWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  selectWorkoutStats,
  selectWorkoutsByType,
  selectRecentWorkouts,
} from "../../src/redux/slices/workoutSlice"
import api from "../../src/services/api"

// Mock the API service
vi.mock("../../src/services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe("Workout Slice", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Reducers", () => {
    it("should handle initial state", () => {
      expect(workoutReducer(undefined, { type: "unknown" })).toEqual({
        workouts: [],
        loading: false,
        error: null,
      })
    })

    it("should handle clearWorkoutError", () => {
      const state = {
        workouts: [],
        loading: false,
        error: "Some error",
      }

      expect(workoutReducer(state, { type: "workouts/clearWorkoutError" })).toEqual({
        workouts: [],
        loading: false,
        error: null,
      })
    })
  })

  describe("Async Thunks", () => {
    it("should handle fetchWorkouts.fulfilled", async () => {
      const workouts = [
        { _id: "1", exercise: "Running", duration: 30, type: "cardio" },
        { _id: "2", exercise: "Bench Press", duration: 45, type: "strength" },
      ]

      api.get.mockResolvedValue({ data: workouts })

      const dispatch = vi.fn()
      const thunk = fetchWorkouts()

      await thunk(dispatch, () => ({}))

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock
      const fulfilledAction = calls[calls.length - 1][0]

      expect(fulfilledAction.type).toBe("workouts/fetchWorkouts/fulfilled")
      expect(fulfilledAction.payload).toEqual(workouts)
    })

    it("should handle addWorkout.fulfilled", async () => {
      const newWorkout = { _id: "3", exercise: "Swimming", duration: 60, type: "cardio" }
      api.post.mockResolvedValue({ data: newWorkout })

      const dispatch = vi.fn()
      const thunk = addWorkout({ exercise: "Swimming", duration: 60, type: "cardio" })

      await thunk(dispatch, () => ({}))

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock
      const fulfilledAction = calls[calls.length - 1][0]

      expect(fulfilledAction.type).toBe("workouts/addWorkout/fulfilled")
      expect(fulfilledAction.payload).toEqual(newWorkout)
    })

    it("should handle updateWorkout.fulfilled", async () => {
      const updatedWorkout = { _id: "1", exercise: "Jogging", duration: 40, type: "cardio" }
      api.put.mockResolvedValue({ data: updatedWorkout })

      const dispatch = vi.fn()
      const thunk = updateWorkout({ id: "1", workoutData: { exercise: "Jogging", duration: 40 } })

      await thunk(dispatch, () => ({}))

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock
      const fulfilledAction = calls[calls.length - 1][0]

      expect(fulfilledAction.type).toBe("workouts/updateWorkout/fulfilled")
      expect(fulfilledAction.payload).toEqual(updatedWorkout)
    })

    it("should handle deleteWorkout.fulfilled", async () => {
      api.delete.mockResolvedValue({})

      const dispatch = vi.fn()
      const thunk = deleteWorkout("1")

      await thunk(dispatch, () => ({}))

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock
      const fulfilledAction = calls[calls.length - 1][0]

      expect(fulfilledAction.type).toBe("workouts/deleteWorkout/fulfilled")
      expect(fulfilledAction.payload).toBe("1")
    })
  })

  describe("Selectors", () => {
    it("should calculate workout stats correctly", () => {
      const state = {
        workouts: {
          workouts: [
            { _id: "1", duration: 30, caloriesBurned: 300 },
            { _id: "2", duration: 45, caloriesBurned: 450 },
            { _id: "3", duration: 60, caloriesBurned: 600 },
          ],
        },
      }

      const stats = selectWorkoutStats(state)

      expect(stats).toEqual({
        totalWorkouts: 3,
        totalDuration: 135,
        totalCalories: 1350,
      })
    })

    it("should handle empty workouts in stats", () => {
      const state = {
        workouts: {
          workouts: [],
        },
      }

      const stats = selectWorkoutStats(state)

      expect(stats).toEqual({
        totalWorkouts: 0,
        totalDuration: 0,
        totalCalories: 0,
      })
    })

    it("should group workouts by type correctly", () => {
      const state = {
        workouts: {
          workouts: [
            { _id: "1", type: "cardio" },
            { _id: "2", type: "strength" },
            { _id: "3", type: "cardio" },
            { _id: "4", type: "flexibility" },
          ],
        },
      }

      const typeGroups = selectWorkoutsByType(state)

      expect(typeGroups).toEqual({
        cardio: 2,
        strength: 1,
        flexibility: 1,
      })
    })

    it("should select recent workouts correctly", () => {
      const state = {
        workouts: {
          workouts: [
            { _id: "1", createdAt: "2023-01-01T00:00:00.000Z" },
            { _id: "2", createdAt: "2023-01-03T00:00:00.000Z" },
            { _id: "3", createdAt: "2023-01-02T00:00:00.000Z" },
            { _id: "4", createdAt: "2023-01-04T00:00:00.000Z" },
            { _id: "5", createdAt: "2023-01-05T00:00:00.000Z" },
          ],
        },
      }

      const recentWorkouts = selectRecentWorkouts(state, 3)

      expect(recentWorkouts).toEqual([
        { _id: "5", createdAt: "2023-01-05T00:00:00.000Z" },
        { _id: "4", createdAt: "2023-01-04T00:00:00.000Z" },
        { _id: "2", createdAt: "2023-01-03T00:00:00.000Z" },
      ])
    })
  })
})
