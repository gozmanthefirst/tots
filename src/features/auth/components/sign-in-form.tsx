"use client";

// External Imports
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TbBrandGoogleFilled } from "react-icons/tb";

// Local Imports
import { Button } from "@/shared/components/button";
import { Spinner } from "@/shared/components/spinner";
import { cn } from "@/shared/lib/utils/cn";
import { instrument } from "@/styles/fonts";
import { signInWithGoogle } from "../actions/sign-in";

const buttonCopy = {
  idle: (
    <div className="flex gap-2 items-center">
      <TbBrandGoogleFilled size={20} />
      <span>Continue with Google</span>
    </div>
  ),
  loading: <Spinner color="#E5E999" />,
  success: "Signing in...",
  error: "Something went wrong",
};

export const SignInForm = () => {
  return (
    <div className="flex flex-col gap-8 items-center w-full px-2 md:gap-12">
      <h1
        className={cn(
          "text-4xl text-brand-400 md:text-5xl",
          instrument.className,
        )}
      >
        Sign in to <span className="italic">Tots</span>
      </h1>

      {/* OAuth Buttons */}
      {/* Large Screens */}
      <SignInButton size="xl" />

      {/* Small Screens */}
      <SignInButton size="lg" />
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

  const handleSignIn = async () => {
    try {
      setButtonState("loading");
      await signInWithGoogle();

      setButtonState("success");
    } catch (error) {
      console.log(error);
      setButtonState("error");

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
        handleSignIn();
      }}
      className={cn(
        "relative overflow-hidden max-w-md w-full",
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
