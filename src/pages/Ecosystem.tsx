import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton, StatusBadge } from "@/components/site/primitives";
import { JourneyTimeline } from "@/components/site/JourneyTimeline";
import { coreServices, servicePages } from "@/content/services";
import { audiences } from "@/content/audiences";

const SERVICE_LIST = [
  servicePages.discovery,
  servicePages.verification,
  servicePages.networks,
  servicePages.incubation,
];

export default function Ecosystem() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Innovation Ecosystem" }]}
        eyebrow="Innovation Ecosystem"
        title="The infrastructure that carries an idea forward"
        lede="Discovery, documentation, verification, institutional networks and readiness — the services that connect innovators with the systems around them."
        actions={
          <>
            <LinkButton href="/submit" variant="primary">
              Submit an innovation
            </LinkButton>
            <LinkButton href="/partnerships" variant="outline">
              Join the network
            </LinkButton>
          </>
        }
      />

      {/* Service directory with status separation */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-chalk sm:text-3xl">
                Service directory
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ash">
                Currently available services are separated from workflows still
                being developed. Each entry links to a full page with
                eligibility, expectations and FAQs.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <StatusBadge tone="available">Available now</StatusBadge>
              <StatusBadge tone="developing">In development</StatusBadge>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {SERVICE_LIST.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 2) * 0.08}>
                <Link
                  to={`/ecosystem/${service.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-ink/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-innovation/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-bold tracking-tight text-chalk group-hover:text-innovation">
                      {service.title}
                    </h3>
                    <StatusBadge tone={service.status === "available" ? "available" : "developing"}>
                      {service.status === "available" ? "Available" : "In development"}
                    </StatusBadge>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-6 text-ash">
                    {service.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-innovation">
                    Open service page
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Reveal className="rounded-2xl border border-white/10 bg-ink/70 p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-lg font-bold tracking-tight text-chalk">
                  Intellectual Property Support
                </h3>
                <StatusBadge tone="available">Available</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-ash">
                Education, readiness assessment, IP clinics and referrals to
                qualified professionals and registration authorities.
              </p>
              <Link
                to="/ip"
                className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-innovation hover:text-innovation-bright"
              >
                Explore IP services <ArrowRight className="size-4" />
              </Link>
            </Reveal>

            <Reveal delay={0.08} className="rounded-2xl border border-white/10 bg-ink/70 p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-lg font-bold tracking-tight text-chalk">
                  Partnerships & Opportunities
                </h3>
                <StatusBadge tone="available">Enquiries open</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-ash">
                Connections across public, academic, research and private
                sectors — agreed case by case.
              </p>
              <Link
                to="/partnerships"
                className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-innovation hover:text-innovation-bright"
              >
                Partnership options <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Journey */}
      <section className="border-y border-white/10 bg-ink py-14 sm:py-20">
        <Container>
          <h2 className="font-display text-2xl font-bold tracking-tight text-chalk sm:text-3xl">
            The innovation journey
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ash">
            The five stages every submission or institutional request moves
            through — with review decisions made at each step.
          </p>
          <JourneyTimeline className="mt-10" />
          <Callout tone="green" className="mt-10">
            Submission does not guarantee acceptance, legal protection, funding or
            commercialisation. Progress depends on review, fit and available
            capacity.
          </Callout>
        </Container>
      </section>

      {/* Ecosystem navigation by audience */}
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <h2 className="font-display text-2xl font-bold tracking-tight text-chalk sm:text-3xl">
            Explore by participant
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ash">
            Each participant group has a dedicated page with its value
            proposition, engagement opportunities and next steps.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(audiences).map((audience, i) => (
              <Reveal key={audience.slug} delay={(i % 3) * 0.07}>
                <Link
                  to={`/engage/${audience.slug}`}
                  className="group flex h-full items-start justify-between gap-4 rounded-xl border border-white/10 bg-ink/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-innovation/60"
                >
                  <span>
                    <span className="block font-display text-base font-bold tracking-tight text-chalk group-hover:text-innovation">
                      {audience.title}
                    </span>
                    <span className="mt-1.5 block text-sm leading-6 text-ash">
                      {audience.lede.slice(0, 90)}…
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-innovation transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Reveal>
            ))}
          </div>

          <Callout tone="neutral" className="mt-8">
            Digital modules — the innovation registry, member portal,
            institutional dashboard and IP case management — are planned in
            sequenced phases and are not represented as working systems here.{" "}
            <Link
              to="/about/mission-vision"
              className="font-semibold text-innovation underline-offset-4 hover:underline"
            >
              See the platform roadmap
            </Link>
            .
          </Callout>
        </Container>
      </section>
    </>
  );
}
