# Avisos a Discord

Acción compuesta que publica en un canal de Discord los eventos de un repo de GAFA, siguiendo el flujo de trabajo de la agencia. No necesita servidor ni bot: usa un webhook del canal y la librería estándar de Python del runner.

Este repo es público: la acción es genérica y no guarda nada de los proyectos. Los nombres, el canal y las menciones se configuran en el repo de cada proyecto.

## Qué avisa

| Evento en GitHub | Aviso | Menciona a |
|---|---|---|
| PR abierto, o pasa de borrador a listo | 🆕 PR abierto; marca si está apilado sobre otro PR o si es una promoción a un entorno (`entornos`) | `revisores` |
| PR mergeado | 🔀 y a qué entorno se despliega; ⚠️ si no entró a la rama principal | autor del PR |
| Comentario en un Issue que empieza con **Listo para QA en staging** (también con `###` o `**` delante) | 🧪 | `qa` |
| Comentario en un Issue que empieza con **QA conforme** | ✅ la historia queda lista para la próxima promoción a producción | `produccion` y asignados del Issue |
| Comentario en un Issue que empieza con **QA observado** | ⚠️ con los defectos de la línea `Defectos: #N` | asignados del Issue |

Nadie recibe una mención por algo que hizo él mismo. Los borradores, los PRs cerrados sin merge y los demás comentarios no avisan.

Los deploys no los avisa esta acción: los avisa Coolify con sus notificaciones de Discord, porque es el único que sabe si un deploy (automático o manual) salió bien.

## Cómo usarla en un proyecto

1. En Discord, crear un webhook en el canal del proyecto y guardarlo en el repo como secreto `DISCORD_WEBHOOK`.
2. (Opcional) Guardar como variable del repo `DISCORD_USUARIOS` el mapa de logins de GitHub a IDs de Discord, para que las menciones notifiquen: `{"login": "123456789012345678"}`. El ID se copia en Discord con el modo desarrollador activado (clic derecho en el usuario → *Copiar ID*). Sin el mapa, los avisos muestran `@login` y no notifican.
3. Agregar `.github/workflows/discord.yml`:

```yaml
name: Avisos a Discord

on:
  pull_request:
    types: [opened, ready_for_review, closed]
  issue_comment:
    types: [created]

permissions:
  contents: read

jobs:
  avisar:
    # Filtra antes de levantar el runner (no gasta minutos de Actions): PRs
    # cerrados sin merge y comentarios que no son "Listo para QA", "QA conforme"
    # ni "QA observado".
    if: >-
      (github.event_name == 'pull_request' &&
        (github.event.action != 'closed' || github.event.pull_request.merged)) ||
      (github.event_name == 'issue_comment' && !github.event.issue.pull_request &&
        (contains(github.event.comment.body, 'Listo para QA') ||
          contains(github.event.comment.body, 'QA conforme') ||
          contains(github.event.comment.body, 'QA observado')))
    runs-on: ubuntu-latest
    steps:
      - uses: AcademicHumber/gafa-tools/.github/actions/discord-notificar@main
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          usuarios: ${{ vars.DISCORD_USUARIOS }}
          revisores: login-del-revisor
          qa: login-de-qa
          produccion: login-de-quien-promueve
          entornos: '{"main": "staging", "prod": "producción"}'
```

Los PRs que vienen de forks no tienen acceso al secreto: la acción deja un warning y no publica nada. Un error al publicar tampoco hace fallar el job.

## Probarla en local

`notificar.py` lee el evento de `GITHUB_EVENT_NAME` y `GITHUB_EVENT_PATH` (un JSON con el payload del evento) y la configuración de `DISCORD_WEBHOOK`, `DISCORD_USUARIOS`, `DISCORD_REVISORES`, `DISCORD_QA`, `DISCORD_PRODUCCION`, `DISCORD_ENTORNOS` y `GITHUB_REPOSITORY`. Con un webhook de un canal de pruebas se puede correr a mano.
