import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AboutUs from "../../src/pages/AboutUs";

// Mock react-icons to avoid rendering actual icons
vi.mock("react-icons/fa", () => ({
  FaGithub: () => <span data-testid="github-icon">GitHub</span>,
  FaLinkedin: () => <span data-testid="linkedin-icon">LinkedIn</span>,
  FaHeartbeat: () => <span data-testid="heartbeat-icon">Heartbeat</span>,
  FaChartLine: () => <span data-testid="chartline-icon">ChartLine</span>,
  FaUsers: () => <span data-testid="users-icon">Users</span>,
  FaRocket: () => <span data-testid="rocket-icon">Rocket</span>,
  FaLightbulb: () => <span data-testid="lightbulb-icon">Lightbulb</span>,
  FaHandshake: () => <span data-testid="handshake-icon">Handshake</span>,
}));

describe("AboutUs Page", () => {
  it("renders the About Us heading", () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    expect(screen.getByText("About Us")).toBeInTheDocument();
  });

  it("renders mission section with key values", () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );

    expect(screen.getByText("Our Mission")).toBeInTheDocument();
    expect(screen.getByText("Empowering Your Fitness Journey")).toBeInTheDocument();
    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText("Simplicity")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
  });

  it("renders all team members", () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );

    const teamMembers = ["Samah Ali", "Omnya Tarek", "Esraa Mostafa", "Mariam Helmy"];

    teamMembers.forEach((member) => {
      expect(screen.getByText(member)).toBeInTheDocument();
    });
  });

  it("renders GitHub and LinkedIn icons for each team member", () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );

    const githubIcons = screen.getAllByTestId("github-icon");
    const linkedinIcons = screen.getAllByTestId("linkedin-icon");

    expect(githubIcons.length).toBe(4);
    expect(linkedinIcons.length).toBe(4);
  });
});
