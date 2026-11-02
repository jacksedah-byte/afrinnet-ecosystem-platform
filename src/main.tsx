import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { CmsPageContent } from "@/components/site/CmsPageContent";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import React, { StrictMode, useEffect, useMemo, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Home = lazy(() => import("./pages/Home.tsx"));
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/ClerkAuth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Cms = lazy(() => import("./pages/Cms.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const About = lazy(() => import("./pages/About.tsx"));
const MissionVision = lazy(() => import("./pages/MissionVision.tsx"));

const Leadership = lazy(() => import("./pages/Leadership.tsx"));
const FounderProfile = lazy(() => import("./pages/FounderProfile.tsx"));
const FounderStory = lazy(() => import("./pages/FounderStory.tsx"));
const ExecutiveProfile = lazy(() => import("./pages/ExecutiveProfile.tsx"));
const Board = lazy(() => import("./pages/Board.tsx"));
const Management = lazy(() => import("./pages/Management.tsx"));
const Governance = lazy(() => import("./pages/Governance.tsx"));

const Ecosystem = lazy(() => import("./pages/Ecosystem.tsx"));
const ServicePage = lazy(() => import("./pages/ServicePage.tsx"));
const IpServices = lazy(() => import("./pages/IpServices.tsx"));
const IpDetail = lazy(() => import("./pages/IpDetail.tsx"));
const Audience = lazy(() => import("./pages/Audience.tsx"));

const Knowledge = lazy(() => import("./pages/Knowledge.tsx"));
const News = lazy(() => import("./pages/News.tsx"));

const SubmitInnovation = lazy(() => import("./pages/SubmitInnovation.tsx"));
const Partnerships = lazy(() => import("./pages/Partnerships.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Legal = lazy(() => import("./pages/Legal.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian">
      <div className="animate-pulse font-display text-sm uppercase tracking-[0.2em] text-ash">
        Loading…
      </div>
    </div>
  );
}

/** Wraps every public page with the shared header, footer and scroll manager. */
function Public({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const content = useQuery(api.cms.getPublishedByPath, { path: location.pathname });
  const preserveExistingPage = content?.content !== null &&
    typeof content?.content === "object" &&
    !Array.isArray(content.content) &&
    (content.content as Record<string, unknown>).preserveExistingPage === true;
  return (
    <SiteLayout>
      {content ? (
        <>
          <CmsPageContent title={content.title} content={content.content} />
          {preserveExistingPage && children}
        </>
      ) : children}
    </SiteLayout>
  );
}

function DynamicCmsRoute() {
  const location = useLocation();
  const content = useQuery(api.cms.getPublishedByPath, { path: location.pathname });
  if (content === undefined) return <RouteLoading />;
  if (!content) {
    return (
      <SiteLayout>
        <NotFound />
      </SiteLayout>
    );
  }
  return (
    <SiteLayout>
      <CmsPageContent title={content.title} content={content.content} />
    </SiteLayout>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in the browser runtime). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(error: Error) {
    console.error("[Preview] Root crash:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function SetupRequired() {
  const missing = [
    !clerkPublishableKey && "VITE_CLERK_PUBLISHABLE_KEY",
    !convexUrl && "VITE_CONVEX_URL",
  ].filter((name): name is string => typeof name === "string");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-xl border-t-4 border-innovation pt-6">
        <p className="afr-eyebrow text-muted-foreground">AFRINNET Foundation</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Connect the app services</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Add these client environment variables to the development or production environment, then restart the app:
        </p>
        <ul className="mt-4 space-y-2 font-mono text-sm">
          {missing.map((name) => <li key={name}>{name}</li>)}
        </ul>
      </section>
    </main>
  );
}

function RouteSyncer() {
  const location = useLocation();
  const publishedPage = useQuery(api.cms.getPublishedByPath, { path: location.pathname });
  const pageMetadata = useMemo(() => {
    const content = publishedPage?.content;
    return content && typeof content === "object" && !Array.isArray(content)
      ? (content as Record<string, unknown>)
      : {};
  }, [publishedPage?.content]);
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "AFRINNET Foundation — African Innovation Network",
      "/about": "About AFRINNET — AFRINNET Foundation",
      "/about/mission-vision": "Mission, Vision & Strategy — AFRINNET Foundation",
      "/leadership": "Leadership & Governance — AFRINNET Foundation",
      "/leadership/founder": "Our Founder — AFRINNET Foundation",
      "/leadership/founder/story": "Why AFRINNET Exists — AFRINNET Foundation",
      "/leadership/executive": "Executive Leadership — AFRINNET Foundation",
      "/leadership/board": "Board of Directors — AFRINNET Foundation",
      "/leadership/management": "Management Committee — AFRINNET Foundation",
      "/leadership/governance": "Governance & Structure — AFRINNET Foundation",
      "/ecosystem": "Innovation Ecosystem — AFRINNET Foundation",
      "/ip": "Intellectual Property Services — AFRINNET Foundation",
      "/knowledge": "Knowledge Centre — AFRINNET Foundation",
      "/knowledge/publications": "Publications & Policy Briefs — AFRINNET Foundation",
      "/news": "News & Events — AFRINNET Foundation",
      "/submit": "Submit an Innovation — AFRINNET Foundation",
      "/partnerships": "Become an Institutional Partner — AFRINNET Foundation",
      "/request-ip-support": "Request IP Support — AFRINNET Foundation",
      "/contact": "Contact — AFRINNET Foundation",
      "/unsubscribe": "Newsletter preferences — AFRINNET Foundation",
      "/privacy": "Privacy Policy — AFRINNET Foundation",
      "/terms": "Terms of Use — AFRINNET Foundation",
      "/accessibility": "Accessibility Statement — AFRINNET Foundation",
    };
    const descriptions: Record<string, string> = {
      "/": "AFRINNET Foundation strengthens Africa's innovation ecosystem by connecting innovators and institutions with knowledge, intellectual property support, partnerships and pathways to develop and advance their ideas.",
      "/about": "Learn about AFRINNET Foundation, its mission, vision and work to strengthen Africa's innovation ecosystem.",
      "/about/mission-vision": "Explore AFRINNET Foundation's mission, vision and strategy for advancing African innovation.",
      "/leadership": "Meet AFRINNET Foundation's leadership and explore its governance structure.",
      "/ecosystem": "Explore AFRINNET's network for discovering, validating and advancing African innovations.",
      "/ip": "Learn about intellectual property support and guidance available through AFRINNET.",
      "/knowledge": "Explore AFRINNET's knowledge centre, resources and publications.",
      "/knowledge/publications": "Browse AFRINNET publications, policy briefs and learning resources.",
      "/news": "Read the latest news, events and updates from AFRINNET Foundation.",
      "/submit": "Submit a non-confidential innovation for consideration by AFRINNET Foundation.",
      "/partnerships": "Explore institutional and development partnerships with AFRINNET Foundation.",
      "/request-ip-support": "Request guidance on intellectual property and innovation support from AFRINNET.",
      "/contact": "Contact AFRINNET Foundation with questions, partnership enquiries or requests for support.",
      "/unsubscribe": "Manage your AFRINNET updates email preferences.",
      "/privacy": "Read how AFRINNET Foundation collects, stores and uses information submitted through this website.",
      "/terms": "Read the terms that apply when using the AFRINNET Foundation website and its services.",
      "/accessibility": "Read AFRINNET Foundation's accessibility statement and how to report a website barrier.",
    };
    const base =
      titles[location.pathname] ??
      (location.pathname.startsWith("/ecosystem/")
        ? "Innovation Service — AFRINNET Foundation"
        : location.pathname.startsWith("/ip/")
          ? "IP Guidance — AFRINNET Foundation"
          : location.pathname.startsWith("/engage/")
            ? "Engage with AFRINNET — AFRINNET Foundation"
            : "AFRINNET Foundation");
    const metadata = pageMetadata ?? {};
    const title =
      (typeof metadata.seoTitle === "string" && metadata.seoTitle.trim()) ||
      base;
    const description =
      (typeof metadata.seoDescription === "string" &&
        metadata.seoDescription.trim()) ||
      (typeof metadata.introduction === "string" &&
        metadata.introduction.trim()) ||
      descriptions[location.pathname] ||
      descriptions["/"];
    const siteOrigin = new URL(
      import.meta.env.VITE_SITE_URL || window.location.origin,
    ).origin;
    const canonicalUrl = new URL(location.pathname, siteOrigin).toString();

    document.title = title;
    const updateMeta = (
      selector: string,
      attribute: "name" | "property",
      key: string,
      value: string,
    ) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.append(element);
      }
      element.content = value;
    };
    const canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    ) ?? document.head.appendChild(document.createElement("link"));
    canonical.rel = "canonical";
    canonical.href = canonicalUrl;

    updateMeta('meta[name="description"]', "name", "description", description);
    updateMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    updateMeta('meta[property="og:title"]', "property", "og:title", title);
    updateMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    updateMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    updateMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );
    updateMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      metadata.noIndex === true ||
        ["/auth", "/cms", "/dashboard", "/unsubscribe"].includes(location.pathname)
        ? "noindex,nofollow"
        : "index,follow",
    );

    const organizationData = document.querySelector<HTMLScriptElement>(
      'script[type="application/ld+json"]',
    );
    if (organizationData) {
      const structuredData = JSON.parse(organizationData.textContent || "{}");
      structuredData.url = `${siteOrigin}/`;
      structuredData.logo = new URL("/logo.svg", siteOrigin).toString();
      organizationData.textContent = JSON.stringify(structuredData);
    }
  }, [location.pathname, pageMetadata]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      {!convex || !clerkPublishableKey ? (
        <SetupRequired />
      ) : (
        <>
          <ToolbarErrorBoundary>
            <VlyToolbar />
          </ToolbarErrorBoundary>
          <ClerkProvider publishableKey={clerkPublishableKey}>
            <ConvexProviderWithClerk client={convex} useAuth={useClerkAuth}>
          <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              {/* Public website */}
              <Route path="/" element={<Public><Home /></Public>} />
              <Route path="/landing" element={<Public><Landing /></Public>} />
              <Route path="/about" element={<Public><About /></Public>} />
              <Route path="/about/mission-vision" element={<Public><MissionVision /></Public>} />

              <Route path="/leadership" element={<Public><Leadership /></Public>} />
              <Route path="/leadership/founder" element={<Public><FounderProfile /></Public>} />
              <Route path="/leadership/founder/story" element={<Public><FounderStory /></Public>} />
              <Route path="/leadership/executive" element={<Public><ExecutiveProfile /></Public>} />
              <Route path="/leadership/board" element={<Public><Board /></Public>} />
              <Route path="/leadership/management" element={<Public><Management /></Public>} />
              <Route path="/leadership/governance" element={<Public><Governance /></Public>} />

              <Route path="/ecosystem" element={<Public><Ecosystem /></Public>} />
              <Route path="/ecosystem/:slug" element={<Public><ServicePage /></Public>} />

              <Route path="/ip" element={<Public><IpServices /></Public>} />
              <Route path="/ip/:slug" element={<Public><IpDetail /></Public>} />
              <Route path="/request-ip-support" element={<Public><Contact variant="ip-support" /></Public>} />

              <Route path="/engage/:slug" element={<Public><Audience /></Public>} />

              <Route path="/knowledge" element={<Public><Knowledge /></Public>} />
              <Route path="/knowledge/publications" element={<Public><Knowledge presetType="publications" /></Public>} />
              <Route path="/news" element={<Public><News /></Public>} />

              <Route path="/submit" element={<Public><SubmitInnovation /></Public>} />
              <Route path="/partnerships" element={<Public><Partnerships /></Public>} />
              <Route path="/contact" element={<Public><Contact /></Public>} />

              <Route path="/privacy" element={<Public><Legal doc="privacy" /></Public>} />
              <Route path="/terms" element={<Public><Legal doc="terms" /></Public>} />
              <Route path="/accessibility" element={<Public><Legal doc="accessibility" /></Public>} />
              <Route path="/unsubscribe" element={<SiteLayout><Unsubscribe /></SiteLayout>} />

              {/* Authentication and member portal */}
              <Route
                path="/auth"
                element={<AuthPage redirectAfterAuth="/dashboard" />}
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth
                    title="Sign in to view your AFRINNET account"
                    description="Your submissions, references and portal modules live here."
                  >
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/cms"
                element={
                  <RequireAuth
                    title="Sign in to manage website content"
                    description="The AFRINNET content workspace is restricted to approved administrators."
                  >
                    <Cms />
                  </RequireAuth>
                }
              />

              <Route path="*" element={<DynamicCmsRoute />} />
            </Routes>
          </Suspense>
              </BrowserRouter>
              <Toaster />
            </ConvexProviderWithClerk>
          </ClerkProvider>
        </>
      )}
    </RootErrorBoundary>
  </StrictMode>,
);
