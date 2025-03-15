import { SignInForm } from "@/features/auth/components/sign-in-form";

export const dynamic = "force-dynamic";

const SignInPage = () => {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <SignInForm />
    </main>
  );
};

export default SignInPage;
