"use client";

// External Imports
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";

// Local Imports
import { signOut } from "@/features/auth/actions/sign-out";
import { Button } from "@/shared/components/button";
import { Container } from "@/shared/components/container";
import { cn } from "@/shared/lib/utils/cn";

const buttonCopy = {
  idle: "Sign Out",
  loading: <RotatingLines visible width="16" strokeColor="#E5E999" />,
  success: "Signed Out!",
  error: "Error",
};

export const TotsHeader = () => {
  const [signOutBtnState, setSignOutBtnState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const handleSignOut = async () => {
    try {
      setSignOutBtnState("loading");
      const response = await signOut();

      if (response.success) {
        setSignOutBtnState("success");

        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setSignOutBtnState("error");

      setTimeout(() => {
        setSignOutBtnState("idle");
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
              disabled={signOutBtnState !== "idle"}
              onClick={handleSignOut}
              className={cn("relative w-32 overflow-hidden")}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={signOutBtnState}
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  initial="initial"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                >
                  {buttonCopy[signOutBtnState]}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </header>
    </Container>
  );
};
