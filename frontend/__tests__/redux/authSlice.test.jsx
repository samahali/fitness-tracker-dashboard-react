import { describe, it, expect, vi, beforeEach } from "vitest";
import authReducer, {
  loginUser,
  fetchCurrentUser,
  updateUserProfile,
  logout,
  clearError,
} from "../../src/redux/slices/authSlice";
import api from "../../src/services/api";

// Mock the API service
vi.mock("../../src/services/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    setAuthToken: vi.fn(),
    removeAuthToken: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Auth Slice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe("Reducers", () => {
    it("should handle initial state", () => {
      expect(authReducer(undefined, { type: "unknown" })).toEqual({
        currentUser: null,
        loading: true,
        error: null,
        isAuthenticated: false,
      });
    });

    it("should handle logout", () => {
      const state = {
        currentUser: { id: "1", name: "Test User" },
        loading: false,
        error: null,
        isAuthenticated: true,
      };

      expect(authReducer(state, logout())).toEqual({
        currentUser: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
      expect(api.removeAuthToken).toHaveBeenCalled();
    });

    it("should handle clearError", () => {
      const state = {
        currentUser: null,
        loading: false,
        error: "Some error",
        isAuthenticated: false,
      };

      expect(authReducer(state, clearError())).toEqual({
        currentUser: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    });
  });

  describe("Async Thunks", () => {
    it("should handle loginUser.fulfilled", async () => {
      const user = { id: "1", name: "Test User" };
      const token = "test-token";

      api.post.mockResolvedValue({ data: { token, user } });

      const dispatch = vi.fn();
      const thunk = loginUser({
        email: "test@example.com",
        password: "password",
      });

      await thunk(dispatch, () => ({}));

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock;
      const fulfilledAction = calls[calls.length - 1][0];

      expect(fulfilledAction.type).toBe("auth/login/fulfilled");
      expect(fulfilledAction.payload).toEqual(user);

      // Check if token was stored in localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith("token", token);
      expect(api.setAuthToken).toHaveBeenCalledWith(token);
    });

    it("should handle loginUser.rejected", async () => {
      const errorMessage = "Invalid credentials";
      api.post.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const dispatch = vi.fn();
      const thunk = loginUser({ email: "test@example.com", password: "wrong" });

      await thunk(dispatch, () => ({}));

      // Check if the last dispatched action is the rejected action
      const { calls } = dispatch.mock;
      const rejectedAction = calls[calls.length - 1][0];

      expect(rejectedAction.type).toBe("auth/login/rejected");
      expect(rejectedAction.payload).toBe(errorMessage);
    });

    it("should handle fetchCurrentUser.fulfilled when token exists", async () => {
      const user = { id: "1", name: "Test User" };
      const token = "test-token";

      localStorageMock.getItem.mockReturnValue(token);
      api.get.mockResolvedValue({ data: user });

      const dispatch = vi.fn();
      const thunk = fetchCurrentUser();

      await thunk(dispatch, () => ({}));

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock;
      const fulfilledAction = calls[calls.length - 1][0];

      expect(fulfilledAction.type).toBe("auth/fetchCurrentUser/fulfilled");
      expect(fulfilledAction.payload).toEqual(user);
      expect(api.setAuthToken).toHaveBeenCalledWith(token);
    });

    it("should handle fetchCurrentUser.fulfilled when no token exists", async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const dispatch = vi.fn();
      const thunk = fetchCurrentUser();

      await thunk(dispatch, () => ({}));

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock;
      const fulfilledAction = calls[calls.length - 1][0];

      expect(fulfilledAction.type).toBe("auth/fetchCurrentUser/fulfilled");
      expect(fulfilledAction.payload).toBeNull();
    });

    it("should handle updateUserProfile.fulfilled", async () => {
      const updatedUser = { id: "1", name: "Updated User" };
      api.put.mockResolvedValue({ data: updatedUser });

      const dispatch = vi.fn();
      const thunk = updateUserProfile({ id: "1", name: "Updated User" });

      await thunk(dispatch, () => ({}));

      // Check if the last dispatched action is the fulfilled action
      const { calls } = dispatch.mock;
      const fulfilledAction = calls[calls.length - 1][0];

      expect(fulfilledAction.type).toBe("auth/updateProfile/fulfilled");
      expect(fulfilledAction.payload).toEqual(updatedUser);
    });
  });
});
