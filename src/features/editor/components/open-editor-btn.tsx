"use client";

// External Imports
import { motion } from "motion/react";

// Local Imports
import { Button } from "@/shared/components/button";
import { Container } from "@/shared/components/container";
import { drawerStore } from "@/shared/store";
import { useStore } from "@tanstack/react-store";

const MotionButton = motion.create(Button);

export const OpenEditorBtn = () => {
  const drawer = useStore(drawerStore);

  return (
    <Container className="sticky bottom-0 z-20 max-w-2xl py-3 md:py-4">
      <MotionButton
        animate={{
          translateY: drawer.drawerName ? "200%" : "0",
          scale: drawer.drawerName ? 0.95 : 1,
        }}
        onClick={() => {
          drawerStore.setState(() => ({
            drawerName: "new-tot",
            editable: true,
          }));
        }}
        className="w-full rounded-full text-base"
        size={"lg"}
      >
        Create Tot
      </MotionButton>
    </Container>
  );
};
