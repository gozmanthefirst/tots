"use client";

import { useEffect, useRef, useState } from "react";
import { Tot } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { HtmlRenderer } from "@/shared/components/html-renderer";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { drawerStore } from "@/shared/store";
import { getTots } from "../actions/get-tots";

export const Tots = () => {
  // Fetch Tots
  const { data: { data: tots } = {} } = useQuery({
    queryKey: ["tots"],
    queryFn: () => runParallelAction(getTots()),
  });

  return (
    <ul className="relative mx-auto flex h-full max-w-2xl flex-col gap-4">
      {tots?.map((tot) => <SingleTot key={tot.id} tot={tot} />)}
    </ul>
  );
};

const SingleTot = ({ tot }: { tot: Tot }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkOverflow = () => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      setIsOverflowing(scrollHeight > clientHeight);
    }
  };

  // Check overflow on mount and window resize
  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  // Check overflow when tot content changes
  useEffect(() => {
    checkOverflow();
  }, [tot.content]);

  return (
    <div
      ref={containerRef}
      onClick={() => {
        drawerStore.setState(() => ({
          drawerName: tot.id,
          editable: false,
          tot,
        }));
      }}
      className="relative z-10 max-h-[50dvh] cursor-pointer overflow-hidden border border-neutral-800 bg-neutral-900/80 p-4 text-neutral-300 shadow-sm transition duration-200 select-none md:p-5 lg:hover:border-neutral-700/70 lg:hover:bg-neutral-900 lg:hover:shadow-lg"
    >
      <HtmlRenderer html={tot.content} />

      {isOverflowing && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[15dvh] bg-linear-to-b from-neutral-950/0 via-neutral-950/30 to-neutral-950/90" />
      )}
    </div>
  );
};
