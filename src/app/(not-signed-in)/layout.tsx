// External Imports
import { ReactNode } from "react";

// Local Imports
import { getUser } from "@/shared/actions/get-user";
import { Container } from "@/shared/components/container";
import { LogoHeader } from "@/shared/components/logo-header";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { redirect } from "next/navigation";

interface Props {
  children: ReactNode;
}

const AuthLayout = async ({ children }: Props) => {
  const [{ data: user }] = await Promise.all([runParallelAction(getUser())]);

  if (user) {
    if (!user.username) {
      redirect("/onboarding");
    } else {
      redirect(`/${user.username}`);
    }
  }

  return (
    <Container className="flex h-dvh flex-col">
      <LogoHeader />
      {children}
    </Container>
  );
};

export default AuthLayout;
