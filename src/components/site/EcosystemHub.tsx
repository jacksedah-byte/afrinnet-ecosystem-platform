import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router";
import {
  Building2,
  GraduationCap,
  Handshake,
  Rocket,
  School,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { stakeholders } from "@/content/audiences";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "/engage/government": Building2,
  "/engage/universities": GraduationCap,
  "/engage/tvet": Wrench,
  "/engage/schools": School,
  "/engage/startups": Rocket,
  "/engage/partners": Handshake,
};

/** Anchor points in the 1000×560 diagram space (3 left, hub, 3 right). */
const POSITIONS = [
  { x: 190, y: 92 },
  { x: 190, y: 280 },
  { x: 190, y: 468 },
  { x: 810, y: 92 },
  { x: 810, y: 280 },
  { x: 810, y: 468 },
];
const HUB = { x: 500, y: 280 };

function StakeholderCard({
  href,
  label,
  short,
}: {
  href: string;
  label: string;
  short: string;
}) {
  const Icon = ICONS[href] ?? Handshake;
  return (
    <Link
      to={href}
      className="group flex w-full items-start gap-3 rounded-xl border border-white/12 bg-navy-deep/85 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-innovation/70 hover:bg-navy-deep"
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-innovation/30 bg-innovation/10 text-innovation transition-colors duration-300 group-hover:border-innovation/70 group-hover:bg-innovation/20">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span>
        <span className="block font-display text-sm font-semibold leading-5 text-chalk">
          {short}
        </span>
        <span className="mt-0.5 block text-xs leading-5 text-ash">{label}</span>
      </span>
    </Link>
  );
}

/**
 * Section 6 visual: a central AFRINNET hub connected to six stakeholder groups.
 * Connections appear sequentially on entry; a static stacked version renders
 * for reduced-motion users and on small screens.
 */
export function EcosystemHub() {
  const reduceMotion = useReducedMotion();
  const staticMode = !!reduceMotion;

  return (
    <div>
      {/* Diagram (large screens) */}
      <div className="relative mx-auto hidden aspect-[1000/560] w-full max-w-5xl lg:block">
        <svg
          viewBox="0 0 1000 560"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#16A34A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbit ring */}
          <ellipse
            cx={HUB.x}
            cy={HUB.y}
            rx="360"
            ry="215"
            fill="none"
            stroke="rgba(240,244,241,0.08)"
            strokeDasharray="4 10"
          />
          <circle cx={HUB.x} cy={HUB.y} r="130" fill="url(#hub-glow)" />

          {POSITIONS.map((pos, i) => (
            <motion.line
              key={i}
              x1={HUB.x}
              y1={HUB.y}
              x2={pos.x}
              y2={pos.y}
              stroke="#22C55E"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              initial={staticMode ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: staticMode ? 0 : 0.8,
                delay: staticMode ? 0 : 0.35 + i * 0.14,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Small relay nodes mid-line */}
          {POSITIONS.map((pos, i) => {
            const mx = (HUB.x + pos.x) / 2;
            const my = (HUB.y + pos.y) / 2;
            return (
              <motion.circle
                key={`mid-${i}`}
                cx={mx}
                cy={my}
                r="3.5"
                fill="#080B0A"
                stroke="#22C55E"
                strokeWidth="1.5"
                initial={staticMode ? false : { opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.4,
                  delay: staticMode ? 0 : 0.9 + i * 0.14,
                }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            );
          })}
        </svg>

        {/* Central hub */}
        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        >
          <div className="flex size-32 flex-col items-center justify-center rounded-full border border-innovation/50 bg-obsidian/90 backdrop-blur-sm">
            <span className="font-display text-sm font-bold tracking-[0.14em] text-chalk">
              AFRINNET
            </span>
            <span className="mt-1 font-display text-[0.55rem] font-semibold uppercase tracking-[0.24em] text-innovation">
              Network hub
            </span>
          </div>
        </div>

        {/* Stakeholder cards */}
        {stakeholders.map((s, i) => {
          const pos = POSITIONS[i];
          return (
            <div
              key={s.href}
              className="absolute w-[248px]"
              style={{
                left: `${(pos.x / 1000) * 100}%`,
                top: `${(pos.y / 560) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div
                initial={staticMode ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: staticMode ? 0 : 0.5 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <StakeholderCard {...s} />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Stacked version — mobile and reduced motion */}
      <div
        className={cn(
          "grid gap-3 sm:grid-cols-2 lg:hidden",
          staticMode && "sm:grid-cols-2",
        )}
      >
        <div className="mb-1 flex items-center justify-center gap-3 rounded-xl border border-innovation/40 bg-obsidian/70 px-4 py-3 sm:col-span-2">
          <span className="font-display text-sm font-bold tracking-[0.14em] text-chalk">
            AFRINNET
          </span>
          <span className="h-4 w-px bg-white/15" />
          <span className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-innovation">
            Network hub
          </span>
        </div>
        {stakeholders.map((s) => (
          <StakeholderCard key={s.href} {...s} />
        ))}
      </div>
    </div>
  );
}
