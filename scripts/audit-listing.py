"""
Confronte un export articles à lib/product-refs.ts.

    python scripts/audit-listing.py "<fichier.xlsx>"

La DESIGNATION fait foi : les colonnes structurées de l'export sont fusionnées dans
Excel (valeur sur la première ligne seulement) et parfois décalées d'une rubrique à
l'autre, alors que la désignation est saisie ligne par ligne.
"""
import re
import subprocess
import sys

COLORS = [
    ("INCOLOR", "Incolore"), ("ASSORT", "Assortit"), ("ORANGE", "Orange"), ("GRIS", "Gris"),
    ("JAUNE", "Jaune"), ("ROSE", "Rose"), ("VIOLET", "Violet"), ("BLEU", "Bleu"),
    ("ROUGE", "Rouge"), ("VERT", "Vert"), ("NOIR", "Noir"),
]


def cells(path):
    """Lignes de la première feuille, via le lecteur sans dépendance."""
    out = subprocess.run(
        [sys.executable, "scripts/read-xlsx.py", path, "--sheet", "0", "--tsv"],
        capture_output=True,
    )
    for line in out.stdout.decode("utf-8").splitlines():
        yield (line.split("\t") + [""] * 30)[:30]


def articles(path):
    """
    {SKU: désignation} — la colonne du SKU varie d'une version à l'autre.

    La désignation est la première cellule longue qui suit le SKU. Ne pas exiger
    qu'elle soit toute en majuscules : « …70GR 24x32 96P… » ne l'est pas.
    """
    out = {}
    for row in cells(path):
        for i, v in enumerate(row):
            # Excel stocke certains SKU en numérique : « 47825 » arrive « 47825.0 ».
            sku = re.fullmatch(r"(\d{5})(?:\.0+)?", v.strip())
            if sku:
                label = next((c for c in row[i + 1:] if len(c) > 20 and re.search(r"[A-Za-z]{4}", c)), "")
                if label:
                    out[sku.group(1)] = label
                break
    return out


def parse(label):
    d = label.upper()
    fmt = "F17x22" if "17X22" in d else "F21x29_7" if "21X29,7" in d else "F24x32" if "24X32" in d else None
    pages = re.search(r"\b(\d{2,3})\s?P\b", d)
    color = next((fr for key, fr in COLORS if key in d), None)
    return fmt, int(pages.group(1)) if pages else None, color


def code_refs():
    src = open("lib/product-refs.ts", encoding="utf-8").read()
    return {sku: key for key, sku in re.findall(r'"([^"]*\|[^"]*)": "(\d{5})"', src)}


def main():
    path = sys.argv[1]
    xl = articles(path)
    code = code_refs()

    print(f"export          : {len(xl)} SKU")
    print(f"product-refs.ts : {len(code)} SKU")

    missing = sorted(set(code) - set(xl))
    added = sorted(set(xl) - set(code))
    print(f"\ndans le code, absentes de l'export : {len(missing)}")
    print(f"dans l'export, absentes du code    : {len(added)}")

    clashes = []
    for sku, label in xl.items():
        if sku not in code:
            continue
        fmt, pages, color = parse(label)
        k = code[sku].split("|")
        diff = []
        if color and color != k[5]:
            diff.append(f"coloris {k[5]} -> {color}")
        if fmt and fmt != k[2]:
            diff.append(f"format {k[2]} -> {fmt}")
        if pages and pages != int(k[6]):
            diff.append(f"pages {k[6]} -> {pages}")
        if diff:
            clashes.append((sku, ", ".join(diff), label))

    print(f"\n=== {len(clashes)} référence(s) où l'export contredit le code ===")
    for sku, diff, label in sorted(clashes):
        print(f"  {sku}  {diff}")
        print(f"         {label[:96]}")

    return xl, code, added


if __name__ == "__main__":
    main()
