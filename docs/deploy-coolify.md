# Deploy en Coolify con CI/CD desde GitHub

El flujo completo es:

```
push a main
    → GitHub Actions corre CI (lint + build)
    → si CI pasa, llama al webhook de Coolify
        → Coolify clona el repo, construye la imagen Docker y despliega
```

---

## Prerequisitos

- Repositorio en GitHub con el proyecto
- Instancia de Coolify corriendo en el VPS
- Acceso de admin a Coolify

---

## Paso 1 — Crear la aplicación en Coolify

1. En Coolify, ir a **Projects → New Project** (o usar uno existente)
2. Hacer clic en **+ New Resource → Application**
3. Seleccionar **GitHub** como fuente y autorizar el acceso al repositorio
4. Configurar:
   - **Branch:** `main`
   - **Build pack:** Docker (detecta el `Dockerfile` automáticamente)
   - **Port:** `3000`
5. Guardar sin hacer deploy todavía

---

## Paso 2 — Obtener el webhook de Coolify

1. Dentro de la aplicación recién creada, ir a la pestaña **General** o **Webhooks**
2. Buscar la sección **Deploy Webhook** — Coolify provee dos valores separados:
   - **URL del endpoint:** `https://tu-coolify.com/api/v1/deploy?uuid=APP_UUID`
   - **Token:** el valor que se envía como header de autenticación

---

## Paso 3 — Agregar los secrets en GitHub

1. En el repositorio de GitHub, ir a **Settings → Secrets and variables → Actions**
2. Crear **dos** secrets:

   | Name | Valor |
   |---|---|
   | `COOLIFY_WEBHOOK_URL` | URL del endpoint (`https://tu-coolify.com/api/v1/deploy?uuid=APP_UUID`) |
   | `COOLIFY_WEBHOOK_TOKEN` | Token de autenticación |

3. El workflow envía el token como header HTTP:
   ```
   Authorization: Bearer <COOLIFY_WEBHOOK_TOKEN>
   ```

---

## Paso 4 — Verificar el workflow

El archivo `.github/workflows/deploy.yml` ya está incluido en el repositorio. Al hacer push a `main`:

1. GitHub Actions inicia el job **Build & Lint**:
   - `npm ci` — instala dependencias
   - `npm run lint` — verifica ESLint
   - `npm run build` — verifica TypeScript y genera el build standalone

2. Si todo pasa, inicia el job **Deploy → Coolify**:
   - Llama al webhook con `curl`
   - Coolify recibe la señal y empieza a construir la nueva imagen Docker

3. En Coolify se puede ver el progreso en tiempo real en la pestaña **Deployments** de la aplicación

---

## Flujo en PRs

En pull requests solo corre el job de **CI** (lint + build). El deploy **no** se activa en PRs — solo en push directo a `main`.

Esto permite validar que el código compila antes de mergear, sin deployar ramas de trabajo.

---

## Variables de entorno en producción

Este proyecto no requiere variables de entorno — todo el procesamiento es client-side.

Si en el futuro una herramienta necesita secrets (API keys, etc.):
1. Agregarlos en Coolify: **Application → Environment Variables**
2. Coolify los inyecta en el contenedor en runtime
3. Para exponerlos al build de Next.js (prefijo `NEXT_PUBLIC_`), marcarlos como **Build Variable** en Coolify

---

## Troubleshooting

**El webhook falla con 401:**
El token es incorrecto o expiró. Regenerar el token en Coolify y actualizar el secret `COOLIFY_WEBHOOK_TOKEN` en GitHub.

**CI pasa pero Coolify no deployó:**
- Verificar en la pestaña Deployments de Coolify si recibió el trigger
- Revisar que ambos secrets (`COOLIFY_WEBHOOK_URL` y `COOLIFY_WEBHOOK_TOKEN`) están bien copiados, sin espacios al final
- Comprobar que el repositorio en Coolify apunta al branch `main`

**Build falla en Coolify pero pasa en CI:**
El CI usa Node 20 en Linux (igual que la imagen Docker), por lo que no debería haber diferencias. Revisar los logs de Coolify para ver el error exacto.

**`npm run build` falla en CI:**
El job muestra el error de TypeScript o ESLint. Corregirlo localmente antes de hacer push.

---

## Resumen de secrets necesarios

| Secret en GitHub | Valor |
|---|---|
| `COOLIFY_WEBHOOK_URL` | URL del endpoint de Coolify (`https://tu-coolify.com/api/v1/deploy?uuid=APP_UUID`) |
| `COOLIFY_WEBHOOK_TOKEN` | Token de autenticación (se envía como `Authorization: Bearer`) |
