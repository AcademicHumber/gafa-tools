# GAFA Tools

Plataforma de herramientas digitales gratuitas de [GAFA](https://gafa.com.bo), agencia web boliviana. Cada herramienta vive en su propia ruta y se registra en un catálogo central — el header, el hub y el footer se actualizan automáticamente al agregar una nueva.

## Herramientas disponibles

| Herramienta | Ruta | Descripción |
|---|---|---|
| QR Generator | `/tools/qr-generator` | Genera códigos QR con logo de branding, colores personalizados y descarga PNG |

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4**
- **Syne + DM Sans** — tipografía vía `next/font/google`
- **Lucide React** — íconos
- **qrcode** — generación de QR en canvas, 100% client-side
- **Docker** — imagen multi-stage para deploy en VPS vía Coolify

## Design system

El sistema de diseño vive en `app/globals.css` como CSS custom properties. Ver `CLAUDE.md` para la referencia completa.

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#FAFAF8` | Fondo del body |
| `--surface` | `#FFFFFF` | Cards y paneles |
| `--border` | `#E8E7E3` | Bordes sutiles |
| `--text-primary` | `#0D0E0E` | Texto principal |
| `--text-secondary` | `#6B6A65` | Texto secundario |
| `--text-muted` | `#9B9A95` | Labels y placeholders |
| `--accent` | `#3abeff` | Acento de marca GAFA |
| `--header-bg` | `#0D0E0E` | Header (fijo) |

**Tipografía:** `var(--font-syne)` para headlines y labels; `var(--font-dm-sans)` para body y UI.

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción + verificación de tipos
npm run lint       # ESLint
```

## Estructura del proyecto

```
app/
├── layout.tsx                  # Shell global: fuentes, SEO, Header, Footer
├── page.tsx                    # Hub: grid de tarjetas de herramientas
├── globals.css                 # Tokens de diseño (CSS custom properties)
├── api/health/route.ts         # GET /api/health — usado por el Docker healthcheck
└── tools/
    └── [slug]/
        └── page.tsx            # Página de cada herramienta

components/
├── Header.tsx                  # Navegación sticky oscura, hamburger en mobile
├── Footer.tsx                  # Footer global con copyright
├── ToolCard.tsx                # Tarjeta del hub (ícono, nombre, descripción, número)
└── [slug]/                     # Componentes de cada herramienta

hooks/
└── [slug]/                     # Hooks de cada herramienta

lib/
└── tools.ts                    # Registro central ← punto de entrada para nuevas herramientas

public/
├── favicon.png                 # Ícono "g" de GAFA
└── og-image.png                # Wordmark GAFA (header + Open Graph)

docs/
├── nueva-herramienta.md        # Guía para agregar herramientas
└── deploy-coolify.md           # Guía de deploy en Coolify con CI/CD
SPEC.md                         # Escenarios de validación funcional
```

## Agregar una herramienta nueva

Ver **[docs/nueva-herramienta.md](docs/nueva-herramienta.md)** para el checklist completo y las plantillas de código con el design system.

Pasos resumidos:
1. Registrar en `lib/tools.ts`
2. Crear `app/tools/[slug]/page.tsx`
3. Crear `components/[slug]/`
4. Crear `hooks/[slug]/` (si aplica)
5. Actualizar `iconMap` en `components/ToolCard.tsx`
6. Agregar escenarios a `SPEC.md`
7. Verificar con `npm run build` + `npm run lint`

## Seguridad

- Security headers en `next.config.ts`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- Upload de logo rechaza SVG y archivos >5MB
- El único API route (`/api/health`) no acepta parámetros

## Deploy

El proyecto incluye un `Dockerfile` multi-stage con `output: "standalone"`.

**Docker local:**
```bash
docker build -t gafa-tools .
docker run -p 3000:3000 gafa-tools
# → http://localhost:3000
```

**Variables de entorno críticas en el container:**
- `HOSTNAME=0.0.0.0` — ya configurada en el Dockerfile; fuerza a Next.js standalone a escuchar en todas las interfaces (sin esto, Docker sobreescribe HOSTNAME con el ID del container y el healthcheck falla)

**Coolify (VPS) con CI/CD automático:**

Ver **[docs/deploy-coolify.md](docs/deploy-coolify.md)** para la guía completa.

Secrets necesarios en GitHub:

| Secret | Descripción |
|---|---|
| `COOLIFY_WEBHOOK_URL` | URL del endpoint (`https://tu-coolify.com/api/v1/deploy?uuid=APP_UUID`) |
| `COOLIFY_WEBHOOK_TOKEN` | Token de autenticación (se envía como `Authorization: Bearer`) |

## Especificaciones funcionales

Ver [SPEC.md](SPEC.md) para los escenarios de validación por herramienta y plataforma.
