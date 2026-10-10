import { PageHeader, type Crumb } from "./PageHeader";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Callout, Container, LinkButton, StatusBadge } from "./primitives";
import { PortraitSlot } from "./PortraitSlot";
import type { PersonProfile as ProfileData } from "@/content/leadership";

/**
 * Premium editorial leadership profile: portrait slot, name, title, concise and
 * full biography, areas of responsibility and approval status. Used by the
 * Founder and Executive Lead pages.
 */
export function PersonProfile({
  profile,
  crumbs,
  actions,
  children,
  statusTone = "neutral",
}: {
  profile: ProfileData;
  crumbs: Crumb[];
  actions?: ReactNode;
  children?: ReactNode;
  statusTone?: "neutral" | "developing";
}) {
  return (
    <>
      <PageHeader
        crumbs={crumbs}
        eyebrow={profile.title}
        title={profile.name}
        lede={profile.shortBio}
        actions={actions}
      />

      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
            {/* Portrait */}
            <div>
              <PortraitSlot
                initials={profile.portrait.initials}
                note={profile.portrait.note}
                name={profile.name}
              />
              <div className="mt-5 space-y-4">
                <div>
                  <p className="afr-eyebrow text-ash/70">Official title</p>
                  <p className="mt-1.5 font-display text-sm font-semibold text-chalk">
                    {profile.title}
                  </p>
                </div>
                <div>
                  <p className="afr-eyebrow text-ash/70">Areas of responsibility</p>
                  <ul className="mt-2 space-y-1.5">
                    {profile.responsibilities.map((r) => (
                      <li key={r} className="flex gap-2 text-sm leading-6 text-ash">
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-innovation/70"
                          aria-hidden="true"
                        />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl font-bold tracking-tight text-chalk">
                  Biography
                </h2>
                <StatusBadge tone={statusTone}>Draft — pending approval</StatusBadge>
              </div>

              <div className="space-y-5">
                {profile.fullBio.map((paragraph, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <p
                      className={
                        i === 0
                          ? "text-lg leading-8 text-chalk/90"
                          : "text-base leading-7 text-ash"
                      }
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.1}>
                <Callout tone="neutral" title="Editorial status" className="mt-8">
                  {profile.approvalStatus}
                </Callout>
              </Reveal>

              {children}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export function ProfileCtas({ links }: { links: { label: string; href: string; primary?: boolean }[] }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {links.map((link) => (
        <LinkButton
          key={link.href}
          href={link.href}
          variant={link.primary ? "primary" : "outline"}
          size="lg"
        >
          {link.label}
        </LinkButton>
      ))}
    </div>
  );
}
