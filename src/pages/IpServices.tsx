import { Link } from "react-router";
import { ArrowRight, Scale } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton, StatusBadge } from "@/components/site/primitives";
import { ipDisclaimer, ipOverview } from "@/content/ip";

export default function IpServices() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Intellectual Property Services" }]}
        eyebrow={ipOverview.eyebrow}
        title={ipOverview.title}
        lede={ipOverview.summary}
        actions={
          <>
            <LinkButton href="/request-ip-support" variant="primary">
              Request IP support
            </LinkButton>
            <LinkButton href="/ip/readiness" variant="outline">
              Assess your readiness
            </LinkButton>
          </>
        }
      />

      {/* Intro */}
      <section className="border-b border-white/10 bg-ink py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {ipOverview.intro.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p
                  className={
                    i === 0 ? "text-lg leading-8 text-chalk/90" : "text-base leading-7 text-ash"
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <Callout tone="green" title="Scope of AFRINNET's role" className="mt-10">
            {ipDisclaimer}
          </Callout>
        </Container>
      </section>

      {/* Coverage grid */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-chalk sm:text-3xl">
                What we help you understand
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ash">
                Each protection type has its own page explaining purpose,
                general considerations and practical next steps.
              </p>
            </div>
            <StatusBadge tone="neutral">Information & referrals</StatusBadge>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ipOverview.coverage.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.07}>
                <Link
                  to={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-ink/70 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-innovation/60"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-innovation transition-colors duration-300 group-hover:border-innovation/60">
                    <Scale className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold leading-6 tracking-tight text-chalk group-hover:text-innovation">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ash">{item.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-innovation">
                    Read more
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pathway */}
      <section className="border-t border-white/10 bg-ink py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="afr-eyebrow text-innovation">How support works</p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-chalk sm:text-3xl">
                Learn, assess, plan, refer
              </h2>
              <p className="mt-4 text-sm leading-7 text-ash">
                AFRINNET's IP support follows a consistent sequence so innovators
                understand their position before spending money or disclosing
                anything further.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <LinkButton href="/request-ip-support" variant="primary">
                  Request IP support
                </LinkButton>
                <LinkButton href="/ip/readiness" variant="outline">
                  Readiness assessment
                </LinkButton>
              </div>
            </div>

            <ol className="grid gap-4 sm:grid-cols-2">
              {ipOverview.pathways.map((step, i) => (
                <Reveal
                  key={step.title}
                  delay={(i % 2) * 0.08}
                  as="li"
                  className="h-full rounded-xl border border-white/10 bg-obsidian/70 p-5"
                >
                    <span className="font-display text-sm font-bold tracking-[0.16em] text-innovation">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-chalk">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ash">{step.text}</p>
                  </Reveal>
              ))}
            </ol>
          </div>

          <Callout tone="neutral" className="mt-10">
            Grant-funded IP registration support is being explored. Any scheme
            will be published with explicit eligibility criteria and availability
            — nothing is offered at this stage.{" "}
            <Link
              to="/knowledge"
              className="font-semibold text-innovation underline-offset-4 hover:underline"
            >
              Check the Knowledge Centre
            </Link>{" "}
            for announcements.
          </Callout>
        </Container>
      </section>
    </>
  );
}
