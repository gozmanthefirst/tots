"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Tot } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TbEdit, TbTrash, TbX } from "react-icons/tb";
import { z } from "zod";

// Local Imports
import { TotsEditor } from "@/features/editor/components/tots-editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/shared/components/form";
import { HtmlRenderer } from "@/shared/components/html-renderer";
import { useDisableScroll } from "@/shared/hooks/use-disable-scroll";
import { copyToClipboard } from "@/shared/lib/utils/copy-paste-text";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { getTots } from "../actions/get-tots";

export const Tots = () => {
  const [activeTot, setActiveTot] = useState<Tot | null>(null);
  const [totCopied, setTotCopied] = useState(false);
  const [editTot, setEditTot] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);

  useDisableScroll(activeTot !== null);

  // Fetch Tots
  const { data: { data: tots } = {} } = useQuery({
    queryKey: ["tots"],
    queryFn: () => runParallelAction(getTots()),
  });

  const copyTot = () => {
    if (textRef.current) {
      if (!totCopied) {
        const tot = textRef.current.textContent || "";
        copyToClipboard(tot);

        setTotCopied(true);

        setTimeout(() => {
          setTotCopied(false);
        }, 1000);
      }
    }
  };

  const closeActiveTot = () => {
    setActiveTot(null);
    setEditTot(false);
  };

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
            setEditTot={setEditTot}
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
              onClick={closeActiveTot}
              className="fixed inset-0 z-100 bg-black/50"
            />

            {/* Active Tot Content */}
            {!editTot ? (
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
                layoutId="tot-content-or-form"
                onClick={closeActiveTot}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        closeActiveTot();
                      }}
                      className="relative z-5 flex cursor-pointer gap-3 self-end rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-neutral-400 lg:hover:text-neutral-200"
                    >
                      <TbX
                        size={20}
                        strokeWidth={3}
                        className="transition duration-200"
                      />
                    </div>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-5 flex gap-3 self-end rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-neutral-400"
                    >
                      <TbEdit
                        size={20}
                        onClick={() => setEditTot(true)}
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
                    onClick={(e) => e.stopPropagation()}
                    className="relative z-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-300 shadow-sm transition duration-200 md:rounded-3xl md:p-5 lg:hover:border-neutral-700/70 lg:hover:shadow-lg"
                  >
                    <HtmlRenderer html={activeTot.content} ref={textRef} />
                  </div>
                </div>
              </motion.div>
            ) : null}

            {/* Edit Tot Form */}
            {editTot ? <EditTotForm totHtml={activeTot.content} /> : null}
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

const SingleTot = ({
  tot,
  activeTot,
  setActiveTot,
  setEditTot,
}: {
  tot: Tot;
  activeTot: Tot | null;
  setActiveTot: Dispatch<SetStateAction<Tot | null>>;
  setEditTot: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      onClick={() => {
        setActiveTot(activeTot ? null : tot);
        setEditTot(false);
      }}
      className="relative z-10 cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-300 shadow-sm transition duration-200 select-none md:rounded-3xl md:p-5 lg:hover:border-neutral-700/70 lg:hover:shadow-lg"
    >
      <HtmlRenderer html={tot.content} />
    </div>
  );
};

const editorSchema = z.object({
  tot: z
    .string()
    .min(1, { message: "C'mon now, surely your Tot can't be blank." }),
});
type EditorFormType = z.infer<typeof editorSchema>;

const EditTotForm = ({ totHtml }: { totHtml: string }) => {
  const form = useForm<EditorFormType>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      tot: totHtml,
    },
  });

  const onSubmit = async (values: EditorFormType) => {
    console.log(values.tot); //! TBR
  };

  return (
    <motion.div
      layoutId="tot-content-or-form"
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
      <div className="mx-auto my-3 h-full max-w-2xl md:my-4">
        <Form {...form}>
          <form
            id="tot-editor"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="tot"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TotsEditor tots={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </motion.div>
  );
};
