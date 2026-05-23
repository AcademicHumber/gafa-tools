import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QRGenerator } from "@/components/qr-generator/QRGenerator";

export const metadata: Metadata = {
  title: "QR Generator",
  description:
    "Genera códigos QR personalizados con el logo de tu marca. Gratis, rápido y sin registro.",
};

export default function QRGeneratorPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
      {/* Back + title */}
      <div className="mb-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-[#9B9A95] transition-colors hover:text-[#3abeff]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span style={{ fontFamily: "var(--font-syne)" }}>Todas las herramientas</span>
        </Link>

        <div className="mt-5 flex items-end gap-4">
          <h1
            className="text-4xl font-extrabold leading-none tracking-tight text-[#0D0E0E] md:text-5xl"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            QR Generator
          </h1>
          <span className="mb-1 hidden text-xs font-semibold uppercase tracking-[0.15em] text-[#9B9A95] sm:block"
            style={{ fontFamily: "var(--font-syne)" }}>
            Herramienta 01
          </span>
        </div>
        <p className="mt-2 text-sm text-[#6B6A65]">
          Genera un código QR con el logo de tu marca.
        </p>
      </div>

      <QRGenerator />
    </main>
  );
}
