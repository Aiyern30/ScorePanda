import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Niuniu",
  description: "Play and track scores for Niuniu card game",
};

export default function NiuniuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
