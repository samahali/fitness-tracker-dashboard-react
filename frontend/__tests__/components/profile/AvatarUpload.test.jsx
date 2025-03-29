import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import AvatarUpload from "../../../src/components/profile/AvatarUpload"
import { updateUserProfile } from "../../../src/redux/slices/authSlice"
import { describe, beforeEach, afterEach, it, vi, expect } from "vitest"

// Mock redux
vi.mock("../../../src/redux/slices/authSlice", () => ({
  updateUserProfile: vi.fn().mockImplementation((userData) => ({
    type: "auth/updateUserProfile",
    payload: userData,
  })),
}))

// Mock Cropper component
vi.mock("react-easy-crop", () => ({
  default: vi.fn().mockImplementation(({ image, crop, zoom, onCropChange, onCropComplete, onZoomChange }) => (
    <div data-testid="mock-cropper">
      <img src={image || "/placeholder.svg"} alt="crop preview" data-testid="crop-preview" />
      <button
        data-testid="trigger-crop-complete"
        onClick={() =>
          onCropComplete({ x: 0, y: 0, width: 200, height: 200 }, { x: 10, y: 10, width: 100, height: 100 })
        }
      >
        Trigger Crop Complete
      </button>
    </div>
  )),
}))

// Mock react-bootstrap components
vi.mock("react-bootstrap", () => {
  const ModalHeader = vi.fn().mockImplementation(({ children }) => <div data-testid="modal-header">{children}</div>)
  const ModalTitle = vi.fn().mockImplementation(({ children }) => <div data-testid="modal-title">{children}</div>)
  const ModalBody = vi.fn().mockImplementation(({ children }) => <div data-testid="modal-body">{children}</div>)
  const ModalFooter = vi.fn().mockImplementation(({ children }) => <div data-testid="modal-footer">{children}</div>)

  const Modal = vi
    .fn()
    .mockImplementation(({ show, onHide, children }) => (show ? <div data-testid="modal">{children}</div> : null))

  // Attach nested components to Modal
  Modal.Header = ModalHeader
  Modal.Title = ModalTitle
  Modal.Body = ModalBody
  Modal.Footer = ModalFooter

  return {
    Modal,
    Button: vi.fn().mockImplementation(({ children, onClick, variant, disabled }) => (
      <button onClick={onClick} disabled={disabled} data-testid={`button-${variant}`}>
        {children}
      </button>
    )),
    ProgressBar: vi.fn().mockImplementation(({ now }) => <div data-testid="progress-bar" data-now={now}></div>),
  }
})

// Mock canvas and blob operations
global.URL.createObjectURL = vi.fn(() => "blob:mock-url")
global.URL.revokeObjectURL = vi.fn()

