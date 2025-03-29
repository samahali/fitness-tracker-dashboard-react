import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import Profile from "../../src/pages/Profile"

// Mock the Redux actions
vi.mock("../../src/redux/slices/authSlice", () => ({
  updateUserProfile: vi.fn(() => ({
    type: "auth/updateProfile",
    payload: {},
    unwrap: vi.fn().mockResolvedValue({}),
  })),
}))

// Mock the AvatarUpload component
vi.mock("../../src/components/profile/AvatarUpload", () => ({
  default: ({ currentUser }) => (
    <div data-testid="avatar-upload">Avatar Upload for {currentUser?.firstName || "User"}</div>
  ),
}))

// Mock the Loader component
vi.mock("../../src/components/common/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}))

describe("Profile Component", () => {
  let store

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create a mock store with initial state
    store = configureStore({
      reducer: {
        auth: (
          state = {
            currentUser: {
              firstName: "John",
              lastName: "Doe",
              email: "john@example.com",
              age: 30,
              gender: "male",
              weight: 75,
              height: 180,
            },
            loading: false,
            error: null,
          },
        ) => state,
      },
    })
  })

  it("renders the profile form with user data", () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    )

    // Check if the form title is rendered
    expect(screen.getByText("Your Profile")).toBeInTheDocument()

    // Check if the avatar upload component is rendered
    expect(screen.getByTestId("avatar-upload")).toBeInTheDocument()
    expect(screen.getByText("Avatar Upload for John")).toBeInTheDocument()

    // Check if form fields are populated with user data
    expect(screen.getByLabelText("First Name")).toHaveValue("John")
    expect(screen.getByLabelText("Last Name")).toHaveValue("Doe")
    expect(screen.getByLabelText("Email")).toHaveValue("john@example.com")
    expect(screen.getByLabelText("Age")).toHaveValue(30)
    expect(screen.getByLabelText("Gender")).toHaveValue("male")
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(75)
    expect(screen.getByLabelText("Height (cm)")).toHaveValue(180)

    // Check if the update button is rendered
    expect(screen.getByRole("button", { name: "Update Profile" })).toBeInTheDocument()
  })

  it("shows loader when loading", () => {
    // Create a store  })).toBeInTheDocument();
  })

  it("shows loader when loading", () => {
    // Create a store with loading state
    const loadingStore = configureStore({
      reducer: {
        auth: (
          state = {
            currentUser: null,
            loading: true,
            error: null,
          },
        ) => state,
      },
    })

    render(
      <Provider store={loadingStore}>
        <Profile />
      </Provider>,
    )

    expect(screen.getByTestId("loader")).toBeInTheDocument()
  })

  it("displays error message when there is an error", () => {
    // Create a store with an error
    const errorStore = configureStore({
      reducer: {
        auth: (
          state = {
            currentUser: {
              firstName: "John",
              lastName: "Doe",
              email: "john@example.com",
            },
            loading: false,
            error: "Failed to update profile",
          },
        ) => state,
      },
    })

    render(
      <Provider store={errorStore}>
        <Profile />
      </Provider>,
    )

    expect(screen.getByText("Failed to update profile")).toBeInTheDocument()
  })

  it("updates form data on input change", () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    )

    const firstNameInput = screen.getByLabelText("First Name")
    const weightInput = screen.getByLabelText("Weight (kg)")

    fireEvent.change(firstNameInput, { target: { value: "Jane" } })
    fireEvent.change(weightInput, { target: { value: "65" } })

    expect(firstNameInput.value).toBe("Jane")
    expect(weightInput.value).toBe("65")
  })

  it("displays success message after successful update", async () => {
    // Import the updateUserProfile action to spy on it
    const { updateUserProfile } = await import("../../src/redux/slices/authSlice")

    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    )

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Update Profile" }))

    // Check if updateUserProfile was called with the correct data
    expect(updateUserProfile).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      age: 30,
      gender: "male",
      weight: 75,
      height: 180,
      profileImage: undefined,
    })

    // Wait for success message to appear
    await waitFor(() => {
      expect(screen.getByText("Profile updated successfully")).toBeInTheDocument()
    })
  })

  it("disables email field", () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    )

    expect(screen.getByLabelText("Email")).toBeDisabled()
    expect(screen.getByText("Email cannot be changed")).toBeInTheDocument()
  })

  it("handles numeric fields correctly", () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    )

    const ageInput = screen.getByLabelText("Age")
    const weightInput = screen.getByLabelText("Weight (kg)")
    const heightInput = screen.getByLabelText("Height (cm)")

    // Test with valid numeric values
    fireEvent.change(ageInput, { target: { value: "31" } })
    fireEvent.change(weightInput, { target: { value: "76.5" } })
    fireEvent.change(heightInput, { target: { value: "181.5" } })

    expect(ageInput.value).toBe("31")
    expect(weightInput.value).toBe("76.5")
    expect(heightInput.value).toBe("181.5")

    // Test with empty values
    fireEvent.change(ageInput, { target: { value: "" } })
    expect(ageInput.value).toBe("")
  })
})

