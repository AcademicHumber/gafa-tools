"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useQRCanvas } from "@/hooks/qr-generator/useQRCanvas";
import { URLInput } from "./URLInput";
import { ColorPicker } from "./ColorPicker";
import { LogoUploader } from "./LogoUploader";
import { DownloadButton } from "./DownloadButton";

const DEBOUNCE_MS = 300;

export function QRGenerator() {
  const [rawUrl, setRawUrl] = useState("");
  const [debouncedUrl, setDebouncedUrl] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoSizePct, setLogoSizePct] = useState(20);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUrlChange = useCallback((val: string) => {
    setRawUrl(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedUrl(val), DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const { canvasRef, downloadPNG } = useQRCanvas({
    url: debouncedUrl,
    fgColor,
    bgColor,
    logoFile,
    logoSizePct,
  });

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8 md:flex-row">
      {/* Controls */}
      <div className="flex w-full flex-col gap-5 md:max-w-xs">
        <URLInput value={rawUrl} onChange={handleUrlChange} />
        <ColorPicker
          fgColor={fgColor}
          bgColor={bgColor}
          onFgChange={setFgColor}
          onBgChange={setBgColor}
        />
        <LogoUploader
          logoFile={logoFile}
          logoSizePct={logoSizePct}
          onLogoChange={setLogoFile}
          onSizeChange={setLogoSizePct}
        />
        <DownloadButton onClick={downloadPNG} disabled={!debouncedUrl.trim()} />
      </div>

      {/* QR Preview */}
      <div className="flex flex-1 items-center justify-center">
        {debouncedUrl.trim() ? (
          <canvas
            ref={canvasRef}
            className="rounded-xl shadow-lg"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        ) : (
          <div className="flex h-64 w-64 items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
            Ingresa una URL para ver el QR
          </div>
        )}
      </div>
    </div>
  );
}
