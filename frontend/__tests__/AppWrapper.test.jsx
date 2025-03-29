import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AppWrapper from "../src/AppWrapper";

// Mock the Redux action
vi.mock("../src/redux/slices/authSlice", () => ({
  fetchCurrentUser: vi.fn(() => ({ type: "auth/fetchCurrentUser" })),
}));

// Import the mocked function for assertions
import { fetchCurrentUser } from "../src/redux/slices/authSlice";

describe("AppWrapper Component", () => {
  let mockStore;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = vi.fn();

    // Create a mock store with a spy on dispatch
    mockStore = {
      getState: () => ({
        auth: {
          currentUser: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        },
      }),
      dispatch: mockDispatch,
      subscribe: vi.fn(),
    };

    // Reset the mocks
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <AppWrapper>
          <div>Test Child Component</div>
        </AppWrapper>
      </Provider>
    );

    expect(getByText("Test Child Component")).toBeInTheDocument();
  });

  it("dispatches fetchCurrentUser on mount", () => {
    render(
      <Provider store={mockStore}>
        <AppWrapper>
          <div>Test Child Component</div>
        </AppWrapper>
      </Provider>
    );

    // Check if fetchCurrentUser was called
    expect(fetchCurrentUser).toHaveBeenCalled();

    // Check if the result was dispatched
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "auth/fetchCurrentUser",
    });
  });

  it("dispatches fetchCurrentUser only once", () => {
    const { rerender } = render(
      <Provider store={mockStore}>
        <AppWrapper>
          <div>Test Child Component</div>
        </AppWrapper>
      </Provider>
    );

    // Re-render the component
    rerender(
      <Provider store={mockStore}>
        <AppWrapper>
          <div>Updated Test Child Component</div>
        </AppWrapper>
      </Provider>
    );

    // fetchCurrentUser should still have been called only once
    expect(fetchCurrentUser).toHaveBeenCalledTimes(1);
  });
});
