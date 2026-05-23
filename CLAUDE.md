@AGENTS.md

# GAFA Tools — contexto del proyecto

Plataforma de herramientas digitales de GAFA (agencia web boliviana, [gafa.com.bo](https://gafa.com.bo)). El objetivo es acumular herramientas independientes bajo un mismo shell de navegación. Cada herramienta es autocontenida; el header y el hub se generan desde un registro central.

## CI/CD

El workflow `.github/workflows/deploy.yml` tiene dos jobs:
- **ci** — corre en todo push y PR: `npm ci` + `npm run lint` + `npm run build`
- **deploy** — solo en push a `main` después de que ci pase: llama al webhook `COOLIFY_WEBHOOK_URL` (secret en GitHub)

Al agregar una herramienta nueva, el CI valida automáticamente que el build no se rompe antes de deployar.

## Archivos críticos

| Archivo | Rol |
|---|---|
| `lib/tools.ts` | Fuente de verdad de todas las herramientas — modificar aquí para registrar o editar una tool |
| `app/layout.tsx` | Shell global: metadata SEO, template de títulos, Header |
| `app/page.tsx` | Hub: genera el grid de tarjetas desde `lib/tools.ts` |
| `components/Header.tsx` | Navegación sticky oscura (`#0d0e0e`), hamburger mobile, link a gafa.com.bo |
| `components/ToolCard.tsx` | Tarjeta del hub — contiene `iconMap`, actualizar al agregar íconos Lucide nuevos |
| `SPEC.md` | Escenarios de validación funcional de toda la plataforma |
| `docs/nueva-herramienta.md` | Guía paso a paso para agregar herramientas — leer antes de crear una nueva |

## Convenciones

**Estructura de carpetas por slug** — todo lo de una herramienta va bajo su slug:
```
app/tools/[slug]/page.tsx
components/[slug]/ComponentePrincipal.tsx
hooks/[slug]/useLogica.ts          ← solo si hay lógica compleja
```
Nunca mezclar archivos de herramientas distintas en la misma carpeta.

**Registro central** — la única forma de hacer que una herramienta aparezca en el hub y el header es añadirla al array en `lib/tools.ts`. No hay magia de auto-discovery.

**Íconos** — el campo `icon` en `lib/tools.ts` debe ser un nombre exacto de Lucide React. Importar el ícono y añadirlo al `iconMap` en `components/ToolCard.tsx`.

**SEO** — cada `app/tools/[slug]/page.tsx` exporta `metadata` con `title` y `description`. El `title` se combina automáticamente con el template `%s | GAFA Tools` definido en `app/layout.tsx`.

**Client-side first** — las herramientas actuales procesan todo en el browser. Preferir este enfoque; crear API routes solo cuando sea estrictamente necesario (ej. la lógica requiere secrets o acceso a servidor).

**Estilo del header** — siempre oscuro (`bg-[#0d0e0e]`), nunca añadir dark mode toggle ni cambiar el fondo. El body es siempre blanco (`bg-white`).

**Sin dark mode en contenido** — el header tiene su propio esquema oscuro fijo. El contenido de las páginas usa colores zinc claros. No añadir `dark:` variants nuevos salvo que sea esencial.

## Para agregar una herramienta nueva

Seguir el checklist en `docs/nueva-herramienta.md`. Contiene plantillas de código listas para usar.

Pasos resumidos:
1. `lib/tools.ts` — nueva entrada con slug, name, description, href, icon
2. `app/tools/[slug]/page.tsx` — página con metadata, botón back, componente principal
3. `components/[slug]/` — orquestador + subcomponentes
4. `hooks/[slug]/` — si la lógica lo justifica
5. `components/ToolCard.tsx` — importar y añadir el ícono al `iconMap`
6. `SPEC.md` — sección nueva con escenarios de validación
7. `npm run build` — verificar que no hay errores

## Lo que NO hacer

- No poner lógica de una herramienta en `components/Header.tsx` o `components/ToolCard.tsx`
- No crear rutas fuera de `app/tools/[slug]/`
- No usar `any` en TypeScript
- No instalar dependencias globales para necesidades de una sola herramienta sin justificación clara
- No modificar `app/layout.tsx` para casos específicos de una herramienta — usar `metadata` local en la page
- No alterar el esquema de colores del header (`#0d0e0e`)
