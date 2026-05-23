import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GAFA Tools",
    template: "%s | GAFA Tools",
  },
  description:
    "Herramientas digitales gratuitas de GAFA, la agencia web que impulsa tu marca en Bolivia.",
  metadataBase: new URL("https://tools.gafa.com.bo"),
  openGraph: {
    type: "website",
    siteName: "GAFA Tools",
    title: "GAFA Tools",
    description: "Herramientas digitales gratuitas de GAFA",
    images: [{ url: "/og-image.png", width: 500, height: 500, alt: "GAFA" }],
  },
  twitter: {
    card: "summary",
    title: "GAFA Tools",
    description: "Herramientas digitales gratuitas de GAFA",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <Header />
        {children}
      </body>
    </html>
  );
}
