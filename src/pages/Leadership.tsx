import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import {
  Callout,
  Container,
  LinkButton,
  SectionHeading,
  StatusBadge,
} from "@/components/site/primitives";
import { PortraitSlot } from "@/components/site/PortraitSlot";
import {
  boardIntro,
  executiveLead,
  founder,
  governance,
  leadershipOverview,
  managementIntro,
} from "@/content/leadership";

const GOVERNANCE_LINKS = [
  {
    href: "/leadership/founder",
    label: "Our Founder",
    blurb: "Samson Ngengi Njuguna — the story and philosophy behind AFRINNET",
    status: "Published draft",
    tone: "neutral" as const,
  },
  {
    href: "/leadership/executive",
    label: "Executive Leadership",
    blurb: "Jack Sedah — day-to-day leadership and institutional development",
    status: "Published draft",
    tone: "neutral" as const,
  },
  {
    href: "/leadership/board",
    label: "Board of Directors",
    blurb: "Governance portfolios and constitutional arrangements",
    status: "Appointments pending",
    tone: "developing" as const,
  },
  {
    href: "/leadership/management",
    label: "Management Committee",
    blurb: "Functional leadership team delivering programmes and operations",
    status: "Recruitment in progress",
    tone: "developing" as const,
  },
  {
    href: "/leadership/governance",
    label: "Governance & Structure",
    blurb: "How governance and executive management relate",
    status: "Indicative structure",
    tone: "neutral" as const,
  },
];

export default function Leadership() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Leadership & Governance" }]}
        eyebrow={leadershipOverview.eyebrow}
        title={leadershipOverview.title}
        lede={leadershipOverview.lede}
        tone="navy"
        actions={
          <>
            <LinkButton href="/leadership/founder" variant="primary">
              Read the founder's story
            </LinkButton>
            <LinkButton href="/leadership/governance" variant="outline">
              Governance & structure
            </LinkButton>
          </>
        }
      />

      {/* Purpose */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {leadershipOverview.purpose.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-base leading-7 text-ash">{p}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured profiles */}
      <section className="border-y border-white/10 bg-ink py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Featured leadership"
            title="Founder and Executive Lead"
            lede="The two roles carrying AFRINNET's vision and its day-to-day execution."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-2xl border border-white/10 bg-obsidian/70 p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-[190px_1fr]">
                <PortraitSlot
                  initials={founder.portrait.initials}
                  note={founder.portrait.note}
                  name={founder.name}
                />
                <div>
                  <p className="afr-eyebrow text-innovation">{founder.title}</p>
                  <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-chalk">
                    {founder.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ash">
                    {founder.shortBio}
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <Link
                      to="/leadership/founder"
                      className="group inline-flex items-center gap-2 font-display text-sm font-semibold text-innovation hover:text-innovation-bright"
                    >
                      Full profile
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      to="/leadership/founder#story"
                      className="group inline-flex items-center gap-2 font-display text-sm font-semibold text-ash hover:text-chalk"
                    >
                      Why AFRINNET exists
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="rounded-2xl border border-white/10 bg-obsidian/70 p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-[190px_1fr]">
                <PortraitSlot
                  initials={executiveLead.portrait.initials}
                  note={executiveLead.portrait.note}
                  name={executiveLead.name}
                />
                <div>
                  <p className="afr-eyebrow text-innovation">{executiveLead.title}</p>
                  <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-chalk">
                    {executiveLead.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ash">
                    {executiveLead.shortBio}
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <Link
                      to="/leadership/executive"
                      className="group inline-flex items-center gap-2 font-display text-sm font-semibold text-innovation hover:text-innovation-bright"
                    >
                      Full profile
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      to="/leadership/management"
                      className="group inline-flex items-center gap-2 font-display text-sm font-semibold text-ash hover:text-chalk"
                    >
                      Management Committee
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Board + management intros */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-2xl border border-white/10 bg-ink/60 p-7">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-xl font-bold tracking-tight text-chalk">
                  {boardIntro.title}
                </h3>
                <StatusBadge tone="developing">Being constituted</StatusBadge>
              </div>
              {boardIntro.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="mt-3 text-sm leading-6 text-ash">
                  {p}
                </p>
              ))}
              <Link
                to="/leadership/board"
                className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-innovation hover:text-innovation-bright"
              >
                View governance portfolios <ArrowRight className="size-4" />
              </Link>
            </Reveal>

            <Reveal delay={0.1} className="rounded-2xl border border-white/10 bg-ink/60 p-7">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-xl font-bold tracking-tight text-chalk">
                  {managementIntro.title}
                </h3>
                <StatusBadge tone="developing">Recruiting through 2026</StatusBadge>
              </div>
              {managementIntro.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="mt-3 text-sm leading-6 text-ash">
                  {p}
                </p>
              ))}
              <Link
                to="/leadership/management"
                className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-innovation hover:text-innovation-bright"
              >
                See the committee <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>

          {/* Structure preview */}
          <Reveal delay={0.05}>
            <div className="mt-6 rounded-2xl border border-white/10 bg-ink/60 p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-chalk">
                    {governance.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ash">
                    {governance.lede}
                  </p>
                </div>
                <LinkButton href="/leadership/governance" variant="outline">
                  Open the structure
                </LinkButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* All governance links */}
      <section className="border-t border-white/10 bg-ink py-14 sm:py-20">
        <Container>
          <h2 className="font-display text-2xl font-bold tracking-tight text-chalk">
            Leadership & governance pages
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GOVERNANCE_LINKS.map((link, i) => (
              <Reveal key={link.href} delay={(i % 3) * 0.07}>
                <Link
                  to={link.href}
                  className="group flex h-full flex-col rounded-xl border border-white/10 bg-obsidian/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-innovation/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-base font-bold tracking-tight text-chalk group-hover:text-innovation">
                      {link.label}
                    </h3>
                    <ArrowRight
                      className="mt-0.5 size-4 shrink-0 text-innovation transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ash">{link.blurb}</p>
                  <span className="mt-4 inline-block">
                    <StatusBadge tone={link.tone}>{link.status}</StatusBadge>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Callout tone="neutral" className="mt-8">
            AFRINNET distinguishes between its Founder, its Executive Lead, the
            Board of Directors and the Management Committee. Executive leadership
            is not board governance, and illustrative roles are never presented as
            filled appointments.
          </Callout>
        </Container>
      </section>
    </>
  );
}
