// Local Imports
import { cn } from "@/shared/lib/utils/cn";
import { SessionUser } from "@/shared/types";
import { instrumentSerif } from "@/styles/fonts";

interface Props {
  user: SessionUser;
}

export const TotsUsername = ({ user }: Props) => {
  return (
    <div className="flex items-center justify-center text-center">
      <p
        className={cn(
          "text-4xl text-brand-400 italic sm:text-5xl md:text-6xl",
          instrumentSerif.className,
        )}
      >
        @{user?.username}
      </p>
    </div>
  );
};
