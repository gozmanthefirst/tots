"use client";

// External Imports
import { useQueryState } from "nuqs";

// Local Imports
import { Button } from "@/shared/components/button";
import { Container } from "@/shared/components/container";

export const OpenEditorBtn = () => {
  const [drawer, setDrawer] = useQueryState("drawer");

  return (
    <Container className="sticky bottom-0 z-20 max-w-2xl py-3 md:py-4">
      <Button
        onClick={() => {
          setDrawer("editor");
        }}
        className="w-full rounded-full text-base"
        size={"lg"}
      >
        Create Tot
      </Button>
    </Container>
  );
};
