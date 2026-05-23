import { tools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
      {/* Editorial headline */}
      <div className="mb-12 md:mb-20">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9B9A95]"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          GAFA · Agencia Web Bolivia
        </p>
        <h1
          className="text-[1.9rem] font-extrabold leading-[1.05] tracking-tight text-[#0D0E0E] sm:text-5xl md:text-7xl"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Herramientas
          <br />
          <span className="text-[#3abeff]">gratuitas.</span>
        </h1>
        <p className="mt-5 max-w-md text-sm text-[#6B6A65] sm:text-base">
          Utilidades para potenciar tu presencia digital, sin costo y sin registro.
        </p>
      </div>

      {/* Divider */}
      <div className="mb-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#E8E7E3]" />
        <span
          className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9B9A95]"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {tools.length} {tools.length === 1 ? "herramienta" : "herramientas"}
        </span>
        <div className="h-px flex-1 bg-[#E8E7E3]" />
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} index={i} />
        ))}
      </div>
    </main>
  );
}
