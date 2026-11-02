import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, SectionHeading } from "@/components/site/primitives";
import { JourneyTimeline } from "@/components/site/JourneyTimeline";
import { homepageContent } from "@/content/homepage";
import { useCmsModule } from "@/hooks/use-cms-module";

/** Homepage Section 5 — how AFRINNET works (five-step journey). */
export function Journey() {
  const { journey } = useCmsModule("homepage", homepageContent);
  return (
    <section id="journey" className="bg-obsidian py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={journey.eyebrow}
          title={journey.title}
          lede={journey.description}
          align="center"
          className="mb-14"
        />

        <JourneyTimeline />

        <Reveal delay={0.1}>
          <Callout tone="green" title={journey.calloutTitle} className="mt-12">
            {journey.callout}
          </Callout>
        </Reveal>
      </Container>
    </section>
  );
}
