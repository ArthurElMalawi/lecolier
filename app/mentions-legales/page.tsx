import React from 'react';

export default function MentionsLegales() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl mb-10">Mentions Légales</h1>
        
        <div className="space-y-8 text-base leading-7 text-zinc-600">
          <p>
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l&apos;économie numérique,
            il est précisé aux utilisateurs du site l&apos;identité des différents intervenants dans le cadre de sa réalisation et de son suivi.
          </p>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">1. Édition du site</h2>
            <p className="mb-4">
              Le présent site est édité par :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Propriétaire :</strong> [Nom de votre entreprise ou votre nom]</li>
              <li><strong>Statut :</strong> [Forme juridique : SARL, SAS, Auto-entrepreneur...]</li>
              <li><strong>Adresse :</strong> [Votre adresse complète]</li>
              <li><strong>SIRET :</strong> [Numéro SIRET]</li>
              <li><strong>Responsable de publication :</strong> [Nom du responsable]</li>
              <li><strong>Contact :</strong> [Adresse email de contact]</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">2. Hébergement</h2>
            <p>
              Le site est hébergé par :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Hébergeur :</strong> [Nom de l&apos;hébergeur, ex: Vercel, OVH...]</li>
              <li><strong>Adresse :</strong> [Adresse de l&apos;hébergeur]</li>
              <li><strong>Site web :</strong> [Site web de l&apos;hébergeur]</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">3. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble de ce site relève de la législation française et internationale sur le droit d&apos;auteur et la propriété intellectuelle.
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">4. Données personnelles</h2>
            <p>
              Le traitement de vos données à caractère personnel est régi par notre charte de confidentialité, 
              disponible depuis la section «&nbsp;Politique de confidentialité&nbsp;», conformément au Règlement Général sur la Protection des Données 2016/679 du 27 avril 2016 («&nbsp;RGPD&nbsp;»).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
