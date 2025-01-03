// External Imports
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Local Imports
import WelcomePage from "@/app/(not-signed-in)/page";

describe("WelcomePage", () => {
  //
  it("renders welcome title correctly", () => {
    render(<WelcomePage />);

    const welcomePageTitle = screen.getByText((content, element) => {
      const hasText = (node: Element | null) =>
        node?.textContent === "Effortlessly capture your tots as they come";
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element?.children || []).every(
        (child) => !hasText(child),
      );
      return elementHasText && childrenDontHaveText;
    });

    expect(welcomePageTitle).toBeInTheDocument();
  });

  it("renders welcome text correctly", () => {
    render(<WelcomePage />);

    const welcomePageText = screen.getByText(
      /A seamless note-taking experience/i,
    );

    expect(welcomePageText).toBeInTheDocument();
  });

  it(`renders 'Get Started' button correctly`, () => {
    render(<WelcomePage />);

    const getStartedBtn = screen.getByRole("link", { name: /get started/i });

    expect(getStartedBtn).toBeInTheDocument();
    expect(getStartedBtn).toHaveAttribute("href", "/sign-in");
  });
});
