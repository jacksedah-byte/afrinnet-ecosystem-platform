import { Reveal } from "@/components/site/Reveal";
import { Container, SectionHeading, Callout } from "@/components/site/primitives";
import { ContinentMap } from "@/components/site/ContinentMap";
import { homepageContent } from "@/content/homepage";
import { useCmsModule } from "@/hooks/use-cms-module";

/** Homepage Section 7 — Pan-African vision map (no coverage claims). */
export function PanAfrica() {
  const { panAfrica } = useCmsModule("homepage", homepageContent);
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-ink py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 afr-dot-bg opacity-25" />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow={panAfrica.eyebrow}
              title={panAfrica.title}
              lede={panAfrica.description}
            />
            <Reveal delay={0.1}>
              <Callout tone="navy" title={panAfrica.calloutTitle} className="mt-6">
                {panAfrica.callout}
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
