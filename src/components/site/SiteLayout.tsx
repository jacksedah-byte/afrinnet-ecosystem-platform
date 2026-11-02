import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { useSiteSettings } from "@/hooks/use-site-settings";

/**
 * Shared shell for every public page: sticky header, main region, footer.
 * Handles scroll restoration — top on navigation, hash targets in view.
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const { faviconUrl, theme } = useSiteSettings();
  const reduceMotion = useReducedMotion();
  const motionRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = motionRootRef.current;
    if (!root || reduceMotion) return;

    const parallaxElements = new Set<HTMLElement>();
    let frame = 0;
    let observer: IntersectionObserver | undefined;

    const reveal = (element: HTMLElement, effect: string, index = 0) => {
      if (
        element.hasAttribute("aria-hidden") ||
        element.closest('[aria-hidden="true"]') ||
        element.dataset.scrollMotion
      ) {
        return;
      }

      element.dataset.scrollMotion = effect;
      element.style.setProperty(
        "--motion-delay",
        `${Math.min(index * 70, 420)}ms`,
      );
      if (observer) observer.observe(element);
      else element.classList.add("is-visible");
    };

    const prepare = (scope: ParentNode) => {
      const sections = scope.querySelectorAll<HTMLElement>("section, footer");
      sections.forEach((section) => {
        reveal(section, "up");

        const contentRoots = Array.from(section.children).filter(
          (element): element is HTMLElement =>
            element instanceof HTMLElement &&
            !element.hasAttribute("aria-hidden"),
        );
        contentRoots.forEach((root) => {
          const children = Array.from(root.children).filter(
            (element): element is HTMLElement =>
              element instanceof HTMLElement &&
              !element.hasAttribute("aria-hidden"),
          );
          if (children.length > 1) {
            children.forEach((child, index) =>
              reveal(child, index % 2 === 0 ? "left" : "right", index),
            );
          }

          root.querySelectorAll<HTMLElement>(".grid, ul, ol").forEach((group) => {
            Array.from(group.children).forEach((child, index) => {
              if (child instanceof HTMLElement) {
                reveal(child, index % 2 === 0 ? "up" : "left", index);
              }
            });
          });
        });

        section
          .querySelectorAll<HTMLElement>('img:not([aria-hidden="true"])')
          .forEach((image) => {
            reveal(image, "image");
            if (image.classList.contains("object-cover")) {
              image.dataset.parallax = "true";
              parallaxElements.add(image);
            }
          });

        section
          .querySelectorAll<HTMLElement>(".afr-grid-bg, [aria-hidden='true'].absolute")
          .forEach((element) => {
            element.dataset.parallax = "true";
            parallaxElements.add(element);
          });
      });
    };

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
      );
    }

    prepare(root);
    root.dataset.motionReady = "true";

    const mutations = new MutationObserver(() => prepare(root));
    mutations.observe(root, { childList: true, subtree: true });

    const updateParallax = () => {
      frame = 0;
      const center = window.innerHeight / 2;
      parallaxElements.forEach((element) => {
        if (!element.isConnected) {
          parallaxElements.delete(element);
          return;
        }
        const rect = element.getBoundingClientRect();
        const offset = Math.max(
          -22,
          Math.min(22, (center - (rect.top + rect.height / 2)) * 0.035),
        );
        element.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
      });
    };
    const scheduleParallax = () => {
      if (!frame) frame = requestAnimationFrame(updateParallax);
    };
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("resize", scheduleParallax, { passive: true });
    scheduleParallax();

    return () => {
      mutations.disconnect();
      observer?.disconnect();
      window.removeEventListener("scroll", scheduleParallax);
      window.removeEventListener("resize", scheduleParallax);
      if (frame) cancelAnimationFrame(frame);
      root.querySelectorAll<HTMLElement>("[data-scroll-motion]").forEach((el) => {
        delete el.dataset.scrollMotion;
        el.classList.remove("is-visible");
        el.style.removeProperty("--motion-delay");
      });
      parallaxElements.forEach((element) => {
        delete element.dataset.parallax;
        element.style.removeProperty("--parallax-y");
      });
      delete root.dataset.motionReady;
    };
  }, [pathname, reduceMotion]);

  useEffect(() => {
    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.append(favicon);
    }
    favicon.href = faviconUrl || "/logo.svg";
  }, [faviconUrl]);

  useEffect(() => {
    const root = document.documentElement;
    const variables: Record<string, string> = {
      "--primary": theme.primary,
      "--color-innovation": theme.primary,
      "--color-innovation-bright": theme.primary,
      "--background": theme.background,
      "--color-obsidian": theme.background,
      "--card": theme.surface,
      "--color-ink": theme.surface,
    };
    const previous = new Map<string, string>();
    for (const [name, value] of Object.entries(variables)) {
      previous.set(name, root.style.getPropertyValue(name));
      root.style.setProperty(name, value);
    }
    return () => {
      for (const [name, value] of previous) {
        if (value) root.style.setProperty(name, value);
        else root.style.removeProperty(name);
      }
    };
  }, [theme.background, theme.primary, theme.surface]);

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
    <div
      ref={motionRootRef}
      className="afr-public-site flex min-h-screen flex-col bg-obsidian"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-innovation focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-semibold focus:text-obsidian"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            className="min-h-full"
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}
            transition={{
              duration: reduceMotion ? 0 : 0.42,
              ease: [0.2, 0.7, 0.2, 1],
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
    </div>
  );
}
