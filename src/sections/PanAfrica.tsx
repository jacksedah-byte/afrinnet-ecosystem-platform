import { Reveal } from "@/components/site/Reveal";
import { Container, SectionHeading, Callout } from "@/components/site/primitives";
import { ContinentMap } from "@/components/site/ContinentMap";

/** Homepage Section 7 — Pan-African vision map (no coverage claims). */
export function PanAfrica() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-ink py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 afr-dot-bg opacity-25" />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="Our pan-African vision"
              title="Building Connections Across Africa"
              lede="AFRINNET's ambition is to connect innovation ecosystems across the continent — region by region, institution by institution."
            />
            <Reveal delay={0.1}>
              <Callout tone="navy" title="On data and coverage" className="mt-6">
                We do not publish institutional locations, coverage figures or a
                pan-African footprint that has not been established. This map
                shows the regions AFRINNET is working to connect; verified
                institutions, programmes and innovation stories will appear as
                they are confirmed.
              </Callout>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <ContinentMap />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
