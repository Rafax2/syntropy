
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Syntropy | Productivity Hub",
  description:
    "Tu espacio personal para organizar tareas, proyectos, hábitos y tiempo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}