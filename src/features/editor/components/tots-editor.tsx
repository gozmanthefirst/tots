"use client";

// External Imports
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "motion/react";

// Local Imports
import { EditorControls } from "@/features/editor/components/editor-controls";
import { useFormField } from "@/shared/components/form";
import { cn } from "@/shared/lib/utils/cn";

interface Props {
  onChange: (tots: string) => void;
  tots: string;
}

export const TotsEditor = ({ onChange, tots }: Props) => {
  const { error } = useFormField();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
          HTMLAttributes: {
            class: "rte",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "text-sm pb-2 md:text-[15px]/[22px]",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc px-6 py-0.5",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal tabular-nums px-6 py-0.5",
          },
        },
      }),
      Underline,
    ],
    content: tots,
    immediatelyRender: false,
    autofocus: "end",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "relative field-sizing-content max-h-[250px] min-h-[100px] w-full overflow-auto rounded-2xl border-none p-4 focus-visible:ring-0 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:max-h-[300px] md:min-h-[150px] md:rounded-3xl md:p-5",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-background rounded-2xl md:rounded-3xl">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          filter: "blur(4px)",
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
        }}
        transition={{
          type: "spring",
          bounce: 0.4,
          duration: 0.5,
        }}
        className={cn(
          "relative rounded-2xl border border-neutral-800 bg-neutral-800/50 text-neutral-300 shadow-sm transition-colors placeholder:text-neutral-500 hover:border-neutral-700/70 has-focus-visible:border-brand-400 has-focus-visible:ring-4 has-focus-visible:ring-brand-400/20 has-focus-visible:outline-hidden md:rounded-3xl",
          !!error &&
            "border-red-900 hover:border-red-800 has-focus-visible:border-red-500 has-focus-visible:ring-red-500/20",
        )}
      >
        <EditorContent editor={editor} />
        <EditorControls editor={editor} />
      </motion.div>
    </div>
  );
};
