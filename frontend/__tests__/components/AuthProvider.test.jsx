import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider, useAuth } from "../../src/components/AuthProvider"
import { BrowserRouter, useNavigate } from "react-router-dom"

// Mock React Router's useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

// Mock for localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

// Test component to access auth context
const TestComponent = () => {
  const auth = useAuth()
  return (
    <div>
      <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : "no user"}</div>
      <div data-testid="loading">{auth.loading ? "loading" : "not loading"}</div>
      <div data-testid="authenticated">{auth.isAuthenticated() ? "authenticated" : "not authenticated"}</div>
      <button onClick={() => auth.login({ id: 1, name: "Test User" })}>Login</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  )
}

describe("AuthProvider", () => {
  const navigateMock = vi.fn()

  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(window, "localStorage", { value: localStorageMock })
    useNavigate.mockReturnValue(navigateMock)
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it("provides auth context with initial null user", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>,
    )

    expect(screen.getByTestId("user").textContent).toBe("no user")
    expect(screen.getByTestId("authenticated").textContent).toBe("not authenticated")
    expect(localStorageMock.getItem).toHaveBeenCalledWith("fitnessUser")
  })

  it("loads user from localStorage on mount", async () => {
    const testUser = { id: 1, name: "Test User" }
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testUser))

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe(JSON.stringify(testUser))
      expect(screen.getByTestId("authenticated").textContent).toBe("authenticated")
    })
    expect(localStorageMock.getItem).toHaveBeenCalledWith("fitnessUser")
  })

  it("updates user state and localStorage on login", async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>,
    )

    expect(screen.getByTestId("user").textContent).toBe("no user")

    await user.click(screen.getByText("Login"))

    expect(screen.getByTestId("user").textContent).toBe(JSON.stringify({ id: 1, name: "Test User" }))
    expect(screen.getByTestId("authenticated").textContent).toBe("authenticated")
    expect(localStorageMock.setItem).toHaveBeenCalledWith("fitnessUser", JSON.stringify({ id: 1, name: "Test User" }))
  })

  it("clears user state, localStorage, and navigates to login on logout", async () => {
    const user = userEvent.setup()
    const testUser = { id: 1, name: "Test User" }
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testUser))

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe(JSON.stringify(testUser))
    })

    await user.click(screen.getByText("Logout"))

    expect(screen.getByTestId("user").textContent).toBe("no user")
    expect(screen.getByTestId("authenticated").textContent).toBe("not authenticated")
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("fitnessUser")
    expect(navigateMock).toHaveBeenCalledWith("/login")
  })

  it("sets loading to false after initialization", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("not loading")
    })
  })

  it("provides isAuthenticated function that returns correct value", async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>,
    )

    expect(screen.getByTestId("authenticated").textContent).toBe("not authenticated")

    await user.click(screen.getByText("Login"))

    expect(screen.getByTestId("authenticated").textContent).toBe("authenticated")

    await user.click(screen.getByText("Logout"))

    expect(screen.getByTestId("authenticated").textContent).toBe("not authenticated")
  })
})

