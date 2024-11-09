// External Imports
import Link from "next/link";

// Local Imports
import { buttonVariants } from "@/shared/components/button";
import { cn } from "@/shared/lib/utils/cn";
import { instrument } from "@/styles/fonts";

export const WelcomeContent = () => {
  return (
    <div className="flex flex-col gap-4 items-center text-center max-w-lg w-full px-2 md:gap-6">
      <h1
        className={cn(
          "text-4xl text-brand-400 md:text-5xl",
          instrument.className,
        )}
      >
        Effortlessly capture your <span className="italic">tots</span> as they
        come
      </h1>
      <p className="text-neutral-300 text-sm md:text-base">
        {`A seamless note-taking experience that adapts to your rhythm. Whether
          it's a fleeting thought, a bookmarked idea, or a snapshot, quickly
          capture it all and stay organized.`}
      </p>

      <Link
        href={"/sign-in"}
        prefetch
        className={cn(
          "mt-4 max-w-sm w-full",
          buttonVariants({ variant: "brand", size: "lg" }),
        )}
      >
        Get Started
      </Link>
    </div>
  );
};
