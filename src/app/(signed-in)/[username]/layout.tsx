// External Imports
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import { ReactNode } from "react";

// Local Imports
import { TotsHeader } from "@/features/tots/components/tots-header";
import { Container } from "@/shared/components/container";
import { auth } from "@/shared/lib/auth/auth";
import { redirect } from "next/navigation";

interface Props {
  children: ReactNode;
  params: {
    username: string;
  };
}

const TotsLayout = async ({ children, params: { username } }: Props) => {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (session?.user) {
    if (!session?.user.username) {
      redirect(`/onboarding`);
    }
  } else {
    redirect(`/sign-in`);
  }

  const queryClient = new QueryClient();

  queryClient.setQueryData(["user"], { data: session?.user });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="flex flex-col h-dvh">
        <TotsHeader />
        {children}
      </Container>
    </HydrationBoundary>
  );
};

export default TotsLayout;
