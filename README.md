# GAFA Tools

Plataforma de herramientas digitales gratuitas de [GAFA](https://gafa.com.bo), agencia web boliviana. Cada herramienta vive en su propia ruta y se registra en un catálogo central — el header y el hub se actualizan automáticamente al agregar una nueva.

## Herramientas disponibles

| Herramienta | Ruta | Descripción |
|---|---|---|
| QR Generator | `/tools/qr-generator` | Genera códigos QR con logo de branding, colores personalizados y descarga PNG |

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4**
- **Lucide React** — íconos
- **qrcode** — generación de QR en canvas, 100% client-side
- **Docker** — imagen multi-stage para deploy en VPS vía Coolify

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
├── layout.tsx                  # Shell global: Header + metadata SEO
├── page.tsx                    # Hub: grid de tarjetas de herramientas
└── tools/
    └── [slug]/
        └── page.tsx            # Página de cada herramienta

components/
├── Header.tsx                  # Navegación sticky oscura, hamburger en mobile
├── ToolCard.tsx                # Tarjeta del hub (ícono, nombre, descripción)
└── [slug]/                     # Componentes de cada herramienta

hooks/
└── [slug]/                     # Hooks de cada herramienta

lib/
└── tools.ts                    # Registro central ← punto de entrada para nuevas herramientas

public/
├── favicon.png                 # Ícono "g" de GAFA
└── og-image.png                # Wordmark GAFA (header + Open Graph)

docs/
└── nueva-herramienta.md        # Guía para agregar herramientas
SPEC.md                         # Escenarios de validación funcional
```

## Agregar una herramienta nueva

Ver **[docs/nueva-herramienta.md](docs/nueva-herramienta.md)** para el checklist completo y las plantillas de código.

Resumen de los pasos:
1. Registrar en `lib/tools.ts`
2. Crear `app/tools/[slug]/page.tsx`
3. Crear `components/[slug]/`
4. Crear `hooks/[slug]/` (si aplica)
5. Actualizar `iconMap` en `components/ToolCard.tsx`
6. Agregar escenarios a `SPEC.md`
7. Verificar con `npm run build`

## Deploy

El proyecto incluye un `Dockerfile` multi-stage. El `next.config.ts` usa `output: "standalone"`.

**Docker local:**
```bash
docker build -t gafa-tools .
docker run -p 3000:3000 gafa-tools
# → http://localhost:3000
```

**Coolify (VPS) con CI/CD automático:**

Ver **[docs/deploy-coolify.md](docs/deploy-coolify.md)** para la guía completa.

Resumen:
1. Crear la app en Coolify apuntando al repo, puerto `3000`
2. Copiar el webhook URL de Coolify
3. Agregarlo como secret `COOLIFY_WEBHOOK_URL` en GitHub → Settings → Secrets
4. Listo — cada push a `main` corre lint + build y, si pasan, dispara el deploy automáticamente

## Especificaciones funcionales

Ver [SPEC.md](SPEC.md) para los escenarios de validación por herramienta.
