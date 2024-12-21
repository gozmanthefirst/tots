"use client";

// External Imports
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { FieldError } from "react-hook-form";

// Local Imports
import { useFormField } from "@/shared/components/form";

interface Props {
  onChange: (tots: string) => void;
  tots: string;
}

export const TotsEditor = ({ onChange, tots }: Props) => {
  const { error } = useFormField();

  const getEditorStyling = (error: FieldError | undefined) => {
    if (error) {
      return "border-red-800 focus-visible:border-red-500 focus-visible:ring-red-500/20";
    }

    return "relative overflow-auto min-h-[120px] max-h-[250px] field-sizing-content w-full rounded-2xl md:rounded-3xl border border-neutral-800 bg-neutral-800/50 text-neutral-300 p-4 text-sm shadow-sm transition-colors placeholder:text-neutral-600 hover:border-neutral-700/70 focus-visible:border-brand-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-400/20 disabled:cursor-not/-allowed disabled:opacity-50 dark:focus-visible:border-brand-400 dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-600 dark:focus-visible:ring-brand/20-400 md:p-5 md:min-h-[150px] md:max-h-[300px]";
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: tots,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: getEditorStyling(error),
      },
    },
  });

  // Update editor attributes when error changes
  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: getEditorStyling(error),
          },
        },
      });
    }
  }, [error, editor]);

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};
