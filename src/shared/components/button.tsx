import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold cursor-pointer transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        brand: "bg-brand-400 text-background shadow-sm lg:hover:bg-brand-200",
        white:
          "bg-white text-black shadow-sm lg:hover:bg-white/90 focus-visible:outline-white",
        black:
          "bg-neutral-950 text-white shadow-sm lg:hover:bg-neutral-950/90 focus-visible:outline-neutral-950",
        secondary:
          "bg-neutral-800 text-brand-400 shadow-sm lg:hover:bg-neutral-800/90 focus-visible:outline-neutral-800",
        destructive:
          "bg-neutral-800 text-red-500 shadow-sm lg:hover:bg-neutral-700/50 focus-visible:outline-neutral-800",
        success:
          "bg-neutral-800 text-green-500 shadow-sm lg:hover:bg-neutral-700/50 focus-visible:outline-neutral-800",
        grayed:
          "bg-neutral-600 text-foreground shadow-sm lg:hover:bg-neutral-600/90 focus-visible:outline-neutral-600",
        outline:
          "border border-brand-500 bg-inherit text-brand-400 shadow-xs lg:hover:bg-brand-400/10 lg:hover:border-brand-400",
        ghost:
          "border-none bg-inherit text-neutral-200 lg:hover:text-neutral-100 focus-visible:outline-hidden focus-visible:outline-0 focus-visible:outline-offset-0",
      },
      size: {
        default: "h-10 px-8 py-2",
        xs: "h-7 rounded-md px-3 text-xs",
        sm: "h-8 rounded-lg px-4 text-[13px]",
        lg: "h-12 rounded-xl px-12",
        xl: "h-14 rounded-2xl px-12 text-base",
        icon: "h-9 w-9",
        smIcon: "h-7 w-7 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
