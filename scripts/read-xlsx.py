"""
Lecteur xlsx minimal, sans dépendance : un classeur est une archive zip de XML.

    python scripts/read-xlsx.py <fichier.xlsx> [--sheet N] [--max N] [--tsv]

Sert à confronter l'export articles à lib/product-refs.ts sans installer openpyxl.
"""
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
NS_REL = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


def col_index(ref):
    """« BC12 » -> 54 (index 0 de la colonne)."""
    n = 0
    for ch in ref:
        if not ch.isalpha():
            break
        n = n * 26 + (ord(ch.upper()) - 64)
    return n - 1


def shared_strings(zf):
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    out = []
    for si in root.findall(f"{NS}si"):
        # Le texte d'une cellule peut être découpé en plusieurs fragments (<r><t>).
        out.append("".join(t.text or "" for t in si.iter(f"{NS}t")))
    return out


def sheet_names(zf):
    root = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    target = {r.get("Id"): r.get("Target") for r in rels}
    out = []
    for sh in root.find(f"{NS}sheets"):
        path = target[sh.get(f"{NS_REL}id")].lstrip("/")
        out.append((sh.get("name"), path if path.startswith("xl/") else "xl/" + path))
    return out


def rows(zf, path, strings):
    root = ET.fromstring(zf.read(path))
    for row in root.iter(f"{NS}row"):
        cells = {}
        for c in row.findall(f"{NS}c"):
            v = c.find(f"{NS}v")
            if c.get("t") == "inlineStr":
                is_ = c.find(f"{NS}is")
                text = "".join(t.text or "" for t in is_.iter(f"{NS}t")) if is_ is not None else ""
            elif v is None:
                continue
            elif c.get("t") == "s":
                text = strings[int(v.text)]
            else:
                text = v.text or ""
            text = text.strip()
            if text:
                cells[col_index(c.get("r"))] = text
        if cells:
            yield [cells.get(i, "") for i in range(max(cells) + 1)]


def main():
    path = sys.argv[1]
    which = int(sys.argv[sys.argv.index("--sheet") + 1]) if "--sheet" in sys.argv else None
    limit = int(sys.argv[sys.argv.index("--max") + 1]) if "--max" in sys.argv else 0
    tsv = "--tsv" in sys.argv

    with zipfile.ZipFile(path) as zf:
        strings = shared_strings(zf)
        sheets = sheet_names(zf)
        if which is None:
            for i, (name, p) in enumerate(sheets):
                n = sum(1 for _ in rows(zf, p, strings))
                print(f"[{i}] {name}  —  {n} lignes")
            return
        name, p = sheets[which]
        if not tsv:
            print(f"# {name}", file=sys.stderr)
        for i, r in enumerate(rows(zf, p, strings)):
            if limit and i >= limit:
                break
            print("\t".join(r))


main()
