# Cómo agregar una nueva herramienta a GAFA Tools

Cada herramienta es autocontenida: tiene su propia ruta, sus propios componentes y sus propios hooks. El shell de navegación (header, hub) se actualiza solo al registrar la herramienta en `lib/tools.ts`.

---

## Checklist

- [ ] 1. Registrar en `lib/tools.ts`
- [ ] 2. Crear `app/tools/[slug]/page.tsx`
- [ ] 3. Crear `components/[slug]/`
- [ ] 4. Crear `hooks/[slug]/` (si aplica)
- [ ] 5. Actualizar `iconMap` en `components/ToolCard.tsx`
- [ ] 6. Agregar escenarios a `SPEC.md`
- [ ] 7. Verificar con `npm run build`

---

## Paso 1 — Registrar en `lib/tools.ts`

Agregar una entrada al array `tools`. El orden del array determina el orden en el hub y en el header.

```ts
// lib/tools.ts
export const tools: Tool[] = [
  {
    slug: "qr-generator",
    name: "QR Generator",
    description: "Genera códigos QR personalizados con el logo de tu marca.",
    href: "/tools/qr-generator",
    icon: "QrCode",
  },
  // Nueva herramienta:
  {
    slug: "mi-herramienta",           // kebab-case, único
    name: "Mi Herramienta",           // nombre visible en UI
    description: "Una frase corta que explica qué hace.",
    href: "/tools/mi-herramienta",    // debe coincidir con el slug
    icon: "NombreIconoLucide",        // ver sección de íconos más abajo
  },
];
```

---

## Paso 2 — Crear la página

```
app/tools/mi-herramienta/page.tsx
```

Plantilla mínima (usando el design system actual):

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MiHerramienta } from "@/components/mi-herramienta/MiHerramienta";

export const metadata: Metadata = {
  title: "Mi Herramienta",
  // Renderiza: "Mi Herramienta | GAFA Tools"
  description: "Descripción concisa para SEO y Open Graph.",
};

export default function MiHerramientaPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
      <div className="mb-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-[#9B9A95] transition-colors hover:text-[#3abeff]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span style={{ fontFamily: "var(--font-syne)" }}>Todas las herramientas</span>
        </Link>

        <div className="mt-5 flex items-end gap-4">
          <h1
            className="text-[1.75rem] font-extrabold leading-none tracking-tight text-[#0D0E0E] sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Mi Herramienta
          </h1>
          <span
            className="mb-0.5 hidden text-xs font-semibold uppercase tracking-[0.15em] text-[#9B9A95] sm:block"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Herramienta 0N
          </span>
        </div>
        <p className="mt-2 text-sm text-[#6B6A65]">
          Subtítulo breve de la herramienta.
        </p>
      </div>

      <MiHerramienta />
    </main>
  );
}
```

---

## Paso 3 — Crear los componentes

```
components/mi-herramienta/
├── MiHerramienta.tsx    ← orquestador principal, maneja estado
└── [SubComponentes].tsx ← un archivo por responsabilidad
```

Reglas:
- Todos los componentes con interactividad llevan `"use client"` en la primera línea.
- El orquestador (`MiHerramienta.tsx`) centraliza el estado y pasa props hacia abajo.
- Cada subcomponente recibe solo lo que necesita — sin acceso directo a estado global.

Plantilla del orquestador (layout de dos columnas con design system):

```tsx
"use client";

import { useState } from "react";

