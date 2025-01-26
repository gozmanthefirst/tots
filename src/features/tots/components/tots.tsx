"use client";

// External Imports
import { Tot } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Local Imports
import { SingleTot } from "@/features/tots/components/single-tot";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { getTots } from "../actions/get-tots";

export const Tots = () => {
  const [activeTot, setActiveTot] = useState<Tot | null>(null);

  // Fetch Tots
  const { data: { data: tots } = {} } = useQuery({
    queryKey: ["tots"],
    queryFn: () => runParallelAction(getTots()),
  });

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col gap-6">
      {tots
        ?.map((tot) => (
          <SingleTot
            key={tot.id}
            tot={tot}
            activeTot={activeTot}
            setActiveTot={setActiveTot}
          />
        ))}
    </div>
  );
};
