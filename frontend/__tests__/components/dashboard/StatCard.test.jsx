import { render, screen } from "@testing-library/react"
import StatCard from "../../../src/components/dashboard/StatCard"
import { FaDumbbell } from "react-icons/fa"

describe("StatCard Component", () => {
  it("renders with default variant", () => {
    render(<StatCard title="Workouts" value="25" icon={FaDumbbell} />)

    expect(screen.getByText("Workouts")).toBeInTheDocument()
    expect(screen.getByText("25")).toBeInTheDocument()

    // Check if the icon is rendered
    const iconElement = document.querySelector(".stats-card-icon svg")
    expect(iconElement).toBeInTheDocument()

    // Check if the default variant class is applied
    const cardElement = document.querySelector(".stats-card")
    expect(cardElement).toHaveClass("stats-card-primary-gradient")
  })

  it("renders with custom variant", () => {
    render(<StatCard title="Calories" value="1,200" icon={FaDumbbell} variant="success" />)

    expect(screen.getByText("Calories")).toBeInTheDocument()
    expect(screen.getByText("1,200")).toBeInTheDocument()

    // Check if the custom variant class is applied
    const cardElement = document.querySelector(".stats-card")
    expect(cardElement).toHaveClass("stats-card-success")
  })

  it("renders with numeric value", () => {
    render(<StatCard title="Progress" value={75} icon={FaDumbbell} />)

    expect(screen.getByText("Progress")).toBeInTheDocument()
    expect(screen.getByText("75")).toBeInTheDocument()
  })

  it("renders with empty value", () => {
    render(<StatCard title="Workouts" value="" icon={FaDumbbell} />)

    expect(screen.getByText("Workouts")).toBeInTheDocument()
    const valueElement = document.querySelector(".stats-card-value")
    expect(valueElement.textContent).toBe("")
  })
})

