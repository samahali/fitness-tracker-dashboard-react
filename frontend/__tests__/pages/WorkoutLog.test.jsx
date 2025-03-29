import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import WorkoutLog from "../../src/pages/WorkoutLog"

// Mock the Redux actions
vi.mock("../../src/redux/slices/workoutSlice", () => ({
  fetchWorkouts: vi.fn(() => ({ type: "workouts/fetchWorkouts" })),
}))

// Mock the WorkoutForm and WorkoutList components
vi.mock("../../src/components/workouts/WorkoutForm", () => ({
  default: ({ onSuccess }) => (
    <div data-testid="workout-form">
      Workout Form
      <button onClick={onSuccess} data-testid="mock-success-button">
        Mock Success
      </button>
    </div>
  ),
}))

vi.mock("../../src/components/workouts/WorkoutList", () => ({
  default: () => <div data-testid="workout-list">Workout List</div>,
}))

// Mock the Loader component
vi.mock("../../src/components/common/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}))

// Mock react-icons
vi.mock("react-icons/fa", () => ({
  FaPlus: () => <span data-testid="plus-icon" />,
  FaTimes: () => <span data-testid="times-icon" />,
}))

describe("WorkoutLog Component", () => {
  let store

  beforeEach(() => {
    // Create a mock store with initial state
    store = configureStore({
      reducer: {
        workouts: (
          state = {
            workouts: [
              {
                _id: "1",
                exercise: "Running",
                duration: 30,
                type: "cardio",
              },
            ],
            loading: false,
          },
        ) => state,
      },
    })

    // Spy on store.dispatch
    vi.spyOn(store, "dispatch")
  })

  it("renders the page title", () => {
    render(
      <Provider store={store}>
        <WorkoutLog />
      </Provider>,
    )

    expect(screen.getByText("Workout Log")).toBeInTheDocument()
  })

  it("renders the add workout button", () => {
    render(
      <Provider store={store}>
        <WorkoutLog />
      </Provider>,
    )

    expect(screen.getByText("Add Workout")).toBeInTheDocument()
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument()
  })

  it("does not show the workout form initially", () => {
    render(
      <Provider store={store}>
        <WorkoutLog />
      </Provider>,
    )

    expect(screen.queryByTestId("workout-form")).not.toBeInTheDocument()
  })

  it("shows the workout form when add button is clicked", () => {
    render(
      <Provider store={store}>
        <WorkoutLog />
      </Provider>,
    )

    // Click the add workout button
    fireEvent.click(screen.getByText("Add Workout"))

    // Check if the form is now visible
    expect(screen.getByTestId("workout-form")).toBeInTheDocument()

    // Check if the button text changed
    expect(screen.getByText("Cancel")).toBeInTheDocument()
    expect(screen.getByTestId("times-icon")).toBeInTheDocument()
  })

  it("hides the workout form when cancel button is clicked", () => {
    render(
      <Provider store={store}>
        <WorkoutLog />
      </Provider>,
    )

    // Click the add workout button to show the form
    fireEvent.click(screen.getByText("Add Workout"))

    // Check if the form is visible
    expect(screen.getByTestId("workout-form")).toBeInTheDocument()

    // Click the cancel button
    fireEvent.click(screen.getByText("Cancel"))

    // Check if the form is hidden
    expect(screen.queryByTestId("workout-form")).not.toBeInTheDocument()
  })

  it("renders the workout list", () => {
    render(
      <Provider store={store}>
        <WorkoutLog />
      </Provider>,
    )

    expect(screen.getByTestId("workout-list")).toBeInTheDocument()
  })

  it("shows loader when loading", () => {
    // Create a store with loading state
    const loadingStore = configureStore({
      reducer: {
        workouts: (state = { workouts: [], loading: true }) => state,
      },
    })

    render(
      <Provider store={loadingStore}>
        <WorkoutLog />
      </Provider>,
    )

    expect(screen.getByTestId("loader")).toBeInTheDocument()
  })

  it("fetches workouts on mount", () => {
    render(
      <Provider store={store}>
        <WorkoutLog />
      </Provider>,
    )

    // Check if the fetchWorkouts action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith({ type: "workouts/fetchWorkouts" })
  })

  it("hides form and refetches workouts on form success", () => {
    render(
      <Provider store={store}>
        <WorkoutLog />
      </Provider>,
    )

    // Click the add workout button to show the form
    fireEvent.click(screen.getByText("Add Workout"))

    // Check if the form is visible
    expect(screen.getByTestId("workout-form")).toBeInTheDocument()

    // Trigger the onSuccess callback
    fireEvent.click(screen.getByTestId("mock-success-button"))

    // Check if the form is hidden
    expect(screen.queryByTestId("workout-form")).not.toBeInTheDocument()

    // Check if fetchWorkouts was called again
    expect(store.dispatch).toHaveBeenCalledTimes(2)
  })
})

