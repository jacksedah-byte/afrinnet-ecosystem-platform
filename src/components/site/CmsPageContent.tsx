import { BookOpen, Building2, Globe2, Lightbulb, ShieldCheck, UsersRound } from "lucide-react";

export type CmsBlock = {
  id?: string;
  type?: string;
  heading?: string;
  body?: string;
  items?: string[];
  cards?: Array<{
    heading?: string;
    body?: string;
    imageUrl?: string;
    alt?: string;
    label?: string;
    href?: string;
    icon?: "book" | "building" | "globe" | "lightbulb" | "shield" | "people";
  }>;
  stats?: Array<{ value?: string; label?: string }>;
  label?: string;
  href?: string;
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  alt?: string;
  attribution?: string;
  variant?: "plain" | "card" | "muted" | "brand";
};

const cardIcons = {
  book: BookOpen,
  building: Building2,
  globe: Globe2,
  lightbulb: Lightbulb,
  shield: ShieldCheck,
  people: UsersRound,
};

export type CmsPageData = {
  eyebrow?: string;
  title?: string;
  introduction?: string;
  preserveExistingPage?: boolean;
  heroImageUrl?: string;
  heroImageAlt?: string;
  design?: {
    layoutWidth?: "compact" | "standard" | "wide";
    heroAlignment?: "left" | "center";
    theme?: "default" | "light" | "brand";
  };
  summary?: string;
  category?: string;
  topic?: string;
  dateLabel?: string;
  blocks?: CmsBlock[];
};

function safeLink(value: string | undefined) {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : undefined;
  } catch {
    return undefined;
  }
}

