import { PersonProfile, ProfileCtas } from "@/components/site/PersonProfile";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton } from "@/components/site/primitives";
import { executiveLead } from "@/content/leadership";

const FOCUS = [
  {
    title: "Strategic execution",
    text: "Turning the institutional roadmap into sequenced, deliverable action.",
  },
  {
    title: "Organisational development",
    text: "Building the operational frameworks, processes and roles the foundation needs.",
  },
  {
    title: "Programme coordination",
    text: "Connecting discovery, IP support and institutional collaboration into working programmes.",
  },
  {
    title: "Digital systems",
    text: "Advancing the infrastructure behind submissions, records and partner workflows.",
  },
  {
    title: "Partnership building",
    text: "Developing relationships with institutions, industry and development partners.",
  },
];

export default function ExecutiveProfile() {
  return (
    <>
      <PersonProfile
        profile={executiveLead}
        crumbs={[
          { label: "Leadership & Governance", href: "/leadership" },
          { label: "Executive Leadership" },
        ]}
        actions={
          <>
            <a
              href="#focus"
              className="inline-flex h-10 items-center rounded-md bg-innovation px-6 font-display text-sm font-semibold text-obsidian transition-colors hover:bg-innovation-bright"
            >
              Areas of focus
            </a>
            <LinkButton href="/leadership/management" variant="outline">
              Management Committee →
            </LinkButton>
          </>
        }
      />

      <section
        id="focus"
        className="border-y border-white/10 bg-ink py-16 sm:py-20"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="afr-eyebrow text-innovation">Areas of responsibility</p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-chalk sm:text-4xl">
                What the Executive Lead focuses on
              </h2>
              <p className="mt-4 text-sm leading-7 text-ash">
                The Executive Lead translates AFRINNET's vision into practical
                systems, programmes and institutional processes — working
                alongside the Founder and the wider leadership team.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {FOCUS.map((item, i) => (
                <Reveal key={item.title} delay={(i % 2) * 0.07}>
                  <div className="h-full rounded-xl border border-white/10 bg-obsidian/70 p-5 transition-colors duration-300 hover:border-innovation/50">
                    <span className="block h-px w-8 bg-innovation" aria-hidden="true" />
                    <h3 className="mt-4 font-display text-base font-bold tracking-tight text-chalk">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ash">{item.text}</p>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={0.14} className="sm:col-span-2">
                <Callout tone="green">
                  The Executive Lead is an executive management role. It is
                  separate from the Board of Directors, which is AFRINNET's
                  governance body.
                </Callout>
              </Reveal>
            </div>
          </div>

          <ProfileCtas
            links={[
              { label: "Governance & structure", href: "/leadership/governance" },
              { label: "Board of Directors", href: "/leadership/board" },
              { label: "Partner with AFRINNET", href: "/partnerships", primary: true },
            ]}
          />
        </Container>
      </section>
    </>
  );
}
