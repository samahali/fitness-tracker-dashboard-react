import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import GoalTracking from "../../src/pages/GoalTracking"

// Mock the Redux actions
vi.mock("../../src/redux/slices/goalSlice", () => ({
  fetchGoals: vi.fn(() => ({ type: "goals/fetchGoals" })),
}))

// Mock the GoalForm and GoalList components
vi.mock("../../src/components/goals/GoalForm", () => ({
  default: ({ onSuccess }) => (
    <div data-testid="goal-form">
      Goal Form
      <button onClick={onSuccess} data-testid="mock-success-button">
        Mock Success
      </button>
    </div>
  ),
}))

vi.mock("../../src/components/goals/GoalList", () => ({
  default: () => <div data-testid="goal-list">Goal List</div>,
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

describe("GoalTracking Component", () => {
  let store

  beforeEach(() => {
    // Create a mock store with initial state
    store = configureStore({
      reducer: {
        goals: (
          state = {
            goals: [
              {
                _id: "1",
                goalType: "weight_loss",
                targetValue: 10,
                unit: "kg",
                status: "in_progress",
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
        <GoalTracking />
      </Provider>,
    )

    expect(screen.getByText("Goal Tracking")).toBeInTheDocument()
  })

  it("renders the add goal button", () => {
    render(
      <Provider store={store}>
        <GoalTracking />
      </Provider>,
    )

    expect(screen.getByText("Add Goal")).toBeInTheDocument()
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument()
  })

  it("does not show the goal form initially", () => {
    render(
      <Provider store={store}>
        <GoalTracking />
      </Provider>,
    )

    expect(screen.queryByTestId("goal-form")).not.toBeInTheDocument()
  })

  it("shows the goal form when add button is clicked", () => {
    render(
      <Provider store={store}>
        <GoalTracking />
      </Provider>,
    )

    // Click the add goal button
    fireEvent.click(screen.getByText("Add Goal"))

    // Check if the form is now visible
    expect(screen.getByTestId("goal-form")).toBeInTheDocument()

    // Check if the button text changed
    expect(screen.getByText("Cancel")).toBeInTheDocument()
    expect(screen.getByTestId("times-icon")).toBeInTheDocument()
  })

  it("hides the goal form when cancel button is clicked", () => {
    render(
      <Provider store={store}>
        <GoalTracking />
      </Provider>,
    )

    // Click the add goal button to show the form
    fireEvent.click(screen.getByText("Add Goal"))

    // Check if the form is visible
    expect(screen.getByTestId("goal-form")).toBeInTheDocument()

    // Click the cancel button
    fireEvent.click(screen.getByText("Cancel"))

    // Check if the form is hidden
    expect(screen.queryByTestId("goal-form")).not.toBeInTheDocument()
  })

  it("renders the goal list", () => {
    render(
      <Provider store={store}>
        <GoalTracking />
      </Provider>,
    )

    expect(screen.getByTestId("goal-list")).toBeInTheDocument()
  })

  it("shows loader when loading", () => {
    // Create a store with loading state
    const loadingStore = configureStore({
      reducer: {
        goals: (state = { goals: [], loading: true }) => state,
      },
    })

    render(
      <Provider store={loadingStore}>
        <GoalTracking />
      </Provider>,
    )

    expect(screen.getByTestId("loader")).toBeInTheDocument()
  })

  it("fetches goals on mount", () => {
    render(
      <Provider store={store}>
        <GoalTracking />
      </Provider>,
    )

    // Check if the fetchGoals action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith({ type: "goals/fetchGoals" })
  })

  it("hides form and refetches goals on form success", () => {
    render(
      <Provider store={store}>
        <GoalTracking />
      </Provider>,
    )

    // Click the add goal button to show the form
    fireEvent.click(screen.getByText("Add Goal"))

    // Check if the form is visible
    expect(screen.getByTestId("goal-form")).toBeInTheDocument()

    // Trigger the onSuccess callback
    fireEvent.click(screen.getByTestId("mock-success-button"))

    // Check if the form is hidden
    expect(screen.queryByTestId("goal-form")).not.toBeInTheDocument()

    // Check if fetchGoals was called again
    expect(store.dispatch).toHaveBeenCalledTimes(2)
  })
})

