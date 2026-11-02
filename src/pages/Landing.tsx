import { motion } from "framer-motion";
import { ArrowRight, Globe2, Network, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";

const pillars = [
  {
    icon: Network,
    title: "Connected ecosystems",
    text: "Link researchers, founders, institutions, and policymakers into one shared innovation engine.",
  },
  {
    icon: ShieldCheck,
    title: "Trust and verification",
    text: "Standards, IP support, and institutional oversight help every opportunity move with confidence.",
  },
  {
    icon: TrendingUp,
    title: "Visible momentum",
    text: "Track progress from concept to commercial traction with a clear view of the journey ahead.",
  },
];

const stats = [
  { value: "40+", label: "African innovation nodes" },
  { value: "100%", label: "collaboration-first model" },
  { value: "24/7", label: "ecosystem visibility" },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-obsidian text-foreground">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.02] px-4 py-3 backdrop-blur-sm"
        >
          <Link to="/" aria-label="AFRINNET home" className="flex items-center gap-3">
            <Logo compact />
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-ash md:flex">
            <Link to="/about" className="transition-colors hover:text-chalk">About</Link>
            <Link to="/ecosystem" className="transition-colors hover:text-chalk">Ecosystem</Link>
            <Link to="/knowledge" className="transition-colors hover:text-chalk">Knowledge</Link>
            <Link to="/contact" className="transition-colors hover:text-chalk">Contact</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="hidden border-white/15 bg-transparent text-chalk hover:border-innovation hover:text-innovation sm:inline-flex">
              <Link to="/auth">Member sign in</Link>
            </Button>
            <Button asChild className="bg-innovation text-white hover:bg-innovation-bright">
              <Link to="/submit">Get started</Link>
            </Button>
          </div>
        </motion.header>

        <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20">
          <div className="absolute inset-0 -z-10 afr-grid-bg opacity-60" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-72 w-72 rounded-full bg-innovation/20 blur-3xl" aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-innovation/40 bg-innovation/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-innovation">
              <Sparkles className="size-3.5" />
              African innovation network
            </div>
            <h1 className="font-display text-4xl font-black tracking-tight text-chalk sm:text-5xl lg:text-7xl">
              Build the future of <span className="text-innovation">African innovation</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-ash sm:text-lg">
              AFRINNET connects institutions, founders, researchers, and builders to unlock productive collaboration,
              commercialization, and long-term impact across the continent.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-innovation text-white hover:bg-innovation-bright">
                <Link to="/ecosystem" className="inline-flex items-center gap-2">
                  Explore the network
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/15 bg-transparent text-chalk hover:border-innovation hover:text-innovation">
                <Link to="/contact">Partner with us</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-12 grid gap-4 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-ink/70 p-5 text-left">
                <div className="font-display text-3xl font-black tracking-tight text-chalk">{stat.value}</div>
                <p className="mt-2 text-sm text-ash">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="rounded-3xl border border-white/10 bg-ink/60 p-6 sm:p-8"
          >
            <p className="afr-eyebrow text-innovation">How we work</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-chalk sm:text-4xl">
              A platform for moving ideas from signal to scale.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-ash">
              AFRINNET brings together ecosystem intelligence, institutional support, and trusted collaboration to help
              breakthrough ideas reach the people and systems ready to activate them.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Map the right partners, programs, and policy pathways for growth.",
                "Support IP, commercialization, and strategic readiness for founders and institutions.",
                "Create a public record of opportunities, momentum, and collective action.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                  <span className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-innovation/15 text-innovation">
                    <Globe2 className="size-4" />
                  </span>
                  <p className="text-sm leading-6 text-ash">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-innovation/10 via-transparent to-navy/60 p-6"
          >
            <div className="rounded-2xl border border-white/10 bg-obsidian/80 p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="afr-eyebrow text-ash">Network map</p>
                  <p className="mt-2 text-lg font-semibold text-chalk">Innovation flow</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-innovation/30 bg-innovation/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-innovation">
                  <Users className="size-3.5" />
                  Active
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Founders", "Launch pathways"],
                  ["Institutions", "Scale capacity"],
                  ["Researchers", "Translate insight"],
                  ["Partners", "Unlock momentum"],
                ].map(([title, copy], index) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-chalk">{title}</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-innovation" aria-hidden="true" style={{ opacity: 0.5 + index * 0.15 }} />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-ash">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="afr-eyebrow text-innovation">What makes AFRINNET different</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-chalk sm:text-4xl">
              A stronger innovation story, built together.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + index * 0.1 }}
                className="rounded-3xl border border-white/10 bg-ink/60 p-6"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl border border-innovation/30 bg-innovation/10 text-innovation">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-chalk">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-ash">{text}</p>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
