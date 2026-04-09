// Next.js 15 App Router Layout
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Desbloqueio Metabólico - Protocolo de 3 Minutos",
  description:
    "Descubra o protocolo de 3 minutos que desbloqueia seu metabolismo e permite emagrecer sem cortar arroz, feijão ou churrasco.",
  keywords: [
    "emagrecimento",
    "metabolismo",
    "perda de peso",
    "dieta brasileira",
    "protocolo metabólico",
  ],
  openGraph: {
    title: "Desbloqueio Metabólico - Protocolo de 3 Minutos",
    description:
      "Descubra o protocolo de 3 minutos que desbloqueia seu metabolismo e permite emagrecer sem cortar arroz, feijão ou churrasco.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1A8A6E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="bg-[#FAFBFC]">
      <body className={`${montserrat.className} antialiased`}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
