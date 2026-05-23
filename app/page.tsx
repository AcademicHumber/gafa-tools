import { tools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Herramientas GAFA
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          Utilidades gratuitas para potenciar tu presencia digital.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </main>
  );
}
