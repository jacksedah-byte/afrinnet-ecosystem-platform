import { Link } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, RevealGroup } from "@/components/site/Reveal";
import {
  Callout,
  Container,
  GreenRule,
  LinkButton,
} from "@/components/site/primitives";
import { aboutIntro, faqs, mandate, timeline } from "@/content/about";

export default function About() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "About AFRINNET" }]}
        eyebrow={aboutIntro.eyebrow}
        title={aboutIntro.title}
        lede={aboutIntro.lede}
        actions={
          <>
            <LinkButton href="/about/mission-vision" variant="primary">
              Mission, vision & strategy
            </LinkButton>
            <LinkButton href="/leadership" variant="outline">
              Leadership & governance
            </LinkButton>
          </>
        }
      />

      {/* Who we are / what we do — light reading surface */}
      <section className="bg-mist py-16 text-obsidian sm:py-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-14">
            {aboutIntro.sections.map((section, i) => (
              <Reveal key={section.title} delay={i * 0.1}>
                <div>
                  <p className="afr-eyebrow text-[#12803F]">
                    {String(i + 1).padStart(2, "0")} — {section.title}
                  </p>
                  <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-obsidian sm:text-3xl">
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-4">
                    {section.paragraphs.map((p) => (
                      <p key={p.slice(0, 32)} className="text-base leading-7 text-obsidian/75">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mandate / principles / theory of change */}
          <div className="mt-14 grid gap-6 border-t border-obsidian/10 pt-10 md:grid-cols-3">
            {mandate.detail.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div>
                  <GreenRule className="mb-4" />
                  <h3 className="font-display text-base font-bold tracking-tight text-obsidian">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-obsidian/70">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Mandate statement */}
      <section className="border-y border-white/10 bg-ink py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <p className="afr-eyebrow text-innovation">Mandate in one line</p>
              <h2 className="mt-5 font-display text-3xl font-bold leading-[1.14] tracking-tight text-chalk sm:text-4xl">
                {mandate.statement}
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {mandate.principles.map((p) => (
                  <div key={p.title} className="border-t border-white/10 pt-4">
                    <span className="font-display text-xs font-bold tracking-[0.16em] text-innovation">
                      {p.number}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-chalk">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-ash">{p.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <Callout tone="green" title="What AFRINNET does not do">
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Grant patents, trademarks, copyright or design rights</li>
                  <li>Provide legal advice in place of qualified professionals</li>
                  <li>Promise funding, registration or commercial outcomes</li>
                  <li>Publish partnerships or coverage that has not been confirmed</li>
                </ul>
              </Callout>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Organisational timeline */}
      <section className="bg-obsidian py-16 sm:py-24">
        <Container>
          <p className="afr-eyebrow text-innovation">Organisational development</p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-chalk sm:text-4xl">
            From experience to institution
          </h2>

          <ol className="mt-10 grid gap-6 md:grid-cols-5">
            {timeline.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} as="li" className="relative h-full border-t border-white/12 pt-5">
                  <span
                    className="absolute -top-1 left-0 h-px w-full bg-linear-to-r from-innovation to-transparent"
                    aria-hidden="true"
                  />
                  <span className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-innovation">
                    {item.phase}
                  </span>
                  <h3 className="mt-2.5 font-display text-base font-bold leading-6 tracking-tight text-chalk">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ash">{item.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/10 bg-ink py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="afr-eyebrow text-innovation">Frequently asked questions</p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-chalk sm:text-4xl">
                Straight answers
              </h2>
              <p className="mt-4 text-sm leading-6 text-ash">
                If your question is not covered, the contact form routes it to the
                right team.
              </p>
              <LinkButton href="/contact" variant="outline" className="mt-6">
                Ask a question
              </LinkButton>
            </div>

            <Reveal>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={faq.q} value={`faq-${i}`}>
                    <AccordionTrigger className="py-5 font-display text-base font-semibold text-chalk hover:text-innovation">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-7 text-ash">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>

          <RevealGroup className="mt-14 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-3">
            <Link
              to="/ecosystem"
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-innovation/60"
            >
              <span className="font-display text-sm font-bold text-chalk">
                Innovation ecosystem
              </span>
              <span className="mt-1.5 block text-sm text-ash">
                Services, journey and institutional networks
              </span>
            </Link>
            <Link
              to="/ip"
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-innovation/60"
            >
              <span className="font-display text-sm font-bold text-chalk">
                IP services
              </span>
              <span className="mt-1.5 block text-sm text-ash">
                Protection types, readiness and referrals
              </span>
            </Link>
            <Link
              to="/partnerships"
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-innovation/60"
            >
              <span className="font-display text-sm font-bold text-chalk">
                Partner with AFRINNET
              </span>
              <span className="mt-1.5 block text-sm text-ash">
                Institutional engagement and collaboration
              </span>
            </Link>
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
