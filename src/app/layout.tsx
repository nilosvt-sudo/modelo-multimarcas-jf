import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { DEALERSHIP_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Modelo Multimarcas JF | Seminovos em Juiz de Fora",
  description:
    "Seminovos em Juiz de Fora com procedência, 1 ano de garantia e laudo cautelar 100% aprovado. Encontre seu carro ideal na Modelo Multimarcas JF.",
  keywords: [
    "seminovos juiz de fora",
    "carros juiz de fora",
    "modelo multimarcas jf",
    "comprar carro jf",
    "financiamento de veiculos jf",
    "seminovos zona da mata",
    "troca de carro juiz de fora"
  ],
  authors: [{ name: DEALERSHIP_INFO.name }],
  openGraph: {
    title: "Modelo Multimarcas JF | Seminovos em Juiz de Fora",
    description:
      "Qualidade e procedência para você sair dirigindo hoje. Estoque completo de seminovos revisados com garantia em Juiz de Fora/MG.",
    type: "website",
    locale: "pt_BR",
  },
  icons: {
    icon: "/images/logo-oficial.jpg",
    apple: "/images/logo-oficial.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f8fafc",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Chakra+Petch:ital,wght@0,400;0,500;0,600;0,700;1,600;1,700;1,800&family=Inter:wght@400;500;600;700&family=Michroma&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans"
      >
        {children}
      </body>
    </html>
  );
}
