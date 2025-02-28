"use client";

// External Imports
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";

// Local Imports
import { Button } from "@/shared/components/button";
import { Container } from "@/shared/components/container";
import { signOut } from "@/shared/lib/auth/auth-client";
import { cn } from "@/shared/lib/utils/cn";

const buttonCopy = {
  idle: "Sign Out",
  loading: <RotatingLines visible width="16" strokeColor="#E5E999" />,
  success: "Signed Out!",
  error: "Error",
};

export const TotsHeader = () => {
  const router = useRouter();

  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const handleSignOut = async () => {
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

          <div className="pointer-events-auto">
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
          </div>
        </div>
      </header>
    </Container>
  );
};
