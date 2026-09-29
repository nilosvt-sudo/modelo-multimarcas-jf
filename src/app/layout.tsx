import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { DEALERSHIP_INFO } from "@/lib/constants";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Apex Motors | Seminovos Premium em São Paulo",
  description:
    "Seminovos selecionados em São Paulo com procedência, 1 ano de garantia e laudo cautelar 100% aprovado. Encontre seu carro ideal na Apex Motors.",
  keywords: [
    "seminovos sao paulo",
    "carros sao paulo",
    "apex motors",
    "comprar carro sp",
    "financiamento de veiculos sp",
    "concessionaria multimarcas sp",
    "troca de carro sp"
  ],
  authors: [{ name: DEALERSHIP_INFO.name }],
  openGraph: {
    title: "Apex Motors | Seminovos em São Paulo",
    description:
      "Qualidade e procedência para você sair dirigindo hoje. Estoque completo de seminovos revisados com garantia em São Paulo/SP.",
    type: "website",
    locale: "pt_BR",
  },
  icons: {
    icon: "/images/logo-apex.svg",
    apple: "/images/logo-apex.svg",
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
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,500;0,600;0,700;1,600;1,700;1,800&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              "name": DEALERSHIP_INFO.name,
              "image": "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
              "telephone": DEALERSHIP_INFO.phoneFormatted,
              "email": DEALERSHIP_INFO.email,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. das Nações Unidas, 12901",
                "addressLocality": "São Paulo",
                "addressRegion": "SP",
                "postalCode": "04578-000",
                "addressCountry": "BR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -23.6085,
                "longitude": -46.6965
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:30",
                  "closes": "19:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "08:30",
                  "closes": "17:00"
                }
              ],
              "priceRange": "$$$",
              "areaServed": {
                "@type": "AdministrativeArea",
                "name": "São Paulo e Região Metropolitana"
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
