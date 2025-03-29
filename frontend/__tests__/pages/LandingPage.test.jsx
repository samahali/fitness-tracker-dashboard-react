import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { BrowserRouter, Navigate } from "react-router-dom"
import LandingPage from "../../src/pages/LandingPage"

// Mock the Navigate component
vi.mock("react-router-dom", async () => {
  const actual = await import("react-router-dom")
  return {
    ...actual,
    Navigate: vi.fn(() => <div data-testid="navigate">Redirecting...</div>),
  }
})

// Mock react-icons
vi.mock("react-icons/fa", () => ({
  FaDumbbell: () => <span data-testid="dumbbell-icon" />,
  FaChartLine: () => <span data-testid="chart-line-icon" />,
  FaBullseye: () => <span data-testid="bullseye-icon" />,
  FaMobileAlt: () => <span data-testid="mobile-icon" />,
  FaLock: () => <span data-testid="lock-icon" />,
  FaUserFriends: () => <span data-testid="user-friends-icon" />,
}))

describe("LandingPage Component", () => {
  it("redirects to dashboard when user is authenticated", () => {
    // Create a store with authenticated state
    const authenticatedStore = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: true }) => state,
      },
    })

    render(
      <Provider store={authenticatedStore}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>,
    )

    // Check if Navigate was called with the correct props
    expect(Navigate).toHaveBeenCalledWith({ to: "/dashboard" }, undefined);
    expect(screen.getByTestId("navigate")).toBeInTheDocument()
  })

  it("renders the landing page when user is not authenticated", () => {
    // Create a store with unauthenticated state
    const unauthenticatedStore = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: false }) => state,
      },
    })

    render(
      <Provider store={unauthenticatedStore}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>,
    )

    // Check if the landing page content is rendered
    expect(screen.getByText("Track Your Fitness Journey")).toBeInTheDocument()
    expect(
      screen.getByText(/FitPulse helps you monitor workouts, set goals, and visualize your progress/i),
    ).toBeInTheDocument()
  })

  it("renders the hero section with CTA buttons", () => {
    const unauthenticatedStore = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: false }) => state,
      },
    })

    render(
      <Provider store={unauthenticatedStore}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>,
    )

    // Check for CTA buttons
    expect(screen.getByText("Get Started")).toBeInTheDocument()
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("renders the features section", () => {
    const unauthenticatedStore = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: false }) => state,
      },
    })

    render(
      <Provider store={unauthenticatedStore}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>,
    )

    // Check for features section
    expect(screen.getByText("Powerful Features")).toBeInTheDocument()
    expect(screen.getByText("Workout Tracking")).toBeInTheDocument()
    expect(screen.getByText("Progress Visualization")).toBeInTheDocument()
    expect(screen.getByText("Goal Setting")).toBeInTheDocument()
    expect(screen.getByText("Mobile Friendly")).toBeInTheDocument()
    expect(screen.getByText("Secure Data")).toBeInTheDocument()
    expect(screen.getByText("Community Support")).toBeInTheDocument()
  })

  it("renders the CTA section", () => {
    const unauthenticatedStore = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: false }) => state,
      },
    })

    render(
      <Provider store={unauthenticatedStore}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>,
    )

    // Check for CTA section
    expect(screen.getByText("Ready to Start Your Fitness Journey?")).toBeInTheDocument()
    expect(
      screen.getByText("Join thousands of users who have transformed their lives with FitPulse"),
    ).toBeInTheDocument()
    expect(screen.getByText("Sign Up Now")).toBeInTheDocument()
  })

  it("renders all feature icons", () => {
    const unauthenticatedStore = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: false }) => state,
      },
    })

    render(
      <Provider store={unauthenticatedStore}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>,
    )

    // Check for feature icons
    expect(screen.getByTestId("dumbbell-icon")).toBeInTheDocument()
    expect(screen.getByTestId("chart-line-icon")).toBeInTheDocument()
    expect(screen.getByTestId("bullseye-icon")).toBeInTheDocument()
    expect(screen.getByTestId("mobile-icon")).toBeInTheDocument()
    expect(screen.getByTestId("lock-icon")).toBeInTheDocument()
    expect(screen.getByTestId("user-friends-icon")).toBeInTheDocument()
  })
})

