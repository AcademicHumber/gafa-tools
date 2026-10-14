"""Traduce un evento de GitHub Actions a un mensaje de Discord.

Avisa cinco cosas: PR abierto, PR mergeado y los comentarios "Listo para QA
en staging", "QA conforme" y "QA observado" en un Issue. Lee el evento de
GITHUB_EVENT_NAME / GITHUB_EVENT_PATH y la configuración de las variables
DISCORD_* que pone action.yml. Si el evento no amerita aviso, no hace nada. Un error al publicar se informa como warning y no
hace fallar el job. Solo usa la librería estándar.
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

AZUL, VERDE, VIOLETA, ROJO = 0x3ABEFF, 0x2ECC71, 0x9B59B6, 0xE74C3C

MARCA_QA = re.compile(r"^[\s*_>#]*(listo para qa|qa conforme|qa observado)", re.IGNORECASE)


def env_json(nombre):
    valor = os.environ.get(nombre, "").strip()
    return json.loads(valor) if valor else {}


def env_lista(nombre):
    return [x.strip() for x in os.environ.get(nombre, "").split(",") if x.strip()]


USUARIOS = env_json("DISCORD_USUARIOS")
REVISORES = env_lista("DISCORD_REVISORES")
EQUIPO_QA = env_lista("DISCORD_QA")
PRODUCCION = env_lista("DISCORD_PRODUCCION")
ENTORNOS = env_json("DISCORD_ENTORNOS")


def nombre(login):
    """Mención de Discord si el login está mapeado; si no, @login."""
    return f"<@{USUARIOS[login]}>" if login in USUARIOS else f"@{login}"


class Aviso:
    def __init__(self, titulo, url, color, descripcion="", mencionar=(), excluir=None):
        self.titulo, self.url, self.color, self.descripcion = titulo, url, color, descripcion
        # Nadie recibe una mención por algo que hizo él mismo.
        self.mencionar = [l for l in dict.fromkeys(mencionar) if l and l != excluir]


def evento_pr(ev, accion):
    pr = ev["pull_request"]
    n, titulo, url, autor = pr["number"], pr["title"], pr["html_url"], pr["user"]["login"]
    base, principal = pr["base"]["ref"], ev["repository"]["default_branch"]

    if accion in ("opened", "ready_for_review"):
        if pr["draft"]:
            return None
        lineas = [f"De {nombre(autor)} · `{pr['head']['ref']}` → `{base}`"]
        if base in ENTORNOS and base != principal:
            lineas.append(f"🚀 Promoción: al mergear se despliega en **{ENTORNOS[base]}**.")
        elif base != principal:
            lineas.append(f"📚 Apilado sobre `{base}`: se mergea después del PR de abajo.")
        revisores = [r for r in REVISORES if r != autor]
        if revisores:
            lineas.append("Revisa: " + ", ".join(nombre(r) for r in revisores))
        return Aviso(f"🆕 PR #{n} · {titulo}", url, AZUL, "\n".join(lineas), revisores, autor)

    if accion == "closed" and pr["merged"]:
        quien = pr["merged_by"]["login"] if pr.get("merged_by") else autor
        lineas = [f"{nombre(quien)} lo mergeó en `{base}`."]
        if base in ENTORNOS:
            lineas.append(f"🚀 Se despliega en **{ENTORNOS[base]}**: el aviso de deploy llega desde Coolify.")
        elif base != principal:
            lineas.append(f"⚠️ No entró a `{principal}`: si `{base}` era la rama de otro PR ya mergeado, este cambio quedó afuera.")
        return Aviso(f"🔀 PR #{n} mergeado · {titulo}", url, VERDE, "\n".join(lineas), [autor], quien)

    return None


def evento_comentario(ev):
    issue, com = ev["issue"], ev["comment"]
    m = MARCA_QA.match(com["body"])
    if "pull_request" in issue or not m:
        return None
    quien = com["user"]["login"]
    cab = f"#{issue['number']} · {issue['title']}"

    marca = m.group(1).lower()
    implementaron = [a["login"] for a in issue.get("assignees", [])]

    if marca == "qa observado":
        # Vuelve a quien implementó, con los defectos que enlaza la plantilla ("Defectos: #N").
        lineas = [f"{nombre(quien)} encontró criterios que no se cumplen en staging."]
        defectos = re.search(r"^Defectos:[ \t]*(.*#\d.*)$", com["body"], re.M | re.I)
        if defectos:
            lineas.append(f"Defectos: {defectos.group(1).strip()}")
        a_corregir = [i for i in implementaron if i != quien]
        if a_corregir:
            lineas.append("Vuelve a: " + ", ".join(nombre(i) for i in a_corregir))
        return Aviso(f"⚠️ QA observado · {cab}", com["html_url"], ROJO,
                     "\n".join(lineas), a_corregir, quien)

    if marca == "qa conforme":
        # Con la conformidad, QA archiva el change y la historia entra en la próxima promoción.
        lineas = [f"{nombre(quien)} verificó todos los criterios en staging."]
        promueven = [p for p in PRODUCCION if p != quien]
        if promueven:
            lineas.append("Lista para la próxima promoción a producción: " + ", ".join(nombre(p) for p in promueven))
        return Aviso(f"✅ QA conforme · {cab}", com["html_url"], VERDE,
                     "\n".join(lineas), promueven + implementaron, quien)

    lineas = [f"{nombre(quien)} lo dejó listo en staging."]
    qa = [q for q in EQUIPO_QA if q != quien]
    if qa:
        lineas.append("A verificar: " + ", ".join(nombre(q) for q in qa))
    return Aviso(f"🧪 Listo para QA · {cab}", com["html_url"], VIOLETA,
                 "\n".join(lineas), qa, quien)


def publicar(aviso):
    ids = [USUARIOS[l] for l in aviso.mencionar if l in USUARIOS]
    cuerpo = {
        "content": " ".join(f"<@{i}>" for i in ids),
        "allowed_mentions": {"parse": [], "users": ids},
        "embeds": [{
            "title": aviso.titulo[:256],
            "url": aviso.url,
            "description": aviso.descripcion[:4000],
            "color": aviso.color,
            "footer": {"text": os.environ["GITHUB_REPOSITORY"]},
        }],
    }
    datos = json.dumps(cuerpo).encode()
    for _ in range(3):
        req = urllib.request.Request(os.environ["DISCORD_WEBHOOK"], data=datos, method="POST", headers={
            "Content-Type": "application/json", "User-Agent": "gafa-tools/discord-notificar"})
        try:
            urllib.request.urlopen(req).close()
            print(f"Publicado: {aviso.titulo}")
            return
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(json.load(e).get("retry_after", 1) + 0.1)
                continue
            print(f"::warning::Discord respondió {e.code}: {e.read().decode()[:300]}")
            return
    print("::warning::Discord siguió limitando la tasa; no se publicó.")


def main():
    if not os.environ.get("DISCORD_WEBHOOK"):
        print("::warning::Falta el webhook de Discord (¿secreto sin configurar?); no se publica nada.")
        return
    nombre_evento = os.environ["GITHUB_EVENT_NAME"]
    with open(os.environ["GITHUB_EVENT_PATH"], encoding="utf-8") as f:
        ev = json.load(f)
    accion = ev.get("action")

    if nombre_evento == "pull_request":
        aviso = evento_pr(ev, accion)
    elif nombre_evento == "issue_comment" and accion == "created":
        aviso = evento_comentario(ev)
    else:
        aviso = None

    if aviso:
        publicar(aviso)
    else:
        print(f"Sin aviso para {nombre_evento}/{accion}.")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # un aviso que falla no debe marcar en rojo el PR
        print(f"::warning::No se pudo procesar el evento: {e!r}")
        sys.exit(0)
