import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { ComponentProps, ReactNode } from "react";

/**
 * Shared layout + typography primitives for the AFRINNET public site.
 * Keeps spacing, containers and section rhythm consistent across pages.
 */

export const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(container, className)}>{children}</div>;
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("afr-eyebrow text-innovation", className)}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow className={align === "center" ? "mb-4" : "mb-4"}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "font-display text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          "text-chalk",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-5 text-base leading-7 sm:text-lg",
            "text-ash",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/** Thin numbered / labelled rule used across institutional sections. */
export function GreenRule({ className }: { className?: string }) {
  return <span className={cn("block h-px w-12 bg-innovation", className)} />;
}

export type LinkButtonVariant = "primary" | "outline" | "soft" | "light";

const linkButtonStyles: Record<LinkButtonVariant, string> = {
  primary:
    "bg-[#121316] text-white hover:bg-[#24262b] border border-transparent",
  outline:
    "border border-obsidian/25 bg-transparent text-chalk hover:border-innovation hover:bg-innovation/10 hover:text-chalk",
  soft:
    "border border-white/10 bg-white/[0.06] text-chalk hover:border-innovation/60 hover:bg-white/10",
  light:
    "border border-[#121316]/20 bg-transparent text-chalk hover:border-innovation hover:bg-innovation/10 hover:text-chalk",
};

/** Router-aware button with the AFRINNET variants. */
export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "lg",
  className,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: LinkButtonVariant;
  size?: "default" | "lg" | "sm";
  className?: string;
} & Omit<ComponentProps<typeof Button>, "children" | "variant" | "size">) {
  return (
    <Button
      asChild
      size={size}
      variant="outline"
      className={cn(
        "cursor-pointer rounded-full font-display font-semibold transition-all duration-200",
        linkButtonStyles[variant],
        variant === "primary" && "afr-primary-cta",
        className,
      )}
      {...rest}
    >
      <Link to={href}>
        {children}
        {variant === "primary" && (
          <span aria-hidden="true" className="afr-cta-arrow ml-2 grid size-8 shrink-0 place-items-center rounded-full bg-innovation text-white">
            <ArrowRight className="size-4" />
          </span>
        )}
      </Link>
    </Button>
  );
}

/** Small status pill: "available" (green) vs "developing" (navy/ash). */
export function StatusBadge({
  tone,
  children,
}: {
  tone: "available" | "developing" | "neutral";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
        tone === "available" &&
          "border-innovation/50 bg-innovation/10 text-innovation",
        tone === "developing" &&
          "border-[#9DA1A7] bg-[#D4D6D8] text-[#3D4148]",
        tone === "neutral" && "border-white/15 bg-white/5 text-ash",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}

/** Institutional note / disclaimer panel. */
export function Callout({
  title,
  children,
  tone = "neutral",
  className,
}: {
  title?: string;
  children: ReactNode;
  tone?: "neutral" | "green" | "navy" | "light";
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "rounded-xl border p-5 text-sm leading-6",
        tone === "neutral" && "border-white/12 bg-white/[0.03] text-ash",
        tone === "green" && "border-innovation/40 bg-innovation/[0.07] text-chalk",
        tone === "navy" && "border-[#A8ABB0] bg-[#D4D6D8]/70 text-[#3D4148]",
        tone === "light" && "border-[#121316]/12 bg-white text-ash",
        className,
      )}
    >
      {title && (
        <p className="mb-1.5 font-display text-xs font-bold uppercase tracking-[0.14em]">
          {title}
        </p>
      )}
      {children}
    </aside>
  );
}
