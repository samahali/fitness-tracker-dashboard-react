import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"
import Navbar from "../../../src/components/layout/Navbar"
import authReducer from "../../../src/redux/slices/authSlice"
import themeReducer from "../../../src/redux/slices/themeSlice"

describe("Navbar Component", () => {
  const createTestStore = (preloadedState) =>
    configureStore({
      reducer: { auth: authReducer, theme: themeReducer },
      preloadedState,
    })

    it("renders correctly when authenticated", () => {
        const store = createTestStore({
          auth: {
            isAuthenticated: true,
            currentUser: { firstName: "John" },
          },
          theme: { mode: "light" },
        })
    
        render(
          <Provider store={store}>
            <BrowserRouter>
              <Navbar />
            </BrowserRouter>
          </Provider>
        )
    
        // Debug output
        screen.debug()
    
        // Check if "John" appears in any part of the component
        const nameElements = screen.getAllByText(/John/i)
        expect(nameElements.length).toBeGreaterThan(0)
      })

  it("renders correctly when not authenticated", () => {
    const store = createTestStore({
      auth: { isAuthenticated: false },
      theme: { mode: "light" },
    })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    )

    // Check if at least one "Login" button exists
    const loginButtons = screen.getAllByText(/Login/i)
    expect(loginButtons.length).toBeGreaterThan(0)

    // Optionally, check for a specific "Login" button
    // expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument()
  })
})
