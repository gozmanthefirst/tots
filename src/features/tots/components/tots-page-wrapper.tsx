"use client";

// External Imports
import { HTMLAttributes, Ref, useEffect, useRef } from "react";

// Local Imports
import { Container } from "@/shared/components/container";
import { cn } from "@/shared/lib/utils/cn";
import { drawerContainerStore } from "@/shared/store";

interface Props extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export const TotsPageWrapper = ({ className, ref, ...props }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      drawerContainerStore.setState(() => containerRef.current);
    }
  }, []);

  return (
    <Container
      ref={containerRef || ref}
      className={cn("max-w-3xl px-0 py-4", className)}
      {...props}
    />
  );
};
