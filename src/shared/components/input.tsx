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
          "flex h-14 w-full rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-300 px-5 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-600 focus-visible:border-brand-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-400/20 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:border-brand-400 dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-600 dark:focus-visible:ring-brand/20-400",
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
