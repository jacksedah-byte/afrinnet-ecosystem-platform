import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton, StatusBadge } from "@/components/site/primitives";
import { missionVision } from "@/content/about";
import { roadmapPhases } from "@/content/site";

export default function MissionVision() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "About AFRINNET", href: "/about" },
          { label: "Mission, Vision & Strategy" },
        ]}
        eyebrow={missionVision.eyebrow}
        title={missionVision.title}
        lede="A clear statement of what AFRINNET is trying to achieve, the principles it works by, and how the institution intends to build."
      />

      {/* Vision & mission */}
      <section className="border-b border-white/10 bg-ink py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal className="rounded-2xl border border-innovation/30 bg-innovation/[0.06] p-7 sm:p-9">
              <p className="afr-eyebrow text-innovation">Vision</p>
              <p className="mt-4 font-display text-xl font-semibold leading-8 tracking-tight text-chalk sm:text-2xl sm:leading-9">
                {missionVision.vision}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="rounded-2xl border border-white/12 bg-obsidian p-7 sm:p-9">
              <p className="afr-eyebrow text-innovation">Mission</p>
              <p className="mt-4 font-display text-xl font-semibold leading-8 tracking-tight text-chalk sm:text-2xl sm:leading-9">
                {missionVision.mission}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Strategic objectives */}
      <section className="bg-obsidian py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="afr-eyebrow text-innovation">Strategic objectives</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-chalk sm:text-4xl">
              Five objectives, one direction
            </h2>
          </div>

          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {missionVision.objectives.map((obj, i) => (
              <Reveal
                key={obj.title}
                delay={(i % 3) * 0.08}
                as="li"
                className="h-full rounded-xl border border-white/10 bg-ink/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-innovation/60"
              >
                  <span className="font-display text-sm font-bold tracking-[0.16em] text-innovation">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-chalk">
                    {obj.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ash">{obj.text}</p>
              </Reveal>
            ))}
          </ol>

          {/* Values */}
          <div className="mt-14 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {missionVision.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.07}>
                <div>
                  <span className="block h-px w-10 bg-innovation" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-base font-bold tracking-tight text-chalk">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ash">{value.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Roadmap */}
      <section className="border-t border-white/10 bg-ink py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="afr-eyebrow text-innovation">Building in phases</p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-chalk sm:text-4xl">
                The digital platform roadmap
              </h2>
              <p className="mt-4 text-sm leading-7 text-ash">
                These are recommended development phases for AFRINNET's digital
                infrastructure — a plan, not a claim that these systems already
                exist. Each phase will be described publicly as it is delivered.
              </p>
            </div>
            <StatusBadge tone="developing">Planning document</StatusBadge>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {roadmapPhases.map((phase, i) => (
              <Reveal key={phase.phase} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-xl border border-white/10 bg-obsidian/70 p-6 transition-colors duration-300 hover:border-innovation/50">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-xs font-bold uppercase tracking-[0.18em] text-innovation">
                      {phase.phase}
                    </span>
                    <StatusBadge tone="neutral">Planned</StatusBadge>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-chalk">
                    {phase.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {phase.deliverables.map((d) => (
                      <li key={d} className="flex gap-2.5 text-sm leading-6 text-ash">
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-innovation/70"
                          aria-hidden="true"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.16}>
              <Callout tone="green" className="h-full">
                <p className="font-display text-sm font-bold text-chalk">
                  What is live today
                </p>
                <p className="mt-2">
                  The public website, knowledge centre, enquiry routing and
                  innovation submission intake are operational. Everything beyond
                  that is labelled as in development across the site.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <LinkButton href="/submit" size="sm" variant="primary">
                    Submit an innovation
                  </LinkButton>
                  <LinkButton href="/contact" size="sm" variant="outline">
                    Contact
                  </LinkButton>
                </div>
              </Callout>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
