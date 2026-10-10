import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FolderKanban,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { Callout, StatusBadge } from "@/components/site/primitives";
import { roadmapPhases } from "@/content/site";

const MODULES = [
  {
    icon: ClipboardCheck,
    title: "Innovation Registry",
    text: "Records, review status, verification and controlled access.",
    phase: "Phase 2",
  },
  {
    icon: ShieldCheck,
    title: "IP Support",
    text: "Readiness assessments, requests, referrals and case tracking.",
    phase: "Phase 4",
  },
  {
    icon: Users,
    title: "Institutional Portal",
    text: "Institution profiles, submissions, collaboration and reports.",
    phase: "Phase 3",
  },
  {
    icon: FolderKanban,
    title: "Administration",
    text: "Moderation, user management, analytics and audit logs.",
    phase: "Phase 3+",
  },
];

const QUICK_LINKS = [
  { label: "Submit an innovation", href: "/submit" },
  { label: "Request IP support", href: "/request-ip-support" },
  { label: "Browse the Knowledge Centre", href: "/knowledge" },
  { label: "Become an institutional partner", href: "/partnerships" },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-obsidian text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Header */}
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" aria-label="AFRINNET Foundation — home">
              <Logo />
            </Link>
            <span className="h-8 w-px bg-white/10" aria-hidden="true" />
            <div>
              <p className="afr-eyebrow text-innovation">Member portal</p>
              <p className="mt-1 text-sm text-ash">
                Signed in as{" "}
                <span className="font-medium text-chalk">
                  {user?.name || user?.email || "AFRINNET member"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              asChild
              variant="outline"
              className="cursor-pointer border-white/20 bg-transparent font-display font-semibold text-chalk hover:border-innovation hover:text-innovation"
            >
              <Link to="/">Return to website</Link>
            </Button>
            <Button
              onClick={handleSignOut}
              className="cursor-pointer bg-innovation font-display font-semibold text-obsidian hover:bg-innovation-bright"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </header>

        {/* Status */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight text-chalk sm:text-4xl">
                Your AFRINNET account
              </h1>
              <StatusBadge tone="developing">Early access</StatusBadge>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ash">
              Authentication is live. The workspace modules that sit behind it —
              the innovation registry, IP case tracking and the institutional
              portal — are being built in sequenced phases, so nothing here is
              presented as operational before it is.
            </p>

            <Callout tone="green" title="What your account does today" className="mt-6">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Keeps a verified identity for future submissions and requests</li>
                <li>Will hold your submission references and follow-up correspondence</li>
                <li>Will become the sign-in for the registry and institutional portal</li>
              </ul>
            </Callout>
          </div>

          {/* Quick links */}
          <div className="rounded-2xl border border-white/10 bg-ink/70 p-6">
            <p className="afr-eyebrow text-ash/80">Available now</p>
            <ul className="mt-4 space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-obsidian/60 px-4 py-3 text-sm font-medium text-chalk transition-colors hover:border-innovation/60"
                  >
                    {link.label}
                    <ArrowRight
                      className="size-4 text-innovation transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Planned modules */}
        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
              Portal modules in development
            </h2>
            <Link
              to="/about/mission-vision"
              className="font-display text-sm font-semibold text-innovation hover:text-innovation-bright"
            >
              See the full roadmap →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.title}
                  className="flex flex-col rounded-2xl border border-white/10 bg-ink/60 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-innovation">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <StatusBadge tone="neutral">{module.phase}</StatusBadge>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-chalk">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ash">{module.text}</p>
                  <p className="mt-4 border-t border-white/10 pt-3 text-xs uppercase tracking-[0.12em] text-ash/60">
                    Not yet operational
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Roadmap strip */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-ink/60 p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="size-4 text-innovation" aria-hidden="true" />
            <h2 className="font-display text-base font-bold tracking-tight text-chalk">
              Platform phases
            </h2>
          </div>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {roadmapPhases.map((phase, i) => (
              <li key={phase.phase} className="border-t border-white/12 pt-3">
                <span className="font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] text-innovation">
                  {phase.phase}
                </span>
                <p className="mt-1.5 font-display text-sm font-bold text-chalk">
                  {phase.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-ash">
                  {i === 0 ? "In progress now" : "Planned"}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
