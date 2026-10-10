import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton, StatusBadge } from "@/components/site/primitives";
import { boardIntro, boardPortfolios } from "@/content/leadership";

/** Neutral placeholder profile component — no fictional people or photos. */
function PortfolioPlaceholder({
  code,
  title,
  status,
  note,
}: {
  code: string;
  title: string;
  status: string;
  note: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/12 bg-ink/70 p-6 transition-colors duration-300 hover:border-navy">
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-sm font-bold tracking-[0.16em] text-innovation">
          {code}
        </span>
        <StatusBadge tone="developing">{status}</StatusBadge>
      </div>

      <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-chalk">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-6 text-ash">{note}</p>

      {/* Portrait placeholder — deliberately abstract, never a fictional person */}
      <div
        role="img"
        aria-label={`Portrait placeholder for ${title} — appointment pending`}
        className="mt-5 flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-obsidian/70"
      >
        <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-ash/60">
          Profile to be confirmed
        </span>
      </div>

      <div className="mt-4 space-y-1.5 text-xs leading-5 text-ash/70">
        <p>Name — to be published on confirmation</p>
        <p>Photograph — to be published on approval</p>
        <p>Biography — to be published on approval</p>
      </div>
    </div>
  );
}

export default function Board() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Leadership & Governance", href: "/leadership" },
          { label: "Board of Directors" },
        ]}
        eyebrow="Governance"
        title="Board of Directors"
        lede={boardIntro.paragraphs[0]}
        tone="navy"
        actions={
          <>
            <LinkButton href="/leadership/governance" variant="primary">
              Governance & structure
            </LinkButton>
            <LinkButton href="/contact?type=government" variant="outline">
              Governance enquiries
            </LinkButton>
          </>
        }
      />

      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl font-bold tracking-tight text-chalk">
                  Governance portfolios
                </h2>
                <StatusBadge tone="developing">Board being constituted</StatusBadge>
              </div>
              <p className="mt-4 max-w-2xl text-base leading-7 text-ash">
                {boardIntro.paragraphs[1]}
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {boardPortfolios.map((portfolio, i) => (
                  <Reveal key={portfolio.code} delay={(i % 2) * 0.08}>
                    <PortfolioPlaceholder {...portfolio} />
                  </Reveal>
                ))}
              </div>
            </div>

            <aside className="space-y-5">
              <Callout tone="navy" title="Our commitment on governance reporting">
                <p>
                  Once appointments are confirmed, each profile will support the
                  person's approved name, professional photograph, biography,
                  expertise, board responsibilities and committee assignments.
                </p>
              </Callout>

              <Callout tone="neutral" title="What is not published here">
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>No names or photographs are assigned to unfilled roles</li>
                  <li>No illustrative biographies or quotations are presented as fact</li>
                  <li>No committee memberships are implied before confirmation</li>
                </ul>
              </Callout>

              <div className="rounded-xl border border-white/10 bg-ink/70 p-5">
                <h3 className="font-display text-base font-bold tracking-tight text-chalk">
                  Related pages
                </h3>
                <ul className="mt-3 space-y-2">
                  {[
                    { label: "Leadership overview", href: "/leadership" },
                    { label: "Executive leadership", href: "/leadership/executive" },
                    { label: "Management Committee", href: "/leadership/management" },
                    { label: "Governance & structure", href: "/leadership/governance" },
                  ].map((link) => (
                    <li key={link.href}>
                      <LinkButton
                        href={link.href}
                        variant="soft"
                        size="sm"
                        className="w-full justify-start"
                      >
                        {link.label}
                      </LinkButton>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
