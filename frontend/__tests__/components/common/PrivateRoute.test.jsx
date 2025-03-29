import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import PrivateRoute from "../../../src/components/common/PrivateRoute"
import authReducer from "../../../src/redux/slices/authSlice"

// Mock the Loader component
vi.mock("../../../src/components/common/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}))

// Create a test component to render inside PrivateRoute
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>

describe("PrivateRoute Component", () => {
  let store

  beforeEach(() => {
    // Reset the store before each test
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          currentUser: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        },
      },
    })
  })

  it("redirects to login when not authenticated", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <TestComponent />
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    // Should redirect to login page
    expect(screen.getByTestId("login-page")).toBeInTheDocument()
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument()
  })

  it("shows loader when loading", () => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          currentUser: null,
          loading: true,
          error: null,
          isAuthenticated: false,
        },
      },
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <TestComponent />
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    // Should show loader
    expect(screen.getByTestId("loader")).toBeInTheDocument()
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument()
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument()
  })

  it("renders children when authenticated", () => {
    // Mock localStorage to return a token
    const originalGetItem = window.localStorage.getItem
    window.localStorage.getItem = vi.fn().mockReturnValue("fake-token")

    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          currentUser: { id: "1", name: "Test User" },
          loading: false,
          error: null,
          isAuthenticated: true,
        },
      },
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <TestComponent />
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    // Should render protected content
    expect(screen.getByTestId("protected-content")).toBeInTheDocument()
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument()

    // Restore original localStorage.getItem
    window.localStorage.getItem = originalGetItem
  })
})
