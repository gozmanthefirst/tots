// External Imports
import type { Metadata } from "next";
import { ReactNode } from "react";

// Local Imports
import QueryProvider from "@/providers/query-provider";
import { ScreenSize } from "@/shared/components/screen-size";
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
    <html lang="en">
      <body
        className={`${geist.className} antialiased bg-background text-foreground`}
      >
        <ScreenSize />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
