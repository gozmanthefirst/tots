// External Imports
import type { Metadata } from "next";
import { ReactNode } from "react";

// Local Imports
import QueryProvider from "@/providers/query-provider";
import { ViewportHeightProvider } from "@/providers/viewport-height-provider";
import { cn } from "@/shared/lib/utils/cn";
import { instrumentSans } from "@/styles/fonts";
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
      <ViewportHeightProvider>
        <body
          className={cn(
            `bg-background text-foreground antialiased`,
            instrumentSans.className,
          )}
        >
          {/* <ScreenSize /> */}
          <QueryProvider>{children}</QueryProvider>
        </body>
      </ViewportHeightProvider>
    </html>
  );
};

export default RootLayout;
