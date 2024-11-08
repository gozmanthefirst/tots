// External Imports
import { ReactNode } from "react";

// Local Imports
import { AuthHeader } from "@/features/auth/components/auth-header";
import { Container } from "@/shared/components/container";

interface Props {
  children: ReactNode;
}

const AuthLayout = async ({ children }: Props) => {
  return (
    <Container className="flex flex-col h-dvh">
      <AuthHeader />
      {children}
    </Container>
  );
};

export default AuthLayout;
