import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { BrowserRouter, useNavigate } from "react-router-dom"
import Login from "../../src/pages/Login"

// Mock the Redux actions
vi.mock("../../src/redux/slices/authSlice", () => ({
  loginUser: vi.fn(() => ({
    type: "auth/login",
    payload: {},
    unwrap: vi.fn().mockResolvedValue({}),
  })),
}))

// Mock the useNavigate hook
vi.mock("react-router-dom", async () => {
  const actual = await import("react-router-dom")
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  Mail: () => <span data-testid="mail-icon" />,
  Lock: () => <span data-testid="lock-icon" />,
  Eye: () => <span data-testid="eye-icon" />,
  EyeOff: () => <span data-testid="eye-off-icon" />,
}))

describe("Login Component", () => {
  let store
  let mockNavigate

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Setup mock navigate function
    mockNavigate = vi.fn()
    useNavigate.mockReturnValue(mockNavigate)

    // Create a mock store with initial state
    store = configureStore({
      reducer: {
        auth: (
          state = {
            loading: false,
            error: null,
            isAuthenticated: false,
          },
        ) => state,
      },
    })

    // Mock document.body.classList methods
    document.body.classList.add = vi.fn()
    document.body.classList.remove = vi.fn()
  })

  it("renders the login form", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    )

    // Check if the form elements are rendered
    expect(screen.getByText("Welcome Back")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
    expect(screen.getByText("Register")).toBeInTheDocument()
  })

  it("adds auth-page class to body on mount", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    )

    expect(document.body.classList.add).toHaveBeenCalledWith("auth-page")
  })

  it("removes auth-page class from body on unmount", () => {
    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    )

    unmount()

    expect(document.body.classList.remove).toHaveBeenCalledWith("auth-page")
  })

  it("redirects to dashboard if already authenticated", () => {
    // Create a store with authenticated state
    const authenticatedStore = configureStore({
      reducer: {
        auth: (
          state = {
            loading: false,
            error: null,
            isAuthenticated: true,
          },
        ) => state,
      },
    })

    render(
      <Provider store={authenticatedStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    )

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
  })

  it("updates form data on input change", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    )

    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })

    expect(emailInput.value).toBe("test@example.com")
    expect(passwordInput.value).toBe("password123")
  })

  it("toggles password visibility when eye icon is clicked", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    )

    const passwordInput = screen.getByLabelText("Password")

    // Password should be hidden initially
    expect(passwordInput.type).toBe("password")

    // Click the eye icon to show password
    fireEvent.click(screen.getByTestId("eye-icon").parentElement)

    // Password should now be visible
    expect(passwordInput.type).toBe("text")

    // Click the eye-off icon to hide password again
    fireEvent.click(screen.getByTestId("eye-off-icon").parentElement)

    // Password should be hidden again
    expect(passwordInput.type).toBe("password")
  })

  it("displays error message when there is an error", () => {
    // Create a store with an error
    const errorStore = configureStore({
      reducer: {
        auth: (
          state = {
            loading: false,
            error: "Invalid credentials",
            isAuthenticated: false,
          },
        ) => state,
      },
    })

    render(
      <Provider store={errorStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    )

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
  })

  it("shows loading state when submitting", () => {
    // Create a store with loading state
    const loadingStore = configureStore({
      reducer: {
        auth: (
          state = {
            loading: true,
            error: null,
            isAuthenticated: false,
          },
        ) => state,
      },
    })

    render(
      <Provider store={loadingStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    )

    expect(screen.getByText("Logging in...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Logging in..." })).toBeDisabled()
  })

  it("submits the form with correct data and navigates on success", async () => {
    // Import the loginUser action to spy on it
    const { loginUser } = await import("../../src/redux/slices/authSlice")

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    )

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Login" }))

    // Check if loginUser was called with the correct data
    expect(loginUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    })

    // Wait for navigation to occur after successful login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
    })
  })
})

