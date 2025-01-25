"use client";

// External Imports
import { Tot } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface Props {
  tot: Tot;
  activeTot: Tot | null;
  setActiveTot: Dispatch<SetStateAction<Tot | null>>;
}

export const SingleTot = ({ tot, activeTot, setActiveTot }: Props) => {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Main Content */}
      <div
        onClick={() => setActiveTot(activeTot ? null : tot)}
        className="relative z-10 cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-800/50 p-4 text-neutral-300 shadow-sm transition duration-200 md:rounded-3xl md:p-5 lg:hover:border-neutral-700/70 lg:hover:shadow-lg"
      >
        <div dangerouslySetInnerHTML={{ __html: tot.content }} />
      </div>

      {/* Options */}
      {/* <AnimatePresence>
        {activeTot?.id === tot.id ? (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: -10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -10,
            }}
            transition={{
              type: "spring",
              duration: 2,
              bounce: 0.2,
            }}
            className="relative z-5 flex gap-3 self-end rounded-xl border border-neutral-800 bg-neutral-800/30 p-2.5 text-neutral-400"
          >
            <TbSquareRoundedX
              onClick={() => setActiveTot(null)}
              size={18}
              className="cursor-pointer transition duration-200 lg:hover:text-neutral-200"
            />
            <TbCopy
              size={18}
              className="cursor-pointer transition duration-200 lg:hover:text-neutral-200"
            />
            <TbEdit
              size={18}
              className="cursor-pointer transition duration-200 lg:hover:text-neutral-200"
            />
            <TbTrash
              size={18}
              className="cursor-pointer transition duration-200 lg:hover:text-neutral-200"
            />
          </motion.div>
        ) : null}
      </AnimatePresence> */}
    </div>
  );
};
