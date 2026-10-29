import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Container, LinkButton, StatusBadge } from "@/components/site/primitives";
import { api } from "@/convex/_generated/api";
import {
  knowledgeNotice,
  resourceTopics,
  resources,
  type Resource,
  type ResourceType,
} from "@/content/resources";

const TYPES = [
  "All types",
  "Learning resource",
  "IP guide",
  "Toolkit",
  "Policy brief",
  "Report",
  "Case study",
] as const;

function ResourceCard({ item }: { item: Resource }) {
  const live = item.status === "live" && !!item.href;

  const body = (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-innovation">
          {item.type}
        </span>
        <span className="size-1 rounded-full bg-ash/50" aria-hidden="true" />
        <span className="text-xs text-ash/70">{item.dateLabel}</span>
      </div>
      <h3 className="mt-2.5 font-display text-lg font-bold leading-6 tracking-tight text-chalk transition-colors group-hover:text-innovation">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-ash">{item.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[0.7rem] text-ash">
          {item.topic}
        </span>
        {live ? (
          <span className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-innovation">
            Read online
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        ) : (
          <StatusBadge tone="neutral">Forthcoming — not yet published</StatusBadge>
        )}
      </div>
    </>
  );

  if (live) {
    return (
      <Link
        to={item.href!}
        className="group block h-full rounded-2xl border border-white/10 bg-ink/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-innovation/60"
      >
        {body}
      </Link>
    );
  }

  return (
    <article className="h-full rounded-2xl border border-white/10 bg-ink/40 p-6 opacity-90">
      {body}
    </article>
  );
}

/** Knowledge Centre — searchable, filterable institutional library. */
export default function Knowledge({ presetType }: { presetType?: string }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>(presetType ?? "All types");
  const [topic, setTopic] = useState("All topics");
  const [order, setOrder] = useState<"published-first" | "type">("published-first");
  const content = useQuery(api.cms.publishedContent);
  const { allResources, allTopics } = useMemo(() => {
    const cmsResources = (content ?? [])
      .filter((item) => item.type === "resource")
      .map(
        (item): Resource => ({
          id: item.slug,
          title: item.title,
          type: "Learning resource" satisfies ResourceType,
          topic: "AFRINNET",
          status: "live",
          dateLabel: `Updated ${new Date(item.updatedAt).toLocaleDateString()}`,
          summary: item.summary || item.body.slice(0, 240),
          href: item.path || `/knowledge/${item.slug}`,
        }),
      );
    const resourceIds = new Set(cmsResources.map((item) => item.id));
    const allResources = [
      ...resources.filter((item) => !resourceIds.has(item.id)),
      ...cmsResources,
    ];
    const allTopics = [
      ...new Set([...resourceTopics, ...cmsResources.map((item) => item.topic)]),
    ];
    return { allResources, allTopics };
  }, [content]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = allResources.filter((r) => {
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q);
      const matchesType = type === "All types" || r.type === type;
      const matchesTopic = topic === "All topics" || r.topic === topic;
      return matchesQuery && matchesType && matchesTopic;
    });

    items = [...items].sort((a, b) =>
      order === "published-first"
        ? Number(b.status === "live") - Number(a.status === "live")
        : a.type.localeCompare(b.type),
    );

    return items;
  }, [allResources, query, type, topic, order]);

  const liveCount = allResources.filter((r) => r.status === "live").length;

  return (
    <>
      <PageHeader
        crumbs={[{ label: presetType ? "Publications & Policy Briefs" : "Knowledge Centre" }]}
        eyebrow="Knowledge & Resources"
        title={presetType ? "Publications & Policy Briefs" : "Knowledge Centre"}
        lede="A searchable library of AFRINNET's institutional knowledge — guides you can read today, with research and policy output listed as it is approved for release."
        actions={
          <>
            <LinkButton href="/knowledge" variant={presetType ? "outline" : "primary"}>
              {presetType ? "Browse all resources" : "Publications & policy briefs"}
            </LinkButton>
            <LinkButton href="/contact?type=support" variant="outline">
              Request a resource
            </LinkButton>
          </>
        }
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StatusBadge tone="available">{liveCount} live resources</StatusBadge>
          <StatusBadge tone="developing">
            {allResources.length - liveCount} forthcoming
          </StatusBadge>
        </div>
      </PageHeader>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-white/10 bg-obsidian/95 py-4 backdrop-blur-md xl:top-[72px]">
        <Container>
          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Search resources</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ash"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, topics, summaries…"
                className="h-10 w-full rounded-md border border-white/15 bg-ink/80 pl-9 pr-3 text-sm text-chalk placeholder:text-ash/60 outline-none transition-colors focus:border-innovation"
              />
            </label>

            <label className="block">
              <span className="sr-only">Filter by type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-10 w-full rounded-md border border-white/15 bg-ink/80 px-3 text-sm text-chalk outline-none transition-colors focus:border-innovation"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t} className="bg-obsidian">
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Filter by topic</span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-10 w-full rounded-md border border-white/15 bg-ink/80 px-3 text-sm text-chalk outline-none transition-colors focus:border-innovation"
              >
                <option className="bg-obsidian">All topics</option>
                {allTopics.map((t) => (
                  <option key={t} value={t} className="bg-obsidian">
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Sort order</span>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as "published-first" | "type")}
                className="h-10 w-full rounded-md border border-white/15 bg-ink/80 px-3 text-sm text-chalk outline-none transition-colors focus:border-innovation"
              >
                <option value="published-first" className="bg-obsidian">
                  Published first
                </option>
                <option value="type" className="bg-obsidian">
                  By type
                </option>
              </select>
            </label>
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs text-ash/70">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            {filtered.length} of {allResources.length} records shown
            {(query || type !== "All types" || topic !== "All topics") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setType("All types");
                  setTopic("All topics");
                }}
                className="ml-1 font-semibold text-innovation underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            )}
          </p>
        </Container>
      </section>

      {/* Results */}
      <section className="bg-obsidian py-12 sm:py-16">
        <Container>
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => (
                <Reveal key={item.id} delay={(i % 3) * 0.06}>
                  <ResourceCard item={item} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-ink/50 p-10 text-center">
              <p className="font-display text-lg font-bold text-chalk">
                No resources match those filters
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ash">
                Try a broader search, or clear the filters to see every record.
                Nothing has been published in this category yet.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setType("All types");
                  setTopic("All topics");
                }}
                className="mt-5 rounded-md border border-white/20 px-4 py-2 font-display text-sm font-semibold text-chalk transition-colors hover:border-innovation hover:text-innovation"
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="mt-10 rounded-2xl border border-white/10 bg-ink/60 p-6">
            <p className="font-display text-sm font-bold text-chalk">
              About the records in this library
            </p>
            <p className="mt-2 text-sm leading-6 text-ash">{knowledgeNotice}</p>
            <p className="mt-3 text-sm leading-6 text-ash">
              When a publication is released, its record includes the full title,
              publication date, summary, author where verified, and a download or
              reading page.{" "}
              <Link
                to="/#newsletter"
                className="font-semibold text-innovation underline-offset-4 hover:underline"
              >
                Subscribe for release updates
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
