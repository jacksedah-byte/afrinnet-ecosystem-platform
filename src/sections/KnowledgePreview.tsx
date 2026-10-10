import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, FileText } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Container, SectionHeading, StatusBadge } from "@/components/site/primitives";
import { knowledgeNotice, resources, type Resource } from "@/content/resources";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Learning resource", "IP guide", "Toolkit", "Policy brief", "Report", "Case study"] as const;

function ResourceRow({ item }: { item: Resource }) {
  const inner = (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-innovation">
          {item.type}
        </span>
        <span className="text-xs text-ash/70">·</span>
        <span className="text-xs text-ash/70">{item.dateLabel}</span>
      </div>
      <h3 className="mt-2 font-display text-base font-bold leading-6 tracking-tight text-chalk transition-colors group-hover:text-innovation">
        {item.title}
      </h3>
      <p className="mt-1.5 text-sm leading-6 text-ash">{item.summary}</p>
    </>
  );

  if (item.status === "live" && item.href) {
    return (
      <Link
        to={item.href}
        className="group block border-t border-white/10 py-6 transition-colors hover:border-innovation/40"
      >
        {inner}
        <span className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-innovation">
          Read online
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    );
  }

  return (
    <div className="border-t border-white/10 py-6 opacity-80">
      {inner}
      <span className="mt-3 inline-block">
        <StatusBadge tone="neutral">Forthcoming — not yet published</StatusBadge>
      </span>
    </div>
  );
}

/** Homepage Section 9 — knowledge, research and policy (editorial layout). */
export function KnowledgePreview() {
  const [filter, setFilter] = useState<string>("All");

  const filtered = useMemo(
    () => (filter === "All" ? resources : resources.filter((r) => r.type === filter)),
    [filter],
  );

  const featured = resources.find((r) => r.featured) ?? resources[0];
  const listings = filtered.filter((r) => r.id !== featured.id).slice(0, 4);

  return (
    <section className="border-t border-white/10 bg-ink py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Knowledge, research & policy"
            title="Evidence, guidance and institutional learning"
            lede="Guides you can read today, and the research and policy work being prepared for release."
          />
          <Link
            to="/knowledge"
            className="group inline-flex shrink-0 items-center gap-2 font-display text-sm font-semibold text-innovation transition-colors hover:text-innovation-bright"
          >
            Explore the Knowledge Centre
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Featured publication */}
          <Reveal>
            <article className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-obsidian transition-colors duration-300 hover:border-innovation/50">
              {/* Cover preview */}
              <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-gradient-to-br from-navy via-navy-deep to-obsidian p-7">
                <div aria-hidden="true" className="absolute inset-0 afr-grid-bg opacity-70" />
                <svg
                  aria-hidden="true"
                  className="absolute -right-6 -top-6 h-40 w-40 opacity-40"
                  viewBox="0 0 100 100"
                >
                  <g stroke="#22C55E" strokeWidth="1" fill="none">
                    <path d="M10 80 L35 55 L60 65 L90 30" />
                    <path d="M10 40 L40 25 L70 45" opacity="0.6" />
                  </g>
                  <g fill="#22C55E">
                    <circle cx="35" cy="55" r="2.5" />
                    <circle cx="60" cy="65" r="2.5" />
                    <circle cx="90" cy="30" r="2.5" />
                    <circle cx="40" cy="25" r="2" />
                  </g>
                </svg>

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center gap-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                    <FileText className="size-3.5" aria-hidden="true" />
                    AFRINNET {featured.type}
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-innovation/50 bg-obsidian/70 px-2.5 py-1 font-display text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-innovation">
                      {featured.type === "IP guide" ? "Live resource" : featured.type}
                    </span>
                    <h3 className="mt-3 max-w-md font-display text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">
                      {featured.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-3 text-xs text-ash">
                  <span>{featured.dateLabel}</span>
                  <span className="size-1 rounded-full bg-ash/50" aria-hidden="true" />
                  <span>{featured.topic}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ash">{featured.summary}</p>
                <Link
                  to={featured.href ?? "/knowledge"}
                  className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-innovation transition-colors hover:text-innovation-bright"
                >
                  {featured.status === "live" ? "Read the guide" : "View record"}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </Reveal>

          {/* Listings + filters */}
          <div>
            <Reveal delay={0.05}>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter resources by type">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 font-display text-xs font-semibold transition-all duration-200",
                      filter === f
                        ? "border-innovation bg-innovation/15 text-chalk"
                        : "border-white/15 text-ash hover:border-white/35 hover:text-chalk",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Reveal>

            <div className="mt-4">
              {listings.length > 0 ? (
                listings.map((item, i) => (
                  <Reveal key={item.id} delay={0.05 + i * 0.05}>
                    <ResourceRow item={item} />
                  </Reveal>
                ))
              ) : (
                <p className="border-t border-white/10 py-6 text-sm text-ash">
                  No resources of this type yet — nothing has been published in
                  this category.
                </p>
              )}
            </div>

            <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-ash/70">
              {knowledgeNotice}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
