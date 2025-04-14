"use client";

import { MouseEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { RotatingLines } from "react-loader-spinner";

import { getUser } from "@/shared/api/get-user";
import { Button } from "@/shared/components/button";
import { Container } from "@/shared/components/container";
import { signOut } from "@/shared/lib/auth/auth-client";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

const buttonCopy = {
  idle: "Sign Out",
  loading: <RotatingLines visible width="16" strokeColor="#000000" />,
  success: "Signed Out!",
  error: "Error",
};

export const TotsHeader = () => {
  const router = useRouter();

  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const { data: { data: user } = {} } = useQuery({
    queryKey: ["user"],
    queryFn: () => runParallelAction(getUser()),
  });

  const handleSignOut = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      await signOut({
        fetchOptions: {
          onRequest() {
            setButtonState("loading");
          },
          onError(ctx) {
            if (process.env.NODE_ENV !== "production") {
              console.error(ctx.error);
            }

            setButtonState("error");
          },
          onSuccess() {
            setButtonState("success");
            router.push("/sign-in");
          },
        },
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      setButtonState("error");
    } finally {
      setTimeout(() => {
        setButtonState("idle");
      }, 3000);
    }
  };

  return (
    <Container className="pointer-events-none sticky top-0 z-50">
      <header className="py-6">
        <div className="flex items-center justify-between">
          <Link href={"/"} className="pointer-events-auto">
            <div className="relative size-10">
              <Image
                src={"/images/logo.png"}
                alt="Logo"
                fill
                className="shadow-md"
              />
            </div>
          </Link>

          <div
            onClick={() => setDropdownOpen((p) => !p)}
            className={cn(
              "pointer-events-auto relative flex cursor-pointer items-center gap-2 font-medium text-neutral-300 transition-colors duration-200 lg:hover:text-brand-400",
              dropdownOpen ? "text-brand-400" : "text-neutral-300",
            )}
          >
            <div className="relative z-60 flex size-8 items-center justify-center overflow-hidden rounded-full">
              <Image
                src={user?.image || "/images/default-avatar.png"}
                alt="Avatar"
                fill
                className="rounded-full"
              />
            </div>

            <span className="relative z-60">{user?.username}</span>

            <AnimatePresence>
              {/* Overlay */}
              {dropdownOpen ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    bounce: 0.2,
                  }}
                  className="fixed inset-0 z-50 cursor-auto bg-black/20 backdrop-blur-sm"
                />
              ) : null}
            </AnimatePresence>

            <AnimatePresence mode="popLayout" initial={false}>
              {dropdownOpen ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    scale: 0.95,
                  }}
                  transition={{
                    type: "spring",
                    bounce: 0.4,
                    duration: 0.4,
                  }}
                  className="absolute top-[calc(100%_+_16px)] right-0 z-50 flex min-w-72 cursor-auto flex-col border border-brand-400/40 bg-brand-400/5 px-6 py-4 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative z-60 flex size-10 items-center justify-center overflow-hidden rounded-full">
                      <Image
                        src={user?.image || "/images/default-avatar.png"}
                        alt="Avatar"
                        fill
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <p className="text-semibold text-brand-400">
                        {user?.name}
                      </p>
                      <p className="text-sm text-neutral-300">{user?.email}</p>
                    </div>
                  </div>

                  <Button
                    variant={"brand"}
                    size={"sm"}
                    disabled={buttonState !== "idle"}
                    onClick={handleSignOut}
                    className={cn("relative mt-4 w-full overflow-hidden")}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={buttonState}
                        transition={{
                          type: "spring",
                          bounce: 0,
                          duration: 0.3,
                        }}
                        initial="initial"
                        animate="visible"
                        exit="exit"
                        variants={variants}
                      >
                        {buttonCopy[buttonState]}
                      </motion.div>
                    </AnimatePresence>
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* <div className="pointer-events-auto">
            <Button
              variant={"secondary"}
              size={"sm"}
              disabled={buttonState !== "idle"}
              onClick={handleSignOut}
              className={cn("relative w-32 overflow-hidden")}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={buttonState}
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  initial="initial"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                >
                  {buttonCopy[buttonState]}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div> */}
        </div>
      </header>
    </Container>
  );
};
