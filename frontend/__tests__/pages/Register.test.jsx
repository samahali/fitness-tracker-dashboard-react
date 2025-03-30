import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { BrowserRouter } from "react-router-dom"
import Register from "../../src/pages/Register"
import authReducer, { registerUser } from "../../src/redux/slices/authSlice"

// Mock the useNavigate hook
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock react-icons
vi.mock("react-icons/fa", () => ({
  FaArrowLeft: () => <span data-testid="arrow-left-icon" />,
  FaArrowRight: () => <span data-testid="arrow-right-icon" />,
  FaCheck: () => <span data-testid="check-icon" />,
  FaUser: () => <span data-testid="user-icon" />,
  FaLock: () => <span data-testid="lock-icon" />,
  FaRulerVertical: () => <span data-testid="ruler-vertical-icon" />,
  FaEnvelope: () => <span data-testid="envelope-icon" />,
  FaUserAlt: () => <span data-testid="user-alt-icon" />,
  FaWeightHanging: () => <span data-testid="weight-icon" />,
  FaRuler: () => <span data-testid="ruler-icon" />,
  FaVenusMars: () => <span data-testid="venus-mars-icon" />,
  FaEye: () => <span data-testid="eye-icon" />,
  FaEyeSlash: () => <span data-testid="eye-slash-icon" />,
}))

describe("Register Component", () => {
  // Store the original methods before mocking
  const originalAddClass = document.body.classList.add
  const originalRemoveClass = document.body.classList.remove

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock classList methods without touching the DOM
    document.body.classList.add = vi.fn()
    document.body.classList.remove = vi.fn()
  })

  afterEach(() => {
    // Restore original methods
    document.body.classList.add = originalAddClass
    document.body.classList.remove = originalRemoveClass
  })

  const createMockStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          loading: false,
          error: null,
          isAuthenticated: false,
          user: null,
          ...initialState,
        },
      },
    })
  }

  it("renders the registration form with step 1 initially", () => {
    const store = createMockStore()

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>,
    )

    // Check if the form title is rendered
    expect(screen.getByText("Create Account")).toBeInTheDocument()

    // Check if step 1 is active
    expect(screen.getByText("Personal Information")).toBeInTheDocument()
    expect(screen.getByLabelText("First Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Last Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()

    // Check if the next button is rendered
    expect(screen.getByText("Next")).toBeInTheDocument()
  })

  it("adds auth-page class to body on mount", () => {
    const store = createMockStore()

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>,
    )

    expect(document.body.classList.add).toHaveBeenCalledWith("auth-page")
  })

  it("removes auth-page class from body on unmount", () => {
    const store = createMockStore()

    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>,
    )

    unmount()

    expect(document.body.classList.remove).toHaveBeenCalledWith("auth-page")
  })

  it("shows password validation error when passwords don't match", () => {
    const store = createMockStore()

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>,
    )

    // Fill out step 1
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "John" },
    })
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: "Doe" },
    })
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    })

    // Click next button to go to step 2
    fireEvent.click(screen.getByRole("button", { name: "Next" }))

    // Fill out step 2 with mismatched passwords
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password456" },
    })

    // Try to go to step 3
    fireEvent.click(screen.getByText("Next"))

    // Check if error message is displayed
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument()
  })

  it("moves to step 3 when next button is clicked with valid passwords", () => {
    const store = createMockStore()

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>,
    )

    // Fill out step 1
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "John" },
    })
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: "Doe" },
    })
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    })

    // Click next button to go to step 2
    fireEvent.click(screen.getByRole("button", { name: "Next" }))

    // Fill out step 2 with matching passwords
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    })

    // Click next button to go to step 3
    fireEvent.click(screen.getByText("Next"))

    // Check if step 3 is now active
    expect(screen.getByText("Physical Information (Optional)")).toBeInTheDocument()
  })

  it("shows loading state when submitting", () => {
    const store = createMockStore({
      loading: true,
    })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>,
    )

    // Go through all steps
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "John" },
    })
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: "Doe" },
    })
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    })
    fireEvent.click(screen.getByText("Next"))

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByText("Next"))

    // Check if loading state is shown
    expect(screen.getByText("Registering...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Registering..." })).toBeDisabled()
  })

  it("navigates to dashboard if already authenticated", () => {
    const store = createMockStore({
      isAuthenticated: true,
    })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>,
    )

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
  })
})