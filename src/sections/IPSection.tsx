import { Link } from "react-router";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton } from "@/components/site/primitives";
import { ipDisclaimer, ipOverview } from "@/content/ip";
import { ArrowRight, ClipboardCheck, ShieldCheck, Waypoints } from "lucide-react";

const PATHWAY = [
  {
    icon: ClipboardCheck,
    title: "Assessment",
    text: "Disclosure history, ownership, evidence and readiness.",
  },
  {
    icon: ShieldCheck,
    title: "Protection planning",
    text: "Which route fits — before any money or disclosure is committed.",
  },
  {
    icon: Waypoints,
    title: "Onward support",
    text: "Referral to qualified professionals and registration authorities.",
  },
];

/** Homepage Section 8 — intellectual property and innovation readiness. */
export function IPSection() {
  return (
    <section className="bg-obsidian py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Explanatory panel */}
          <div>
            <Reveal>
              <p className="afr-eyebrow text-innovation">Intellectual property</p>
              <h2 className="mt-5 font-display text-3xl font-bold leading-[1.12] tracking-tight text-chalk sm:text-4xl lg:text-[2.75rem]">
                Protect the idea. Understand the options. Plan the next step.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-ash">
                AFRINNET helps innovators understand the protection landscape
                before they commit — and connects them with the professionals and
                authorities who do the formal work.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {ipOverview.coverage.map((item) => (
                  <li key={item.title}>
                    <Link
                      to={item.href}
                      className="group flex h-full items-start gap-3 rounded-lg border border-white/10 bg-ink/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-innovation/60"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-innovation" aria-hidden="true" />
                      <span>
                        <span className="block font-display text-sm font-semibold leading-5 text-chalk">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-ash">
                          {item.text}
                        </span>                        </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="/ip" variant="primary">
                  Explore IP Support
                </LinkButton>
                <LinkButton href="/ip/readiness" variant="outline">
                  Assess Your Innovation Readiness
                </LinkButton>
              </div>
            </Reveal>
          </div>

          {/* Visual pathway panel */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink p-6 sm:p-8">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 afr-grid-bg opacity-60" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-white/15 bg-obsidian px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-chalk">
                    The idea
                  </span>
                  <span className="h-px flex-1 bg-linear-to-r from-white/20 to-innovation/50" aria-hidden="true" />
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-innovation">
                    Pathway
                  </span>
                </div>

                <ol className="relative mt-7 space-y-5 pl-9">
                  <span
                    aria-hidden="true"
                    className="absolute bottom-6 left-[15px] top-3 w-px bg-linear-to-b from-innovation via-innovation/60 to-transparent"
                  />
                  {PATHWAY.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <Reveal key={step.title} delay={0.15 + i * 0.12} as="li" className="relative">
                          <span className="absolute -left-9 top-1 flex size-[30px] items-center justify-center rounded-full border border-innovation/50 bg-obsidian text-innovation">
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <div className="rounded-xl border border-white/10 bg-obsidian/70 p-4 transition-colors duration-300 hover:border-innovation/50">
                            <div className="flex items-center gap-3">
                              <span className="font-display text-[0.65rem] font-bold tracking-[0.18em] text-ash/70">
                                STEP {i + 1}
                              </span>
                              <h3 className="font-display text-base font-bold tracking-tight text-chalk">
                                {step.title}
                              </h3>
                            </div>
                            <p className="mt-1.5 text-sm leading-6 text-ash">
                              {step.text}
                            </p>
                          </div>
                      </Reveal>
                    );
                  })}
                </ol>

                <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <ArrowRight className="size-4 shrink-0 text-innovation" aria-hidden="true" />
                  <p className="text-xs leading-5 text-ash">
                    Outcomes connect to qualified IP professionals, registration
                    authorities and development pathways — not to AFRINNET as a
                    granting body.
                  </p>
                </div>
              </div>
            </div>

            <Callout tone="neutral" className="mt-5">
              {ipDisclaimer}
            </Callout>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
