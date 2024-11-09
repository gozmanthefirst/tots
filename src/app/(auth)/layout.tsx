// External Imports
import { ReactNode } from "react";

// Local Imports
import { Container } from "@/shared/components/container";
import { LogoHeader } from "@/shared/components/logo-header";

interface Props {
  children: ReactNode;
}

const AuthLayout = async ({ children }: Props) => {
  return (
    <Container className="flex flex-col h-dvh">
      <LogoHeader />
      {children}
    </Container>
  );
};

export default AuthLayout;
