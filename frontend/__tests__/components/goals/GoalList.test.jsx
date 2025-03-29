import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Mock the icons
vi.mock("react-icons/fa", () => ({
  FaTrash: () => <div data-testid="trash-icon">Trash</div>,
  FaRedo: () => <div data-testid="redo-icon">Redo</div>,
  FaCalendarAlt: () => <div data-testid="calendar-icon">Calendar</div>,
  FaFlag: () => <div data-testid="flag-icon">Flag</div>,
  FaWeight: () => <div data-testid="weight-icon">Weight</div>,
  FaDumbbell: () => <div data-testid="dumbbell-icon">Dumbbell</div>,
  FaRunning: () => <div data-testid="running-icon">Running</div>,
  FaHandRock: () => <div data-testid="hand-rock-icon">Hand Rock</div>,
  FaRegSadTear: () => <div data-testid="sad-tear-icon">Sad Tear</div>,
  FaTrophy: () => <div data-testid="trophy-icon">Trophy</div>,
  FaEllipsisH: () => <div data-testid="ellipsis-icon">Ellipsis</div>,
  FaExpandAlt: () => <div data-testid="expand-icon">Expand</div>,
  FaCompressAlt: () => <div data-testid="compress-icon">Compress</div>,
  FaStopwatch: () => <div data-testid="stopwatch-icon">Stopwatch</div>,
  FaStickyNote: () => <div data-testid="sticky-note-icon">Sticky Note</div>,
  FaQuoteRight: () => <div data-testid="quote-right-icon">Quote Right</div>,
  FaBullseye: () => <div data-testid="bullseye-icon">Bullseye</div>,
  FaWalking: () => <div data-testid="walking-icon">Walking</div>,
}));

vi.mock("react-icons/gr", () => ({
  GrYoga: () => <div data-testid="yoga-icon">Yoga</div>,
}));

// Create mock actions
const mockDeleteGoal = vi.fn();
const mockUpdateGoalStatus = vi.fn();

// Mock the goalSlice with proper async behavior
vi.mock("../../src/redux/slices/goalSlice", () => ({
  __esModule: true,
  deleteGoal: (id) => async (dispatch) => {
    try {
      await mockDeleteGoal(id);
      return { type: "goals/deleteGoal/fulfilled", payload: id };
    } catch (error) {
      return { type: "goals/deleteGoal/rejected", error };
    }
  },
  updateGoalStatus: mockUpdateGoalStatus,
  default: () => ({ reducer: (state = { goals: [] }) => state }),
}));

// Mock window.confirm
window.confirm = vi.fn(() => true);

// Import GoalList after mocking
import GoalList from "../../../src/components/goals/GoalList";

describe("GoalList Component", () => {
  let store;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup store with test data
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
                deadline: "2023-12-31T00:00:00.000Z",
                status: "in_progress",
              },
              {
                _id: "2",
                goalType: "muscle_gain",
                targetValue: 5,
                unit: "kg",
                deadline: null,
                status: "achieved",
              },
            ],
            loading: false,
            error: null,
          }
        ) => state,
      },
    });

    // Setup mock to resolve successfully
    mockDeleteGoal.mockResolvedValue({});
  });

  it("renders the goal list correctly", () => {
    render(
      <Provider store={store}>
        <GoalList />
      </Provider>
    );

    expect(screen.getByText("Weight Loss")).toBeInTheDocument();
    expect(screen.getByText("Muscle Gain")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getAllByText("kg")).toHaveLength(2);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Achieved")).toBeInTheDocument();
  });
});
