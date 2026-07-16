
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500", className)}>
      <Link href="/" className="shrink-0 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-x-2">
          <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
          {item.href ? (
            <Link href={item.href} className="break-words hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="break-words font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
