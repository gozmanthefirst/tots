// External Imports
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import { ReactNode } from "react";

// Local Imports
import { TotsEditorForm } from "@/features/editor/components/tots-editor-form";
import { TotsHeader } from "@/features/tots/components/tots-header";
import { Container } from "@/shared/components/container";
import { auth } from "@/shared/lib/auth/auth";
import { redirect } from "next/navigation";

type Params = Promise<{ username: string }>;

interface Props {
  children: ReactNode;
  params: Params;
}

const TotsLayout = async ({ children, params }: Props) => {
  const { username } = await params;

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
      <Container className="relative flex min-h-dvh flex-col justify-between">
        <TotsHeader />
        {children}
        <TotsEditorForm />
      </Container>
    </HydrationBoundary>
  );
};

export default TotsLayout;
