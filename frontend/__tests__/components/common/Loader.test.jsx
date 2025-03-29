import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Loader from "../../../src/components/common/Loader"

describe("Loader Component", () => {
  it("renders correctly", () => {
    render(<Loader />)

    // Check if the loader container is rendered
    const loaderContainer = screen.getByRole("status")
    expect(loaderContainer).toBeInTheDocument()

    // Check if the loader has the correct class
    expect(loaderContainer.firstChild).toHaveClass("premium-loader")
  })
})
