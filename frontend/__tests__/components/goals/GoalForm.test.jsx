import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import goalsReducer, { addGoal } from "../../../src/redux/slices/goalSlice";
import GoalForm from "../../../src/components/goals/GoalForm";

// Create a mock store function
const createMockStore = (state = {}) => {
  return configureStore({
    reducer: {
      goals: goalsReducer,
    },
    preloadedState: {
      goals: {
        goals: [],
        loading: false,
        error: null,
        ...state,
      },
    },
  });
};

// Mock react-redux dispatch
vi.mock("react-redux", async () => {
  const actual = await import("react-redux"); // Ensure actual module is imported
  return {
    ...actual,
    useDispatch: vi.fn(() => vi.fn()), // Return a mock function that returns another mock function
  };
});

// Mock `addGoal` action
vi.mock("../../../src/redux/slices/goalSlice", async () => {
  const actual = await import("../../../src/redux/slices/goalSlice");
  return {
    ...actual,
    addGoal: vi.fn(),
  };
});

describe("GoalForm Component", () => {
  let dispatch;
  
  beforeEach(() => {
    vi.clearAllMocks();
    dispatch = vi.fn(); // Create a new mock function
    useDispatch.mockReturnValue(dispatch); // Ensure `useDispatch` always returns this mock
  });
  it("allows selecting different goal types", () => {
    render(
      <Provider store={createMockStore()}>
        <GoalForm />
      </Provider>
    );
  
    const goalTypes = ["Muscle Gain", "Weight Loss", "Endurance"]; // Add more if needed
  
    goalTypes.forEach((type) => {
      const radio = screen.getByLabelText(new RegExp(type, "i"));
      fireEvent.click(radio);
      expect(radio).toBeChecked();
    });
  });
  
  it("allows selecting a different goal type", () => {
    render(
      <Provider store={createMockStore()}>
        <GoalForm />
      </Provider>
    );

    const muscleGainRadio = screen.getByLabelText(/Muscle Gain/i);
    fireEvent.click(muscleGainRadio);
    expect(muscleGainRadio).toBeChecked();
  });
  
  it("updates the target value", () => {
    render(
      <Provider store={createMockStore()}>
        <GoalForm />
      </Provider>
    );

    const targetInput = screen.getByLabelText(/Target Value/i);
    fireEvent.change(targetInput, { target: { value: "10" } });
    expect(targetInput.value).toBe("10");
  });
  it("dispatches addGoal action on form submission", async () => {
    render(
      <Provider store={createMockStore()}>
        <GoalForm />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Target Value/i), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Set Goal/i }));

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(addGoal({ goalType: expect.any(String), targetValue: "5" }));
    });
  });
  it("shows loading state when submitting", () => {
    render(
      <Provider store={createMockStore({ loading: true })}>
        <GoalForm />
      </Provider>
    );

    expect(screen.getByText("Saving..."))
      .toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });
  
  it("displays an error message when there is an error", () => {
    render(
      <Provider store={createMockStore({ error: "Failed to add goal" })}>
        <GoalForm />
      </Provider>
    );

    expect(screen.getByText("Failed to add goal"))
      .toBeInTheDocument();
  });
});
