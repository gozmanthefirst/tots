// External Imports
import { headers } from "next/headers";
import { ReactNode } from "react";

// Local Imports
import { Container } from "@/shared/components/container";
import { LogoHeader } from "@/shared/components/logo-header";
import { auth } from "@/shared/lib/auth/auth";
import { redirect } from "next/navigation";

interface Props {
  children: ReactNode;
}

const OnboardingLayout = async ({ children }: Props) => {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (session?.user) {
    if (session?.user.username) {
      redirect(`/${session.user.username}`);
    }
  } else {
    redirect(`/sign-in`);
  }

  return (
    <Container className="flex flex-col h-dvh">
      <LogoHeader />
      {children}
    </Container>
  );
};

export default OnboardingLayout;
