import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import WorkoutList from "../../../src/components/workouts/WorkoutList";
import workoutReducer from "../../../src/redux/slices/workoutSlice";

// Create a mock store
const createMockStore = (state = {}) => {
  return configureStore({
    reducer: {
      workouts: workoutReducer,
    },
    preloadedState: {
      workouts: {
        workouts: [],
        loading: false,
        error: null,
        ...state,
      },
    },
  });
};

// Mock the useDispatch hook
vi.mock("react-redux", async (importOriginal) => {
  const actual = await importOriginal();
  const mockDispatch = vi.fn(() => ({
    unwrap: vi.fn().mockResolvedValue(undefined)
  }));
  
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

describe("WorkoutList", () => {
  const mockWorkouts = [
    {
      _id: "1",
      type: "cardio",
      exercise: "Running",
      duration: 30,
      caloriesBurned: 300,
      notes: "Morning run",
      createdAt: "2023-01-01T00:00:00.000Z",
    },
    {
      _id: "2",
      type: "strength",
      exercise: "Bench Press",
      duration: 45,
      caloriesBurned: 200,
      notes: "",
      createdAt: "2023-01-02T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders workout cards when workouts exist", () => {
    render(
      <Provider store={createMockStore({ workouts: mockWorkouts })}>
        <WorkoutList />
      </Provider>
    );

    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("30 min")).toBeInTheDocument();
    expect(screen.getByText("45 min")).toBeInTheDocument();
  });

  it("shows empty state when no workouts exist", () => {
    render(
      <Provider store={createMockStore()}>
        <WorkoutList />
      </Provider>
    );

    expect(screen.getByText("No workouts logged yet")).toBeInTheDocument();
    expect(
      screen.getByText("Start by adding your first workout!")
    ).toBeInTheDocument();
  });

  it("expands and collapses workout notes", () => {
    render(
      <Provider store={createMockStore({ workouts: mockWorkouts })}>
        <WorkoutList />
      </Provider>
    );

    const expandButtons = screen.getAllByTitle("Expand");
    fireEvent.click(expandButtons[0]);

    expect(screen.getByText("Morning run")).toBeInTheDocument();
    expect(screen.getByTitle("Collapse")).toBeInTheDocument();
  });

  it("shows loading spinner when loading", () => {
    render(
      <Provider store={createMockStore({ loading: true })}>
        <WorkoutList />
      </Provider>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("calls delete when delete button is clicked", async () => {
    // Mock window.confirm
    window.confirm = vi.fn(() => true);

    render(
      <Provider store={createMockStore({ workouts: mockWorkouts })}>
        <WorkoutList />
      </Provider>
    );

    const deleteButtons = screen.getAllByTitle("Delete Workout");
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    
    // Verify the mock was called (now using the module-level mock)
    const { useDispatch } = await import("react-redux");
    expect(useDispatch()).toHaveBeenCalled();
  });
});