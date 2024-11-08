// External Imports
import { TbBrandGoogleFilled } from "react-icons/tb";

// Local Imports
import { Button } from "@/shared/components/button";
import { cn } from "@/shared/lib/utils/cn";
import { instrument } from "@/styles/fonts";

export const SignInForm = () => {
  return (
    <div className="flex flex-col gap-8 items-center w-full px-2 md:gap-12">
      <h3
        className={cn(
          "text-4xl text-brand-400 md:text-5xl",
          instrument.className,
        )}
      >
        Sign in to Tots
      </h3>

      {/* OAuth Buttons */}
      <>
        {/* Large Screens */}
        <Button
          variant={"secondary"}
          size={"xl"}
          className={cn("hidden max-w-md w-full md:inline-flex")}
        >
          <TbBrandGoogleFilled size={22} />
          <span>Continue with Google</span>
        </Button>

        {/* Small Screens */}
        <Button
          variant={"secondary"}
          size={"lg"}
          className={cn("max-w-md w-full md:hidden")}
        >
          <TbBrandGoogleFilled size={20} />
          <span>Sign in with Google</span>
        </Button>
      </>
    </div>
  );
};
