import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"
import Sidebar from "../../../src/components/layout/Sidebar"
import authReducer, { logout } from "../../../src/redux/slices/authSlice"

describe("Sidebar Component", () => {
  const createTestStore = (preloadedState) => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState,
    })
    store.dispatch = vi.fn() // Mock dispatch
    return store
  }

  let store

  beforeEach(() => {
    store = createTestStore({
      auth: {
        currentUser: { firstName: "John", lastName: "Doe", email: "john@example.com" },
        isAuthenticated: true,
      },
    })
  })

  it("renders correctly when authenticated", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })

  it("calls logout when clicking on Logout", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      </Provider>
    )

    fireEvent.click(screen.getByText("Logout"))
    expect(store.dispatch).toHaveBeenCalledWith(logout())
  })
})
