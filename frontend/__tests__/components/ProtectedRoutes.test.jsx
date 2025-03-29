import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import ProtectedRoute from "../../src/components/ProtectedRoute"
import { AuthContext } from "../../src/components/AuthProvider"
import { BrowserRouter } from "react-router-dom"

// Mock React Router's Navigate component
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    Navigate: ({ to, replace }) => (
      <div data-testid="navigate-mock" data-to={to} data-replace={replace.toString()}>
        Redirecting to {to}
      </div>
    ),
  }
})

// Mock Navbar component
vi.mock("../../src/components/layout/Navbar", () => ({
  default: () => <div data-testid="navbar-mock">Navbar</div>,
}))

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it("shows loading state when auth is loading", () => {
    const authContextValue = {
      user: null,
      loading: true,
      isAuthenticated: vi.fn().mockReturnValue(false),
      login: vi.fn(),
      logout: vi.fn(),
    }

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </BrowserRouter>
    )

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument()
    expect(screen.queryByTestId("navigate-mock")).not.toBeInTheDocument()
  })

  it("redirects to login when user is not authenticated", () => {
    const authContextValue = {
      user: null,
      loading: false,
      isAuthenticated: vi.fn().mockReturnValue(false),
      login: vi.fn(),
      logout: vi.fn(),
    }

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </BrowserRouter>
    )

    const navigateElement = screen.getByTestId("navigate-mock")
    expect(navigateElement).toBeInTheDocument()
    expect(navigateElement.getAttribute("data-to")).toBe("/login")
    expect(navigateElement.getAttribute("data-replace")).toBe("true")
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument()
    expect(authContextValue.isAuthenticated).toHaveBeenCalled()
  })

  it("renders children and navbar when user is authenticated", () => {
    const authContextValue = {
      user: { id: 1, name: "Test User" },
      loading: false,
      isAuthenticated: vi.fn().mockReturnValue(true),
      login: vi.fn(),
      logout: vi.fn(),
    }

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByTestId("navbar-mock")).toBeInTheDocument()
    expect(screen.getByTestId("protected-content")).toBeInTheDocument()
    expect(screen.queryByTestId("navigate-mock")).not.toBeInTheDocument()
    expect(authContextValue.isAuthenticated).toHaveBeenCalled()
  })
})