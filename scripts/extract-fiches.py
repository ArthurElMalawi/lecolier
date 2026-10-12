"""
Extrait les fiches produit PDF (une par référence) vers lib/fiches.generated.ts
et leur visuel produit vers public/fiches/<ref>.webp.

    pip install pymupdf pillow
    python scripts/extract-fiches.py "<dossier Fiche_Produit_*.pdf>" [--write]

Sans --write : affiche seulement le rapport (écarts avec nos références, fiches sans visuel).

Seules les références présentées par le site (scripts/displayed-refs.mts) sont gardées :
le site porte les références à jour, une fiche hors site est ignorée.

Les PDF ne font PAS foi : nos valeurs (product-refs.ts, classement-refs.ts, saisies
d'après les images) l'emportent. Les écarts connus sont corrigés par OVERRIDES
ci-dessous ; le rapport signale tout nouvel écart sur les cahiers.
"""
import io, json, pathlib, re, subprocess, sys
import pymupdf
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_TS = ROOT / "lib" / "fiches.generated.ts"
OUT_IMG = ROOT / "public" / "fiches"

# Nos valeurs, prioritaires sur le PDF (champ -> valeur).
OVERRIDES: dict[str, dict] = {
    # Copies doubles non perforées : le PDF inverse les formats (vérifié sur les images).
    "44753": {"format": "21 x 29,7 cm (A4)", "designation": "COPIES DOUBLES 21X29,7 70GR 200P SEYES 3C NON PERFORÉES"},
    "44754": {"format": "17 x 22 cm", "designation": "COPIES DOUBLES 17X22 70GR 200P SEYES 3C NON PERFORÉES"},
    # Sacs kraft : dimensions du site.
    "49818": {"format": "20 x 26 x 12 cm"},
    "49820": {"format": "30 x 38 x 14 cm"},
    "49822": {"format": "38 x 40 x 16 cm"},
    # Cahiers de recherche 192/288 p : Seyès chez nous.
    "47936": {"reglure": "Seyès Grand Carreaux"},
    "47939": {"reglure": "Seyès Grand Carreaux"},
    # Musique et chant : uni chez nous.
    "48325": {"reglure": "Blanc Uni"},
    "48326": {"reglure": "Blanc Uni"},
}

# Corrections de forme, appliquées partout.
def tidy(v: str | None) -> str | None:
    if not v:
        return None
    v = re.sub(r"\bIncolor\b", "Incolore", v)
    v = v.replace("Séyès", "Seyès")
    v = re.sub(r"^1 unités$", "1 unité", v)
    return v


def clean(t: str) -> str:
    return re.sub(r"\s+", " ", t.replace("\xa0", " ")).strip()


def spans(page):
    for b in page.get_text("dict")["blocks"]:
        for line in b.get("lines", []):
            for s in line["spans"]:
                t = clean(s["text"])
                if t:
                    yield s["bbox"][0], s["bbox"][1], s["bbox"][2], t


def rows(items):
    """Regroupe les spans par ligne (même ordonnée à 3 pt près)."""
    out: list[tuple[float, list]] = []
    for x0, y, x1, t in sorted(items, key=lambda s: (round(s[1]), s[0])):
        if out and abs(out[-1][0] - y) < 3:
            out[-1][1].append((x0, x1, t))
        else:
            out.append((y, [(x0, x1, t)]))
    return out


# (section, libellé) du PDF -> champ
FIELDS = {
    ("Format", "Dimension"): "format",
    ("Papier", "Nombre de Pages"): "pages",
    ("Papier", "Qualité"): "papier",
    ("Papier", "Grammage"): "grammage",
    ("Réglure", "Type"): "reglure",
    ("Réglure", "Nombre de Couleurs"): "couleursReglure",
    ("Couverture", "Qualité"): "couverture",
    ("Couverture", "Couleur"): "couleur",
}
LOG_ROWS = {"Quantité": "quantite", "EAN": "ean", "Poids": "poids", "Dimension": "dimension"}


def parse(pdf: pathlib.Path):
    ref = re.search(r"\d+", pdf.stem).group(0)
    doc = pymupdf.open(pdf)
    page = doc[0]
    sp = list(spans(page))
    y_car = next(y for _, y, _, t in sp if t.startswith("Caract"))
    y_log = next(y for _, y, _, t in sp if t.startswith("Fiche Logistique"))
    designation = " ".join(t for _, y, _, t in sp if 125 < y < y_car and not t.startswith("FICHE PRODUIT"))

    # Caractéristiques : section x<170, libellé x<315, valeur au-delà.
    fiche: dict = {"designation": designation}
    finition: list[str] = []
    sec = lab = None
    for _, cells in rows([s for s in sp if y_car < s[1] < y_log and not s[3].startswith("Caract")]):
        val = None
        for x0, _, t in cells:
            if x0 < 170:
                sec, lab = t, None
            elif x0 < 315:
                lab = t
            else:
                val = t
        if not val:
            continue
        if sec == "Finition":
            finition.append(val)
        elif (sec, lab) in FIELDS:
            key = FIELDS[(sec, lab)]
            fiche[key] = f"{fiche[key]} {val}" if key in fiche else val  # valeur sur 2 lignes
    fiche = {k: tidy(v) for k, v in fiche.items()}
    fiche["finition"] = finition

    # Logistique : colonnes Unité / Paquet / Carton repérées par le centre du texte.
    log = {"unite": {}, "paquet": {}, "carton": {}}
    hs = None
    for _, cells in rows([s for s in sp if s[1] > y_log + 5 and not s[3].startswith("l’")]):
        name = next((t for x0, _, t in cells if x0 < 150), None)
        for x0, x1, t in cells:
            if x0 < 150:
                continue
            if name == "HS CODE":
                hs = t
            elif name in LOG_ROWS:
                col = "unite" if (x0 + x1) / 2 < 290 else "paquet" if (x0 + x1) / 2 < 400 else "carton"
                log[col][LOG_ROWS[name]] = tidy(t)
    fiche["logistique"] = log
    fiche["hsCode"] = hs

    # Visuel produit : la plus grande image sous le logo.
    imgs = [i for i in page.get_image_info(xrefs=True) if i["bbox"][1] > 120]
    image = None
    if imgs:
        info = max(imgs, key=lambda i: (i["bbox"][2] - i["bbox"][0]) * (i["bbox"][3] - i["bbox"][1]))
        raw = doc.extract_image(info["xref"])
        image = Image.open(io.BytesIO(raw["image"]))
        if raw.get("smask"):
            mask = Image.open(io.BytesIO(doc.extract_image(raw["smask"])["image"])).convert("L")
            image = image.convert("RGB")
            image.putalpha(mask.resize(image.size))
        elif image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")
        image.thumbnail((1000, 1000))
    return ref, fiche, image


