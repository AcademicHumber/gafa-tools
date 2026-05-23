"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

interface Props {
  logoFile: File | null;
  logoSizePct: number;
  onLogoChange: (file: File | null) => void;
  onSizeChange: (pct: number) => void;
}

export function LogoUploader({ logoFile, logoSizePct, onLogoChange, onSizeChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    if (!file) {
      setPreviewUrl(null);
      onLogoChange(null);
      return;
    }
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      setError("Formato no soportado. Usa PNG o JPG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5 MB.");
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    onLogoChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0] ?? null;
    handleFile(file);
  };

  const handleRemove = () => {
    handleFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B9A95]"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        Logo (opcional)
      </label>

      {logoFile ? (
        <div className="flex items-center gap-3 rounded-xl border border-[#E8E7E3] bg-white px-4 py-3">
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="logo preview" className="h-9 w-9 rounded-lg object-contain" />
          )}
          <span className="flex-1 truncate text-sm text-[#6B6A65]">{logoFile.name}</span>
          <button
            onClick={handleRemove}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[#C8C7C2] transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#E8E7E3] bg-white py-6 transition-all hover:border-[#3abeff] hover:bg-[#3abeff]/5"
        >
          <ImagePlus className="h-5 w-5 text-[#C8C7C2]" />
          <div className="text-center">
            <p className="text-sm text-[#6B6A65]">Arrastra o haz clic</p>
            <p className="text-xs text-[#C8C7C2]">PNG o JPG · máx. 5 MB</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      {logoFile && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B9A95]"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Tamaño del logo
            </span>
            <span
              className={`text-xs font-bold ${logoSizePct > 30 ? "text-amber-500" : "text-[#3abeff]"}`}
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {logoSizePct}%
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={40}
            value={logoSizePct}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="accent-[#3abeff] w-full"
          />
          {logoSizePct > 30 && (
            <p className="text-xs text-amber-600">
              Por encima del 30% el QR puede no ser escaneable.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
