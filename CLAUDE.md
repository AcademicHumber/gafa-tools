@AGENTS.md

# GAFA Tools — contexto del proyecto

Plataforma de herramientas digitales de GAFA (agencia web boliviana, [gafa.com.bo](https://gafa.com.bo)). El objetivo es acumular herramientas independientes bajo un mismo shell de navegación. Cada herramienta es autocontenida; el header y el hub se generan desde un registro central.

## Design system

El sistema de diseño está definido en `app/globals.css` como CSS custom properties. Usar siempre estas variables — no hardcodear colores en los componentes salvo los del header (que tienen su propio esquema fijo).

### Tokens de color

| Variable | Valor | Uso |
|---|---|---|
| `--bg` | `#FAFAF8` | Fondo del body (crema cálido) |
| `--surface` | `#FFFFFF` | Fondo de cards y paneles |
| `--border` | `#E8E7E3` | Bordes sutiles |
| `--border-strong` | `#C8C7C2` | Bordes con más peso |
| `--text-primary` | `#0D0E0E` | Texto principal |
| `--text-secondary` | `#6B6A65` | Texto secundario |
| `--text-muted` | `#9B9A95` | Labels, placeholders, texto de apoyo |
| `--accent` | `#3abeff` | Color de marca GAFA — CTAs, estados activos, focus |
| `--accent-dark` | `#1a9fe8` | Hover del acento |
| `--header-bg` | `#0D0E0E` | Fondo del header (fijo, no usar en contenido) |

El acento `#3abeff` aparece en: link activo del header, botón de descarga, focus de inputs, hover de cards, label de tamaño del logo. No usarlo en texto secundario.

### Tipografía

| Variable | Fuente | Uso |
|---|---|---|
| `var(--font-syne)` | Syne (400–800) | Headlines, labels uppercase, nav links, botones |
| `var(--font-dm-sans)` | DM Sans | Body, descripciones, inputs, texto de UI |

Patrón de label de sección (aplicar consistentemente en nuevas herramientas):
```tsx
<label
  className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B9A95]"
  style={{ fontFamily: "var(--font-syne)" }}
>
  Nombre del campo
</label>
```

### Componentes base reutilizables

- **Card/panel de controles**: `rounded-2xl border border-[#E8E7E3] bg-white p-6 shadow-sm`
- **Input de texto**: `rounded-xl border border-[#E8E7E3] bg-white px-4 py-3 text-sm focus:border-[#3abeff] focus:ring-2 focus:ring-[#3abeff]/15`
- **Botón primario (acento)**: `rounded-xl bg-[#3abeff] px-4 py-3 text-sm font-bold text-[#0D0E0E] hover:bg-[#1a9fe8] hover:shadow-lg hover:shadow-[#3abeff]/20`
- **Botón back**: `inline-flex items-center gap-2 text-sm text-[#9B9A95] hover:text-[#3abeff]`

## CI/CD

El workflow `.github/workflows/deploy.yml` tiene dos jobs:
- **ci** — corre en todo push y PR: `npm ci` + `npm run lint` + `npm run build`
- **deploy** — solo en push a `main` después de que ci pase: llama al webhook con `Authorization: Bearer COOLIFY_WEBHOOK_TOKEN` a `COOLIFY_WEBHOOK_URL`

Secrets necesarios en GitHub: `COOLIFY_WEBHOOK_URL` y `COOLIFY_WEBHOOK_TOKEN` (por separado).

## Docker / Healthcheck

El Dockerfile usa multi-stage (deps → builder → runner en Alpine). Dos variables de entorno críticas en el runner:
- `NODE_ENV=production`
- `HOSTNAME=0.0.0.0` — **obligatorio**: Next.js standalone lee esta variable para determinar la interfaz de escucha. Sin ella, Docker la sobreescribe con el hostname del container y el servidor no escucha en localhost.

El healthcheck usa `127.0.0.1` explícito (no `localhost`) porque en Alpine con musl libc, `localhost` puede resolver a `::1` (IPv6) antes que `127.0.0.1` (IPv4), causando "Connection refused".

## Archivos críticos

| Archivo | Rol |
|---|---|
| `lib/tools.ts` | Fuente de verdad de todas las herramientas |
| `app/globals.css` | Tokens de diseño (CSS custom properties) + configuración tipográfica |
| `app/layout.tsx` | Shell global: fuentes, metadata SEO, Header, Footer |
| `app/page.tsx` | Hub: genera el grid de tarjetas desde `lib/tools.ts` |
| `components/Header.tsx` | Navegación sticky oscura (`#0d0e0e`), hamburger mobile, link a gafa.com.bo |
| `components/Footer.tsx` | Footer global con copyright y "Hecho en Bolivia" |
| `components/ToolCard.tsx` | Tarjeta del hub — contiene `iconMap`, actualizar al agregar íconos Lucide nuevos |
| `next.config.ts` | Security headers (X-Frame-Options, CSP parcial, etc.) + output standalone |
| `SPEC.md` | Escenarios de validación funcional de toda la plataforma |
| `docs/nueva-herramienta.md` | Guía paso a paso para agregar herramientas |
| `docs/deploy-coolify.md` | Guía de deploy en Coolify con CI/CD |

## Convenciones

**Estructura de carpetas por slug** — todo lo de una herramienta va bajo su slug:
```
app/tools/[slug]/page.tsx
components/[slug]/ComponentePrincipal.tsx
hooks/[slug]/useLogica.ts          ← solo si hay lógica compleja
```
Nunca mezclar archivos de herramientas distintas en la misma carpeta.

**Registro central** — la única forma de hacer que una herramienta aparezca en el hub y el header es añadirla al array en `lib/tools.ts`. No hay auto-discovery.

**Íconos** — el campo `icon` en `lib/tools.ts` debe ser un nombre exacto de Lucide React. Importar el ícono y añadirlo al `iconMap` en `components/ToolCard.tsx`.

**SEO** — cada `app/tools/[slug]/page.tsx` exporta `metadata` con `title` y `description`. El `title` se combina automáticamente con el template `%s | GAFA Tools` definido en `app/layout.tsx`.

**Client-side first** — las herramientas actuales procesan todo en el browser. Preferir este enfoque; crear API routes solo cuando sea estrictamente necesario.

**Esquema de color fijo** — el header siempre es `#0d0e0e`. El body siempre es `var(--bg)` = `#FAFAF8`. No añadir dark mode toggle ni usar `dark:` variants en el contenido de las páginas.

## Seguridad

- `next.config.ts` aplica security headers a todas las rutas: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- `LogoUploader` rechaza SVG (riesgo de canvas tainted) y archivos >5MB
- `useQRCanvas.downloadPNG` tiene try/catch para `SecurityError` de canvas tainted
- El único API route es `GET /api/health` — no acepta parámetros, sin side effects

## Para agregar una herramienta nueva

Seguir el checklist en `docs/nueva-herramienta.md`. Contiene plantillas de código actualizadas con el design system.

Pasos resumidos:
1. `lib/tools.ts` — nueva entrada con slug, name, description, href, icon
2. `app/tools/[slug]/page.tsx` — página con metadata, botón back (estilo acento), componente principal
3. `components/[slug]/` — orquestador + subcomponentes usando los tokens de diseño
4. `hooks/[slug]/` — si la lógica lo justifica
5. `components/ToolCard.tsx` — importar y añadir el ícono al `iconMap`
6. `SPEC.md` — sección nueva con escenarios de validación
7. `npm run build` + `npm run lint` — sin errores

## Lo que NO hacer

- No hardcodear colores fuera de los tokens de `globals.css` (excepto los del header)
- No poner lógica de una herramienta en `components/Header.tsx`, `components/ToolCard.tsx` o `components/Footer.tsx`
- No crear rutas fuera de `app/tools/[slug]/`
- No usar `any` en TypeScript
- No aceptar SVG en uploads de usuario (riesgo de canvas tainted)
- No instalar dependencias globales para necesidades de una sola herramienta sin justificación
- No modificar `app/layout.tsx` para casos específicos de una herramienta — usar `metadata` local en la page
- No alterar `HOSTNAME=0.0.0.0` ni el healthcheck en el Dockerfile sin entender las implicancias
