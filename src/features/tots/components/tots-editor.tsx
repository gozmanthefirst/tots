"use client";

import { BaseSyntheticEvent, useEffect } from "react";
import { useStore } from "@tanstack/react-store";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { AnimatePresence, motion } from "motion/react";
import {
  TbArrowBackUp,
  TbArrowForwardUp,
  TbArrowUp,
  TbBold,
  TbCircleCheck,
  TbDeviceFloppy,
  TbEdit,
  TbExclamationCircle,
  TbH1,
  TbH2,
  TbItalic,
  TbList,
  TbListNumbers,
  TbSquareCheck,
  TbStrikethrough,
  TbUnderline,
} from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";

import { DelTotBtn } from "@/features/tots/components/del-tot-btn";
import { Button } from "@/shared/components/button";
import { Separator } from "@/shared/components/separator";
import {
  delTotBtnStateStore,
  drawerStore,
  submitTotBtnStateStore,
} from "@/shared/store";

interface Props {
  onChange: (tots: string) => void;
  tots: string;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export const TotsEditor = ({ onChange, tots, onSubmit }: Props) => {
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
      TaskList.configure({}),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "text-sm md:text-[15px]/[22px]",
        },
      }),
    ],
    content: tots,
    immediatelyRender: true,
    editable: drawer.editable,
    autofocus: drawer.editable ? "end" : false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
          event.preventDefault();
          onSubmit();
          return true;
        }
        return false;
      },
      attributes: {
        class:
          "relative field-sizing-content max-h-[70dvh] min-h-[15dvh] w-full overflow-auto border-none py-4 focus-visible:ring-0 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 lg:pt-6 lg:pb-4",
      },
    },
  });

  // Sync editor content with tots
  useEffect(() => {
    if (editor && tots !== editor.getHTML()) {
      editor.commands.setContent(tots);
      if (drawer.editable) {
        editor.commands.focus("end");
      }
    }
  }, [tots, editor, drawer.editable]);

  // Focus the editor at the end when `editable` is true
  useEffect(() => {
    if (editor) {
      editor.setEditable(drawer.editable);
      if (drawer.editable) {
        editor.commands.focus("end");
      }
    }
  }, [drawer.editable, editor]);

  // Keyboard shortcut that makes the editor editable, if it already isn't Ctrl+E or Cmd+E (Mac)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "e") {
        event.preventDefault();
        if (!drawer.editable) {
          drawerStore.setState(() => ({
            drawerName: drawer.drawerName,
            editable: true,
            tot: drawer.tot,
          }));
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawer]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <EditorContent editor={editor} />
      {drawer.editable ? (
        <EditorControls editor={editor} />
      ) : (
        <NonEditorControls editor={editor} />
      )}
    </div>
  );
};

const buttonCopy = {
  idle: <TbArrowUp size={20} strokeWidth={2} />,
  loading: <RotatingLines visible width="18" strokeColor="#000000" />,
  success: <TbCircleCheck size={20} strokeWidth={2} />,
  error: <TbExclamationCircle size={20} strokeWidth={2} />,
};

//* Editor Controls
const EditorControls = ({ editor }: { editor: Editor | null }) => {
  const drawer = useStore(drawerStore);
  const submitButtonState = useStore(submitTotBtnStateStore);
  const delButtonState = useStore(delTotBtnStateStore);

  const variants = {
    initial: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 py-3">
      {/* Formatting Options */}
      <div className="remove-system-scrollbar flex w-[calc(100%_-_48px)] items-center gap-2 overflow-auto">
        {/* Undo/Redo */}
        <div className="flex items-center justify-center gap-1">
          <Button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            variant="ghost"
            size="smIcon"
            disabled={
              !editor.can().undo() ||
              delButtonState !== "idle" ||
              submitButtonState !== "idle"
            }
          >
            <TbArrowBackUp size={18} />
          </Button>

          <Button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            variant="ghost"
            size="smIcon"
            disabled={
              !editor.can().redo() ||
              delButtonState !== "idle" ||
              submitButtonState !== "idle"
            }
          >
            <TbArrowForwardUp size={18} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-4" />

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
            variant={
              editor.isActive("heading", { level: 1 }) ? "white" : "ghost"
            }
            size={"smIcon"}
            disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
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
            variant={
              editor.isActive("heading", { level: 2 }) ? "white" : "ghost"
            }
            size={"smIcon"}
            disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
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
            disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
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
            disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
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
            disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
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
            disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
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
            disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
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
            disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
          >
            <TbListNumbers size={18} />
          </Button>

          {/* Task List */}
          <Button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleTaskList().run();
            }}
            variant={editor.isActive("taskList") ? "white" : "ghost"}
            size={"smIcon"}
            disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
          >
            <TbSquareCheck size={18} />
          </Button>
        </div>
      </div>

      <Button
        size="icon"
        form="tot-editor"
        variant={
          delButtonState === "idle"
            ? "white"
            : delButtonState === "error"
              ? "destructive"
              : "brand"
        }
        disabled={!editor.getText().length}
        className="relative ml-auto flex-none cursor-pointer overflow-hidden rounded-full bg-neutral-300 lg:hover:bg-brand-400"
        aria-label={drawer.tot ? "Edit Content" : "Submit Content"}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={submitButtonState}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            initial="initial"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            {drawer.tot && submitButtonState === "idle" ? (
              <TbDeviceFloppy size={20} strokeWidth={2} />
            ) : (
              buttonCopy[submitButtonState]
            )}
          </motion.div>
        </AnimatePresence>
      </Button>
    </div>
  );
};

//* Non-Editor Controls
const NonEditorControls = ({ editor }: { editor: Editor | null }) => {
  const drawer = useStore(drawerStore);
  const delButtonState = useStore(delTotBtnStateStore);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-2 py-3">
        <DelTotBtn />
      </div>

      <div className="flex items-center gap-2 py-3">
        <Button
          size="icon"
          onClick={() =>
            drawerStore.setState(() => ({
              drawerName: drawer.drawerName,
              editable: true,
              tot: drawer.tot,
            }))
          }
          type="button"
          variant="white"
          disabled={delButtonState !== "idle"}
          className="ml-auto cursor-pointer rounded-full bg-neutral-300 lg:hover:bg-brand-400"
        >
          <TbEdit size={20} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
};