export function CmsPageContent({ title, content }: { title: string; content: unknown }) {
  const page = content && typeof content === "object" ? (content as CmsPageData) : {};
  const pageTitle = page.title?.trim() || title;
  const design = page.design ?? {};
  const layoutWidth = {
    compact: "max-w-3xl",
    standard: "max-w-5xl",
    wide: "max-w-7xl",
  }[design.layoutWidth ?? "standard"];
  const heroAlignment = design.heroAlignment === "center" ? "text-center" : "text-left";
  const mutedText = design.theme === "light" ? "text-slate-600" : "text-muted-foreground";
  const cardSurface = design.theme === "light" ? "bg-white" : "bg-card";
  const theme = {
    default: "bg-background text-foreground",
    light: "bg-white text-slate-950",
    brand: "bg-ink text-chalk",
  }[design.theme ?? "default"];
  const heroImageUrl = safeLink(page.heroImageUrl);

  return (
    <main className={`min-h-[60vh] ${theme}`}>
      <div className={`mx-auto px-5 py-16 sm:px-8 sm:py-24 ${layoutWidth}`}>
        <header className={`grid gap-8 ${heroImageUrl ? "md:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] md:items-center" : ""} ${heroAlignment}`}>
          <div>
            {page.eyebrow && <p className="afr-eyebrow text-muted-foreground">{page.eyebrow}</p>}
            <h1 className={`mt-3 max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-5xl ${design.heroAlignment === "center" ? "mx-auto" : ""}`}>
              {pageTitle}
            </h1>
            {page.introduction && (
              <p className={`mt-6 max-w-3xl text-lg leading-8 ${mutedText} ${design.heroAlignment === "center" ? "mx-auto" : ""}`}>
                {page.introduction}
              </p>
            )}
          </div>
          {heroImageUrl && (
            <img
              src={heroImageUrl}
              alt={page.heroImageAlt ?? ""}
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
          )}
        </header>

        <div className="mt-12 space-y-10">
          {(page.blocks ?? []).map((block, index) => {
            const key = block.id || `${block.type || "block"}-${index}`;
            const sectionStyle = {
              plain: "",
              card: `rounded-xl border border-border/70 ${cardSurface} p-6`,
              muted: "rounded-xl bg-muted/70 p-6",
              brand: "rounded-xl bg-innovation/10 p-6",
            }[block.variant ?? "plain"];
            const sectionClass = `min-w-0 ${sectionStyle}`;
            if (block.type === "heading") {
              return <h2 key={key} className={`${sectionClass} font-display text-2xl font-bold tracking-tight`}>{block.heading}</h2>;
            }
            if (block.type === "list") {
              return (
                <section key={key} className={sectionClass}>
                  {block.heading && <h2 className="font-display text-xl font-bold">{block.heading}</h2>}
                  <ul className={`mt-3 list-disc space-y-2 pl-6 text-base leading-7 ${design.theme === "light" ? "text-slate-600" : "text-muted-foreground"}`}>
                    {(block.items ?? []).map((item, itemIndex) => <li key={`${key}-${itemIndex}`}>{item}</li>)}
                  </ul>
                </section>
              );
            }
            if (block.type === "image") {
              const imageUrl = safeLink(block.imageUrl);
              return imageUrl ? <figure key={key}><img src={imageUrl} alt={block.alt ?? ""} className="h-auto max-h-[38rem] w-full object-cover" /></figure> : null;
            }
            if (block.type === "divider") return <hr key={key} className="border-border" />;
            if (block.type === "video") {
              const videoUrl = safeLink(block.videoUrl);
              const posterUrl = safeLink(block.posterUrl);
              return videoUrl ? (
                <figure key={key} className={sectionClass}>
                  <video controls playsInline preload="metadata" poster={posterUrl} className="max-h-[42rem] w-full rounded-lg bg-black">
                    <source src={videoUrl} />
                    Your browser does not support embedded video.
                  </video>
                  {block.alt && <figcaption className="mt-2 text-sm text-muted-foreground">{block.alt}</figcaption>}
                </figure>
              ) : null;
            }
            if (block.type === "feature") {
              const imageUrl = safeLink(block.imageUrl);
              const href = safeLink(block.href);
              return (
                <section key={key} className={`${sectionClass} grid gap-6 py-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center`}>
                  {imageUrl && <img src={imageUrl} alt={block.alt ?? ""} className="aspect-[4/3] w-full object-cover" />}
                  <div>
                    {block.heading && <h2 className="font-display text-xl font-bold tracking-tight">{block.heading}</h2>}
                    {block.body && <p className="mt-3 text-base leading-7 text-muted-foreground">{block.body}</p>}
                    {href && <a href={href} className="mt-5 inline-flex font-semibold text-foreground underline-offset-4 hover:underline">{block.label || "Learn more"} →</a>}
                  </div>
                </section>
              );
            }
            if (block.type === "cards") {
              return (
                <section key={key} className={sectionClass}>
                  {block.heading && <h2 className="mb-5 font-display text-2xl font-bold tracking-tight">{block.heading}</h2>}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(block.cards ?? []).map((card, cardIndex) => {
                      const imageUrl = safeLink(card.imageUrl);
                      const href = safeLink(card.href);
                      const Icon = card.icon ? cardIcons[card.icon] : undefined;
                      return (
                        <article key={`${key}-${cardIndex}`} className={`overflow-hidden rounded-lg border border-border/70 ${cardSurface}`}>
                          {imageUrl && <img src={imageUrl} alt={card.alt ?? ""} className="aspect-[16/10] w-full object-cover" />}
                          <div className="space-y-3 p-5">
                            {Icon && <Icon aria-hidden="true" className="size-6 text-innovation" />}
                            {card.heading && <h3 className="font-display text-lg font-bold">{card.heading}</h3>}
                            {card.body && <p className={`text-sm leading-6 ${mutedText}`}>{card.body}</p>}
                            {href && <a href={href} className="inline-flex font-semibold text-foreground underline-offset-4 hover:underline">{card.label || "Learn more"} →</a>}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            }
            if (block.type === "stats") {
              return (
                <section key={key} className={sectionClass}>
                  {block.heading && <h2 className="mb-5 font-display text-2xl font-bold tracking-tight">{block.heading}</h2>}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {(block.stats ?? []).map((stat, statIndex) => (
                      <div key={`${key}-${statIndex}`} className={`rounded-lg border border-border/70 ${cardSurface} p-5`}>
                        <p className="font-display text-3xl font-bold text-innovation">{stat.value}</p>
                        <p className={`mt-2 text-sm ${mutedText}`}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote key={key} className={`${sectionClass} border-l-4 border-innovation pl-6`}>
                  <p className="font-display text-xl font-semibold leading-8">{block.body}</p>
                  {block.attribution && <cite className="mt-3 block text-sm not-italic text-muted-foreground">{block.attribution}</cite>}
                </blockquote>
              );
            }
            if (block.type === "cta") {
              const href = safeLink(block.href);
              return href ? (
                <p key={key} className={sectionClass}>
                  <a href={href} className="inline-flex items-center border-b-2 border-current pb-1 font-semibold text-foreground hover:text-muted-foreground">
                    {block.label || block.heading || "Learn more"}
                  </a>
                </p>
              ) : null;
            }
            return (
              <section key={key} className={sectionClass}>
                {block.heading && <h2 className="font-display text-xl font-bold tracking-tight">{block.heading}</h2>}
                {block.body && <p className={`mt-3 max-w-3xl text-base leading-7 ${mutedText}`}>{block.body}</p>}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}