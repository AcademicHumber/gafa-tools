"use client";

import { Download } from "lucide-react";

interface Props {
  onClick: () => void;
  disabled: boolean;
}

export function DownloadButton({ onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ fontFamily: "var(--font-syne)" }}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3abeff] px-4 py-3 text-sm font-bold text-[#0D0E0E] transition-all hover:bg-[#1a9fe8] hover:shadow-lg hover:shadow-[#3abeff]/20 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Download className="h-4 w-4" />
      Descargar PNG
    </button>
  );
}
