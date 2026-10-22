
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  // Fil d'ariane en données structurées : Google l'affiche à la place de l'URL.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ label: "L'écolier", href: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };

  return (
    <>
    <JsonLd data={breadcrumbJsonLd} />
    <nav
      aria-label="Breadcrumb"
      className={cn("text-sm leading-6 text-zinc-500 [overflow-wrap:anywhere]", className)}
    >
      <Link href="/" className="inline align-middle hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        <Home className="inline h-4 w-4 align-middle" />
      </Link>
      {items.map((item, index) => (
        <span key={index}>
          <ChevronRight className="mx-1 inline h-4 w-4 align-middle text-zinc-400" />
          {item.href ? (
            <Link href={item.href} className="align-middle hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="align-middle font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
    </>
  );
}
