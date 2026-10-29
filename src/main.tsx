import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CmsContentSections } from "@/components/site/CmsContentSections";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Home = lazy(() => import("./pages/Home.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const CmsPage = lazy(() => import("./pages/Cms.tsx"));
const CmsPublishedEntry = lazy(() => import("./pages/CmsPublishedEntry.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
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
  const { pathname } = useLocation();
  const page = useQuery(api.cms.publishedPage, { path: pathname });

  if (page) {
    return (
      <SiteLayout>
        <article className="mx-auto max-w-4xl px-6 py-16 text-chalk sm:py-24">
          <p className="afr-eyebrow text-innovation">AFRINNET Foundation</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {page.title}
          </h1>
          {page.summary && (
            <p className="mt-5 text-lg leading-8 text-ash">{page.summary}</p>
          )}
          {page.sections?.length ? (
            <div className="mt-10">
              <CmsContentSections sections={page.sections} />
            </div>
          ) : (
            <div className="mt-10 space-y-5 text-base leading-8 text-ash">
              {page.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </article>
      </SiteLayout>
    );
  }

  return <SiteLayout>{children}</SiteLayout>;
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

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || "http://127.0.0.1:3210",
);

function RouteSyncer() {
  const location = useLocation();
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

  // Unique document titles per route for SEO and orientation.
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
      "/privacy": "Privacy Policy — AFRINNET Foundation",
      "/terms": "Terms of Use — AFRINNET Foundation",
      "/accessibility": "Accessibility Statement — AFRINNET Foundation",
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
    document.title = base;
  }, [location.pathname]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              {/* Public website */}
              <Route path="/" element={<Public><Home /></Public>} />
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
              <Route path="/knowledge/:slug" element={<Public><CmsPublishedEntry /></Public>} />
              <Route path="/news" element={<Public><News /></Public>} />
              <Route path="/news/:slug" element={<Public><CmsPublishedEntry /></Public>} />

              <Route path="/submit" element={<Public><SubmitInnovation /></Public>} />
              <Route path="/partnerships" element={<Public><Partnerships /></Public>} />
              <Route path="/contact" element={<Public><Contact /></Public>} />

              <Route path="/privacy" element={<Public><Legal doc="privacy" /></Public>} />
              <Route path="/terms" element={<Public><Legal doc="terms" /></Public>} />
              <Route path="/accessibility" element={<Public><Legal doc="accessibility" /></Public>} />

              {/* Authentication and member portal */}
              <Route path="/cms" element={<CmsPage />} />
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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
