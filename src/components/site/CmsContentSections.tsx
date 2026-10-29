import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { isSafeCmsHref, isSafeCmsImageUrl, type CmsSection } from "@/lib/cms-content";

function ContentLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  if (!isSafeCmsHref(href)) return <span>{children}</span>;
  if (href.startsWith("/")) return <Link to={href}>{children}</Link>;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function paragraphs(text: string) {
  return text.split(/\n\s*\n/).filter(Boolean);
}

export function CmsContentSections({ sections }: { sections: CmsSection[] }) {
  return (
    <div className="space-y-12">
      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return (
              <section key={section.id} className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  {section.eyebrow && (
                    <p className="afr-eyebrow text-innovation">{section.eyebrow}</p>
                  )}
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-chalk sm:text-4xl">
                    {section.heading}
                  </h2>
                  {section.body && (
                    <div className="mt-5 space-y-4 leading-7 text-ash">
                      {paragraphs(section.body).map((text, index) => <p key={index}>{text}</p>)}
                    </div>
                  )}
                  {(section.primaryLabel || section.secondaryLabel) && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {section.primaryLabel && section.primaryHref && (
                        <Button asChild>
                          <ContentLink href={section.primaryHref}>{section.primaryLabel}</ContentLink>
                        </Button>
                      )}
                      {section.secondaryLabel && section.secondaryHref && (
                        <Button variant="outline" asChild>
                          <ContentLink href={section.secondaryHref}>{section.secondaryLabel}</ContentLink>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {section.imageUrl && isSafeCmsImageUrl(section.imageUrl) && (
                  <img
                    src={section.imageUrl}
                    alt={section.imageAlt ?? ""}
                    className="max-h-[28rem] w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                )}
              </section>
            );
          case "text":
            return (
              <section key={section.id} className="mx-auto max-w-3xl">
                {section.heading && (
                  <h2 className="mb-4 font-display text-2xl font-bold text-chalk">
                    {section.heading}
                  </h2>
                )}
                <div className="space-y-5 leading-8 text-ash">
                  {paragraphs(section.body).map((text, index) => <p key={index}>{text}</p>)}
                </div>
              </section>
            );
          case "image":
            return (
              <figure key={section.id} className="mx-auto max-w-5xl">
                {isSafeCmsImageUrl(section.imageUrl) && (
                  <img
                    src={section.imageUrl}
                    alt={section.imageAlt}
                    className="max-h-[42rem] w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                )}
                {section.caption && (
                  <figcaption className="mt-3 text-center text-sm text-ash">
                    {section.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "features":
            return (
              <section key={section.id}>
                {section.heading && (
                  <h2 className="mb-5 font-display text-2xl font-bold text-chalk">
                    {section.heading}
                  </h2>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item, index) => (
                    <article key={`${section.id}-${index}`} className="rounded-xl border border-white/10 bg-ink p-5">
                      <h3 className="font-display text-lg font-semibold text-chalk">{item.title}</h3>
                      <p className="mt-2 whitespace-pre-wrap leading-7 text-ash">{item.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            );
          case "cta":
            return (
              <section key={section.id} className="rounded-xl border border-white/10 bg-ink p-7 text-center sm:p-10">
                <h2 className="font-display text-2xl font-bold text-chalk">{section.heading}</h2>
                {section.body && <p className="mx-auto mt-3 max-w-2xl leading-7 text-ash">{section.body}</p>}
                <Button asChild className="mt-6">
                  <ContentLink href={section.buttonHref}>{section.buttonLabel}</ContentLink>
                </Button>
              </section>
            );
        }
      })}
    </div>
  );
}
