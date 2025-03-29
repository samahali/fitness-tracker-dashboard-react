import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import Footer from "../../../src/components/layout/Footer"
import authReducer from "../../../src/redux/slices/authSlice"

describe("Footer Component", () => {
  const createTestStore = (preloadedState) =>
    configureStore({
      reducer: { auth: authReducer },
      preloadedState,
    })

  it("renders authenticated footer", () => {
    const store = createTestStore({ auth: { isAuthenticated: true } })

    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    )

    expect(screen.getByText(/FitPulse. All rights reserved./i)).toBeInTheDocument()
  })

  it("renders public footer with contact details", () => {
    const store = createTestStore({ auth: { isAuthenticated: false } })

    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    )

    expect(screen.getByText("Contact Us")).toBeInTheDocument()
    expect(screen.getByText(/support@fitpulse.com/i)).toBeInTheDocument()
  })
})
