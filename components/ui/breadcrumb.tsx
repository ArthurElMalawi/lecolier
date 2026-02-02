
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
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-2 text-sm text-zinc-500", className)}>
      <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-zinc-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
