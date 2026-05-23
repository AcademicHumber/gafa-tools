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
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
      {/* Controls panel */}
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#E8E7E3] bg-white p-6 shadow-sm lg:max-w-sm">
        <URLInput value={rawUrl} onChange={handleUrlChange} />
        <div className="h-px bg-[#E8E7E3]" />
        <ColorPicker
          fgColor={fgColor}
          bgColor={bgColor}
          onFgChange={setFgColor}
          onBgChange={setBgColor}
        />
        <div className="h-px bg-[#E8E7E3]" />
        <LogoUploader
          logoFile={logoFile}
          logoSizePct={logoSizePct}
          onLogoChange={setLogoFile}
          onSizeChange={setLogoSizePct}
        />
        <div className="h-px bg-[#E8E7E3]" />
        <DownloadButton onClick={downloadPNG} disabled={!debouncedUrl.trim()} />
      </div>

      {/* Preview panel */}
      <div className="flex flex-1 items-center justify-center">
        {debouncedUrl.trim() ? (
          <div className="rounded-2xl border border-[#E8E7E3] bg-white p-6 shadow-sm">
            <canvas
              ref={canvasRef}
              className="block rounded-xl"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        ) : (
          <div className="flex h-72 w-72 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#E8E7E3]">
            <div className="h-12 w-12 rounded-xl bg-[#FAFAF8]" />
            <p className="text-center text-sm text-[#9B9A95]">
              Ingresa una URL<br />para ver el QR
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
