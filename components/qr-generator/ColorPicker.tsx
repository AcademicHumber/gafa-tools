"use client";

interface Props {
  fgColor: string;
  bgColor: string;
  onFgChange: (color: string) => void;
  onBgChange: (color: string) => void;
}

export function ColorPicker({ fgColor, bgColor, onFgChange, onBgChange }: Props) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Color QR</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={fgColor}
            onChange={(e) => onFgChange(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded border border-zinc-300 p-0.5 dark:border-zinc-600"
          />
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{fgColor}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Fondo</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onBgChange(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded border border-zinc-300 p-0.5 dark:border-zinc-600"
          />
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{bgColor}</span>
        </div>
      </div>
    </div>
  );
}
