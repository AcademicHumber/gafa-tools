import Link from "next/link";
import { QrCode, ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/tools";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  QrCode,
};

interface Props {
  tool: Tool;
  index: number;
}

export function ToolCard({ tool, index }: Props) {
  const Icon = iconMap[tool.icon] ?? QrCode;
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8E7E3] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3abeff] hover:shadow-md"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAFAF8] transition-colors group-hover:bg-[#3abeff]/10">
          <Icon className="h-5 w-5 text-[#6B6A65] transition-colors group-hover:text-[#3abeff]" />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold text-[#C8C7C2] transition-colors group-hover:text-[#3abeff]"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {num}
          </span>
          <ArrowUpRight className="h-4 w-4 text-[#C8C7C2] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#3abeff]" />
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8">
        <h2
          className="text-base font-bold text-[#0D0E0E]"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {tool.name}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-[#6B6A65]">
          {tool.description}
        </p>
      </div>

      {/* Accent bottom line */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#3abeff] transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
