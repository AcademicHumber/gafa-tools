"use client";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function URLInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B9A95]"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        URL destino
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://ejemplo.com"
        className="w-full rounded-xl border border-[#E8E7E3] bg-white px-4 py-3 text-sm text-[#0D0E0E] outline-none placeholder:text-[#C8C7C2] focus:border-[#3abeff] focus:ring-2 focus:ring-[#3abeff]/15 transition-all"
      />
    </div>
  );
}
