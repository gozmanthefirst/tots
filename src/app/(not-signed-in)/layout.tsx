import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/shared/api/get-user";
import { Container } from "@/shared/components/container";
import { LogoHeader } from "@/shared/components/logo-header";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

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
