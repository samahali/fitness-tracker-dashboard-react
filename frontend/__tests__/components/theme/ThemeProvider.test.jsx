import { describe, it, expect, beforeEach } from "vitest"
import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import ThemeProvider from "../../../src/components/theme/ThemeProvider"
import themeReducer from "../../../src/redux/slices/themeSlice"

describe("ThemeProvider Component", () => {
  let store

  beforeEach(() => {
    // Reset the store before each test
    store = configureStore({
      reducer: {
        theme: themeReducer,
      },
      preloadedState: {
        theme: {
          mode: "light",
        },
      },
    })

    // Reset document.body.classList
    document.body.classList.remove("dark-mode")
  })

  it("adds dark-mode class to body when theme is dark", () => {
    store = configureStore({
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
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      </Provider>,
    )

    expect(document.body.classList.contains("dark-mode")).toBe(true)
  })

  it("removes dark-mode class from body when theme is light", () => {
    // Add dark-mode class to body
    document.body.classList.add("dark-mode")

    render(
      <Provider store={store}>
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      </Provider>,
    )

    expect(document.body.classList.contains("dark-mode")).toBe(false)
  })

  it("renders children correctly", () => {
    const { getByText } = render(
      <Provider store={store}>
        <ThemeProvider>
          <div>Child Component</div>
        </ThemeProvider>
      </Provider>,
    )

    expect(getByText("Child Component")).toBeInTheDocument()
  })
})

