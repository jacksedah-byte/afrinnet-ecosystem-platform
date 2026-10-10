import { Reveal } from "@/components/site/Reveal";
import { Container, SectionHeading } from "@/components/site/primitives";
import { EcosystemHub } from "@/components/site/EcosystemHub";

/** Homepage Section 6 — the institutional ecosystem (deep navy). */
export function EcosystemSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-navy-deep py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 afr-grid-bg opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-innovation/10 blur-3xl"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="The institutional ecosystem"
          title="One network, six constituencies"
          lede="AFRINNET connects the institutions and actors that make innovation ecosystems function — each with its own engagement route."
          align="center"
        />

        <Reveal className="mt-14">
          <EcosystemHub />
        </Reveal>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm leading-6 text-ash">
          Each category links to a dedicated page describing the value,
          engagement opportunities and next steps for that audience. Connections
          shown are illustrative of how the network is designed — not a
          statement of established coverage.
        </p>
      </Container>
    </section>
  );
}
