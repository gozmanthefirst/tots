"use client";

// External Imports
import { useQueryState } from "nuqs";

// Local Imports
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/components/drawer";
import { cn } from "@/shared/lib/utils/cn";
import { mainPageComponentStore } from "@/shared/store";
import { instrumentSerif } from "@/styles/fonts";

export const EditorDrawer = () => {
  const [drawer, setDrawer] = useQueryState("drawer");

  return (
    <Drawer
      open={drawer === "editor"}
      onOpenChange={() => {
        setDrawer(drawer === "editor" ? null : "editor");
      }}
      container={mainPageComponentStore.state}
    >
      <DrawerContent>
        <DrawerTitle
          className={cn(
            "flex items-center justify-center py-6 text-center text-3xl md:py-8 md:text-4xl",
            instrumentSerif.className,
          )}
      >
          Tot Editor
        </DrawerTitle>

        <div className="py-20"></div>
      </DrawerContent>
    </Drawer>
  );
};
