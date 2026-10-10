import { Reveal } from "@/components/site/Reveal";
import { Container, GreenRule } from "@/components/site/primitives";
import { mandate } from "@/content/about";

/** Homepage Section 3 — the AFRINNET mandate: statement + three principles. */
export function Mandate() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-ink py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 afr-grid-bg opacity-50" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* Statement */}
          <Reveal>
            <p className="afr-eyebrow text-innovation">The AFRINNET mandate</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.14] tracking-tight text-chalk sm:text-4xl lg:text-[2.9rem]">
              {mandate.statement}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {mandate.detail.map((item) => (
                <div key={item.title}>
                  <GreenRule className="mb-3" />
                  <h3 className="font-display text-sm font-bold tracking-tight text-chalk">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ash">{item.text}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Principles */}
          <ul className="space-y-8">
            {mandate.principles.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 0.12} as="li" className="flex gap-6 border-t border-white/10 pt-7">
                  <span className="font-display text-sm font-bold tracking-[0.14em] text-innovation">
                    {principle.number}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-chalk sm:text-2xl">
                      {principle.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-ash sm:text-base">
                      {principle.text}
                    </p>
                  </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
