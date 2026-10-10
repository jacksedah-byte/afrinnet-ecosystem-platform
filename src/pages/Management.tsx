import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton, StatusBadge } from "@/components/site/primitives";
import { PortraitSlot } from "@/components/site/PortraitSlot";
import { managementIntro, managementRoles } from "@/content/leadership";

export default function Management() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Leadership & Governance", href: "/leadership" },
          { label: "Management Committee" },
        ]}
        eyebrow="Executive management"
        title="Management Committee"
        lede={managementIntro.paragraphs[0]}
        tone="navy"
        actions={
          <>
            <LinkButton href="/leadership/executive" variant="primary">
              Executive Lead profile
            </LinkButton>
            <LinkButton href="/leadership" variant="outline">
              All leadership pages
            </LinkButton>
          </>
        }
      />

      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <Callout tone="navy" title="Appointment status">
              {managementIntro.paragraphs[1]}
            </Callout>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {managementRoles.map((role, i) => {
              const appointed = role.status === "appointed";
              return (
                <Reveal key={role.code} delay={(i % 3) * 0.08}>
                  <article
                    className={`flex h-full flex-col rounded-2xl border p-6 transition-colors duration-300 ${
                      appointed
                        ? "border-innovation/40 bg-ink/80 hover:border-innovation/70"
                        : "border-white/10 bg-ink/50 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-sm font-bold tracking-[0.16em] text-innovation">
                        {role.code}
                      </span>
                      <StatusBadge tone={appointed ? "available" : "developing"}>
                        {appointed ? "Appointed" : "Recruitment in progress"}
                      </StatusBadge>
                    </div>

                    <div className="mt-5 flex gap-4">
                      <PortraitSlot
                        initials={role.portrait.initials}
                        note=""
                        className="w-[92px] shrink-0"
                      />
                      <div className="min-w-0">
                        <h2 className="font-display text-lg font-bold leading-6 tracking-tight text-chalk">
                          {role.name ?? "Position open"}
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-innovation">
                          {role.title}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-6 text-ash">
                      {role.summary}
                    </p>

                    <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
                      {role.responsibilities.map((r) => (
                        <li key={r} className="flex gap-2 text-xs leading-5 text-ash">
                          <span
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-innovation/70"
                            aria-hidden="true"
                          />
                          {r}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-4 text-[0.7rem] leading-4 text-ash/60">
                      {role.portrait.note}
                    </p>
                  </article>
                </Reveal>
              );
            })}

            <Reveal delay={0.2}>
              <div className="flex h-full flex-col rounded-2xl border border-dashed border-white/15 bg-obsidian/40 p-6">
                <StatusBadge tone="neutral">Also supported by</StatusBadge>
                <h2 className="mt-4 font-display text-lg font-bold tracking-tight text-chalk">
                  Staff, advisers and collaborators
                </h2>
                <p className="mt-2.5 text-sm leading-6 text-ash">
                  Further team members and advisers will be presented here once
                  their roles are confirmed and their profiles approved for
                  publication.
                </p>
                <LinkButton
                  href="/contact"
                  variant="soft"
                  size="sm"
                  className="mt-auto w-full"
                >
                  Contact AFRINNET
                </LinkButton>
              </div>
            </Reveal>
          </div>

          <Callout tone="green" className="mt-10" title="For candidates and partners">
            Functional leadership recruitment runs through 2026. Institutional
            partners interested in collaborating with a specific function can
            route an enquiry and it will reach the Executive Lead.
            <div className="mt-4 flex flex-wrap gap-3">
              <LinkButton href="/contact?type=institution" size="sm" variant="primary">
                Send an enquiry
              </LinkButton>
              <LinkButton href="/partnerships" size="sm" variant="outline">
                Partnership options
              </LinkButton>
            </div>
          </Callout>
        </Container>
      </section>
    </>
  );
}
