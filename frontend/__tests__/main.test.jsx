import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { store } from "../src/redux/store"
import App from "../src/App"
import AppWrapper from "../src/AppWrapper"

// Mock ReactDOM.createRoot since we're not testing actual mounting
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}))

test("renders the app inside providers without crashing", () => {
  render(
    <Provider store={store}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </Provider>
  )

  // Example check: Ensure the Navbar or an important element renders
  expect(screen.getByRole("navigation", { name: /desktop/i })).toBeInTheDocument();
})
