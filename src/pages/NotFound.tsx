import { Link } from "react-router";
import { ArrowLeft, Search } from "lucide-react";

const SUGGESTIONS = [
  { label: "Innovation ecosystem", href: "/ecosystem" },
  { label: "IP services", href: "/ip" },
  { label: "Knowledge Centre", href: "/knowledge" },
  { label: "Submit an innovation", href: "/submit" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound({ embedded = false }: { embedded?: boolean }) {
  const content = (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 afr-grid-bg afr-mask-fade opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-innovation/10 blur-3xl"
      />

      <div className="relative w-full max-w-xl text-center">
        <p className="afr-eyebrow text-innovation">Error 404</p>
        <h1 className="mt-5 font-display text-6xl font-bold tracking-tight text-chalk sm:text-7xl">
          404
        </h1>
        <p className="mt-4 font-display text-xl font-semibold tracking-tight text-chalk sm:text-2xl">
          This page could not be found
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ash">
          The address may be mistyped, or the page may have moved as AFRINNET's
          site develops. Everything important is reachable from here.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-innovation px-6 font-display text-sm font-semibold text-obsidian transition-colors hover:bg-innovation-bright"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link
            to="/knowledge"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-white/25 px-6 font-display text-sm font-semibold text-chalk transition-colors hover:border-innovation hover:text-innovation"
          >
            <Search className="size-4" aria-hidden="true" />
            Search the Knowledge Centre
          </Link>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-2.5">
          {SUGGESTIONS.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="inline-block rounded-full border border-white/12 bg-ink/70 px-4 py-2 text-xs text-ash transition-colors hover:border-innovation/60 hover:text-chalk"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  if (embedded) {
    return (
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-obsidian px-5 py-20">
        {content}
      </section>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian px-5 py-24">
      {content}
    </main>
  );
}
