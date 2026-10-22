import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, SITE_NAME, SITE_ALTERNATE_NAMES, DEFAULT_DESCRIPTION } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Cahiers scolaires`, template: `%s — ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION.fr,
};

// Données structurées de la marque et du site, lues par les moteurs pour la fiche de
// marque et le nom affiché dans les résultats. Le WebSite et ses `alternateName`
// relient les recherches « lecolier », « l'ecolier »… à ce domaine.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description: DEFAULT_DESCRIPTION.fr,
      // Société éditrice (voir les mentions légales).
      legalName: "AVANTIS",
      email: "info@avantis-france.com",
      telephone: "+33134242338",
      vatID: "FR03440545770",
      address: {
        "@type": "PostalAddress",
        streetAddress: "8 Rue de Témara",
        postalCode: "78100",
        addressLocality: "Saint-Germain-en-Laye",
        addressCountry: "FR",
      },
      identifier: { "@type": "PropertyValue", propertyID: "SIRET", value: "44054577000065" },
      brand: { "@id": `${SITE_URL}/#brand` },
    },
    {
      "@type": "Brand",
      "@id": `${SITE_URL}/#brand`,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      slogan: "L'excellence pour vos études",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      url: SITE_URL,
      inLanguage: ["fr-FR", "en-GB"],
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        <JsonLd data={siteJsonLd} />
        <Suspense>
          <Header />
        </Suspense>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
