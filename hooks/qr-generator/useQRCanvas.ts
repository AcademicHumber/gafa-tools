"use client";

import { useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";

interface QROptions {
  url: string;
  fgColor: string;
  bgColor: string;
  logoFile: File | null;
  logoSizePct: number;
}

export function useQRCanvas({ url, fgColor, bgColor, logoFile, logoSizePct }: QROptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!url.trim()) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const renderQR = async () => {
      const size = 400;

      // Render QR to an offscreen canvas first
      const offscreen = document.createElement("canvas");
      await QRCode.toCanvas(offscreen, url, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(offscreen, 0, 0);

      if (!logoFile) return;

      const img = new Image();
      const objectUrl = URL.createObjectURL(logoFile);
      img.src = objectUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
      }).catch(() => null);

      URL.revokeObjectURL(objectUrl);

      if (!img.complete || img.naturalWidth === 0) return;

      const logoMax = size * (logoSizePct / 100);
      const ratio = Math.min(logoMax / img.naturalWidth, logoMax / img.naturalHeight);
      const logoW = img.naturalWidth * ratio;
      const logoH = img.naturalHeight * ratio;
      const padding = 8;
      const bgW = logoW + padding * 2;
      const bgH = logoH + padding * 2;
      const x = (size - bgW) / 2;
      const y = (size - bgH) / 2;
      const radius = 6;

      // White rounded background behind logo
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + bgW - radius, y);
      ctx.quadraticCurveTo(x + bgW, y, x + bgW, y + radius);
      ctx.lineTo(x + bgW, y + bgH - radius);
      ctx.quadraticCurveTo(x + bgW, y + bgH, x + bgW - radius, y + bgH);
      ctx.lineTo(x + radius, y + bgH);
      ctx.quadraticCurveTo(x, y + bgH, x, y + bgH - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.drawImage(img, x + padding, y + padding, logoW, logoH);
    };

    renderQR().catch(console.error);
  }, [url, fgColor, bgColor, logoFile, logoSizePct]);

  const downloadPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !url.trim()) return;

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [url]);

  return { canvasRef, downloadPNG };
}
