import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import ThemeToggle from "../../../src/components/theme/ThemeToggle"
import themeReducer, { toggleTheme } from "../../../src/redux/slices/themeSlice"

// Mock the icons
vi.mock("react-icons/fa", () => ({
  FaSun: () => <div data-testid="sun-icon">Sun</div>,
  FaMoon: () => <div data-testid="moon-icon">Moon</div>,
}))

describe("ThemeToggle Component", () => {
  it("renders sun icon when in light mode", () => {
    const store = configureStore({
      reducer: {
        theme: themeReducer,
      },
      preloadedState: {
        theme: {
          mode: "light",
        },
      },
    })

    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>,
    )

    expect(screen.getByTestId("sun-icon")).toBeInTheDocument()
    expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument()
  })

  it("renders moon icon when in dark mode", () => {
    const store = configureStore({
      reducer: {
        theme: themeReducer,
      },
      preloadedState: {
        theme: {
          mode: "dark",
        },
      },
    })

    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>,
    )

    expect(screen.getByTestId("moon-icon")).toBeInTheDocument()
    expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument()
  })

  it("dispatches toggleTheme action when clicked", () => {
    const store = configureStore({
      reducer: {
        theme: themeReducer,
      },
      preloadedState: {
        theme: {
          mode: "light",
        },
      },
    })

    // Spy on store.dispatch
    const dispatchSpy = vi.spyOn(store, "dispatch")

    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>,
    )

    // Click the toggle
    fireEvent.click(screen.getByRole("button"))

    // Check if toggleTheme action was dispatched
    expect(dispatchSpy).toHaveBeenCalledWith(toggleTheme())
  })
})

