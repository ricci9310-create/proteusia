import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Proteus IA — Inteligencia que toma la forma de tu negocio",
  description:
    "Nos transformamos en la solución exacta que tu empresa necesita. CRMs, agentes de voz IA, automatizaciones, SaaS y más. Cuéntanos tu problema y Proteus tomará forma.",
  keywords: [
    "inteligencia artificial",
    "software a medida",
    "CRM",
    "agentes de voz IA",
    "automatización",
    "SaaS",
    "Proteus",
    "proteusia",
  ],
  openGraph: {
    title: "Proteus IA — Inteligencia que toma la forma de tu negocio",
    description:
      "Nos transformamos en la solución exacta que tu empresa necesita. Cuéntanos tu problema y Proteus tomará forma.",
    type: "website",
    locale: "es_CO",
    alternateLocale: "en_US",
  },
  applicationName: "Proteus",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Proteus",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#030308",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
