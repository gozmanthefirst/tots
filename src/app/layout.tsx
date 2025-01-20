// External Imports
import type { Metadata } from "next";
import { ReactNode } from "react";

// Local Imports
import QueryProvider from "@/providers/query-provider";
import { cn } from "@/shared/lib/utils/cn";
import { geist } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Tots",
  description: "Tots, a note-taking web app.",
};

interface Props {
  children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          `bg-background text-foreground antialiased`,
          geist.className,
        )}
      >
        {/* <ScreenSize /> */}
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
