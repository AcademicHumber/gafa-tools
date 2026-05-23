"use client";

import { useRef, useState } from "react";

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
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Logo (opcional)</label>

      {logoFile ? (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {previewUrl && <img src={previewUrl} alt="logo preview" className="h-10 w-10 rounded object-contain" />}
          <span className="flex-1 truncate text-sm text-zinc-700 dark:text-zinc-300">{logoFile.name}</span>
          <button
            onClick={handleRemove}
            className="text-sm text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
          >
            Quitar
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 py-4 text-sm text-zinc-500 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
        >
          <span>Arrastra una imagen o haz clic</span>
          <span className="text-xs text-zinc-400">PNG o JPG · máx. 5 MB</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {logoFile && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Tamaño del logo</span>
            <span className={logoSizePct > 30 ? "font-medium text-amber-500" : ""}>{logoSizePct}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={40}
            value={logoSizePct}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="accent-zinc-800 dark:accent-zinc-300"
          />
          {logoSizePct > 30 && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Por encima del 30% el QR puede no ser escaneable.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
