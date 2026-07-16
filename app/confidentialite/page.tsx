import React from 'react';

export default function Confidentialite() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl mb-10">Politique de Confidentialité</h1>
        
        <div className="space-y-8 text-base leading-7 text-zinc-600">
          <p>
            Nous attachons une grande importance à la protection de vos données personnelles. 
            Cette politique décrit comment nous collectons, utilisons et protégeons vos informations.
          </p>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">1. Collecte des données</h2>
            <p>
              Nous pouvons collecter les informations suivantes lors de votre navigation ou de votre interaction avec notre site :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Données d&apos;identification (Nom, prénom, email, téléphone)</li>
              <li>Données de connexion (Adresse IP, navigateur utilisé)</li>
              <li>Données de localisation (Pays, ville)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">2. Utilisation des données</h2>
            <p>
              Les données collectées nous permettent de :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Gérer votre compte et vos commandes.</li>
              <li>Améliorer nos services et personnaliser votre expérience.</li>
              <li>Vous envoyer des informations et offres promotionnelles (avec votre consentement).</li>
              <li>Assurer la sécurité de notre site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">3. Cookies</h2>
            <p>
              Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur.
              Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait limiter certaines fonctionnalités du site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">4. Vos droits</h2>
            <p>
              Conformément à la réglementation applicable, vous disposez des droits suivants concernant vos données personnelles :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Droit d&apos;accès et de rectification.</li>
              <li>Droit à l&apos;effacement (« droit à l&apos;oubli »).</li>
              <li>Droit à la limitation du traitement.</li>
              <li>Droit d&apos;opposition.</li>
              <li>Droit à la portabilité des données.</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse suivante : <strong>[Votre email de contact]</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">5. Contact</h2>
            <p>
              Pour toute question relative à cette politique de confidentialité, veuillez nous contacter à : <strong>[Votre email de contact]</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
