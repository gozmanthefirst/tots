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
  TbUnderline,
} from "react-icons/tb";

// Local Imports
import { Button } from "@/shared/components/button";
import { Separator } from "@/shared/components/separator";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/toggle-group";

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
      <ToggleGroup
        type="single"
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
              ? "h2"
              : undefined
        }
        onValueChange={(value) => {
          if (value) {
            const level = value === "h1" ? 1 : 2;
            editor.chain().focus().toggleHeading({ level }).run();
          }
        }}
      >
        <ToggleGroupItem value="h1" aria-label="Toggle H1" size="sm">
          <TbH1 size={18} />
        </ToggleGroupItem>
        <ToggleGroupItem value="h2" aria-label="Toggle H2" size="sm">
          <TbH2 size={18} />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="h-4" />

      {/* Formatting */}
      <ToggleGroup
        type="multiple"
        value={[
          editor.isActive("bold") ? "bold" : "",
          editor.isActive("italic") ? "italic" : "",
          editor.isActive("underline") ? "underline" : "",
        ].filter(Boolean)}
        onValueChange={(value) => {
          if (value.includes("bold") !== editor.isActive("bold")) {
            editor.chain().focus().toggleBold().run();
          }
          if (value.includes("italic") !== editor.isActive("italic")) {
            editor.chain().focus().toggleItalic().run();
          }
          if (value.includes("underline") !== editor.isActive("underline")) {
            editor.chain().focus().toggleUnderline().run();
          }
        }}
      >
        <ToggleGroupItem value="bold" aria-label="Toggle Bold" size="sm">
          <TbBold size={18} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle Italic" size="sm">
          <TbItalic size={18} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          aria-label="Toggle Underline"
          size="sm"
        >
          <TbUnderline size={18} />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="h-4" />

      {/* Lists */}
      <ToggleGroup type="single">
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
      </ToggleGroup>

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
