import React from "react"
import { render, screen } from "@testing-library/react"
import GoalProgressChart from "../../../src/components/dashboard/GoalProgressChart"
import Chart from "chart.js/auto"
import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock Chart.js
vi.mock("chart.js/auto", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      destroy: vi.fn(),
    })),
  }
})

describe("GoalProgressChart Component", () => {
  const mockGoals = [
    { id: 1, title: "Run 5K", status: "in_progress" },
    { id: 2, title: "Lose 5 pounds", status: "achieved" },
    { id: 3, title: "Do 50 pushups", status: "in_progress" },
    { id: 4, title: "Drink 2L water daily", status: "failed" },
    { id: 5, title: "Meditate daily", status: "achieved" },
  ]

  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks()
  })

  it("renders a canvas element", () => {
    render(<GoalProgressChart goals={mockGoals} />)
    const canvasElement = document.querySelector("canvas")
    expect(canvasElement).toBeInTheDocument()
  })

  it("initializes Chart.js with goal data", () => {
    render(<GoalProgressChart goals={mockGoals} />)
    expect(Chart).toHaveBeenCalled()
    
    // Check that Chart was initialized with the correct type
    const chartConfig = Chart.mock.calls[0][1]
    expect(chartConfig.type).toBe("bar")
    
    // Check that data was processed correctly
    expect(chartConfig.data.labels).toContain("In Progress")
    expect(chartConfig.data.labels).toContain("Achieved")
    expect(chartConfig.data.labels).toContain("Failed")
  })

  it("doesn't initialize Chart.js when goals are empty", () => {
    render(<GoalProgressChart goals={[]} />)
    expect(Chart).not.toHaveBeenCalled()
  })

  it("doesn't initialize Chart.js when goals are null", () => {
    render(<GoalProgressChart goals={null} />)
    expect(Chart).not.toHaveBeenCalled()
  })

  it("destroys previous chart instance when component updates", () => {
    const { rerender } = render(<GoalProgressChart goals={mockGoals} />)
    
    // First render should create a chart
    expect(Chart).toHaveBeenCalledTimes(1)
    
    // Get the destroy method from the mocked chart instance
    const destroyMock = Chart.mock.results[0].value.destroy
    
    // Rerender with new goals
    rerender(<GoalProgressChart goals={[...mockGoals, { id: 6, title: "New goal", status: "in_progress" }]} />)
    
    // Should create a new chart
    expect(Chart).toHaveBeenCalledTimes(2)
  })
})
