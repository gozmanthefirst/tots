// External Imports
import { forwardRef, HTMLAttributes } from "react";

// Local Imports
import { cn } from "../lib/utils/cn";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("container max-w-6xl", className)}
        {...props}
      />
    );
  },
);
Container.displayName = "Container";
