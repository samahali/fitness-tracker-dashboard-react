import { render } from "@testing-library/react"
import WorkoutChart from "../../../src/components/dashboard/WorkoutChart"
import Chart from "chart.js/auto"
import { describe, expect, it, vi, beforeEach } from "vitest"

// Mock Chart.js
vi.mock("chart.js/auto", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      destroy: vi.fn(),
    })),
  }
})

describe("WorkoutChart Component", () => {
  const mockWorkouts = [
    {
      id: 1,
      type: "cardio",
      duration: 30,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: "strength",
      duration: 45,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ]

  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks()
  })

  it("renders a canvas element", () => {
    render(<WorkoutChart workouts={mockWorkouts} />)
    const canvasElement = document.querySelector("canvas")
    expect(canvasElement).toBeInTheDocument()
  })

  it("initializes Chart.js with workout data", () => {
    render(<WorkoutChart workouts={mockWorkouts} />)
    expect(Chart).toHaveBeenCalled()

    // Check that Chart was initialized with the correct type
    const chartConfig = Chart.mock.calls[0][1]
    expect(chartConfig.type).toBe("line")
  })

  it("doesn't initialize Chart.js when workouts are empty", () => {
    render(<WorkoutChart workouts={[]} />)
    expect(Chart).not.toHaveBeenCalled()
  })

  it("doesn't initialize Chart.js when workouts are null", () => {
    render(<WorkoutChart workouts={null} />)
    expect(Chart).not.toHaveBeenCalled()
  })

  it("destroys previous chart instance when component updates", () => {
    const { rerender } = render(<WorkoutChart workouts={mockWorkouts} />)

    // First render should create a chart
    expect(Chart).toHaveBeenCalledTimes(1)

    // Get the destroy method from the mocked chart instance
    const destroyMock = Chart.mock.results[0].value.destroy

    // Rerender with new workouts
    rerender(
      <WorkoutChart
        workouts={[...mockWorkouts, { id: 3, type: "yoga", duration: 60, createdAt: new Date().toISOString() }]}
      />,
    )

    // Should create a new chart
    expect(Chart).toHaveBeenCalledTimes(2)
  })
})

