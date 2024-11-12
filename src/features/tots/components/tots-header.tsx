"use client";

// External Imports
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Local Imports
import { signOut } from "@/features/auth/actions/sign-out";
import { Button } from "@/shared/components/button";
import { Spinner } from "@/shared/components/spinner";
import { cn } from "@/shared/lib/utils/cn";

const buttonCopy = {
  idle: "Sign Out",
  loading: <Spinner size={15} color="#E5E999" />,
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
    <header className="sticky top-0 z-50 py-6">
      <div className="flex items-center justify-between">
        <Link href={"/"}>
          <div className="relative size-10">
            <Image
              src={"/images/logo.png"}
              alt="Logo"
              fill
              className="shadow-md"
            />
          </div>
        </Link>

        <div>
          <Button
            variant={"secondary"}
            size={"sm"}
            disabled={signOutBtnState !== "idle"}
            onClick={handleSignOut}
            className={cn("relative overflow-hidden w-32")}
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
  );
};
