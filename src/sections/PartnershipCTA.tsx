import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Container } from "@/components/site/primitives";

const ROUTES = [
  {
    label: "For Institutions",
    text: "Universities, TVETs, schools, research bodies and public institutions — explore institutional engagement.",
    cta: "Explore institutional engagement",
    href: "/partnerships",
  },
  {
    label: "For Innovators",
    text: "Submit an innovation or ask for guidance on intellectual property and readiness.",
    cta: "Submit an innovation",
    href: "/submit",
  },
  {
    label: "For Partners",
    text: "Development partners, funders and intermediaries — discuss collaboration with AFRINNET.",
    cta: "Discuss collaboration",
    href: "/contact?type=partnership",
  },
];

/** Homepage Section 10 — green-on-black partnership call to action. */
export function PartnershipCTA() {
  return (
    <section className="relative overflow-hidden border-t border-innovation/25 bg-obsidian py-24 sm:py-32">
      {/* Restrained animated background lines */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg className="h-full w-full opacity-[0.22]" viewBox="0 0 1200 500" preserveAspectRatio="none">
          <g stroke="#16A34A" strokeWidth="1" fill="none">
            <path d="M-50 420 C250 340 450 470 750 360 C950 290 1100 350 1250 300" className="afr-flow" />
            <path d="M-50 300 C200 240 500 330 800 230 C1000 170 1120 220 1250 180" className="afr-flow" opacity="0.6" />
            <path d="M-50 140 C300 90 560 180 860 110 C1040 70 1140 110 1250 80" className="afr-flow" opacity="0.35" />
          </g>
        </svg>
      </div>

      <Container className="relative">
        <Reveal>
          <p className="afr-eyebrow text-innovation">Partnership</p>
          <h2 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-chalk sm:text-5xl lg:text-[3.6rem]">
            Stronger innovation ecosystems are built{" "}
            <span className="text-innovation">together</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {ROUTES.map((route, i) => (
            <Reveal key={route.label} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-white/12 bg-ink/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-innovation/60 sm:p-7">
                <span className="font-display text-[0.68rem] font-bold uppercase tracking-[0.2em] text-innovation">
                  {route.label}
                </span>
                <p className="mt-4 flex-1 text-sm leading-6 text-ash">{route.text}</p>
                <Link
                  to={route.href}
                  className="group mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-chalk transition-colors hover:text-innovation"
                >
                  {route.cta}
                  <ArrowRight
                    className="size-4 text-innovation transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
