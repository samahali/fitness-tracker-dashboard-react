import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"
import MobileNavbar from "../../../src/components/layout/MobileNavbar"
import authReducer, { logout } from "../../../src/redux/slices/authSlice"
import { vi } from "vitest"
import * as redux from "react-redux"

// Mock useDispatch properly
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux")
  return {
    ...actual,
    useDispatch: () => vi.fn(), // Prevent multiple redefinitions
  }
})

describe("MobileNavbar Component", () => {
  const createTestStore = (preloadedState) =>
    configureStore({
      reducer: { auth: authReducer },
      preloadedState,
    })

  it("renders navigation links", () => {
    const store = createTestStore({ auth: { isAuthenticated: true } })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MobileNavbar />
        </BrowserRouter>
      </Provider>
    )

    // Check if links exist
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Workouts")).toBeInTheDocument()
    expect(screen.getByText("Goals")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("Logout")).toBeInTheDocument()
  })

  it("applies active class to the current route", () => {
    vi.mock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom")
      return {
        ...actual,
        useLocation: () => ({ pathname: "/dashboard" }),
      }
    })

    const store = createTestStore({ auth: { isAuthenticated: true } })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MobileNavbar />
        </BrowserRouter>
      </Provider>
    )

    // Check if the "Dashboard" link has the "active" class
    expect(screen.getByText("Dashboard").closest("a")).toHaveClass("active")
  })

  it("calls logout when clicking Logout", () => {
    const store = createTestStore({ auth: { isAuthenticated: true } })
    const mockDispatch = vi.fn()
    
    vi.spyOn(redux, "useDispatch").mockReturnValue(mockDispatch)

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MobileNavbar />
        </BrowserRouter>
      </Provider>
    )

    fireEvent.click(screen.getByText("Logout"))
    
    // Expect dispatch to be called with logout()
    expect(mockDispatch).toHaveBeenCalledWith(logout())
  })
})
