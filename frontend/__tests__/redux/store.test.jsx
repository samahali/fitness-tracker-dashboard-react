import { describe, it, expect } from "vitest";
import { store } from "../../src/redux/store"; // Adjust the path based on your structure

describe("Redux Store", () => {
  it("should have the correct state keys", () => {
    const state = store.getState();

    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("workouts");
    expect(state).toHaveProperty("goals");
    expect(state).toHaveProperty("theme");
  });

  it("should return defined initial states for each slice", () => {
    const state = store.getState();

    expect(state.auth).toBeDefined();
    expect(state.workouts).toBeDefined();
    expect(state.goals).toBeDefined();
    expect(state.theme).toBeDefined();
  });
});
