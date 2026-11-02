import { Reveal } from "@/components/site/Reveal";
import { Container, SectionHeading } from "@/components/site/primitives";
import { EcosystemHub } from "@/components/site/EcosystemHub";
import { homepageContent } from "@/content/homepage";
import { useCmsModule } from "@/hooks/use-cms-module";

/** Homepage Section 6 — the institutional ecosystem (deep navy). */
export function EcosystemSection() {
  const { ecosystem } = useCmsModule("homepage", homepageContent);
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-navy-deep py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 afr-grid-bg opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-innovation/10 blur-3xl"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow={ecosystem.eyebrow}
          title={ecosystem.title}
          lede={ecosystem.description}
          align="center"
        />

        <Reveal className="mt-14">
          <EcosystemHub />
        </Reveal>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm leading-6 text-ash">
          {ecosystem.note}
        </p>
      </Container>
    </section>
  );
}
