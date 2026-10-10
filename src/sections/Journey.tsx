import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, SectionHeading } from "@/components/site/primitives";
import { JourneyTimeline } from "@/components/site/JourneyTimeline";

/** Homepage Section 5 — how AFRINNET works (five-step journey). */
export function Journey() {
  return (
    <section id="journey" className="bg-obsidian py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How AFRINNET works"
          title="A clear journey from discovery to advancement"
          lede="Every innovation moves at its own pace. The journey describes the steps involved — not a promise of outcomes."
          align="center"
          className="mb-14"
        />

        <JourneyTimeline />

        <Reveal delay={0.1}>
          <Callout tone="green" title="What submission means" className="mt-12">
            Submission starts a review — it does not automatically qualify an
            innovation for registration, funding or commercialisation, and it does
            not itself establish intellectual property rights. Where an innovation
            progresses, it does so because the relevant review and connections
            support it.
          </Callout>
        </Reveal>
      </Container>
    </section>
  );
}
