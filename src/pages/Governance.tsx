import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton, StatusBadge } from "@/components/site/primitives";
import { governance } from "@/content/leadership";
import { cn } from "@/lib/utils";

const TONE_STYLES = {
  navy: "border-[#2C4E7A] bg-navy/40",
  green: "border-innovation/50 bg-innovation/[0.07]",
  muted: "border-dashed border-white/15 bg-obsidian/50",
} as const;

export default function Governance() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Leadership & Governance", href: "/leadership" },
          { label: "Governance & Structure" },
        ]}
        eyebrow="Governance"
        title={governance.title}
        lede={governance.lede}
        tone="navy"
        actions={
          <>
            <LinkButton href="/leadership/board" variant="primary">
              Board of Directors
            </LinkButton>
            <LinkButton href="/leadership/management" variant="outline">
              Management Committee
            </LinkButton>
          </>
        }
      />

      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          {/* Structure diagram */}
          <div className="mx-auto max-w-4xl">
            {governance.levels.map((level, li) => (
              <div key={level.label}>
                {/* Connector between levels */}
                {li > 0 && (
                  <div aria-hidden="true" className="flex justify-center py-5">
                    <div className="h-10 w-px bg-linear-to-b from-innovation/70 to-innovation/20" />
                  </div>
                )}

                <Reveal delay={li * 0.1}>
                  <section aria-label={level.label}>
                    <div className="mb-4 flex items-center gap-4">
                      <span className="afr-eyebrow text-innovation">{level.label}</span>
                      <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                    </div>

                    <div
                      className={cn(
                        "grid gap-4",
                        level.nodes.length === 1 && "max-w-xl",
                        level.nodes.length === 2 && "sm:grid-cols-2",
                        level.nodes.length > 2 && "sm:grid-cols-2 lg:grid-cols-4",
                      )}
                    >
                      {level.nodes.map((node) => (
                        <div
                          key={node.title}
                          className={cn(
                            "rounded-xl border p-5 transition-colors duration-300",
                            TONE_STYLES[node.tone],
                            node.tone === "navy"
                              ? "hover:border-[#3E68A0]"
                              : node.tone === "green"
                                ? "hover:border-innovation"
                                : "hover:border-white/30",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-base font-bold leading-6 tracking-tight text-chalk">
                              {node.title}
                            </h3>
                            {node.tone === "muted" && (
                              <StatusBadge tone="developing">Pending</StatusBadge>
                            )}
                          </div>
                          <p
                            className={cn(
                              "mt-2 text-xs font-semibold uppercase tracking-[0.1em]",
                              node.tone === "green" ? "text-innovation" : "text-ash",
                            )}
                          >
                            {node.note}
                          </p>
                          <p className="mt-2.5 text-sm leading-6 text-ash">
                            {node.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </Reveal>
              </div>
            ))}
          </div>

          {/* Caption + principles */}
          <div className="mx-auto mt-12 max-w-4xl space-y-5">
            <Callout tone="neutral" title="About this diagram">
              {governance.caption}
            </Callout>

            <div className="grid gap-5 sm:grid-cols-2">
              <Callout tone="navy" title="Governance ≠ executive management">
                The Board provides oversight and stewardship. Day-to-day
                management sits with the Executive Lead. These are distinct
                roles, and the website presents them separately.
              </Callout>
              <Callout tone="green" title="Editable structure">
                Titles, reporting lines and membership are held as structured
                content, so the diagram can be updated as appointments are
                confirmed — without redesigning the page.
              </Callout>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <LinkButton href="/leadership/founder" variant="outline">
                Our Founder
              </LinkButton>
              <LinkButton href="/leadership/executive" variant="outline">
                Executive leadership
              </LinkButton>
              <LinkButton href="/contact?type=government" variant="primary">
                Governance enquiries
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
