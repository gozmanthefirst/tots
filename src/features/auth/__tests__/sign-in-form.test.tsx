// External Imports
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Local Imports
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { signIn } from "@/shared/lib/auth/auth-client";

jest.mock("better-auth/react", () => ({
  createAuthClient: jest.fn(() => ({
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    useSession: jest.fn(),
  })),
}));

jest.mock("../../../shared/lib/auth/auth-client", () => ({
  signIn: {
    social: jest.fn(),
  },
}));

describe("Sign In Form", () => {
  describe("Render", () => {
    it("should render a sign in form with heading and google sign-in button", () => {
      render(<SignInForm />);

      const signInHeading = screen.getByRole("heading", {
        level: 1,
        name: /sign in to tots/i,
      });
      const googleSignInBtns = screen.getAllByRole("button", {
        name: /continue with google/i,
      });

      expect(signInHeading).toBeInTheDocument();
      googleSignInBtns.forEach((btn) => {
        expect(btn).toBeInTheDocument();
      });
    });
  });

  describe("Behaviour", () => {
    it("should call signIn.social with 'google' when the Google sign in button is clicked, disable the Google sign-in button and show loading state while processing sign in", () => {
      render(<SignInForm />);

      // This is for mocking the sign-in process after the sign in button has been clicked
      (signIn.social as jest.Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 500)),
      );

      const googleSignInBtns = screen.getAllByRole("button", {
        name: /continue with google/i,
      });

      googleSignInBtns.forEach(async (btn) => {
        await userEvent.click(btn);

        expect(signIn.social).toHaveBeenCalledTimes(1);
        expect(signIn.social).toHaveBeenCalledWith({
          provider: "google",
        });
        expect(btn).toBeDisabled();
        
        // This is commented out because I stopped using the DIY loading spinner since it's a hack and therefore kinda messy. An alternative test for this will be found.
        // expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      });
    });

    it("should show an error message in the button when signIn.social fails ", () => {
      render(<SignInForm />);

      // This is for mocking the sign-in process if an error occurs
      (signIn.social as jest.Mock).mockRejectedValueOnce(
        new Error("Something went wrong"),
      );

      const googleSignInBtns = screen.getAllByRole("button", {
        name: /continue with google/i,
      });

      googleSignInBtns.forEach(async (btn) => {
        await userEvent.click(btn);

        expect(btn).toBeDisabled();
        expect(screen.findByText(/Something went wrong/i)).toBeInTheDocument();
      });
    });

    it("should show a message in the button when signIn.social succeeds ", () => {
      render(<SignInForm />);

      // This is for mocking the sign-in process if an error occurs
      (signIn.social as jest.Mock).mockResolvedValueOnce({ status: "success" });

      const googleSignInBtns = screen.getAllByRole("button", {
        name: /continue with google/i,
      });

      googleSignInBtns.forEach(async (btn) => {
        await userEvent.click(btn);

        expect(btn).toBeDisabled();
        expect(screen.findByText(/Signing in.../i)).toBeInTheDocument();
      });
    });
  });
});
