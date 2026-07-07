import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo — Panolayer Starter",
  description:
    "A small Next.js todolist with an API backend, used as a Panolayer starter/tutorial project.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