def displayed_refs() -> set[str]:
    out = subprocess.run(
        "npx jiti scripts/displayed-refs.mts", cwd=ROOT, shell=True, check=True,
        capture_output=True, text=True, encoding="utf-8",
    ).stdout
    return set(json.loads(out))


def our_refs() -> dict[str, list[str]]:
    src = (ROOT / "lib" / "product-refs.ts").read_text(encoding="utf-8")
    out: dict[str, list[str]] = {}
    for key, ref in re.findall(r'"([^"]+\|[^"]+)":\s*"(\d{5})"', src):
        out.setdefault(ref, []).append(key)
    return out


FMT = {"17 x 22 cm": "F17x22", "21 x 29,7 cm (A4)": "F21x29_7", "24 x 32 cm": "F24x32", "14,8 x 21 cm (A5)": "F14_8x21"}


def ruling(t: str) -> str:
    t = (t or "").lower()
    if "seyès" in t:
        return "SEYES"
    if "5x5" in t:
        return "QUADRI"
    if "ligne" in t:
        return "LIGNE"
    return "BLANC" if ("blanc" in t or "uni" in t) else t


def check(ref: str, f: dict, keys: list[str]) -> list[str]:
    """Écarts entre la fiche (overrides appliqués) et notre clé product-refs."""
    if len(keys) != 1:
        return [f"clé ambiguë {keys}"]
    g, cover, fmt, _, rul, col, pages = keys[0].split("|")
    if f["designation"].startswith(("COPIES DOUBLES", "FEUILLETS MOBILES")):
        col = ""  # la couleur de ces clés n'est pas une couleur de couverture
    color = f.get("couleur") or ""
    color = "Assortit" if color.startswith("Assorti") else color
    pdf = {
        "grammage": re.sub(r"\D", "", f.get("grammage") or ""),
        "cover": "PP" if "Polypropyl" in (f.get("couverture") or "") else "CARTONNE",
        "format": FMT.get(f.get("format"), f.get("format")),
        "ruling": ruling(f.get("reglure")),
        "color": col if col == "Sans Couverture" and color == "Sans couverture" else color,
        "pages": (re.match(r"\d+", f.get("pages") or "") or [""])[0],
    }
    ours = {"grammage": g, "cover": cover, "format": fmt, "ruling": rul, "color": col, "pages": pages}
    return [f"{k}: nous={ours[k]!r} pdf={pdf[k]!r}" for k in ours if ours[k] != pdf[k]]


def main():
    src = pathlib.Path(sys.argv[1])
    write = "--write" in sys.argv
    refs = our_refs()
    shown = displayed_refs()
    fiches, images, report, ignored = {}, {}, [], []
    for pdf in sorted(src.glob("Fiche_Produit_*.pdf")):
        ref, f, img = parse(pdf)
        if ref not in shown:
            ignored.append(ref)
            continue
        f.update(OVERRIDES.get(ref, {}))
        if img is None:
            report.append(f"{ref} sans visuel — {f['designation']}")
        else:
            images[ref] = img
            f["image"] = f"/fiches/{ref}.webp"
        if ref in refs and ref not in OVERRIDES:  # corrections volontaires : pas un écart
            for d in check(ref, f, refs[ref]):
                report.append(f"{ref} ÉCART {d} — {f['designation']}")
        fiches[ref] = {k: v for k, v in f.items() if v not in (None, [], {})}

    print(f"{len(fiches)} fiches, {len(images)} visuels")
    print("\n".join(report) or "aucun écart")
    print(f"PDF hors site, ignorés ({len(ignored)}) :", " ".join(ignored) or "aucun")
    missing = sorted(shown - fiches.keys())
    print(f"Références du site sans fiche ({len(missing)}) :", " ".join(missing) or "aucune")
    if not write:
        return
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    for old in OUT_IMG.glob("*.webp"):
        if old.stem not in images:
            old.unlink()  # visuel d'une référence retirée du site
    for ref, img in images.items():
        img.save(OUT_IMG / f"{ref}.webp", "WEBP", quality=85)
    body = json.dumps(fiches, ensure_ascii=False, indent=2)
    OUT_TS.write_text(
        "/**\n * FICHIER GÉNÉRÉ — ne pas éditer à la main.\n"
        " * Source : scripts/extract-fiches.py (fiches PDF + corrections OVERRIDES).\n */\n"
        'import type { FicheProduit } from "./fiches";\n\n'
        f"export const fiches: Record<string, FicheProduit> = {body};\n",
        encoding="utf-8",
    )
    print("écrit :", OUT_TS.relative_to(ROOT), "+", OUT_IMG.relative_to(ROOT))


if __name__ == "__main__":
    main()
