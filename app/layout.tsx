import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Balú | Trazabilidad de exportación",
  description:
    "Experiencia inmersiva de trazabilidad para cajas de exportación de plátano Balú."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-[var(--font-body)]">{children}</body>
    </html>
  );
}
