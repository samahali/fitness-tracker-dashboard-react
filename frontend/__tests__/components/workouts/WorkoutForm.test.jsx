import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"

// Mock the workoutSlice module and define mock function inside vi.mock to avoid hoisting issues
vi.mock("../../../src/redux/slices/workoutSlice", () => {
  return {
    addWorkout: vi.fn(),  // Declare the function directly inside the mock
    default: (state = { workouts: [], loading: false, error: null }, action) => state,
  }
})

// Mock the icons
vi.mock("react-icons/fa", () => ({
  FaRunning: () => <div data-testid="running-icon">Running</div>,
  FaDumbbell: () => <div data-testid="dumbbell-icon">Dumbbell</div>,
  FaBalanceScale: () => <div data-testid="balance-icon">Balance</div>,
  FaEllipsisH: () => <div data-testid="ellipsis-icon">Ellipsis</div>,
  FaPlus: () => <div data-testid="plus-icon">Plus</div>,
}))

vi.mock("react-icons/gr", () => ({
  GrYoga: () => <div data-testid="yoga-icon">Yoga</div>,
}))

// Import WorkoutForm after mocking
import WorkoutForm from "../../../src/components/workouts/WorkoutForm"
import { addWorkout } from "../../../src/redux/slices/workoutSlice"

describe("WorkoutForm Component", () => {
  let store
  let onSuccess

  beforeEach(() => {
    // Reset the store before each test
    store = configureStore({
      reducer: {
        workouts: (state = { workouts: [], loading: false, error: null }) => state,
      },
    })

    // Mock the onSuccess callback
    onSuccess = vi.fn()

    // Reset mocks
    vi.clearAllMocks()

    // Setup the mock implementation for addWorkout
    addWorkout.mockReturnValue({
      type: "workouts/addWorkout",
      payload: {},
    })
  })

  it("renders the form correctly", () => {
    render(
      <Provider store={store}>
        <WorkoutForm onSuccess={onSuccess} />
      </Provider>,
    )

    // Check if the form title is rendered
    expect(screen.getByText("Log New Workout")).toBeInTheDocument()

    // Check if form fields are rendered
    expect(screen.getByLabelText("Exercise Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Duration (minutes)")).toBeInTheDocument()
    expect(screen.getByLabelText("Calories Burned (optional)")).toBeInTheDocument()
    expect(screen.getByLabelText("Notes (optional)")).toBeInTheDocument()

    // Check if submit button is rendered
    expect(screen.getByText("Log Workout")).toBeInTheDocument()
  })

  it("submits the form with correct data", () => {
    // Mock the unwrap method
    addWorkout.mockReturnValue({
      type: "workouts/addWorkout",
      payload: {},
      unwrap: vi.fn().mockResolvedValue({}),
    })

    render(
      <Provider store={store}>
        <WorkoutForm onSuccess={onSuccess} />
      </Provider>,
    )

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Exercise Name"), {
      target: { value: "Running" },
    })

    fireEvent.change(screen.getByLabelText("Duration (minutes)"), {
      target: { value: "30" },
    })

    fireEvent.change(screen.getByLabelText("Calories Burned (optional)"), {
      target: { value: "300" },
    })

    fireEvent.change(screen.getByLabelText("Notes (optional)"), {
      target: { value: "Good workout" },
    })

    // Submit the form
    fireEvent.click(screen.getByText("Log Workout"))

    // Check if addWorkout was called with the correct data
    expect(addWorkout).toHaveBeenCalledWith({
      type: "cardio",
      exercise: "Running",
      duration: 30,
      caloriesBurned: 300,
      notes: "Good workout",
    })
  })
})
