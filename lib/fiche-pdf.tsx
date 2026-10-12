/**
 * Génération côté navigateur du PDF d'une fiche produit (aucun PDF stocké sur le site).
 * Module lourd (@react-pdf/renderer) : à charger via `import()` au clic seulement.
 */
import { Document, Image, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import {
  FICHE_LABELS, LOG_COLUMNS, ficheLogCell, ficheLogRows, ficheSections, type FicheProduit,
} from "./fiches";

const BLUE = "#1e4fa3";
const s = StyleSheet.create({
  page: { padding: 40, fontSize: 9.5, fontFamily: "Helvetica", color: "#222" },
  logo: { width: 96, alignSelf: "center", marginBottom: 14 },
  ref: { fontSize: 12, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 6 },
  designation: { fontSize: 10.5, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 12 },
  image: { height: 170, objectFit: "contain", alignSelf: "center", marginBottom: 16 },
  heading: {
    fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: "center", color: BLUE,
    borderWidth: 1, borderColor: BLUE, paddingVertical: 4, marginTop: 10, marginBottom: 8,
  },
  row: { flexDirection: "row", paddingVertical: 2.5, paddingHorizontal: 4 },
  zebra: { backgroundColor: "#f2f2f2" },
  section: { width: "22%", fontFamily: "Helvetica-Bold" },
  label: { width: "28%" },
  value: { width: "50%" },
  logLabel: { width: "19%", fontFamily: "Helvetica-Bold" },
  logCell: { width: "27%", textAlign: "center" },
  footer: { position: "absolute", bottom: 28, left: 0, right: 0, textAlign: "center", fontSize: 8, color: "#777" },
});

/** react-pdf ne lit pas le webp : on repasse l'image en PNG via un canvas. */
async function toPng(src: string): Promise<string> {
  const img = new window.Image();
  img.src = src;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext("2d")!.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}

function FicheDocument({ code, fiche, lang, image, logo }: {
  code: string; fiche: FicheProduit; lang: "fr" | "en"; image?: string; logo: string;
}) {
  const L = FICHE_LABELS[lang];
  let n = 0; // alternance des fonds de ligne, continue sur toutes les sections
  return (
    <Document title={`${L.sheet} ${code}`} author="L'écolier">
      <Page size="A4" style={s.page}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- composant react-pdf, pas une balise HTML */}
        <Image src={logo} style={s.logo} />
        <Text style={s.ref}>{`${L.sheet.toUpperCase()} ${code}`}</Text>
        <Text style={s.designation}>{fiche.designation}</Text>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        {image && <Image src={image} style={s.image} />}

        <Text style={s.heading}>{L.features}</Text>
        {ficheSections(fiche, lang).map((sec) =>
          sec.rows.map((r, i) => (
            <View key={`${sec.title}-${i}`} style={[s.row, n++ % 2 === 0 ? s.zebra : {}]} wrap={false}>
              <Text style={s.section}>{i === 0 ? sec.title : ""}</Text>
              <Text style={s.label}>{r.label ?? ""}</Text>
              <Text style={s.value}>{r.value}</Text>
            </View>
          )),
        )}

        <Text style={s.heading}>{L.logistics}</Text>
        <View style={[s.row, s.zebra]}>
          <Text style={s.logLabel} />
          {LOG_COLUMNS.map((c) => (
            <Text key={c} style={[s.logCell, { fontFamily: "Helvetica-Bold" }]}>{L.columns[c]}</Text>
          ))}
        </View>
        {ficheLogRows(fiche).map((k, i) => (
          <View key={k} style={[s.row, i % 2 === 1 ? s.zebra : {}]}>
            <Text style={s.logLabel}>{L.log[k]}</Text>
            {LOG_COLUMNS.map((c) => (
              <Text key={c} style={s.logCell}>{ficheLogCell(fiche, c, k, lang) ?? ""}</Text>
            ))}
          </View>
        ))}
        {fiche.hsCode && (
          <View style={s.row}>
            <Text style={s.logLabel}>{L.log.hsCode}</Text>
            <Text style={s.logCell}>{fiche.hsCode}</Text>
          </View>
        )}

        <Text style={s.footer} fixed>{L.trademark}</Text>
      </Page>
    </Document>
  );
}

/** Génère la fiche et déclenche son téléchargement (Fiche_Produit_<ref>.pdf). */
export async function downloadFichePdf(code: string, fiche: FicheProduit, lang: "fr" | "en") {
  const [logo, image] = await Promise.all([
    toPng("/logo.png"),
    fiche.image ? toPng(fiche.image) : Promise.resolve(undefined),
  ]);
  const blob = await pdf(<FicheDocument code={code} fiche={fiche} lang={lang} image={image} logo={logo} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Fiche_Produit_${code}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
