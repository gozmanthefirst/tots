// External Imports
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// Local Imports
import { OpenEditorBtn } from "@/features/editor/components/open-editor-btn";
import { getTots } from "@/features/tots/actions/get-tots";
import { TotsHeader } from "@/features/tots/components/tots-header";
import { DrawerProvider } from "@/providers/drawer-provider";
import { getUser } from "@/shared/actions/get-user";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

type Params = Promise<{ username: string }>;

interface Props {
  children: ReactNode;
  params: Params;
}

const TotsLayout = async ({ children, params }: Props) => {
  const { username } = await params;

  const [{ data: user }, { data: tots }] = await Promise.all([
    runParallelAction(getUser()),
    runParallelAction(getTots()),
  ]);

  if (user) {
    if (!user.username) {
      redirect(`/onboarding`);
    }
  } else {
    redirect(`/sign-in`);
  }

  const queryClient = new QueryClient();

  queryClient.setQueryData(["user"], { data: user });
  queryClient.setQueryData(["tots"], { data: tots });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col min-h-dvh">
        <TotsHeader />
        <main className="flex-1">{children}</main>
        <OpenEditorBtn />
      </div>
      <DrawerProvider />
    </HydrationBoundary>
  );
};

export default TotsLayout;