describe("AvatarUpload Component", () => {
  let store
  let originalCreateElement
  let xhrMock

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        auth: (state = { user: null, loading: false, error: null }, action) => state,
      },
    })

    // Save original createElement
    originalCreateElement = document.createElement.bind(document)

    // Mock canvas operations
    const mockCanvas = {
      getContext: vi.fn().mockReturnValue({
        drawImage: vi.fn(),
      }),
      toBlob: vi.fn().mockImplementation((callback) => {
        callback(new Blob(["mock-image-data"], { type: "image/webp" }))
      }),
    }

    // Mock document.createElement
    document.createElement = vi.fn().mockImplementation((tag) => {
      if (tag === "canvas") return mockCanvas
      // Use jsdom's createElement for other elements
      return originalCreateElement(tag)
    })

    // Create a proper XMLHttpRequest mock with onload handler
    xhrMock = {
      open: vi.fn(),
      send: vi.fn(),
      setRequestHeader: vi.fn(),
      upload: {
        addEventListener: vi.fn(),
      },
      status: 200,
      responseText: JSON.stringify({ imageUrl: "https://example.com/avatar.jpg" }),
      _onload: null,
    }

    // Add onload as a property that can be set
    Object.defineProperty(xhrMock, "onload", {
      set: function (callback) {
        this._onload = callback
      },
      get: function () {
        return this._onload
      },
    })

    // Method to trigger the onload event
    xhrMock.triggerOnload = function () {
      if (this._onload) {
        this._onload.call(this)
      }
    }

    // Mock XMLHttpRequest constructor
    global.XMLHttpRequest = vi.fn(() => xhrMock)

    // Mock environment variable
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com")
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()

    // Restore original createElement
    if (originalCreateElement) {
      document.createElement = originalCreateElement
    }
  })

  const mockUser = {
    id: "123",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  }

  it("renders avatar with initials when no profile image exists", () => {
    render(
      <Provider store={store}>
        <AvatarUpload currentUser={mockUser} />
      </Provider>,
    )

    const initialsElement = screen.getByText("JD")
    expect(initialsElement).toBeInTheDocument()
  })

  it("renders avatar with image when profile image exists", () => {
    const userWithImage = {
      ...mockUser,
      profileImage: "https://example.com/avatar.jpg",
    }

    render(
      <Provider store={store}>
        <AvatarUpload currentUser={userWithImage} />
      </Provider>,
    )

    const imageElement = document.querySelector(".avatar-image")
    expect(imageElement).toBeInTheDocument()
    expect(imageElement.src).toContain("https://example.com/avatar.jpg")
  })

  it("opens file input when avatar is clicked", () => {
    render(
      <Provider store={store}>
        <AvatarUpload currentUser={mockUser} />
      </Provider>,
    )

    const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click")

    const avatarElement = document.querySelector(".avatar-preview")
    fireEvent.click(avatarElement)

    expect(clickSpy).toHaveBeenCalled()
  })

  it("shows cropper modal when file is selected", async () => {
    render(
      <Provider store={store}>
        <AvatarUpload currentUser={mockUser} />
      </Provider>,
    )

    const file = new File(["dummy content"], "avatar.png", { type: "image/png" })
    const fileInput = document.querySelector("input[type='file']")

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: null,
      result: "data:image/png;base64,mockbase64data",
    }

    global.FileReader = vi.fn().mockImplementation(() => mockFileReader)

    // Trigger file selection
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })

      // Simulate FileReader onload
      mockFileReader.onload({ target: mockFileReader })
    })

    // Check if modal is shown
    await waitFor(() => {
      const modal = screen.getByTestId("modal")
      expect(modal).toBeInTheDocument()
    })
  })

  it("processes image when Apply button is clicked", async () => {
    // Setup dispatch spy
    const dispatchSpy = vi.spyOn(store, "dispatch")

    render(
      <Provider store={store}>
        <AvatarUpload currentUser={mockUser} />
      </Provider>,
    )

    // Select a file to trigger the modal
    const file = new File(["dummy content"], "avatar.png", { type: "image/png" })
    const fileInput = document.querySelector("input[type='file']")

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: null,
      result: "data:image/png;base64,mockbase64data",
    }

    global.FileReader = vi.fn().mockImplementation(() => mockFileReader)

    // Mock Image constructor
    const originalImage = global.Image
    global.Image = vi.fn().mockImplementation(() => ({
      src: "",
      onload: null,
    }))

    // Trigger file selection and all subsequent actions inside act
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })

      // Simulate FileReader onload
      mockFileReader.onload({ target: mockFileReader })
    })

    // Wait for modal to appear
    await waitFor(() => {
      const modal = screen.getByTestId("modal")
      expect(modal).toBeInTheDocument()
    })

    // Trigger crop complete and apply button click inside act
    await act(async () => {
      // Trigger crop complete
      const cropCompleteButton = screen.getByTestId("trigger-crop-complete")
      fireEvent.click(cropCompleteButton)

      // Click Apply button
      const applyButton = screen.getByTestId("button-primary")
      fireEvent.click(applyButton)

      // Simulate image onload
      const imageInstance = global.Image.mock.instances[0]
      if (imageInstance && typeof imageInstance.onload === "function") {
        imageInstance.onload()
      }

      // Simulate XMLHttpRequest response - use the xhrMock directly from the test scope
      if (xhrMock && xhrMock.triggerOnload) {
        xhrMock.triggerOnload()
      }
    })
    // Restore global Image
    global.Image = originalImage
  })
})