# Especificaciones Funcionales — GAFA Tools

## 0. Plataforma / Navegación

| ID     | Escenario | Resultado esperado |
|--------|-----------|--------------------|
| NAV-01 | Visitar `/` | Se muestra el hub con tarjetas de herramientas disponibles |
| NAV-02 | Tarjeta "QR Generator" visible en el hub | Muestra nombre, descripción e ícono de la herramienta |
| NAV-03 | Click en tarjeta "QR Generator" | Navega a `/tools/qr-generator` |
| NAV-04 | Header visible en todas las páginas | Logo GAFA + links de herramientas + botón "Visitar gafa.com.bo" |
| NAV-05 | Link activo en el header | El link de la herramienta actual aparece resaltado |
| NAV-06 | Click en logo GAFA del header | Navega a `/` (hub) |
| NAV-07 | Click en botón "Visitar gafa.com.bo" | Abre https://gafa.com.bo en nueva pestaña |
| NAV-08 | Navegar directamente a `/tools/qr-generator` por URL | Carga la herramienta correctamente sin pasar por el hub |

## 1. Generación básica de QR

| ID    | Escenario | Resultado esperado |
|-------|-----------|--------------------|
| QR-01 | Ingresar una URL válida (ej. https://example.com) | Se genera y muestra un QR en tiempo real |
| QR-02 | Ingresar una URL con parámetros (ej. https://x.com?foo=bar) | QR generado correctamente, URL codificada completa |
| QR-03 | Ingresar texto sin protocolo (ej. example.com) | QR generado (el texto se codifica tal cual) |
| QR-04 | Campo URL vacío | No se genera QR; se muestra placeholder con instrucción |
| QR-05 | Modificar la URL mientras el QR está visible | QR se actualiza en tiempo real (debounce ~300ms) |

## 2. Personalización de colores

| ID     | Escenario | Resultado esperado |
|--------|-----------|--------------------|
| COL-01 | Cambiar color de foreground (módulos del QR) | QR se re-renderiza con el nuevo color |
| COL-02 | Cambiar color de background | Fondo del QR cambia al nuevo color |
| COL-03 | Foreground y background con el mismo color | El QR se vuelve ilegible — comportamiento esperado, sin crash |
| COL-04 | Valor hexadecimal del color se muestra junto al picker | Confirmación visual del color seleccionado |

## 3. Logo / imagen de branding

| ID      | Escenario | Resultado esperado |
|---------|-----------|--------------------|
| LOGO-01 | Subir un PNG con fondo transparente | Logo aparece centrado en el QR con fondo blanco de padding |
| LOGO-02 | Subir un JPG opaco | Logo aparece centrado correctamente |
| LOGO-03 | Subir un SVG | Logo aparece centrado (si el browser soporta SVG en canvas) |
| LOGO-04 | Subir una imagen de alta resolución (>2MB) | El logo se escala proporcionalmente, sin deformar el QR |
| LOGO-05 | Subir un archivo que no es imagen (ej. PDF) | Se rechaza silenciosamente; la app no se rompe |
| LOGO-06 | Quitar el logo después de haberlo añadido | El QR vuelve a mostrarse sin logo |
| LOGO-07 | Logo con tamaño por defecto (20% del QR) | El QR sigue siendo escaneable por la cámara |
| LOGO-08 | Logo que supera el 30% del QR | Se muestra advertencia en la UI; el QR puede fallar al escanear |
| LOGO-09 | Arrastrar y soltar una imagen sobre la zona de upload | Logo se carga igual que si se seleccionara con el file picker |

## 4. Descarga

| ID    | Escenario | Resultado esperado |
|-------|-----------|--------------------|
| DL-01 | Descargar QR sin logo | Se descarga un PNG nítido con solo el código QR |
| DL-02 | Descargar QR con logo | El PNG incluye el logo centrado tal como se ve en el preview |
| DL-03 | Descargar QR con colores personalizados | Los colores del PNG coinciden con los del preview |
| DL-04 | Clic en descargar con campo URL vacío | Botón deshabilitado; no se descarga nada |

## 5. Legibilidad del QR (validación manual con cámara)

| ID      | Escenario | Resultado esperado |
|---------|-----------|--------------------|
| SCAN-01 | QR básico sin logo | Cámara de iOS y Android lo lee correctamente |
| SCAN-02 | QR con logo al 20% | Cámara lo lee correctamente (corrección de error H activa) |
| SCAN-03 | QR con colores de alto contraste (no negro/blanco) | Cámara lo lee (depende del contraste; documentar si falla) |
| SCAN-04 | QR con colores de bajo contraste | Puede fallar al escanear — comportamiento esperado |

## 6. Docker / Deploy

| ID     | Escenario | Resultado esperado |
|--------|-----------|--------------------|
| DOC-01 | `docker build -t qr-generator .` | Build exitoso sin errores |
| DOC-02 | `docker run -p 3000:3000 qr-generator` | App disponible en http://localhost:3000 |
| DOC-03 | Deploy en Coolify apuntando al repo | App disponible en el dominio configurado |
| DOC-04 | Rebuild en Coolify tras push a main | Nueva versión desplegada sin downtime |
