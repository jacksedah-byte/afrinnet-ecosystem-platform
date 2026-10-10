import { PersonProfile, ProfileCtas } from "@/components/site/PersonProfile";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton } from "@/components/site/primitives";
import { founder } from "@/content/leadership";

export default function FounderProfile() {
  return (
    <>
      <PersonProfile
        profile={founder}
        crumbs={[
          { label: "Leadership & Governance", href: "/leadership" },
          { label: "Our Founder" },
        ]}
        actions={
          <>
            <a
              href="#story"
              className="inline-flex h-10 items-center rounded-md bg-innovation px-6 font-display text-sm font-semibold text-obsidian transition-colors hover:bg-innovation-bright"
            >
              The Human Blueprint
            </a>
            <LinkButton href="/leadership/founder/story" variant="outline">
              Why AFRINNET exists →
            </LinkButton>
          </>
        }
      />

      {/* Philosophy */}
      <section
        id="story"
        className="relative overflow-hidden border-y border-white/10 bg-navy-deep py-16 sm:py-20"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 afr-grid-bg opacity-40" />
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <p className="afr-eyebrow text-innovation">The Human Blueprint</p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-[1.14] tracking-tight text-chalk sm:text-4xl">
                Technology must serve humanity — and creators must be protected
                alongside their creations.
              </h2>
              <p className="mt-5 text-base leading-7 text-ash">
                The founding philosophy places human dignity, creator ownership
                and the responsible use of technology at the centre of every
                system AFRINNET builds.
              </p>
            </div>

            <Reveal delay={0.1}>
              <blockquote className="rounded-2xl border border-white/12 bg-obsidian/70 p-7 sm:p-9">
                <p className="font-display text-xl font-semibold leading-8 tracking-tight text-chalk sm:text-2xl">
                  “{founder.fullBio[2]}”
                </p>
                <footer className="mt-5 flex items-center gap-3 text-sm text-ash">
                  <span className="h-px w-8 bg-innovation" aria-hidden="true" />
                  {founder.name} — {founder.title}
                </footer>
              </blockquote>

              <Callout tone="green" className="mt-6">
                <p className="font-display text-sm font-bold text-chalk">
                  The founding sequence
                </p>
                <p className="mt-1.5">
                  Discover the idea. Protect it. Then help it grow — the sequence
                  AFRINNET's services are built around.
                </p>
              </Callout>
            </Reveal>
          </div>

          <ProfileCtas
            links={[
              { label: "Read the full founder's story", href: "/leadership/founder/story", primary: true },
              { label: "Mission, vision & strategy", href: "/about/mission-vision" },
              { label: "IP services", href: "/ip" },
            ]}
          />
        </Container>
      </section>
    </>
  );
}
