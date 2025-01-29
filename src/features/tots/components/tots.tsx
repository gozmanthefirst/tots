"use client";

// External Imports
import { Tot } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, SetStateAction, useState } from "react";

// Local Imports
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { TbCopy, TbEdit, TbTrash, TbX } from "react-icons/tb";
import { getTots } from "../actions/get-tots";

export const Tots = () => {
  const [activeTot, setActiveTot] = useState<Tot | null>(null);
  const ref = useClickAway<HTMLDivElement>(() => {
    setActiveTot(null);
  });

  // Fetch Tots
  const { data: { data: tots } = {} } = useQuery({
    queryKey: ["tots"],
    queryFn: () => runParallelAction(getTots()),
  });

  return (
    <>
      {/* Tots */}
      <ul className="relative mx-auto flex h-full max-w-2xl flex-col gap-6">
        {tots?.map((tot) => (
          <SingleTot
            key={tot.id}
            tot={tot}
            activeTot={activeTot}
            setActiveTot={setActiveTot}
          />
        ))}
      </ul>

      {/* Active Tot */}
      <AnimatePresence>
        {activeTot ? (
          <>
            {/* Modal */}
            <motion.div
              initial={{
                opacity: 0,
                backdropFilter: "blur(0px)",
              }}
              animate={{
                opacity: 1,
                backdropFilter: "blur(4px)",
              }}
              exit={{
                opacity: 0,
                backdropFilter: "blur(0px)",
              }}
              transition={{
                type: "spring",
                duration: 0.4,
                bounce: 0.4,
              }}
              className="fixed inset-0 z-100 bg-black/50"
            />

            {/* Active Tot Content */}
            <motion.div
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 50,
              }}
              transition={{
                type: "spring",
                duration: 0.4,
                bounce: 0.3,
              }}
              className="fixed right-0 bottom-0 left-0 z-100 px-4"
            >
              <div className="mx-auto my-3 flex h-full max-w-2xl flex-col gap-2.5 md:my-4">
                {/* Options */}
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    y: 20,
                  }}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    bounce: 0.3,
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <div
                    ref={ref}
                    className="relative z-5 flex gap-3 self-end rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-neutral-400"
                  >
                    <TbX
                      size={20}
                      strokeWidth={3}
                      className="cursor-pointer transition duration-200 lg:hover:text-neutral-200"
                    />
                  </div>
                  <div
                    ref={ref}
                    className="relative z-5 flex gap-3 self-end rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-neutral-400"
                  >
                    <TbCopy
                      size={20}
                      className="cursor-pointer transition duration-200 lg:hover:text-neutral-200"
                    />
                    <TbEdit
                      size={20}
                      className="cursor-pointer transition duration-200 lg:hover:text-neutral-200"
                    />
                    <TbTrash
                      size={20}
                      className="cursor-pointer transition duration-200 lg:hover:text-neutral-200"
                    />
                  </div>
                </motion.div>

                {/* Content */}
                <div
                  ref={ref}
                  // onClick={(e) => e.preventDefault()}
                  className="relative z-10 cursor-default rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-300 shadow-sm transition duration-200 md:rounded-3xl md:p-5 lg:hover:border-neutral-700/70 lg:hover:shadow-lg"
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: activeTot.content }}
                  />
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

interface Props {
  tot: Tot;
  activeTot: Tot | null;
  setActiveTot: Dispatch<SetStateAction<Tot | null>>;
}

const SingleTot = ({ tot, activeTot, setActiveTot }: Props) => {
  return (
    <div
      onClick={() => setActiveTot(activeTot ? null : tot)}
      className="relative z-10 cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-300 shadow-sm transition duration-200 md:rounded-3xl md:p-5 lg:hover:border-neutral-700/70 lg:hover:shadow-lg"
    >
      <div dangerouslySetInnerHTML={{ __html: tot.content }} />
    </div>
  );
};
