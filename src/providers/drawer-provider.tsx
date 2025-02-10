"use client";

// External Imports
import { useEffect, useState } from "react";

// Local Imports
import { EditorDrawer } from "@/features/editor/components/editor-drawer";

export const DrawerProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <EditorDrawer />
    </>
  );
};
