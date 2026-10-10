import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { announcement, navGroups, navPlainLinks, primaryCta } from "@/content/site";
import { Logo } from "./Logo";
import { container } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * Announcement strip + sticky navigation.
 * Transparent over the hero, opaque near-black once the page scrolls.
 * Dropdowns work with mouse, keyboard (Escape closes, focus restored) and touch.
 */
export function SiteHeader() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on route change, outside click and Escape.
  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const isActiveGroup = (href: string) => {
    const base = href.split("#")[0];
    if (base === "/") return location.pathname === "/";
    return location.pathname === base || location.pathname.startsWith(`${base}/`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Announcement strip — hide when there is no current announcement */}
      {announcement.enabled && (
        <div
          className={cn(
            "overflow-hidden border-b border-white/10 bg-ink transition-[max-height,opacity] duration-300",
            scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
          )}
        >
          <div
            className={cn(
              container,
              "flex h-9 items-center justify-between gap-4 text-[0.78rem]",
            )}
          >
            <p className="truncate text-ash">
              <span className="mr-2 inline-block size-1.5 rounded-full bg-innovation align-middle" />
              {announcement.text}{" "}
              <Link
                to={announcement.href}
                className="font-semibold text-innovation underline-offset-4 hover:underline"
              >
                {announcement.linkLabel} →
              </Link>
            </p>
            <nav
              aria-label="Utility"
              className="hidden shrink-0 items-center gap-5 md:flex"
            >
              {navPlainLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-ash transition-colors hover:text-chalk"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main navigation */}
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-obsidian/95 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            container,
            "flex h-16 items-center justify-between gap-4 xl:h-[72px]",
          )}
        >
          <Link
            to="/"
            aria-label="AFRINNET Foundation — home"
            className="shrink-0 rounded-md"
          >
            <Logo />
          </Link>

          <nav
            ref={navRef}
            aria-label="Main"
            className="hidden items-center xl:flex"
          >
            {navGroups.map((group, i) => {
              const open = openGroup === i;
              const active = isActiveGroup(group.href);
              const alignRight = i >= navGroups.length - 2;
              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(i)}
                  onMouseLeave={() => setOpenGroup(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && open) setOpenGroup(null);
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-haspopup="true"
                    aria-controls={`nav-panel-${i}`}
                    onClick={() => setOpenGroup(open ? null : i)}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2.5 py-2 font-display text-[0.8125rem] font-semibold tracking-tight transition-colors",
                      active
                        ? "text-innovation"
                        : "text-chalk/85 hover:text-chalk",
                    )}
                  >
                    {group.label}
                    <ChevronDown
                      className={cn(
                        "size-3.5 opacity-60 transition-transform duration-200",
                        open && "rotate-180",
                      )}
                    />
                  </button>

                  <div
                    id={`nav-panel-${i}`}
                    className={cn(
                      "absolute top-[calc(100%+10px)] z-50 rounded-xl border border-white/10 bg-ink/97 p-4 shadow-2xl shadow-black/40 backdrop-blur transition-all duration-200",
                      alignRight ? "right-0" : "left-0",
                      group.columns.length > 1 ? "w-[560px]" : "w-[380px]",
                      open
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0",
                    )}
                  >
                    <div
                      className={cn(
                        "grid gap-x-7 gap-y-1",
                        group.columns.length > 1 && "sm:grid-cols-2",
                      )}
                    >
                      {group.columns.map((col, ci) => (
                        <div key={ci}>
                          {col.title && (
                            <p className="afr-eyebrow mb-2 mt-1 text-ash/70">
                              {col.title}
                            </p>
                          )}
                          <ul>
                            {col.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  to={link.href}
                                  className="group/link block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.05]"
                                >
                                  <span className="block font-display text-sm font-semibold text-chalk">
                                    {link.label}
                                  </span>
                                  {link.blurb && (
                                    <span className="mt-0.5 block text-xs leading-5 text-ash">
                                      {link.blurb}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <span className="mx-1 h-5 w-px bg-white/10" aria-hidden="true" />
            {navPlainLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "rounded-md px-2.5 py-2 font-display text-[0.8125rem] font-semibold tracking-tight transition-colors",
                  location.pathname === link.href
                    ? "text-innovation"
                    : "text-chalk/85 hover:text-chalk",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="lg"
              className="hidden bg-innovation font-display font-semibold text-obsidian hover:bg-innovation-bright sm:inline-flex"
            >
              <Link to={primaryCta.href}>{primaryCta.label}</Link>
            </Button>

            {/* Mobile / tablet menu */}
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="flex size-10 items-center justify-center rounded-md border border-white/15 text-chalk transition-colors hover:bg-white/5 xl:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="flex w-[min(24rem,92vw)] flex-col gap-0 overflow-y-auto border-white/10 bg-obsidian p-0"
        >
          <SheetHeader className="border-b border-white/10 px-5 py-4">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex items-center justify-between">
              <Logo />
              <SheetClose
                aria-label="Close navigation menu"
                className="flex size-9 items-center justify-center rounded-md border border-white/15 text-chalk"
              >
                <X className="size-4" />
              </SheetClose>
            </div>
          </SheetHeader>

          <nav aria-label="Mobile" className="flex flex-col px-5 py-4">
            {navGroups.map((group) => (
              <div key={group.label} className="border-b border-white/10 py-4 first:pt-0">
                <Link
                  to={group.href}
                  className="font-display text-base font-bold tracking-tight text-chalk"
                >
                  {group.label}
                </Link>
                <div className="mt-2 space-y-1">
                  {group.columns.flatMap((col) => col.links).map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className="block rounded-md px-2 py-2 text-sm text-ash transition-colors hover:bg-white/5 hover:text-chalk"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-1 py-4">
              {navPlainLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    to={link.href}
                    className="rounded-md px-2 py-2 font-display text-sm font-semibold text-chalk"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </nav>

          <div className="mt-auto border-t border-white/10 p-5">
            <Button
              asChild
              size="lg"
              className="w-full bg-innovation font-display font-semibold text-obsidian hover:bg-innovation-bright"
            >
              <Link to={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
