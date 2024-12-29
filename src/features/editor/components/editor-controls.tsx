"use client";

// External Imports
import { type Editor } from "@tiptap/react";
import {
  TbBold,
  TbCircleArrowUpFilled,
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

interface Props {
  editor: Editor | null;
}

export const EditorControls = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-b-2xl py-1.5 pr-1 pl-4 md:rounded-b-3xl md:py-1.5 md:pr-1 md:pl-5">
      {/* Headings */}
      <div className="flex items-center justify-center gap-1">
        {/* H1 */}
        <Button
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
        {/* Unordered List */}
        <Button
          onClick={() => {
            if (editor.isActive("orderedList")) {
              editor.chain().focus().toggleOrderedList().run();
            }

            editor.chain().focus().toggleBulletList().run();
          }}
          variant={editor.isActive("heading", { level: 1 }) ? "white" : "ghost"}
          size={"smIcon"}
        >
          <TbList size={18} />
        </Button>

        {/* Ordered List */}
        <Button
          onClick={() => {
            if (editor.isActive("bulletList")) {
              editor.chain().focus().toggleBulletList().run();
            }

            editor.chain().focus().toggleOrderedList().run();
          }}
          variant={editor.isActive("heading", { level: 2 }) ? "white" : "ghost"}
          size={"smIcon"}
        >
          <TbListNumbers size={18} />
        </Button>
      </div>

      {/* <ToggleGroup type="single">
        <ToggleGroupItem value="list" aria-label="Toggle Bullet List" size="sm">
          <TbList size={18} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="list-numbers"
          aria-label="Toggle Numbered List"
          size="sm"
        >
          <TbListNumbers size={18} />
        </ToggleGroupItem>
      </ToggleGroup> */}

      <Button
        size="icon"
        form="tots-editor"
        variant="ghost"
        className="ml-auto h-auto w-auto rounded-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-400"
        aria-label="Submit Content"
      >
        <TbCircleArrowUpFilled
          size={34}
          className="cursor-pointer fill-neutral-300 transition-colors hover:fill-brand-400"
        />
      </Button>
    </div>
  );
};
