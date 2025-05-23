"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TbBrandGoogleFilled } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";

import { Button } from "@/shared/components/button";
import { signIn } from "@/shared/lib/auth/auth-client";
import { cn } from "@/shared/lib/utils/cn";
import { instrumentSerif } from "@/styles/fonts";

const buttonCopy = {
  idle: (
    <div className="flex items-center gap-2">
      <TbBrandGoogleFilled size={20} />
      <span>Continue with Google</span>
    </div>
  ),
  loading: <RotatingLines visible width="18" strokeColor="#E5E999" />,
  success: "Signing in...",
  error: "Something went wrong",
};

export const SignInForm = () => {
  return (
    <div className="flex w-full flex-col items-center gap-8 px-2 md:gap-12">
      <h1
        className={cn(
          "text-4xl text-brand-400 md:text-5xl",
          instrumentSerif.className,
        )}
      >
        Sign in to <span className="italic">Tots</span>
      </h1>

      {/* OAuth Buttons */}
      <>
        {/* Large Screens */}
        <SignInButton size="xl" />
        {/* Small Screens */}
        <SignInButton size="lg" />
      </>
    </div>
  );
};

interface SignInButtonProps {
  size: "lg" | "xl";
}

const SignInButton = ({ size }: SignInButtonProps) => {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social(
        {
          provider: "google",
        },
        {
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
          },
        },
      );
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
    <Button
      key={size === "lg" ? "small" : "large"}
      variant={"secondary"}
      size={size}
      disabled={buttonState !== "idle"}
      onClick={() => {
        handleGoogleSignIn();
      }}
      className={cn(
        "relative w-full max-w-md overflow-hidden",
        size === "xl" ? "hidden md:inline-flex" : "md:hidden",
      )}
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
  );
};
