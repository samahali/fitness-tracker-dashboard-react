import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../src/redux/slices/authSlice"
import workoutReducer from "../src/redux/slices/workoutSlice"
import goalReducer from "../src/redux/slices/goalSlice"
import themeReducer from "../src/redux/slices/themeSlice"
import { act } from "react-dom/test-utils"

// Mock BrowserRouter and Routes before importing App
vi.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }) => element,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
  useLocation: () => ({ pathname: "/" }),
}))

// Mock the components that are lazy loaded
vi.mock("../src/pages/Dashboard", () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}))

vi.mock("../src/pages/Login", () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}))

vi.mock("../src/pages/Register", () => ({
  default: () => <div data-testid="register-page">Register Page</div>,
}))

vi.mock("../src/pages/WorkoutLog", () => ({
  default: () => <div data-testid="workout-log-page">Workout Log Page</div>,
}))

vi.mock("../src/pages/GoalTracking", () => ({
  default: () => <div data-testid="goal-tracking-page">Goal Tracking Page</div>,
}))

vi.mock("../src/pages/Profile", () => ({
  default: () => <div data-testid="profile-page">Profile Page</div>,
}))

vi.mock("../src/pages/LandingPage", () => ({
  default: () => <div data-testid="landing-page">Landing Page</div>,
}))

vi.mock("../src/pages/AboutUs", () => ({
  default: () => <div data-testid="about-us-page">About Us Page</div>,
}))

vi.mock("../src/pages/ContactUs", () => ({
  default: () => <div data-testid="contact-us-page">Contact Us Page</div>,
}))

// Mock the layout components
vi.mock("../src/components/layout/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}))

vi.mock("../src/components/layout/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}))

vi.mock("../src/components/layout/MobileNavbar", () => ({
  default: () => <div data-testid="mobile-navbar">Mobile Navbar</div>,
}))

vi.mock("../src/components/layout/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}))

vi.mock("../src/components/common/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}))

vi.mock("../src/components/common/PrivateRoute", () => ({
  default: ({ children }) => <div data-testid="private-route">{children}</div>,
}))

// Mock the Suspense component
vi.mock("react", async () => {
  const actual = await vi.importActual("react")
  return {
    ...actual,
    Suspense: ({ children }) => children,
  }
})

// Import App after all mocks are set up
import App from "../src/App"

describe("App Component", () => {
  it("renders without crashing", async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        workouts: workoutReducer,
        goals: goalReducer,
        theme: themeReducer,
      },
    })

    await act(async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>,
      )
    })

    // Check if the main layout components are rendered
    expect(screen.getByTestId("navbar")).toBeInTheDocument()
    expect(screen.getByTestId("sidebar")).toBeInTheDocument()
    expect(screen.getByTestId("footer")).toBeInTheDocument()
    expect(screen.getByTestId("mobile-navbar")).toBeInTheDocument()

    // The landing page should be rendered by default (at the "/" route)
    expect(screen.getByTestId("landing-page")).toBeInTheDocument()
  })
})