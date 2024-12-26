// External Imports
import * as React from "react";
import { useFormField } from "./form";

// Local Imports
import { cn } from "../lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { error } = useFormField();

    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-2xl border border-neutral-800 bg-neutral-800/50 px-5 py-1 text-sm text-neutral-300 shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-600 hover:border-neutral-700/70 focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-400/20 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
          !!error &&
            "border-red-800 focus-visible:border-red-500 focus-visible:ring-red-500/20",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
