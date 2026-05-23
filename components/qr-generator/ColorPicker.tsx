"use client";

interface SwatchProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

function Swatch({ label, value, onChange }: SwatchProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B9A95]"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        {label}
      </label>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E8E7E3] bg-white px-4 py-3 transition-all hover:border-[#3abeff]">
        <span
          className="h-5 w-5 flex-shrink-0 rounded-md border border-[#E8E7E3] shadow-sm"
          style={{ backgroundColor: value }}
        />
        <span className="font-mono text-xs text-[#6B6A65]">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </label>
    </div>
  );
}

interface Props {
  fgColor: string;
  bgColor: string;
  onFgChange: (color: string) => void;
  onBgChange: (color: string) => void;
}

export function ColorPicker({ fgColor, bgColor, onFgChange, onBgChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Swatch label="Color QR" value={fgColor} onChange={onFgChange} />
      <Swatch label="Fondo" value={bgColor} onChange={onBgChange} />
    </div>
  );
}
