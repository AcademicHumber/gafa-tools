import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-[#0D0E0E]">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
