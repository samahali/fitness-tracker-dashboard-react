import { render } from "@testing-library/react"
import WorkoutTypeChart from "../../../src/components/dashboard/WorkoutTypeChart"
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

describe("WorkoutTypeChart Component", () => {
  const mockWorkoutTypes = {
    cardio: 5,
    strength: 8,
    yoga: 3,
    hiit: 2,
  }

  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks()
  })

  it("renders a canvas element", () => {
    render(<WorkoutTypeChart workoutTypes={mockWorkoutTypes} />)
    const canvasElement = document.querySelector("canvas")
    expect(canvasElement).toBeInTheDocument()
  })

  it("initializes Chart.js with workout type data", () => {
    render(<WorkoutTypeChart workoutTypes={mockWorkoutTypes} />)
    expect(Chart).toHaveBeenCalled()

    // Check that Chart was initialized with the correct type
    const chartConfig = Chart.mock.calls[0][1]
    expect(chartConfig.type).toBe("doughnut")

    // Check that data was processed correctly
    expect(chartConfig.data.labels.length).toBe(4) // 4 workout types
    expect(chartConfig.data.datasets[0].data.length).toBe(4)
  })

  it("doesn't initialize Chart.js when workout types are empty", () => {
    render(<WorkoutTypeChart workoutTypes={{}} />)
    expect(Chart).not.toHaveBeenCalled()
  })

  it("doesn't initialize Chart.js when workout types are null", () => {
    render(<WorkoutTypeChart workoutTypes={null} />)
    expect(Chart).not.toHaveBeenCalled()
  })

  it("destroys previous chart instance when component updates", () => {
    const { rerender } = render(<WorkoutTypeChart workoutTypes={mockWorkoutTypes} />)

    // First render should create a chart
    expect(Chart).toHaveBeenCalledTimes(1)

    // Get the destroy method from the mocked chart instance
    const destroyMock = Chart.mock.results[0].value.destroy

    // Rerender with new workout types
    rerender(<WorkoutTypeChart workoutTypes={{ ...mockWorkoutTypes, pilates: 4 }} />)


    // Should create a new chart
    expect(Chart).toHaveBeenCalledTimes(2)
  })
})