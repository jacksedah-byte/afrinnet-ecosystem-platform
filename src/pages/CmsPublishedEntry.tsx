import { useLocation } from "react-router";
import { useQuery } from "convex/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { api } from "@/convex/_generated/api";
import { CmsContentSections } from "@/components/site/CmsContentSections";

export default function CmsPublishedEntry() {
  const { pathname } = useLocation();
  const entries = useQuery(api.cms.publishedContent);
  const entry = entries?.find((item) => {
    const expectedPath =
      item.path ||
      (item.type === "news"
        ? `/news/${item.slug}`
        : item.type === "resource"
          ? `/knowledge/${item.slug}`
          : undefined);
    return expectedPath === pathname;
  });

  if (!entries) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-obsidian text-chalk">
        <Loader2 className="size-6 animate-spin" aria-label="Loading article" />
      </div>
    );
  }

  if (!entry) {
    return (
      <main className="min-h-[60vh] bg-obsidian px-6 py-20 text-center text-chalk">
        <h1 className="font-display text-3xl font-bold">Content not found</h1>
        <Link to={pathname.startsWith("/news") ? "/news" : "/knowledge"} className="mt-6 inline-flex items-center gap-2 text-innovation hover:underline">
          <ArrowLeft className="size-4" /> Back to listing
        </Link>
      </main>
    );
  }

  return (
    <article className="min-h-[60vh] bg-obsidian px-6 py-16 text-chalk sm:py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          to={entry.type === "news" ? "/news" : "/knowledge"}
          className="inline-flex items-center gap-2 text-sm text-innovation hover:underline"
        >
          <ArrowLeft className="size-4" />
          {entry.type === "news" ? "News & events" : "Knowledge Centre"}
        </Link>
        <p className="afr-eyebrow mt-10 text-innovation">
          {entry.type === "news" ? "News & Events" : "Knowledge & Resources"}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {entry.title}
        </h1>
        {entry.summary && (
          <p className="mt-5 text-lg leading-8 text-ash">{entry.summary}</p>
        )}
        {entry.sections?.length ? (
          <div className="mt-10">
            <CmsContentSections sections={entry.sections} />
          </div>
        ) : (
          <div className="mt-10 space-y-5 text-base leading-8 text-ash">
            {entry.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
