// External Imports
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Local Imports
import { WelcomeContent } from "@/features/welcome/components/welcome-content";

describe("Welcome Content", () => {
  describe("Render", () => {
    it("should render welcome title correctly", () => {
      render(<WelcomeContent />);

      const welcomeTitle = screen.getByRole("heading", {
        level: 1,
        name: /effortlessly capture your tots as they come/i,
      });

      expect(welcomeTitle).toBeInTheDocument();
    });

    it("should render welcome text correctly", () => {
      render(<WelcomeContent />);

      const welcomeText = screen.getByText(
        /A seamless note-taking experience that adapts to your rhythm./i,
      );

      expect(welcomeText).toBeInTheDocument();
    });

    it(`should render 'Get Started' button correctly`, () => {
      render(<WelcomeContent />);

      const getStartedBtn = screen.getByRole("link", { name: /get started/i });

      expect(getStartedBtn).toBeInTheDocument();
      expect(getStartedBtn).toHaveAttribute("href", "/sign-in");
    });
  });
});
