import { describe, it, expect, vi, beforeEach } from "vitest"
import goalReducer, {
  fetchGoals,
  addGoal,
  updateGoalStatus,
  deleteGoal,
  selectGoalsByStatus,
  selectActiveGoals,
} from "../../src/redux/slices/goalSlice"
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

describe("Goal Slice", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Reducers", () => {
    it("should handle initial state", () => {
      expect(goalReducer(undefined, { type: "unknown" })).toEqual({
        goals: [],
        loading: false,
        error: null,
      })
    })

    it("should handle clearGoalError", () => {
      const state = {
        goals: [],
        loading: false,
        error: "Some error",
      }

      expect(goalReducer(state, { type: "goals/clearGoalError" })).toEqual({
        goals: [],
        loading: false,
        error: null,
      })
    })
  })

  describe("Async Thunks", () => {
    it("should handle fetchGoals.fulfilled", async () => {
      const goals = [
        { _id: "1", goalType: "weight_loss", targetValue: 10, status: "in_progress" },
        { _id: "2", goalType: "muscle_gain", targetValue: 5, status: "achieved" },
      ]

      api.get.mockResolvedValue({ data: goals })

      const dispatch = vi.fn()
      const thunk = fetchGoals()

      await thunk(dispatch, () => ({}))

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock
      const fulfilledAction = calls[calls.length - 1][0]

      expect(fulfilledAction.type).toBe("goals/fetchGoals/fulfilled")
      expect(fulfilledAction.payload).toEqual(goals)
    })

    it("should handle addGoal.fulfilled", async () => {
      const newGoal = { _id: "3", goalType: "endurance", targetValue: 20, status: "in_progress" }
      api.post.mockResolvedValue({ data: newGoal })

      const dispatch = vi.fn()
      const thunk = addGoal({ goalType: "endurance", targetValue: 20 })

      await thunk(dispatch, () => ({}))

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock
      const fulfilledAction = calls[calls.length - 1][0]

      expect(fulfilledAction.type).toBe("goals/addGoal/fulfilled")
      expect(fulfilledAction.payload).toEqual(newGoal)
    })

    it("should handle updateGoalStatus.fulfilled", async () => {
      const updatedGoal = { _id: "1", goalType: "weight_loss", targetValue: 10, status: "achieved" }
      api.put.mockResolvedValue({ data: updatedGoal })

      const dispatch = vi.fn()
      const thunk = updateGoalStatus({ id: "1", status: "achieved" })

      await thunk(dispatch, () => ({}))

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock
      const fulfilledAction = calls[calls.length - 1][0]

      expect(fulfilledAction.type).toBe("goals/updateGoalStatus/fulfilled")
      expect(fulfilledAction.payload).toEqual(updatedGoal)
    })

    it("should handle deleteGoal.fulfilled", async () => {
      api.delete.mockResolvedValue({})

      const dispatch = vi.fn()
      const thunk = deleteGoal("1")

      await thunk(dispatch, () => ({}))

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock
      const fulfilledAction = calls[calls.length - 1][0]

      expect(fulfilledAction.type).toBe("goals/deleteGoal/fulfilled")
      expect(fulfilledAction.payload).toBe("1")
    })
  })

  describe("Selectors", () => {
    it("should count goals by status correctly", () => {
      const state = {
        goals: {
          goals: [
            { _id: "1", status: "in_progress" },
            { _id: "2", status: "achieved" },
            { _id: "3", status: "in_progress" },
            { _id: "4", status: "failed" },
            { _id: "5", status: "in_progress" },
          ],
        },
      }

      const statusCounts = selectGoalsByStatus(state)

      expect(statusCounts).toEqual({
        in_progress: 3,
        achieved: 1,
        failed: 1,
      })
    })

    it("should select active goals correctly", () => {
      const state = {
        goals: {
          goals: [
            { _id: "1", status: "in_progress", goalType: "weight_loss" },
            { _id: "2", status: "achieved", goalType: "muscle_gain" },
            { _id: "3", status: "in_progress", goalType: "endurance" },
            { _id: "4", status: "failed", goalType: "flexibility" },
          ],
        },
      }

      const activeGoals = selectActiveGoals(state)

      expect(activeGoals).toEqual([
        { _id: "1", status: "in_progress", goalType: "weight_loss" },
        { _id: "3", status: "in_progress", goalType: "endurance" },
      ])
    })
  })
})

