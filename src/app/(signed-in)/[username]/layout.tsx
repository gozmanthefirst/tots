import { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getTots } from "@/features/tots/actions/get-tots";
import { OpenEditorBtn } from "@/features/tots/components/open-editor-btn";
import { TotsHeader } from "@/features/tots/components/tots-header";
import { DrawerProvider } from "@/providers/drawer-provider";
import { getUser } from "@/shared/actions/get-user";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

interface Props {
  children: ReactNode;
}

const TotsLayout = async ({ children }: Props) => {
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
