"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "motion/react";
import {
  TbCircleCheck,
  TbExclamationCircle,
  TbPinned,
  TbPinnedOff,
} from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";

import { editTot } from "@/features/tots/api/edit-tot";
import { Button } from "@/shared/components/button";
import {
  drawerStore,
  pinTotBtnStateStore,
  submitTotBtnStateStore,
} from "@/shared/store";

const pinButtonCopy = {
  idle: <TbPinned size={20} strokeWidth={2} />,
  loading: <RotatingLines visible width="18" strokeColor="#000000" />,
  success: <TbCircleCheck size={20} strokeWidth={2} />,
  error: <TbExclamationCircle size={20} strokeWidth={2} />,
};

export const PinTotBtn = ({ isPinned }: { isPinned: boolean }) => {
  const drawer = useStore(drawerStore);
  const submitButtonState = useStore(submitTotBtnStateStore);
  const pinButtonState = useStore(pinTotBtnStateStore);

  const variants = {
    initial: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
  };

  const queryClient = useQueryClient();

  const handlePinToggle = async () => {
    if (!drawer.tot) return;

    try {
      pinTotBtnStateStore.setState(() => "loading");

      const updatedPinnedStatus = !drawer.tot.pinned;

      const response = await editTot({
        updatedTot: { ...drawer.tot, pinned: updatedPinnedStatus },
      });

      if (response.status === "error") {
        return pinTotBtnStateStore.setState(() => "error");
      }

      pinTotBtnStateStore.setState(() => "success");

      // Invalidate tots query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["tots"] });

      // Close the drawer
      setTimeout(() => {
        drawerStore.setState(() => ({
          drawerName: null,
          editable: false,
          tot: null,
        }));
      }, 1000);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      pinTotBtnStateStore.setState(() => "error");
    } finally {
      setTimeout(() => {
        pinTotBtnStateStore.setState(() => "idle");
      }, 3000);
    }
  };

  return (
    <Button
      size="icon"
      type="button"
      onClick={handlePinToggle}
      disabled={pinButtonState !== "idle" || submitButtonState !== "idle"}
      variant={
        pinButtonState === "idle"
          ? "secondary"
          : pinButtonState === "error"
            ? "destructive"
            : "white"
      }
      className="relative cursor-pointer overflow-hidden rounded-full"
      aria-label={isPinned ? "Unpin Tot" : "Pin Tot"}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pinButtonState}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          initial="initial"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          {isPinned && pinButtonState === "idle" ? (
            <TbPinnedOff size={20} strokeWidth={2} />
          ) : (
            pinButtonCopy[pinButtonState]
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
};
