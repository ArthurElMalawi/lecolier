"""
Régénère le bloc REFS de lib/product-refs.ts depuis l'export articles.

    python scripts/generate-product-refs.py "<fichier.xlsx>" [--write]

La DESIGNATION fait foi (cf. scripts/audit-listing.py). Sans --write, le script
n'affiche que le diff avec le fichier actuel.

Ne sont retenus que les cahiers : gourdes, sacs kraft, blocs, stylos, pochettes,
agendas, PLV, copies doubles et feuillets mobiles portent leurs tableaux dans
lib/classement-refs.ts ou lib/product-lines.ts, saisis à la main.
"""
import importlib.util
import re
import sys

spec = importlib.util.spec_from_file_location("audit", "scripts/audit-listing.py")
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

TS = "lib/product-refs.ts"

COLORS = [
    ("INCOLOR", "Incolore"), ("ASSORT", "Assortit"), ("ORANGE", "Orange"), ("GRIS", "Gris"),
    ("JAUNE", "Jaune"), ("ROSE", "Rose"), ("VIOLET", "Violet"), ("BLEU", "Bleu"),
    ("ROUGE", "Rouge"), ("VERT", "Vert"), ("NOIR", "Noir"), ("SANS COUVERTURE", "Sans Couverture"),
]

FORMATS = [("17X22", "F17x22"), ("21X29,7", "F21x29_7"), ("24X32", "F24x32")]

# Produits qui ne relèvent pas de REFS : leurs tableaux sont saisis ailleurs.
NOT_A_NOTEBOOK = re.compile(
    r"GOURDE|SAC KRAFT|PLV|BLOC NOTE|POCHETTE|AGENDA|STYLO|COPIES DOUBLES|FEUILLETS MOBILES|ETUI|FEUTRE"
)

# « Cahier de recherche » n'a ni page ni variante dans le site : le laisser entrer
# écraserait un cahier scolaire de même grammage, format et pagination.
UNSUPPORTED = re.compile(r"CAHIER DE RECHERCHE")


def key_for(label):
    """Clé REFS d'une désignation, ou (None, raison) si elle n'y a pas sa place."""
    d = label.upper()
    if NOT_A_NOTEBOOK.search(d):
        return None, "hors cahiers"
    if UNSUPPORTED.search(d):
        return None, "type de produit absent du site"

    grammage = re.search(r"\b(\d{2})\s?GR\b", d)
    fmt = next((v for k, v in FORMATS if k in d), None)
    pages = re.search(r"\b(\d{2,3})\s?P\b", d)
    color = next((fr for k, fr in COLORS if k in d), None)
    if not (grammage and fmt and pages and color):
        return None, "désignation incomplète"

    if "TRAVAUX PRATIQUES" in d:
        variant, ruling = "TP", "SEYES"
    elif "PETITE ECOLE" in d:
        variant, ruling = "MAT", "LIGNE"
    elif "CAHIER DESSIN" in d:
        variant, ruling = "DESSIN", "BLANC"
    else:
        variant = "STD"
        # « UNI » = papier sans réglure (Musique et Chants), « 5X5 » = quadrillé.
        ruling = "BLANC" if re.search(r"\bUNI\b", d) else "QUADRI" if "5X5" in d else "SEYES"

    cover = "CARTONNE" if "CARTON" in d else "PP"
    return f"{grammage.group(1)}|{cover}|{fmt}|{variant}|{ruling}|{color}|{int(pages.group(1))}", None


def main():
    path = sys.argv[1]
    xl = audit.articles(path)
    current = dict(re.findall(r'"([^"]*\|[^"]*)": "(\d{5})"', open(TS, encoding="utf-8").read()))

    built, skipped, clashes = {}, [], []
    for sku, label in sorted(xl.items()):
        key, why = key_for(label)
        if not key:
            skipped.append((sku, why, label))
        elif key in built:
            clashes.append((sku, key, built[key], label))
        else:
            built[key] = sku

    # Les cartonnées 60/70 g ne sont plus dans l'export : on les conserve telles quelles.
    kept = {k: v for k, v in current.items() if k not in built and v not in built.values()}

    print(f"export      : {len(xl)} articles")
    print(f"cahiers     : {len(built)} clés générées")
    print(f"conservées  : {len(kept)} clés absentes de l'export")
    print(f"total       : {len(built) + len(kept)}  (actuel : {len(current)})")

    if clashes:
        print(f"\n=== {len(clashes)} COLLISION(S) — deux articles pour une même clé ===")
        for sku, key, other, label in clashes:
            print(f"  {key}\n     {other} déjà posé, puis {sku} : {label[:74]}")

    if skipped:
        print(f"\n=== {len(skipped)} article(s) écarté(s) ===")
        by = {}
        for sku, why, label in skipped:
            by.setdefault(why, []).append((sku, label))
        for why, items in by.items():
            print(f"  {why} ({len(items)}) :")
            for sku, label in items if why != "hors cahiers" else []:
                print(f"     {sku}  {label[:76]}")

    new = {**built, **kept}
    moved = [(k, current[k], new[k]) for k in set(current) & set(new) if current[k] != new[k]]
    gone = sorted(set(current) - set(new))
    added = sorted(set(new) - set(current))

    print(f"\n=== {len(moved)} clé(s) dont le SKU change ===")
    for k, a, b in sorted(moved):
        print(f"  {k}\n     {a} -> {b}")
    print(f"\n=== {len(gone)} clé(s) retirée(s) ===")
    for k in gone:
        print(f"  {k}  ({current[k]})")
    print(f"\n=== {len(added)} clé(s) ajoutée(s) ===")
    for k in added:
        print(f"  {k}  ({new[k]})")

    if "--write" not in sys.argv:
        print("\nSimulation — relancer avec --write.")
        return

    src = open(TS, encoding="utf-8").read()
    body = "".join(f'  "{k}": "{new[k]}",\n' for k in sorted(new))
    out = re.sub(r"const REFS: Record<string, string> = \{.*?\n\};",
                 "const REFS: Record<string, string> = {\n" + body + "};",
                 src, count=1, flags=re.S)
    open(TS, "w", encoding="utf-8", newline="\n").write(out)
    print(f"\n{TS} réécrit : {len(new)} références.")


main()
