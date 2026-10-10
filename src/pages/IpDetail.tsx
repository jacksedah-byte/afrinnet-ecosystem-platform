import { Link, useParams } from "react-router";
import { AlertTriangle, ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton } from "@/components/site/primitives";
import NotFound from "./NotFound";
import { ipDisclaimer, ipOverview, ipTypes } from "@/content/ip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** Template for /ip/:slug — patents, trademarks, copyright, designs, readiness. */
export default function IpDetail() {
  const { slug } = useParams();
  const type = slug ? ipTypes[slug] : undefined;

  if (!type) return <NotFound embedded />;

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Intellectual Property Services", href: "/ip" },
          { label: type.title },
        ]}
        eyebrow={type.eyebrow}
        title={type.title}
        lede={type.summary}
        actions={
          <>
            <LinkButton href="/request-ip-support" variant="primary">
              Request IP support
            </LinkButton>
            <LinkButton href="/ip" variant="outline">
              All IP services
            </LinkButton>
          </>
        }
      />

      {/* Purpose — light reading surface for long-form explanation */}
      <section className="bg-mist py-14 text-obsidian sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
            <div>
              <p className="afr-eyebrow text-[#12803F]">Purpose & scope</p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-obsidian sm:text-3xl">
                What {type.title.toLowerCase()} protection is for
              </h2>
              <p className="mt-5 text-base leading-8 text-obsidian/75">
                {type.purpose}
              </p>
            </div>

            <div className="rounded-2xl border border-obsidian/15 bg-white/60 p-6">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="size-4 text-[#12803F]" aria-hidden="true" />
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-obsidian">
                  Important
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-obsidian/75">{ipDisclaimer}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Considerations + next steps */}
      <section className="border-y border-white/10 bg-ink py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                Eligibility & practical considerations
              </h2>
              <p className="mt-2 text-sm leading-6 text-ash">
                General guidance only — the exact tests depend on the
                jurisdiction and the right in question.
              </p>
              <ul className="mt-5 space-y-3">
                {type.considerations.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-lg border border-white/10 bg-obsidian/70 p-4 text-sm leading-6 text-ash"
                  >
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-innovation"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                Recommended next steps
              </h2>
              <p className="mt-2 text-sm leading-6 text-ash">
                What you can do now, before engaging a professional.
              </p>
              <ol className="mt-5 space-y-4">
                {type.nextSteps.map((step, i) => (
                  <Reveal key={step} delay={i * 0.06} as="li" className="flex gap-4">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-innovation/60 bg-obsidian font-display text-xs font-bold text-innovation">
                        {i + 1}
                      </span>
                      <p className="pt-1 text-sm leading-6 text-chalk/90">{step}</p>
                  </Reveal>
                ))}
              </ol>

              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton href="/request-ip-support" variant="primary">
                  Talk to AFRINNET about this
                </LinkButton>
                <LinkButton href="/ip/readiness" variant="soft">
                  Readiness assessment
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ + related */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                Frequently asked questions
              </h2>
              <Accordion type="single" collapsible className="mt-5">
                {type.faqs.map((faq, i) => (
                  <AccordionItem key={faq.q} value={`faq-${i}`}>
                    <AccordionTrigger className="py-4 font-display text-base font-semibold text-chalk hover:text-innovation">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-7 text-ash">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Callout tone="green" className="mt-8" title="Where rights actually come from">
                Rights are granted only by the relevant national or regional
                authorities. AFRINNET facilitates information, support and
                referrals — nothing on this page constitutes legal advice.
              </Callout>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                Other protection types
              </h2>
              <ul className="mt-5 space-y-2.5">
                {ipOverview.coverage
                  .filter((item) => !item.href.endsWith(type.slug))
                  .map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="group flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-ink/70 px-4 py-3.5 transition-colors duration-300 hover:border-innovation/60"
                      >
                        <span className="font-display text-sm font-semibold text-chalk group-hover:text-innovation">
                          {item.title}
                        </span>
                        <ArrowRight
                          className="size-4 shrink-0 text-innovation transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
              </ul>

              <div className="mt-6 rounded-xl border border-white/10 bg-ink/70 p-5">
                <p className="flex items-center gap-2 font-display text-sm font-bold text-chalk">
                  <Check className="size-4 text-innovation" aria-hidden="true" />
                  Remember
                </p>
                <p className="mt-2 text-sm leading-6 text-ash">
                  Public disclosure before filing can affect available options in
                  many systems. If you are unsure, seek advice before sharing
                  further.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
