"use client";

import { Tot } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "motion/react";
import { TbCircleCheck, TbExclamationCircle, TbTrash } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";

import { deleteTot } from "@/features/tots/actions/delete-tot";
import { Button } from "@/shared/components/button";
import {
  delTotBtnStateStore,
  drawerStore,
  submitTotBtnStateStore,
} from "@/shared/store";
import { ServerActionResponse } from "@/shared/types";

const delButtonCopy = {
  idle: <TbTrash size={20} strokeWidth={2} />,
  loading: <RotatingLines visible width="18" strokeColor="#000000" />,
  success: <TbCircleCheck size={20} strokeWidth={2} />,
  error: <TbExclamationCircle size={20} strokeWidth={2} />,
};

export const DelTotBtn = () => {
  const drawer = useStore(drawerStore);
  const submitButtonState = useStore(submitTotBtnStateStore);
  const delButtonState = useStore(delTotBtnStateStore);

  const variants = {
    initial: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
  };

  const queryClient = useQueryClient();

  const handleDeleteTot = async () => {
    if (!drawer.tot) return;

    try {
      delTotBtnStateStore.setState(() => "loading");

      const response: ServerActionResponse = await deleteTot(drawer.tot as Tot);

      if (response.status === "error") {
        return delTotBtnStateStore.setState(() => "error");
      }

      delTotBtnStateStore.setState(() => "success");
      setTimeout(() => {
        drawerStore.setState(() => ({
          drawerName: null,
          editable: false,
          tot: null,
        }));
      }, 1000);
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["tots"],
        });
      }, 1500);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      delTotBtnStateStore.setState(() => "error");
    } finally {
      setTimeout(() => {
        delTotBtnStateStore.setState(() => "idle");
      }, 3000);
    }
  };

  return (
    <Button
      size="icon"
      type="button"
      onClick={handleDeleteTot}
      disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
      variant={
        delButtonState === "idle" || delButtonState === "error"
          ? "destructive"
          : "white"
      }
      className="relative cursor-pointer overflow-hidden rounded-full"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={delButtonState}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          initial="initial"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          {delButtonCopy[delButtonState]}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
};
