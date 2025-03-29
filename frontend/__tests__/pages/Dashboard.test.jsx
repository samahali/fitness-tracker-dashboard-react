import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Dashboard from "../../src/pages/Dashboard";

// Mock the Redux actions
vi.mock("../../src/redux/slices/workoutSlice", () => ({
  fetchWorkouts: vi.fn(() => ({ type: "workouts/fetchWorkouts" })),
}));

vi.mock("../../src/redux/slices/goalSlice", () => ({
  fetchGoals: vi.fn(() => ({ type: "goals/fetchGoals" })),
}));

// Mock the chart components
vi.mock("../../src/components/dashboard/WorkoutChart", () => ({
  default: () => <div data-testid="workout-chart">Workout Chart</div>,
}));

vi.mock("../../src/components/dashboard/WorkoutTypeChart", () => ({
  default: () => <div data-testid="workout-type-chart">Workout Type Chart</div>,
}));

vi.mock("../../src/components/dashboard/GoalProgressChart", () => ({
  default: () => <div data-testid="goal-progress-chart">Goal Progress Chart</div>,
}));

// Mock the StatCard component
vi.mock("../../src/components/dashboard/StatCard", () => ({
  default: ({ title, value }) => (
    <div data-testid="stat-card">
      {title}: {value}
    </div>
  ),
}));

// Mock the Loader component
vi.mock("../../src/components/common/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Mock react-icons
vi.mock("react-icons/fa", () => ({
  FaDumbbell: () => <span data-testid="dumbbell-icon" />,
  FaClock: () => <span data-testid="clock-icon" />,
  FaFire: () => <span data-testid="fire-icon" />,
  FaTrophy: () => <span data-testid="trophy-icon" />,
  FaCalendarAlt: () => <span data-testid="calendar-icon" />,
  FaBullseye: () => <span data-testid="bullseye-icon" />,
}));

describe("Dashboard Component", () => {
  let store;

  beforeEach(() => {
    // Create a mock store with initial state
    store = configureStore({
      reducer: {
        auth: (state = { currentUser: { firstName: "John" } }) => state,
        workouts: (
          state = {
            workouts: [
              {
                _id: "1",
                exercise: "Running",
                duration: 30,
                caloriesBurned: 300,
                type: "cardio",
                createdAt: new Date().toISOString(),
              },
              {
                _id: "2",
                exercise: "Bench Press",
                duration: 45,
                caloriesBurned: 200,
                type: "strength",
                createdAt: new Date().toISOString(),
              },
            ],
            loading: false,
          }
        ) => state,
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
              {
                _id: "2",
                goalType: "muscle_gain",
                targetValue: 5,
                unit: "kg",
                status: "achieved",
              },
            ],
            loading: false,
          }
        ) => state,
      },
    });

    // Spy on store.dispatch
    vi.spyOn(store, "dispatch");
  });

  it("renders welcome message with user's name", () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByText(/Welcome, John!/i)).toBeInTheDocument();
  });

  it("renders stat cards with correct data", () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    const statCards = screen.getAllByTestId("stat-card");
    expect(statCards).toHaveLength(4);
    
    // Check for specific stat cards
    expect(screen.getByText(/Total Workouts: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Minutes: 75/i)).toBeInTheDocument();
    expect(screen.getByText(/Calories Burned: 500/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Goals: 1/i)).toBeInTheDocument();
  });

  it("renders chart components", () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByTestId("workout-chart")).toBeInTheDocument();
    expect(screen.getByTestId("workout-type-chart")).toBeInTheDocument();
    expect(screen.getByTestId("goal-progress-chart")).toBeInTheDocument();
  });

  it("renders recent workouts section", () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByText(/Recent Workouts/i)).toBeInTheDocument();
    expect(screen.getByText(/Running/i)).toBeInTheDocument();
    expect(screen.getByText(/Bench Press/i)).toBeInTheDocument();
  });

  it("renders active goals section", () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
  
    const activeGoalsHeadings = screen.getAllByText(/Active Goals/i);
    expect(activeGoalsHeadings.length).toBeGreaterThan(0); // Ensure at least one exists
  
    expect(screen.getByText(/Weight Loss/i)).toBeInTheDocument();
  });
  

  it("shows loader when loading", () => {
    // Create a store with loading state
    const loadingStore = configureStore({
      reducer: {
        auth: (state = { currentUser: { firstName: "John" } }) => state,
        workouts: (state = { workouts: [], loading: true }) => state,
        goals: (state = { goals: [], loading: true }) => state,
      },
    });

    render(
      <Provider store={loadingStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("fetches workouts and goals on mount", () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    // Check if the fetchWorkouts and fetchGoals actions were dispatched
    expect(store.dispatch).toHaveBeenCalledWith({ type: "workouts/fetchWorkouts" });
    expect(store.dispatch).toHaveBeenCalledWith({ type: "goals/fetchGoals" });
  });
});
