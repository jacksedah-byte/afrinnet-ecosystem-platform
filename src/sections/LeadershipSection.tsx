import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Container, SectionHeading, StatusBadge } from "@/components/site/primitives";
import { PortraitSlot } from "@/components/site/PortraitSlot";
import { founder, executiveLead } from "@/content/leadership";

function ProfileCard({
  person,
  href,
  cta,
}: {
  person: typeof founder;
  href: string;
  cta: string;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-[168px_1fr] sm:gap-7">
      <PortraitSlot
        initials={person.portrait.initials}
        note={person.portrait.note}
        name={person.name}
      />
      <div>
        <p className="afr-eyebrow text-innovation">{person.title}</p>
        <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-chalk">
          {person.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-ash">{person.shortBio}</p>
        <Link
          to={href}
          className="group mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold text-innovation transition-colors hover:text-innovation-bright"
        >
          {cta}
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

/**
 * Homepage leadership feature — integral to AFRINNET's identity, placed after
 * the institutional ecosystem section.
 */
export function LeadershipSection() {
  return (
    <section className="bg-obsidian py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Leadership & Governance"
            title="The People and Principles Behind AFRINNET"
            lede="Founder-led and institutionally governed — with leadership structures being built in the open."
          />
          <Link
            to="/leadership"
            className="group inline-flex shrink-0 items-center gap-2 font-display text-sm font-semibold text-innovation transition-colors hover:text-innovation-bright"
          >
            Leadership & Governance
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-white/10 bg-ink/70 p-6 sm:p-8">
            <ProfileCard
              person={founder}
              href="/leadership/founder"
              cta="Read the founder's story"
            />
          </Reveal>
          <Reveal
            delay={0.1}
            className="rounded-2xl border border-white/10 bg-ink/70 p-6 sm:p-8"
          >
            <ProfileCard
              person={executiveLead}
              href="/leadership/executive"
              cta="Full profile"
            />
          </Reveal>
        </div>

        {/* Board & governance feature */}
        <Reveal delay={0.05}>
          <div className="mt-6 grid gap-6 rounded-2xl border border-white/10 bg-ink/50 p-6 sm:p-8 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg font-bold tracking-tight text-chalk">
                  Board & Governance
                </h3>
                <StatusBadge tone="developing">Board being constituted</StatusBadge>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ash">
                AFRINNET's Board of Directors is being formally constituted. The
                governance portfolios — Board Chair, Finance & Audit, Academic
                Partnerships and Intellectual Property — are published as
                structural placeholders until appointments are confirmed.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/leadership/board"
                  className="rounded-md border border-white/20 px-4 py-2 font-display text-sm font-semibold text-chalk transition-colors hover:border-innovation hover:text-innovation"
                >
                  View governance portfolios
                </Link>
                <Link
                  to="/leadership/governance"
                  className="rounded-md px-2 py-2 font-display text-sm font-semibold text-ash transition-colors hover:text-chalk"
                >
                  Institutional structure →
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-obsidian/60 p-5">
              <p className="afr-eyebrow text-ash/80">Management Committee</p>
              <p className="mt-2.5 text-sm leading-6 text-ash">
                The Executive Lead is joined by four functional roles — Monitoring,
                Evaluation & Learning, Programmes, Partnerships and Communications
                — currently being recruited.
              </p>
              <Link
                to="/leadership/management"
                className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-innovation transition-colors hover:text-innovation-bright"
              >
                See the management team <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
