// External Imports
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import { ReactNode } from "react";

// Local Imports
import { getUsernames } from "@/shared/actions/get-usernames";
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

  const queryClient = new QueryClient();

  const { data: usernames } = await getUsernames();

  queryClient.setQueryData(["usernames"], { data: usernames });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="flex flex-col h-dvh">
        <LogoHeader />
        {children}
      </Container>
    </HydrationBoundary>
  );
};

export default OnboardingLayout;
