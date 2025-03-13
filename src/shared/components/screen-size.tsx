"use client";

import { useEffect, useState } from "react";

import { cn } from "../lib/utils/cn";

export const ScreenSize = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateDimensions() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const { width, height } = dimensions;

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      className={cn(
        "fixed bottom-3 left-3 z-[500] flex items-center space-x-2 rounded-full bg-brand-400 px-2.5 py-1 text-xs font-bold text-black shadow-sm transition-opacity duration-300",
        dimensions.width === 0 ? "opacity-0" : "opacity-100",
      )}
    >
      <span>
        {width.toLocaleString()} x {height.toLocaleString()}
      </span>

      <div className="h-3 w-px bg-neutral-900" />

      <div className="pt-0.5">
        <span className="sm:hidden">XS</span>
        <span className="hidden sm:inline smd:hidden">SM</span>
        <span className="hidden smd:inline md:hidden">SMD</span>
        <span className="hidden md:inline lg:hidden">MD</span>
        <span className="hidden lg:inline xl:hidden">LG</span>
        <span className="hidden xl:inline 2xl:hidden">XL</span>
        <span className="hidden 2xl:inline 3xl:hidden">2XL</span>
        <span className="hidden 3xl:inline">3XL</span>
      </div>
    </div>
  );
};
