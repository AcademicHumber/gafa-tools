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
    <main className="flex flex-col items-center px-6 py-12">
      <div className="mb-10 w-full max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Todas las herramientas
        </Link>
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            QR Generator
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Genera un código QR con tu logo de branding
          </p>
        </div>
      </div>
      <QRGenerator />
    </main>
  );
}
