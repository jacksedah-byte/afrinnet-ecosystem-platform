import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  tone = "light",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
  tone?: "light" | "dark";
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
          tone === "light" ? "text-chalk" : "text-obsidian",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-5 text-base leading-7 sm:text-lg",
            tone === "light" ? "text-ash" : "text-obsidian/70",
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
    "bg-innovation text-obsidian hover:bg-innovation-bright border border-transparent",
  outline:
    "border border-white/25 bg-transparent text-chalk hover:border-innovation hover:bg-innovation/10 hover:text-chalk",
  soft:
    "border border-white/10 bg-white/[0.06] text-chalk hover:border-innovation/60 hover:bg-white/10",
  light:
    "border border-obsidian/25 bg-transparent text-obsidian hover:border-innovation hover:bg-innovation/10 hover:text-obsidian",
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
        "cursor-pointer rounded-md font-display font-semibold transition-all duration-200",
        linkButtonStyles[variant],
        className,
      )}
      {...rest}
    >
      <Link to={href}>{children}</Link>
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
          "border-navy/60 bg-navy/25 text-[#9FC0E8]",
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
        tone === "navy" && "border-[#2C4E7A] bg-navy/30 text-[#D6E3F2]",
        tone === "light" && "border-obsidian/15 bg-obsidian/[0.04] text-obsidian/80",
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
