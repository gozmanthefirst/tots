// External Imports
import { useEffect } from "react";

export const useDisableScroll = (condition: boolean) => {
  useEffect(() => {
    if (condition) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [condition]);
};
