"use client";

import { useEffect, useState } from "react";

import { TotDrawer } from "@/features/tots/components/tot-drawer";

export const DrawerProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <TotDrawer />
    </>
  );
};
