import type { Metadata } from "next";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
