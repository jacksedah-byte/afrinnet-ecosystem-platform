import { Link } from "react-router";
import { useQuery } from "convex/react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton, StatusBadge } from "@/components/site/primitives";
import { newsEmptyState } from "@/content/resources";
import { api } from "@/convex/_generated/api";
import { Newspaper, CalendarDays, Megaphone, Award } from "lucide-react";

const WILL_APPEAR = [
  { icon: Megaphone, title: "Announcements", text: "Institutional updates, network news and partnership confirmations." },
  { icon: CalendarDays, title: "Programmes & events", text: "Application windows, clinics, workshops and conferences — once confirmed." },
  { icon: Award, title: "Opportunities", text: "Challenges, calls for participation and funded programmes we are involved in." },
  { icon: Newspaper, title: "Stories", text: "Innovation stories and ecosystem insights, published with consent." },
];

export default function News() {
  const content = useQuery(api.cms.publishedContent);
  const articles = content?.filter((item) => item.type === "news") ?? [];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "News & Events" }]}
        eyebrow="News & Events"
        title="Announcements, programmes and opportunities"
        lede="Everything AFRINNET publishes about its work — announced here only once it is confirmed."
        actions={
          <>
            <LinkButton href="/#newsletter" variant="primary">
              Subscribe for updates
            </LinkButton>
            <LinkButton href="/contact" variant="outline">
              Media enquiries
            </LinkButton>
          </>
        }
      />

      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          {articles.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {articles.map((article) => (
                <Reveal key={article._id}>
                  <Link
                    to={article.path || `/news/${article.slug}`}
                    className="block h-full rounded-2xl border border-white/10 bg-ink/70 p-6 transition-colors hover:border-innovation/60"
                  >
                    <p className="afr-eyebrow text-innovation">News &amp; Events</p>
                    <h2 className="mt-3 font-display text-xl font-bold text-chalk">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="mt-3 text-sm leading-6 text-ash">{article.summary}</p>
                    )}
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="rounded-2xl border border-dashed border-white/15 bg-ink/60 p-8 text-center sm:p-12">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-innovation/40 bg-innovation/10 text-innovation">
                  <Newspaper className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-chalk">
                  {newsEmptyState.title}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ash">
                  {newsEmptyState.body}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <LinkButton href="/#newsletter" variant="primary">
                    {newsEmptyState.cta.label}
                  </LinkButton>
                  <LinkButton href="/knowledge" variant="outline">
                    Browse the Knowledge Centre
                  </LinkButton>
                </div>
              </div>
            </Reveal>
          )}

          {/* What will appear */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WILL_APPEAR.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={(i % 4) * 0.07}>
                  <div className="h-full rounded-xl border border-white/10 bg-ink/70 p-5">
                    <span className="flex size-9 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-innovation">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-bold tracking-tight text-chalk">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ash">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Callout tone="neutral" title="Why this page starts empty">
              Placeholder deadlines, invented programme launches and unconfirmed
              partnerships erode trust. This page fills up as announcements are
              approved for publication — nothing is staged here to look busy.
            </Callout>
            <Callout tone="green" title="Media & speaking enquiries">
              Journalists and event organisers can route an enquiry directly to
              the right team through the contact form, selecting “Media &
              speaking”.
              <div className="mt-4">
                <LinkButton href="/contact?type=media" size="sm" variant="primary">
                  Make a media enquiry
                </LinkButton>
              </div>
            </Callout>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StatusBadge tone="neutral">Archive launches with the first publication</StatusBadge>
            <span className="text-xs text-ash/70">
              Individual article pages activate as stories are published.
            </span>
          </div>
        </Container>
      </section>
    </>
  );
}
