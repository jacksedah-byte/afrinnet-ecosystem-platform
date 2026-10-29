import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import { useSiteConfiguration } from "@/hooks/use-site-configuration";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

const FONT_OPTIONS = ["Montserrat", "Open Sans", "Arial", "Georgia", "system-ui"];

function isHexColor(value: string) {
  return /^#[\da-f]{6}$/i.test(value);
}

/**
 * Shared shell for every public page: sticky header, main region, footer.
 * Handles scroll restoration — top on navigation, hash targets in view.
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const { design } = useSiteConfiguration();

  useEffect(() => {
    const root = document.documentElement;
    const primary = isHexColor(design.primary) ? design.primary : "#16a34a";
    const secondary = isHexColor(design.secondary) ? design.secondary : "#18365b";
    const background = isHexColor(design.background) ? design.background : "#080b0a";
    const surface = isHexColor(design.surface) ? design.surface : "#101a16";
    const text = isHexColor(design.text) ? design.text : "#f5f7f5";
    const displayFont = FONT_OPTIONS.includes(design.displayFont) ? design.displayFont : "Montserrat";
    const bodyFont = FONT_OPTIONS.includes(design.bodyFont) ? design.bodyFont : "Open Sans";
    const radius = Number.isFinite(design.radius)
      ? Math.min(Math.max(design.radius, 0), 2)
      : 0.625;
    const channel = (hex: string, offset: number) => {
      const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    const luminance =
      0.2126 * channel(primary, 1) +
      0.7152 * channel(primary, 3) +
      0.0722 * channel(primary, 5);
    root.style.setProperty("--color-innovation", primary);
    root.style.setProperty("--color-navy", secondary);
    root.style.setProperty("--color-obsidian", background);
    root.style.setProperty("--background", background);
    root.style.setProperty("--color-ink", surface);
    root.style.setProperty("--card", surface);
    root.style.setProperty("--color-chalk", text);
    root.style.setProperty("--foreground", text);
    root.style.setProperty("--primary", primary);
    root.style.setProperty(
      "--primary-foreground",
      luminance > 0.45 ? "#080b0a" : "#ffffff",
    );
    root.style.setProperty("--ring", primary);
    root.style.setProperty("--secondary", secondary);
    root.style.setProperty("--radius", `${radius}rem`);
    root.style.setProperty(
      "--font-display",
      `"${displayFont}", ui-sans-serif, system-ui, sans-serif`,
    );
    root.style.setProperty(
      "--font-body",
      `"${bodyFont}", ui-sans-serif, system-ui, sans-serif`,
    );
  }, [design]);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hash) {
      const id = hash.slice(1);
      // Wait a frame so the target exists after route/content render.
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col bg-obsidian">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-innovation focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-semibold focus:text-obsidian"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
