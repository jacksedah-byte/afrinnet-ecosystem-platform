import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton, StatusBadge } from "@/components/site/primitives";
import { audiences } from "@/content/audiences";

const PARTNERSHIP_TYPES = [
  {
    title: "Academic & research partnerships",
    text: "Universities and research organisations documenting innovation activity, running IP clinics and connecting researchers with support.",
    href: "/engage/universities",
  },
  {
    title: "Public sector collaboration",
    text: "Government bodies working on ecosystem development, institutional mapping and innovation policy.",
    href: "/engage/government",
  },
  {
    title: "TVET & schools programmes",
    text: "Technical institutions and schools building innovation documentation and IP awareness into existing programmes.",
    href: "/engage/tvet",
  },
  {
    title: "Industry & startup connections",
    text: "Enterprises seeking IP readiness support, research expertise or ecosystem opportunities.",
    href: "/engage/startups",
  },
  {
    title: "Development partner programmes",
    text: "Funders and intermediaries co-designing programmes across discovery, readiness and institutional capacity.",
    href: "/engage/partners",
  },
];

const EXPECTATIONS = [
  "Partnerships are agreed case by case, with scope and responsibilities set out in advance.",
  "Institutions are listed publicly only with confirmed consent.",
  "AFRINNET does not claim endorsements, co-branding or coverage that has not been agreed and published.",
  "Programmes run only where funding and capacity genuinely exist.",
];

export default function Partnerships() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Get Involved" }, { label: "Become an Institutional Partner" }]}
        eyebrow="Get Involved"
        title="Become an Institutional Partner"
        lede="AFRINNET's network is built relationship by relationship. If your institution works with innovators, research, skills or technology transfer, there is probably a useful conversation to have."
        tone="navy"
        actions={
          <>
            <LinkButton href="/contact?type=partnership" variant="primary">
              Start a partnership conversation
            </LinkButton>
            <LinkButton href="/about" variant="outline">
              About AFRINNET
            </LinkButton>
          </>
        }
      >
        <div className="mt-6">
          <StatusBadge tone="available">Enquiries open</StatusBadge>
        </div>
      </PageHeader>

      {/* Partnership types */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="afr-eyebrow text-innovation">Ways to work together</p>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-chalk sm:text-3xl">
              Five routes into the network
            </h2>
            <p className="mt-3 text-sm leading-7 text-ash">
              Each route has a dedicated page describing the value, engagement
              opportunities and next steps for that audience.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PARTNERSHIP_TYPES.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.07}>
                <Link
                  to={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-ink/70 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-innovation/60"
                >
                  <h3 className="font-display text-base font-bold leading-6 tracking-tight text-chalk group-hover:text-innovation">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-6 text-ash">{item.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-innovation">
                    Explore
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}

            <Reveal delay={0.2} className="md:col-span-2 lg:col-span-1">
              <div className="flex h-full flex-col rounded-2xl border border-innovation/40 bg-innovation/[0.07] p-6">
                <p className="afr-eyebrow text-innovation">Not sure which fits?</p>
                <p className="mt-3 flex-1 text-sm leading-6 text-ash">
                  Send a general enquiry describing your institution and what you
                  are trying to achieve — it will reach the Executive Lead.
                </p>
                <LinkButton href="/contact?type=institution" variant="primary" size="sm" className="mt-5 self-start">
                  Send an enquiry
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Process + expectations */}
      <section className="border-y border-white/10 bg-ink py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="afr-eyebrow text-innovation">How partnerships form</p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-chalk sm:text-3xl">
                A straightforward sequence
              </h2>
              <ol className="mt-7 space-y-5">
                {[
                  {
                    title: "Conversation",
                    text: "You describe your institution, context and objectives.",
                  },
                  {
                    title: "Fit assessment",
                    text: "AFRINNET assesses where interests genuinely overlap — and says so when they do not.",
                  },
                  {
                    title: "Defined scope",
                    text: "Activities, responsibilities and expectations are set out before anything is announced.",
                  },
                  {
                    title: "Delivery & review",
                    text: "The partnership runs, with review points agreed up front.",
                  },
                ].map((step, i) => (
                  <Reveal key={step.title} delay={i * 0.07} as="li" className="flex gap-4">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-innovation/60 bg-obsidian font-display text-xs font-bold text-innovation">
                        {i + 1}
                      </span>
                      <div>
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
                What partners can expect from us
              </h2>
              <ul className="mt-5 space-y-3">
                {EXPECTATIONS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-lg border border-white/10 bg-obsidian/70 p-4 text-sm leading-6 text-ash"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-innovation" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <Callout tone="green" className="mt-6" title="Ready to talk?">
                Partnership conversations start with a short enquiry. Include your
                institution, the context you are working in and the outcome you
                are seeking.
                <div className="mt-4 flex flex-wrap gap-3">
                  <LinkButton href="/contact?type=partnership" size="sm" variant="primary">
                    Discuss collaboration
                  </LinkButton>
                  <LinkButton href="/engage/partners" size="sm" variant="outline">
                    Development partners
                  </LinkButton>
                </div>
              </Callout>
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-3">
            {Object.values(audiences).slice(0, 3).map((audience) => (
              <Link
                key={audience.slug}
                to={`/engage/${audience.slug}`}
                className="rounded-xl border border-white/10 bg-obsidian/60 p-5 transition-colors hover:border-innovation/60"
              >
                <span className="font-display text-sm font-bold text-chalk">
                  {audience.title}
                </span>
                <span className="mt-1.5 block text-xs leading-5 text-ash">
                  Value, opportunities and next steps
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
