"use client";

// External Imports
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import {
  TbArrowUp,
  TbBold,
  TbEdit,
  TbH1,
  TbH2,
  TbItalic,
  TbList,
  TbListNumbers,
  TbStrikethrough,
  TbUnderline,
} from "react-icons/tb";

// Local Imports
import { Button } from "@/shared/components/button";
import { Separator } from "@/shared/components/separator";
import { drawerStore } from "@/shared/store";
import { useStore } from "@tanstack/react-store";

interface Props {
  onChange: (tots: string) => void;
  tots: string;
}

export const TotsEditor = ({ onChange, tots }: Props) => {
  const drawer = useStore(drawerStore);

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
            class: "text-sm pb-1.5 md:text-[15px]/[22px]",
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
      Placeholder.configure({
        placeholder: "Write something...",
      }),
      Underline,
    ],
    content: tots,
    immediatelyRender: true,
    editable: drawer.editable,
    autofocus: drawer.editable ? "end" : false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "relative field-sizing-content max-h-[50dvh] min-h-[15dvh] w-full overflow-auto border-none py-5 focus-visible:ring-0 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:max-h-[60dvh] md:min-h-[15dvh] lg:pt-6 lg:pb-4",
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(drawer.editable);
      if (drawer.editable) {
        editor.commands.focus("end");
      }
    }
  }, [drawer.editable, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <EditorContent editor={editor} />
      {drawer.editable ? (
        <EditorControls editor={editor} tots={tots} />
      ) : (
        <NonEditorControls editor={editor} tots={tots} />
      )}
    </div>
  );
};

//* Controls
export const EditorControls = ({
  editor,
  tots,
}: {
  editor: Editor | null;
  tots: string;
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 py-3">
      {/* Headings */}
      <div className="flex items-center justify-center gap-1">
        {/* H1 */}
        <Button
          type="button"
          onClick={() => {
            if (editor.isActive("heading", { level: 2 })) {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }

            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          variant={editor.isActive("heading", { level: 1 }) ? "white" : "ghost"}
          size={"smIcon"}
        >
          <TbH1 size={18} />
        </Button>

        {/* H2 */}
        <Button
          type="button"
          onClick={() => {
            if (editor.isActive("heading", { level: 1 })) {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }

            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          variant={editor.isActive("heading", { level: 2 }) ? "white" : "ghost"}
          size={"smIcon"}
        >
          <TbH2 size={18} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-4" />

      {/* Formatting */}
      <div className="flex items-center justify-center gap-1">
        {/* Bold */}
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleBold().run();
          }}
          variant={editor.isActive("bold") ? "white" : "ghost"}
          size={"smIcon"}
        >
          <TbBold size={18} />
        </Button>

        {/* Italic */}
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
          }}
          variant={editor.isActive("italic") ? "white" : "ghost"}
          size={"smIcon"}
        >
          <TbItalic size={18} />
        </Button>

        {/* Underline */}
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleUnderline().run();
          }}
          variant={editor.isActive("underline") ? "white" : "ghost"}
          size={"smIcon"}
        >
          <TbUnderline size={18} />
        </Button>

        {/* Strikethrough */}
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleStrike().run();
          }}
          variant={editor.isActive("strike") ? "white" : "ghost"}
          size={"smIcon"}
        >
          <TbStrikethrough size={18} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-4" />

      {/* Lists */}
      <div className="flex items-center justify-center gap-1">
        {/* Bullet List */}
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleBulletList().run();
          }}
          variant={editor.isActive("bulletList") ? "white" : "ghost"}
          size={"smIcon"}
        >
          <TbList size={18} />
        </Button>

        {/* Ordered List */}
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleOrderedList().run();
          }}
          variant={editor.isActive("orderedList") ? "white" : "ghost"}
          size={"smIcon"}
        >
          <TbListNumbers size={18} />
        </Button>
      </div>

      <Button
        size="icon"
        form="tot-editor"
        variant="white"
        disabled={!editor.getText().length}
        className="ml-auto cursor-pointer rounded-full bg-neutral-300 lg:hover:bg-brand-400"
        aria-label="Submit Content"
      >
        <TbArrowUp size={20} strokeWidth={2.5} />
      </Button>
    </div>
  );
};

export const NonEditorControls = ({
  editor,
  tots,
}: {
  editor: Editor | null;
  tots: string;
}) => {
  const drawer = useStore(drawerStore);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 py-3">
      <Button
        size="icon"
        onClick={() =>
          drawerStore.setState(() => ({
            drawerName: drawer.drawerName,
            editable: true,
          }))
        }
        type="button"
        variant="white"
        className="ml-auto cursor-pointer rounded-full bg-neutral-300 lg:hover:bg-brand-400"
      >
        <TbEdit size={24} strokeWidth={2.5} />
      </Button>
    </div>
  );
};
