import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-black/[.06] text-zinc-900 dark:bg-white/[.08] dark:text-zinc-100",
        secondary: "border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        outline: "text-zinc-900 dark:text-zinc-100",
        blue: "border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
        green: "border-transparent bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
        orange: "border-transparent bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100",
        purple: "border-transparent bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };