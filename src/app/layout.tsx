// External Imports
import type { Metadata } from "next";
import { ReactNode } from "react";

// Local Imports
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
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
