"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TbPinned } from "react-icons/tb";

import { HtmlRenderer } from "@/shared/components/html-renderer";
import { Tot } from "@/shared/lib/db/prisma";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { drawerStore } from "@/shared/store";
import { getTots } from "../api/get-tots";
import { formatTotsByDate } from "../utils/format-tots";

export const Tots = () => {
  const { data: { data: tots } = {} } = useQuery({
    queryKey: ["tots"],
    queryFn: () => runParallelAction(getTots()),
  });

  const { pinnedTots, regularTots } = useMemo(() => {
    const pinned: Tot[] = [];
    const regular: Tot[] = [];

    // Separate pinned and regular tots, limit pinned to 3
    (tots ?? []).forEach((tot) => {
      if (tot.pinned) {
        pinned.push(tot);
      } else {
        regular.push(tot);
      }
    });
    return { pinnedTots: pinned, regularTots: regular };
  }, [tots]);

  const formattedRegularTots = regularTots ? formatTotsByDate(regularTots) : [];
  const hasPinnedTots = pinnedTots.length > 0;

  return (
    <ul className="relative mx-auto flex h-full max-w-2xl flex-col gap-8">
      {/* Pinned Tots */}
      {hasPinnedTots && <PinnedTots pinnedTots={pinnedTots} />}

      {/* Regular Tots */}
      {formattedRegularTots.map(({ date, tots }) => (
        <li key={date} className="relative flex flex-col gap-2">
          <h2 className="flex items-center gap-3 text-sm font-medium text-neutral-500 xl:absolute xl:right-full xl:mr-6 xl:text-nowrap">
            <span>{date}</span>{" "}
            <span className="font-bold text-brand-400">{tots.length}</span>
          </h2>

          <div className="flex flex-col gap-4">
            {tots.map((tot) => (
              <SingleTot key={tot.id} tot={tot} />
            ))}
          </div>
        </li>
      ))}
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
          editable: !isOverflowing,
          tot,
        }));
      }}
      className={cn(
        "relative z-10 max-h-[50lvh] cursor-pointer overflow-hidden border border-neutral-800 bg-neutral-900/80 p-4 text-neutral-300 shadow-sm transition duration-200 select-none md:p-5 lg:hover:border-neutral-700/70 lg:hover:bg-neutral-900 lg:hover:shadow-lg",
        tot.pinned &&
          "max-h-[15lvh] border-brand-400/40 bg-brand-400/5 lg:hover:border-brand-400/50 lg:hover:bg-brand-400/8",
      )}
    >
      <HtmlRenderer html={tot.content} />

      {isOverflowing && (
        <div
          className={cn(
            "pointer-events-none absolute right-0 bottom-0 left-0 h-[15lvh] bg-linear-to-b from-neutral-950/0 via-neutral-950/30 to-neutral-950/90",
            tot.pinned && "h-[10lvh]",
          )}
        />
      )}
    </div>
  );
};

const PinnedTots = ({ pinnedTots }: { pinnedTots: Tot[] }) => {
  return (
    <li className="relative flex flex-col gap-2">
      <h2 className="flex items-center gap-3 text-sm font-medium text-neutral-500 xl:absolute xl:right-full xl:mr-6 xl:text-nowrap">
        <span>Pinned</span>{" "}
        <span className="font-bold text-brand-400">
          <TbPinned size={18} />
        </span>
      </h2>

      <div className="flex flex-col gap-4">
        {pinnedTots.map((tot) => (
          <SingleTot key={tot.id} tot={tot} />
        ))}
      </div>
    </li>
  );
};
