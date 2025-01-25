"use client";
// External Imports
import { useQuery } from "@tanstack/react-query";

// Local Imports
import { SingleTot } from "@/features/tots/components/single-tot";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { getTots } from "../actions/get-tots";

export const Tots = () => {
  // Fetch Tots
  const { data: { data: tots } = {} } = useQuery({
    queryKey: ["tots"],
    queryFn: () => runParallelAction(getTots()),
  });

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col gap-6">
      {tots?.map((tot) => <SingleTot key={tot.id} tot={tot} />)}
    </div>
  );
};
