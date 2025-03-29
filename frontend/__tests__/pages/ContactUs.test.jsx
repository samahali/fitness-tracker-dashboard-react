import { render, screen, fireEvent } from "@testing-library/react";
import ContactUs from "../../src/pages/ContactUs";

describe("ContactUs Component", () => {
  test("renders Contact Us heading", () => {
    render(<ContactUs />);
    const heading = screen.getByRole("heading", { name: /contact us/i });
    expect(heading).toBeInTheDocument();
  });

  test("renders form fields", () => {
    render(<ContactUs />);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  test("updates form fields on change", () => {
    render(<ContactUs />);

    const nameInput = screen.getByLabelText(/your name/i);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");
  });

  test("submits the form and displays success message", () => {
    render(<ContactUs />);

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: "Inquiry" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Hello, I have a question." },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
  });
});
