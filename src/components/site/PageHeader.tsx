import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { container, Eyebrow } from "./primitives";
import { Reveal } from "./Reveal";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Internal page hero: breadcrumbs, eyebrow, title, lede and optional actions.
 * Padding clears the fixed header (announcement strip + nav).
 */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  lede,
  actions,
  tone = "dark",
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
  /** `navy` for governance/engagement sections, `dark` elsewhere. */
  tone?: "dark" | "navy";
  children?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-white/10 pt-28 pb-14 sm:pt-32 sm:pb-16",
        tone === "navy"
          ? "bg-navy-deep"
          : "bg-obsidian",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 afr-grid-bg afr-mask-fade-b opacity-60",
          tone === "navy" && "opacity-40",
        )}
      />
      <div className={cn(container, "relative")}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ash">
            <li>
              <Link to="/" className="transition-colors hover:text-innovation">
                Home
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight className="size-3 opacity-60" aria-hidden="true" />
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="transition-colors hover:text-innovation"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-chalk/90">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <Reveal y={16} className="mt-7 max-w-4xl">
          {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-chalk sm:text-5xl lg:text-[3.4rem]">
            {title}
          </h1>
          {lede && (
            <p className="mt-5 max-w-3xl text-base leading-7 text-ash sm:text-lg">
              {lede}
            </p>
          )}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
