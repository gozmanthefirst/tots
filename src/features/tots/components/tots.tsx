"use client";
// External Imports
import { useQuery } from "@tanstack/react-query";

// Local Imports
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
      {tots?.map((tot) => (
        <div
          key={tot.id}
          className="relative rounded-2xl border border-neutral-800 bg-neutral-800/50 p-4 text-neutral-300 shadow-sm md:rounded-3xl md:p-5"
        >
          <div dangerouslySetInnerHTML={{ __html: tot.content }} />
        </div>
      ))}
    </div>
  );
};
