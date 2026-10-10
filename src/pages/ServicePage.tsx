import { Link, useParams } from "react-router";
import { Check, HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import {
  Callout,
  Container,
  LinkButton,
  StatusBadge,
} from "@/components/site/primitives";
import NotFound from "./NotFound";
import { servicePages } from "@/content/services";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/** Template for /ecosystem/:slug — discovery, verification, networks, incubation. */
export default function ServicePage() {
  const { slug } = useParams();
  const service = slug ? servicePages[slug] : undefined;

  if (!service) return <NotFound embedded />;

  const isAvailable = service.status === "available";

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Innovation Ecosystem", href: "/ecosystem" },
          { label: service.title },
        ]}
        eyebrow={service.eyebrow}
        title={service.title}
        lede={service.summary}
        actions={
          <>
            <LinkButton href={service.cta.href} variant="primary">
              {service.cta.label}
            </LinkButton>
            {service.secondaryCta && (
              <LinkButton href={service.secondaryCta.href} variant="outline">
                {service.secondaryCta.label}
              </LinkButton>
            )}
          </>
        }
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StatusBadge tone={isAvailable ? "available" : "developing"}>
            {isAvailable ? "Available now" : "In development"}
          </StatusBadge>
        </div>
      </PageHeader>

      {/* Status note */}
      <section className="border-b border-white/10 bg-ink py-8">
        <Container>
          <Callout tone={isAvailable ? "green" : "navy"} title="Service status">
            {service.statusNote}
          </Callout>
        </Container>
      </section>

      {/* Intro + offerings */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div>
              <div className="space-y-5">
                {service.intro.map((p, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <p
                      className={
                        i === 0
                          ? "text-lg leading-8 text-chalk/90"
                          : "text-base leading-7 text-ash"
                      }
                    >
                      {p}
                    </p>
                  </Reveal>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                  Who this is for
                </h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {service.suitableFor.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-6 text-ash">
                      <Check className="mt-1 size-4 shrink-0 text-innovation" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                What this involves
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {service.offerings.map((item, i) => (
                  <Reveal key={item.title} delay={(i % 2) * 0.07}>
                    <div className="h-full rounded-xl border border-white/10 bg-ink/70 p-5 transition-colors duration-300 hover:border-innovation/50">
                      <span className="block h-px w-8 bg-innovation" aria-hidden="true" />
                      <h3 className="mt-4 font-display text-base font-bold tracking-tight text-chalk">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-ash">{item.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Steps + expectations */}
      <section className="border-y border-white/10 bg-ink py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                How it works
              </h2>
              <ol className="mt-6 space-y-5">
                {service.steps.map((step, i) => (
                  <Reveal
                    key={step.title}
                    delay={i * 0.07}
                    as="li"
                    className="relative flex gap-5 pl-1"
                  >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-innovation/60 bg-obsidian font-display text-xs font-bold text-innovation">
                        {i + 1}
                      </span>
                      <div className="pb-1">
                        <h3 className="font-display text-base font-bold tracking-tight text-chalk">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-ash">{step.text}</p>
                      </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                What to expect
              </h2>
              <ul className="mt-4 space-y-3">
                {service.expectations.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-white/10 bg-obsidian/70 p-4 text-sm leading-6 text-ash"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ + CTA */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <h2 className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-chalk">
                <HelpCircle className="size-5 text-innovation" aria-hidden="true" />
                Frequently asked questions
              </h2>
              <Accordion type="single" collapsible className="mt-5">
                {service.faqs.map((faq, i) => (
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
            </div>

            <div className="rounded-2xl border border-innovation/30 bg-innovation/[0.06] p-7">
              <p className="afr-eyebrow text-innovation">Next step</p>
              <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-chalk">
                {service.cta.label}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-ash">
                Take the first step with AFRINNET — or explore the related
                service first.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <LinkButton href={service.cta.href} variant="primary">
                  {service.cta.label}
                </LinkButton>
                {service.secondaryCta && (
                  <LinkButton href={service.secondaryCta.href} variant="outline">
                    {service.secondaryCta.label}
                  </LinkButton>
                )}
                <Link
                  to="/ecosystem"
                  className="text-center font-display text-sm font-semibold text-ash transition-colors hover:text-chalk"
                >
                  ← All ecosystem services
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
