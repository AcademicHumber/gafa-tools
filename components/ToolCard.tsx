import Link from "next/link";
import { QrCode, ArrowRight } from "lucide-react";
import type { Tool } from "@/lib/tools";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  QrCode,
};

interface Props {
  tool: Tool;
}

export function ToolCard({ tool }: Props) {
  const Icon = iconMap[tool.icon] ?? QrCode;

  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
        </div>
        <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 dark:text-zinc-500" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{tool.name}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{tool.description}</p>
      </div>
    </Link>
  );
}
