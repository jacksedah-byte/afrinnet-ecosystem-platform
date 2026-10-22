export type CmsBlock = {
  id?: string;
  type?: string;
  heading?: string;
  body?: string;
  items?: string[];
  label?: string;
  href?: string;
  imageUrl?: string;
  alt?: string;
  attribution?: string;
};

export type CmsPageData = {
  eyebrow?: string;
  title?: string;
  introduction?: string;
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

  return (
    <main className="min-h-[60vh] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        {page.eyebrow && (
          <p className="afr-eyebrow text-muted-foreground">{page.eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {pageTitle}
        </h1>
        {page.introduction && (
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {page.introduction}
          </p>
        )}

        <div className="mt-12 space-y-10">
          {(page.blocks ?? []).map((block, index) => {
            const key = block.id || `${block.type || "block"}-${index}`;
            if (block.type === "heading") {
              return <h2 key={key} className="font-display text-2xl font-bold tracking-tight">{block.heading}</h2>;
            }
            if (block.type === "list") {
              return (
                <section key={key}>
                  {block.heading && <h2 className="font-display text-xl font-bold">{block.heading}</h2>}
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
                    {(block.items ?? []).map((item, itemIndex) => <li key={`${key}-${itemIndex}`}>{item}</li>)}
                  </ul>
                </section>
              );
            }
            if (block.type === "image") {
              const imageUrl = safeLink(block.imageUrl);
              return imageUrl ? <figure key={key}><img src={imageUrl} alt={block.alt ?? ""} className="h-auto max-h-[38rem] w-full object-cover" /></figure> : null;
            }
            if (block.type === "feature") {
              const imageUrl = safeLink(block.imageUrl);
              const href = safeLink(block.href);
              return (
                <section key={key} className="grid gap-6 border-y py-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center">
                  {imageUrl && <img src={imageUrl} alt={block.alt ?? ""} className="aspect-[4/3] w-full object-cover" />}
                  <div>
                    {block.heading && <h2 className="font-display text-xl font-bold tracking-tight">{block.heading}</h2>}
                    {block.body && <p className="mt-3 text-base leading-7 text-muted-foreground">{block.body}</p>}
                    {href && <a href={href} className="mt-5 inline-flex font-semibold text-foreground underline-offset-4 hover:underline">{block.label || "Learn more"} →</a>}
                  </div>
                </section>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote key={key} className="border-l-4 border-innovation pl-6">
                  <p className="font-display text-xl font-semibold leading-8">{block.body}</p>
                  {block.attribution && <cite className="mt-3 block text-sm not-italic text-muted-foreground">{block.attribution}</cite>}
                </blockquote>
              );
            }
            if (block.type === "cta") {
              const href = safeLink(block.href);
              return href ? (
                <p key={key}>
                  <a href={href} className="inline-flex items-center border-b-2 border-current pb-1 font-semibold text-foreground hover:text-muted-foreground">
                    {block.label || block.heading || "Learn more"}
                  </a>
                </p>
              ) : null;
            }
            return (
              <section key={key}>
                {block.heading && <h2 className="font-display text-xl font-bold tracking-tight">{block.heading}</h2>}
                {block.body && <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{block.body}</p>}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}