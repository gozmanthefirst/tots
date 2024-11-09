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

const AuthLayout = async ({ children }: Props) => {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (session?.user) {
    if (!session?.user.username) {
      redirect("/onboarding");
    } else {
      redirect(`/${session.user.username}`);
    }
  }

  return (
    <Container className="flex flex-col h-dvh">
      <LogoHeader />
      {children}
    </Container>
  );
};

export default AuthLayout;
