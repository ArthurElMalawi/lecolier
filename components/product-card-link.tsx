"use client";

import { useRouter } from "next/navigation";
import { useTransition, MouseEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ProductCardLink({ href, children, className }: ProductCardLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Allow default behavior for modifier keys (new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick} 
      className={cn("relative block", className)}
    >
      {children}
      {isPending && (
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center z-50 rounded-lg backdrop-blur-[1px] transition-all duration-300">
           <Loader2 className="w-8 h-8 animate-spin text-zinc-600 dark:text-zinc-400" />
        </div>
      )}
    </Link>
  );
}
