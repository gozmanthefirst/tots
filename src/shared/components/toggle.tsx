"use client";

// External Imports
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// Local Imports
import { cn } from "../lib/utils/cn";

const toggleVariants = cva(
  "inline-flex items-center justify-center cursor-pointer rounded-lg text-sm font-medium ring-offset-red-500 transition-colors hover:bg-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-neutral-300 data-[state=on]:text-neutral-900 [&_svg]:pointer-events-none [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-7 min-w-7",
        lg: "h-11 px-5 min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
