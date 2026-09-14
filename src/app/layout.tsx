import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { DEALERSHIP_INFO } from "@/lib/constants";
import { ThemeProvider } from "@/context/ThemeContext";

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
    icon: "/images/logo-oficial.png",
    apple: "/images/logo-oficial.png",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              "name": DEALERSHIP_INFO.name,
              "image": "https://modelomultimarcasjf.com.br/images/logo-oficial.png",
              "telephone": DEALERSHIP_INFO.phoneFormatted,
              "email": DEALERSHIP_INFO.email,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Barão do Rio Branco, 4200",
                "addressLocality": "Juiz de Fora",
                "addressRegion": "MG",
                "postalCode": "36025-020",
                "addressCountry": "BR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -21.7642,
                "longitude": -43.3503
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:30",
                  "closes": "18:30"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "08:30",
                  "closes": "13:00"
                }
              ],
              "priceRange": "$$",
              "areaServed": {
                "@type": "AdministrativeArea",
                "name": "Juiz de Fora e Zona da Mata Mineira"
              }
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('modelo_jf_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-slate-50 dark:bg-[#06070a] text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col font-sans transition-colors duration-200 overflow-x-hidden w-full max-w-full"
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

