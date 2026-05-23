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

Plantilla mínima:

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
    <main className="flex flex-col items-center px-6 py-12">
      <div className="mb-10 w-full max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Todas las herramientas
        </Link>
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Mi Herramienta
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Subtítulo breve de la herramienta
          </p>
        </div>
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

Plantilla del orquestador:

```tsx
"use client";

import { useState } from "react";

export function MiHerramienta() {
  // Estado centralizado aquí
  const [valor, setValor] = useState("");

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8 md:flex-row">
      {/* Panel de controles */}
      <div className="flex w-full flex-col gap-5 md:max-w-xs">
        {/* subcomponentes */}
      </div>

      {/* Panel de resultado / preview */}
      <div className="flex flex-1 items-center justify-center">
        {/* resultado */}
      </div>
    </div>
  );
}
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
npm run build     # debe completar sin errores TypeScript
npm run dev       # verificar en http://localhost:3000
```

Validar manualmente:
- La tarjeta aparece en el hub (`/`)
- El link en el header lleva a la herramienta
- El botón "← Todas las herramientas" vuelve al hub
- El título del browser es `[Nombre] | GAFA Tools`

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
