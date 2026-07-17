import { createElement } from "react";
import {
  Notebook,
  BookOpen,
  Book,
  Sparkles,
  Layers,
  FlaskConical,
  Music,
  Baby,
  Folder,
  Ruler,
  Pencil,
  Eraser,
  Scissors,
  Palette,
  Backpack,
  Calendar,
  Package,
  GraduationCap,
  ShieldCheck,
  Download,
  Mail,
  Droplets,
  StickyNote,
  RotateCw,
  type LucideIcon,
} from "lucide-react";

/** Clé d'icône (champ `icon` des NavNode) -> composant lucide. */
const ICONS: Record<string, LucideIcon> = {
  notebook: Notebook,
  book: Book,
  sparkles: Sparkles,
  layers: Layers,
  flask: FlaskConical,
  music: Music,
  baby: Baby,
  spiral: RotateCw,
  notepad: StickyNote,
  supplies: Package,
  folder: Folder,
  shield: ShieldCheck,
  ruler: Ruler,
  pencil: Pencil,
  eraser: Eraser,
  scissors: Scissors,
  glue: Pencil,
  palette: Palette,
  accessories: Backpack,
  backpack: Backpack,
  calendar: Calendar,
  bottle: Droplets,
  level: GraduationCap,
  brand: BookOpen,
  download: Download,
  mail: Mail,
};

export function getNavIcon(key?: string): LucideIcon {
  return (key && ICONS[key]) || Layers;
}

/**
 * Rendu d'une icône de nav de façon "statique" (via createElement) afin de ne
 * pas créer de composant pendant le render côté appelant.
 */
export function NavIcon({ iconKey, className, strokeWidth }: { iconKey?: string; className?: string; strokeWidth?: number }) {
  return createElement(getNavIcon(iconKey), { className, strokeWidth });
}

/**
 * Accents de couleur par rubrique de premier niveau (clé = slug).
 * Utilisés pour les dégradés des cartes et sections.
 */
export type Accent = {
  gradient: string; // dégradé du bloc visuel
  soft: string; // fond doux (icône)
  text: string; // couleur d'accent texte
  ring: string; // bordure/anneau au survol
};

export const ACCENTS: Record<string, Accent> = {
  "nos-cahiers": {
    gradient: "from-blue-500 to-cyan-400",
    soft: "bg-blue-50 text-blue-600",
    text: "text-blue-600",
    ring: "hover:border-blue-300",
  },
  fournitures: {
    gradient: "from-teal-500 to-emerald-400",
    soft: "bg-teal-50 text-teal-600",
    text: "text-teal-600",
    ring: "hover:border-teal-300",
  },
  accessoires: {
    gradient: "from-violet-500 to-purple-400",
    soft: "bg-violet-50 text-violet-600",
    text: "text-violet-600",
    ring: "hover:border-violet-300",
  },
  "par-niveau": {
    gradient: "from-amber-500 to-orange-400",
    soft: "bg-amber-50 text-amber-600",
    text: "text-amber-600",
    ring: "hover:border-amber-300",
  },
};

const DEFAULT_ACCENT: Accent = {
  gradient: "from-zinc-500 to-zinc-400",
  soft: "bg-zinc-100 text-zinc-600",
  text: "text-zinc-700",
  ring: "hover:border-zinc-300",
};

export function getAccent(rootSlug?: string): Accent {
  return (rootSlug && ACCENTS[rootSlug]) || DEFAULT_ACCENT;
}
