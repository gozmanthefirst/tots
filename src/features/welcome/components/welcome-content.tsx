import Link from "next/link";

import { buttonVariants } from "@/shared/components/button";
import { cn } from "@/shared/lib/utils/cn";
import { instrumentSerif } from "@/styles/fonts";

export const WelcomeContent = () => {
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4 px-2 text-center md:gap-6">
      <h1
        className={cn(
          "text-4xl text-brand-400 md:text-5xl",
          instrumentSerif.className,
        )}
      >
        Effortlessly capture your <span className="italic">tots</span> as they
        come
      </h1>
      <p className="text-sm text-neutral-300 md:text-base">
        {`A seamless note-taking experience that adapts to your rhythm. Whether it's a fleeting thought, a bookmarked idea, or a snapshot, quickly capture it all and stay organized.`}
      </p>

      <Link
        href={"/sign-in"}
        prefetch
        className={cn(
          "mt-4 w-full max-w-sm",
          buttonVariants({ variant: "brand", size: "lg" }),
        )}
      >
        Get Started
      </Link>
    </div>
  );
};
