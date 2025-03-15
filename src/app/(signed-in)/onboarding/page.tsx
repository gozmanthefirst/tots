import { CreateUsernameForm } from "@/features/onboarding/components/create-username-form";

export const dynamic = "force-dynamic";

const OnboardingPage = () => {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <CreateUsernameForm />
    </main>
  );
};

export default OnboardingPage;
