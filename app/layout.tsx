import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VideoMatte - AI Video Background Remover",
  description: "Remove video backgrounds with AI. No green screen needed. Fast, accurate, and easy to use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
