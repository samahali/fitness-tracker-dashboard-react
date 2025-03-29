import { describe, it, expect, vi, beforeEach } from "vitest"
import themeReducer, { toggleTheme, setTheme } from "../../src/redux/slices/themeSlice"

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
}

// Replace global localStorage with mock
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true
})

describe("Theme Slice", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
  })

  describe("Reducers", () => {
    it("should handle toggleTheme from light to dark", () => {
      const state = {
        mode: "light",
      }

      expect(themeReducer(state, toggleTheme())).toEqual({
        mode: "dark",
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark")
    })

    it("should handle toggleTheme from dark to light", () => {
      const state = {
        mode: "dark",
      }

      expect(themeReducer(state, toggleTheme())).toEqual({
        mode: "light",
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light")
    })

    it("should handle setTheme", () => {
      const state = {
        mode: "light",
      }

      expect(themeReducer(state, setTheme("dark"))).toEqual({
        mode: "dark",
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark")
    })
  })
})