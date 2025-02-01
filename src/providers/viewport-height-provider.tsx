"use client";

// External Imports
import { ReactNode, useEffect, useState } from "react";

export const ViewportHeightProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    // Initialize height (avoids SSR mismatches)
    setViewportHeight(window.innerHeight);

    // Handler to update height
    const updateHeight = () => {
      const newHeight = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(newHeight);
    };

    // Prioritize Visual Viewport API (for iOS)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateHeight);
    } else {
      // Fallback for browsers without Visual Viewport API (older Android)
      window.addEventListener("resize", updateHeight);
    }

    // Cleanup
    return () => {
      window.visualViewport?.removeEventListener("resize", updateHeight);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div style={{ height: `${viewportHeight}px`, overflow: "auto" }}>
      {children}
    </div>
  );
};
