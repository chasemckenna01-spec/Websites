import Link from "next/link";
import { cn } from "@/lib/cn";

type CtaButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline-light" | "outline-dark";
  className?: string;
};

const base =
  "cursor-pointer inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.15em] transition-all duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5";

const variants = {
  primary: "bg-gold text-ink hover:bg-gold-bright",
  "outline-light": "border border-foam/40 text-foam hover:border-foam hover:bg-foam/10",
  "outline-dark": "border border-marlin/30 text-marlin hover:border-marlin hover:bg-marlin/5",
};

export default function CtaButton({
  href,
  children,
  variant = "primary",
  className,
}: CtaButtonProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
