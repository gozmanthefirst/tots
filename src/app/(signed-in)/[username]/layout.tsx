// External Imports
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// Local Imports
import { TotsEditorForm } from "@/features/editor/components/tots-editor-form";
import { TotsHeader } from "@/features/tots/components/tots-header";
import { getUser } from "@/shared/actions/get-user";
import { Container } from "@/shared/components/container";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

type Params = Promise<{ username: string }>;

interface Props {
  children: ReactNode;
  params: Params;
}

const TotsLayout = async ({ children, params }: Props) => {
  const { username } = await params;

  const [{ data: user }] = await Promise.all([runParallelAction(getUser())]);

  if (user) {
    if (!user.username) {
      redirect(`/onboarding`);
    }
  } else {
    redirect(`/sign-in`);
  }

  const queryClient = new QueryClient();

  queryClient.setQueryData(["user"], { data: user });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="relative flex min-h-dvh flex-col justify-between">
        <TotsHeader />
        {children}
        <TotsEditorForm />
      </Container>
    </HydrationBoundary>
  );
};

export default TotsLayout;
