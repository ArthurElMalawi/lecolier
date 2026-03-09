import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Colonne 1: Logo & Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-900">L'écolier</h3>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              La qualité au service de l'éducation. Des cahiers conçus pour durer et accompagner la réussite de chaque élève.
            </p>
          </div>

          {/* Colonne 2: Liens utiles */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-zinc-600 hover:text-blue-600 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/qui-sommes-nous" className="text-sm text-zinc-600 hover:text-blue-600 transition-colors">
                  Qui sommes-nous ?
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-sm text-zinc-600 hover:text-blue-600 transition-colors">
                  Nos Produits
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Réseaux sociaux & Contact - MASQUÉ TEMPORAIREMENT
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-blue-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-pink-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-blue-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-blue-800 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          */}
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} L'écolier. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {/* LIENS LÉGAUX MASQUÉS TEMPORAIREMENT
            <Link href="/mentions-legales" className="text-xs text-zinc-400 hover:text-zinc-600">Mentions légales</Link>
            <Link href="/confidentialite" className="text-xs text-zinc-400 hover:text-zinc-600">Confidentialité</Link>
            */}
          </div>
        </div>
      </div>
    </footer>
  );
}
