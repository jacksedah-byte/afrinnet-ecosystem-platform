import { Link, useParams } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton } from "@/components/site/primitives";
import NotFound from "./NotFound";
import { audiences } from "@/content/audiences";

/** Template for /engage/:slug — six stakeholder landing pages. */
export default function Audience() {
  const { slug } = useParams();
  const audience = slug ? audiences[slug] : undefined;

  if (!audience) return <NotFound embedded />;

  const others = Object.values(audiences).filter((a) => a.slug !== audience.slug);

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Institutions & Partnerships", href: "/partnerships" },
          { label: audience.title },
        ]}
        eyebrow={audience.eyebrow}
        title={audience.title}
        lede={audience.lede}
        actions={
          <>
            <LinkButton href={audience.cta.href} variant="primary">
              {audience.cta.label}
            </LinkButton>
            {audience.secondaryCta && (
              <LinkButton href={audience.secondaryCta.href} variant="outline">
                {audience.secondaryCta.label}
              </LinkButton>
            )}
          </>
        }
      />

      {/* Value proposition */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="afr-eyebrow text-innovation">The value for your institution</p>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-chalk sm:text-3xl">
              What working with AFRINNET gives you
            </h2>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {audience.value.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-ink/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-innovation/60">
                  <span className="block h-px w-10 bg-innovation" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-chalk">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ash">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Engagement + next steps */}
      <section className="border-y border-white/10 bg-ink py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                Engagement opportunities
              </h2>
              <ul className="mt-5 space-y-3">
                {audience.engagement.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-lg border border-white/10 bg-obsidian/70 p-4 text-sm leading-6 text-ash"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-innovation" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                Next steps
              </h2>
              <ol className="mt-5 space-y-4">
                {audience.nextSteps.map((step, i) => (
                  <Reveal key={step} delay={i * 0.07}>
                    <li className="flex gap-4">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-innovation/60 bg-obsidian font-display text-xs font-bold text-innovation">
                        {i + 1}
                      </span>
                      <p className="pt-1 text-sm leading-6 text-chalk/90">{step}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>

              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton href={audience.cta.href} variant="primary">
                  {audience.cta.label}
                </LinkButton>
                <LinkButton href="/contact" variant="outline">
                  Contact AFRINNET
                </LinkButton>
              </div>
            </div>
          </div>

          {audience.note && (
            <Callout tone="neutral" className="mt-10">
              {audience.note}
            </Callout>
          )}
        </Container>
      </section>

      {/* Other audiences */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
            Other ways to engage
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.slug}
                to={`/engage/${other.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-ink/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-innovation/60"
              >
                <span>
                  <span className="block font-display text-sm font-bold tracking-tight text-chalk group-hover:text-innovation">
                    {other.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-ash">
                    {other.eyebrow}
                  </span>
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-innovation transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
