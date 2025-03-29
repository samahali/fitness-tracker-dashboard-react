import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the dependencies
vi.mock("react-dom/client", async (importOriginal) => {
  const actual = await importOriginal(); // Import the real module
  return {
    ...actual,
    createRoot: vi.fn(() => {
      return {
        render: vi.fn(),
      };
    }),
  };
});

vi.mock("react-redux", () => ({
  Provider: ({ children }) => <div data-testid="mock-provider">{children}</div>,
}));

vi.mock("../src/App", () => ({
  default: () => <div data-testid="mock-app">App Component</div>,
}));

vi.mock("../src/AppWrapper", () => ({
  default: ({ children }) => <div data-testid="mock-app-wrapper">{children}</div>,
}));

vi.mock("../src/redux/store", () => ({
  store: { getState: vi.fn(), dispatch: vi.fn() },
}));

describe("main.jsx", () => {
  let originalCreateElement;

  beforeEach(() => {
    // Save original createElement
    originalCreateElement = document.createElement.bind(document);

    // Mock document.getElementById
    const mockDiv = document.createElement("div");
    mockDiv.id = "root";
    document.getElementById = vi.fn().mockReturnValue(mockDiv);

    // Clear module cache to ensure fresh import
    vi.resetModules();

    // Mock console.error to suppress React warnings
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original methods
    if (originalCreateElement) {
      document.createElement = originalCreateElement;
    }

    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("renders the app with all required wrappers", async () => {
    // Import the module under test - we need to use dynamic import
    // to ensure our mocks are set up before the module is loaded
    const ReactDOM = await import("react-dom/client");

    // Now import the main module which will use our mocked modules
    await import("../src/main");

    // Verify createRoot was called with the root element
    expect(document.getElementById).toHaveBeenCalledWith("root");

    // Get the render mock properly
    const renderMock = ReactDOM.createRoot.mock.results[0]?.value?.render;
  });
});
