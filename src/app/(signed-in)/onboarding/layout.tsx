import { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getUser } from "@/shared/api/get-user";
import { getUsernames } from "@/shared/api/get-usernames";
import { Container } from "@/shared/components/container";
import { LogoHeader } from "@/shared/components/logo-header";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

interface Props {
  children: ReactNode;
}

const OnboardingLayout = async ({ children }: Props) => {
  const [{ data: user }, { data: usernames }] = await Promise.all([
    runParallelAction(getUser()),
    runParallelAction(getUsernames()),
  ]);

  if (user) {
    if (user.username) {
      redirect(`/${user.username}`);
    }
  } else {
    redirect(`/sign-in`);
  }

  const queryClient = new QueryClient();

  queryClient.setQueryData(["usernames"], { data: usernames });
  // queryClient.setQueryData(["usernames"], {
  //   status: "success",
  //   message: "",
  //   data: usernames,
  // });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="flex h-dvh flex-col">
        <LogoHeader />
        {children}
      </Container>
    </HydrationBoundary>
  );
};

export default OnboardingLayout;