export function MiHerramienta() {
  const [valor, setValor] = useState("");

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
      {/* Panel de controles */}
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#E8E7E3] bg-white p-6 shadow-sm lg:max-w-sm">
        {/* subcomponentes de control */}
        <div className="h-px bg-[#E8E7E3]" /> {/* divisor entre secciones */}
        {/* botón de acción principal */}
        <button
          style={{ fontFamily: "var(--font-syne)" }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3abeff] px-4 py-3 text-sm font-bold text-[#0D0E0E] hover:bg-[#1a9fe8] hover:shadow-lg hover:shadow-[#3abeff]/20 disabled:opacity-40"
        >
          Acción principal
        </button>
      </div>

      {/* Panel de resultado */}
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-2xl border border-[#E8E7E3] bg-white p-6 shadow-sm">
          {/* resultado o preview */}
        </div>
      </div>
    </div>
  );
}
```

**Label de campo** (patrón estándar del design system):
```tsx
<label
  className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B9A95]"
  style={{ fontFamily: "var(--font-syne)" }}
>
  Nombre del campo
</label>
```

**Input de texto** (patrón estándar):
```tsx
<input
  type="text"
  className="w-full rounded-xl border border-[#E8E7E3] bg-white px-4 py-3 text-sm text-[#0D0E0E] outline-none placeholder:text-[#C8C7C2] focus:border-[#3abeff] focus:ring-2 focus:ring-[#3abeff]/15 transition-all"
/>
```

---

## Paso 4 — Crear hooks (si aplica)

Si la herramienta tiene lógica compleja de efectos secundarios o canvas, extraerla a un hook:

```
hooks/mi-herramienta/
└── useMiLogica.ts
```

```ts
"use client";

import { useEffect, useRef } from "react";

export function useMiLogica(/* params */) {
  // lógica aquí
  return { /* valores y funciones expuestos */ };
}
```

Las herramientas simples (sin canvas, sin efectos complejos) pueden prescindir de hooks propios.

---

## Paso 5 — Actualizar `iconMap` en `ToolCard.tsx`

`ToolCard.tsx` tiene un mapa estático de íconos. Si usaste un ícono nuevo en el paso 1, agrégalo:

```tsx
// components/ToolCard.tsx
import { QrCode, NuevoIcono, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  QrCode,
  NuevoIcono,   // ← agregar aquí
};
```

### Íconos disponibles recomendados

Usar nombres exactos de [lucide.dev](https://lucide.dev/icons/):

| Caso de uso | Nombre Lucide |
|---|---|
| QR / códigos | `QrCode` |
| Imágenes / fotos | `Image` |
| Texto / tipografía | `Type` |
| Paleta de colores | `Palette` |
| Enlace / URL | `Link` |
| Descarga | `Download` |
| Compresión / archivo | `FileArchive` |
| Conversión | `RefreshCw` |
| Calculadora | `Calculator` |
| Email | `Mail` |

---

## Paso 6 — Agregar escenarios al SPEC.md

Añadir una nueva sección al final de `SPEC.md` siguiendo el mismo formato de tabla:

```markdown
## N. Mi Herramienta

| ID    | Escenario | Resultado esperado |
|-------|-----------|--------------------|
| MI-01 | ... | ... |
| MI-02 | ... | ... |
```

Los IDs deben ser únicos en todo el documento. Usar las iniciales de la herramienta como prefijo.

---

## Paso 7 — Verificar

```bash
npm run lint      # sin errores ni warnings
npm run build     # sin errores TypeScript
npm run dev       # verificar en http://localhost:3000
```

Validar manualmente:
- La tarjeta aparece en el hub (`/`) con número ordinal correcto
- El link en el header lleva a la herramienta (y se marca activo)
- El botón "← Todas las herramientas" vuelve al hub
- El título del browser es `[Nombre] | GAFA Tools`
- La herramienta se ve correctamente en mobile (390px) — headline no desborda

---

## Estructura final esperada

```
app/tools/mi-herramienta/
└── page.tsx

components/mi-herramienta/
├── MiHerramienta.tsx
└── [SubComponentes].tsx

hooks/mi-herramienta/          ← solo si hay lógica compleja
└── useMiLogica.ts
```

Archivos modificados:
- `lib/tools.ts` — nueva entrada
- `components/ToolCard.tsx` — nuevo ícono en `iconMap` (si aplica)
- `SPEC.md` — nueva sección de escenarios
