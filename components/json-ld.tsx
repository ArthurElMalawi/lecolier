/** Données structurées schema.org, lues par Google et les moteurs d'IA. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // `<` échappé : un libellé contenant « </script> » ne doit pas fermer la balise.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
