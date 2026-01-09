import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NumberSolver",
  description: "Solve number puzzles and card combinations",
};

export default function NumberSolverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
