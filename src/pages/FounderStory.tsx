import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton } from "@/components/site/primitives";
import { PortraitSlot } from "@/components/site/PortraitSlot";
import { founder } from "@/content/leadership";
import {
  founderClosing,
  founderStoryChapters,
  founderStoryLinks,
  founderStoryMeta,
} from "@/content/founderStory";

/** Long-form editorial founder narrative — "Why AFRINNET Exists". */
export default function FounderStory() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Leadership & Governance", href: "/leadership" },
          { label: "Our Founder", href: "/leadership/founder" },
          { label: "Why AFRINNET Exists" },
        ]}
        eyebrow={founderStoryMeta.eyebrow}
        title={founderStoryMeta.title}
        lede={founderStoryMeta.intro}
        actions={
          <>
            <LinkButton href="/leadership/founder" variant="outline">
              Founder profile
            </LinkButton>
            <LinkButton href="/about/mission-vision" variant="soft">
              Mission & strategy
            </LinkButton>
          </>
        }
      />

      {/* Opening: portrait + editorial note */}
      <section className="border-b border-white/10 bg-ink py-14 sm:py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-[240px_1fr] md:gap-12 lg:max-w-4xl">
            <PortraitSlot
              initials={founder.portrait.initials}
              note={founder.portrait.note}
              name={founder.name}
            />
            <div>
              <p className="afr-eyebrow text-innovation">Samson Ngengi Njuguna</p>
              <p className="mt-3 font-display text-xl font-semibold leading-8 tracking-tight text-chalk sm:text-2xl">
                “{founderStoryChapters[3].quote?.text}”
              </p>
              <p className="mt-3 text-sm text-ash">
                {founderStoryChapters[3].quote?.attribution}
              </p>
              <Callout tone="neutral" title="Editorial note" className="mt-6">
                {founderStoryMeta.editorialNote}
              </Callout>
            </div>
          </div>
        </Container>
      </section>

      {/* Narrative timeline */}
      <section className="bg-obsidian py-14 sm:py-16">
        <Container>
          <h2 className="afr-eyebrow text-ash/80">The narrative in sequence</h2>
          <ol className="mt-5 flex flex-wrap gap-2.5">
            {founderStoryChapters.map((chapter) => (
              <li key={chapter.number}>
                <a
                  href={`#chapter-${chapter.number}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-ink/70 px-3.5 py-1.5 text-xs text-ash transition-colors hover:border-innovation/60 hover:text-chalk"
                >
                  <span className="font-display font-bold text-innovation">
                    {chapter.number}
                  </span>
                  {chapter.title}
                </a>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Chapters */}
      <section className="bg-obsidian pb-20">
        <Container>
          <div className="max-w-3xl">
            {founderStoryChapters.map((chapter, i) => (
              <Reveal key={chapter.number}>
                <article
                  id={`chapter-${chapter.number}`}
                  className="border-t border-white/10 py-12 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-sm font-bold tracking-[0.18em] text-innovation">
                      {chapter.number}
                    </span>
                    <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-chalk sm:text-3xl">
                      {chapter.title}
                    </h2>
                  </div>

                  <div className="mt-5 space-y-5">
                    {chapter.paragraphs.map((p, pi) => (
                      <p
                        key={pi}
                        className={
                          pi === 0
                            ? "text-lg leading-8 text-chalk/90"
                            : "text-base leading-7 text-ash"
                        }
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {chapter.quote && i !== 3 && (
                    <blockquote className="mt-7 border-l-2 border-innovation pl-5">
                      <p className="font-display text-xl font-semibold leading-8 tracking-tight text-chalk">
                        “{chapter.quote.text}”
                      </p>
                      <footer className="mt-2.5 text-sm text-ash">
                        {chapter.quote.attribution}
                      </footer>
                    </blockquote>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing */}
      <section className="relative overflow-hidden border-t border-innovation/25 bg-ink py-16 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 afr-grid-bg opacity-50" />
        <Container className="relative">
          <div className="max-w-3xl">
            <p className="afr-eyebrow text-innovation">Closing statement</p>
            <p className="mt-5 font-display text-2xl font-semibold leading-9 tracking-tight text-chalk sm:text-3xl sm:leading-10">
              “{founderClosing.statement}”
            </p>
            <p className="mt-4 text-sm text-ash">{founderClosing.attribution}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              {founderStoryLinks.map((link, i) => (
                <LinkButton
                  key={link.href}
                  href={link.href}
                  variant={i === 0 ? "primary" : "outline"}
                >
                  {link.label}
                </LinkButton>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
