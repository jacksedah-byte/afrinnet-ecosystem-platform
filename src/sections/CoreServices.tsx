import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Reveal } from "@/components/site/Reveal";
import { Container, SectionHeading } from "@/components/site/primitives";
import { coreServices } from "@/content/services";
import { cn } from "@/lib/utils";

/** Homepage Section 4 — six core services, each linking to its service page. */
export function CoreServices() {
  return (
    <section id="services" className="bg-obsidian py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Core services"
            title="Six ways AFRINNET works with innovators and institutions"
            lede="Each service has its own page, with eligibility, expectations and next steps set out plainly."
          />
          <Link
            to="/ecosystem"
            className="group inline-flex shrink-0 items-center gap-2 font-display text-sm font-semibold text-innovation transition-colors hover:text-innovation-bright"
          >
            View all services
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title} delay={(i % 3) * 0.08}>
                <Link
                  to={service.href}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-ink/70 p-6",
                    "transition-all duration-300 hover:-translate-y-1.5 hover:border-innovation/60 hover:bg-ink",
                    "focus-visible:-translate-y-1.5 focus-visible:border-innovation/60",
                  )}
                >
                  {/* Green edge highlight */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px scale-x-0 bg-innovation transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                  <span className="flex size-11 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-innovation transition-all duration-300 group-hover:border-innovation/60 group-hover:bg-innovation/10">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-chalk">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-6 text-ash">
                    {service.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-innovation">
                    Learn more
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
