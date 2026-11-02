import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import {
  AFRICA_PATH,
  AFRICA_VIEWBOX,
  COUNTRIES,
  MADAGASCAR_PATH,
  NETWORK_EDGES,
  NETWORK_NODES,
  OUTLINE_POINTS,
  PULSE_EDGES,
} from "./africa";

const FLOATING_LABELS: {
  text: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay: string;
}[] = [
  { text: "Innovation", top: "8%", left: "2%", delay: "0.2s" },
  { text: "Research", top: "20%", right: "-2%", delay: "1.4s" },
  { text: "IP Support", bottom: "24%", left: "-3%", delay: "0.8s" },
  { text: "Partnerships", bottom: "8%", right: "4%", delay: "2s" },
];

/**
 * Hero visual: a real outline of Africa (Natural Earth 1:110m) drawn with fine
 * network lines, progressive node/line animation, light pulses and a small
 * scroll drift. Static when prefers-reduced-motion is set.
 */
export function NetworkHero() {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Subtle scroll drift — transform only, no layout work, disabled for reduced motion.
  useEffect(() => {
    if (reduceMotion || !wrapRef.current) return;
    const el = wrapRef.current;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const offset = Math.min(window.scrollY * 0.045, 42);
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  const staticMode = !!reduceMotion;
  const pulseSet = new Set(PULSE_EDGES.map(([a, b]) => `${a}-${b}`));

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-full max-w-[540px] will-change-transform"
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <div className="absolute inset-[12%] rounded-full bg-innovation/10 blur-3xl" />
      <div className="absolute inset-0 afr-dot-bg opacity-[0.18]" />

      <svg
        viewBox={AFRICA_VIEWBOX}
        className="relative h-full w-full overflow-visible"
        role="presentation"
      >
        <defs>
          <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#16A34A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8FB3A0" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id="hero-node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Continental silhouette */}
        <path
          d={AFRICA_PATH}
          fill="rgba(22,163,74,0.05)"
          stroke={staticMode ? "rgba(165,174,169,0.5)" : "rgba(165,174,169,0.55)"}
          strokeWidth="1.5"
          strokeLinejoin="round"
          className={staticMode ? "" : "afr-line"}
          style={{ ["--afr-dash" as string]: "1600" }}
        />
        <path
          d={MADAGASCAR_PATH}
          fill="rgba(22,163,74,0.05)"
          stroke="rgba(165,174,169,0.5)"
          strokeWidth="1.5"
          className={staticMode ? "" : "afr-line"}
          style={{ ["--afr-dash" as string]: "300" }}
        />

        {/* Real country borders, drawn faintly so the silhouette reads as a proper map */}
        <g fill="none" stroke="rgba(165,174,169,0.3)" strokeWidth="0.7">
          {COUNTRIES.map((country) => (
            <path key={country.name} d={country.d} />
          ))}
        </g>

        {/* Network links */}
        <g strokeLinecap="round">
          {NETWORK_EDGES.map(([a, b], i) => {
            const na = NETWORK_NODES[a];
            const nb = NETWORK_NODES[b];
            const key = `${a}-${b}`;
            const isPulse = pulseSet.has(key) || pulseSet.has(`${b}-${a}`);
            const length = Math.hypot(nb[0] - na[0], nb[1] - na[1]);
            return (
              <g key={key}>
                <line
                  x1={na[0]}
                  y1={na[1]}
                  x2={nb[0]}
                  y2={nb[1]}
                  stroke={isPulse ? "url(#hero-line)" : "rgba(165,174,169,0.32)"}
                  strokeWidth={isPulse ? 1.4 : 1}
                  className={staticMode ? "" : "afr-line"}
                  style={{
                    ["--afr-dash" as string]: `${length.toFixed(0)}`,
                    animationDelay: `${(i % 8) * 0.12 + 0.35}s`,
                  }}
                />
                {!staticMode && isPulse && (
                  <line
                    x1={na[0]}
                    y1={na[1]}
                    x2={nb[0]}
                    y2={nb[1]}
                    stroke="#22C55E"
                    strokeWidth="1.6"
                    className="afr-flow"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {NETWORK_NODES.map(([x, y], i) => {
            const major = i % 4 === 0;
            return (
              <g
                key={i}
                className={staticMode ? "" : "afr-node"}
                style={{ animationDelay: `${0.3 + i * 0.07}s` }}
              >
                {major && <circle cx={x} cy={y} r="9" fill="url(#hero-node)" />}
                <circle
                  cx={x}
                  cy={y}
                  r={major ? 3.4 : 2.4}
                  fill={major ? "#22C55E" : "#F0F4F1"}
                  opacity={major ? 1 : 0.85}
                />
                {major && (
                  <circle
                    cx={x}
                    cy={y}
                    r="6.5"
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="1"
                    className={staticMode ? "" : "afr-pulse"}
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Outline reinforcement points */}
        <g>
          {OUTLINE_POINTS.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.6"
              fill="#A5AEA9"
              opacity="0.55"
              className={staticMode ? "" : "afr-node"}
              style={{ animationDelay: `${0.2 + i * 0.03}s` }}
            />
          ))}
        </g>
      </svg>

      {/* Floating labels — deliberately subordinate to the headline */}
      <ul className="pointer-events-none absolute inset-0">
        {FLOATING_LABELS.map((label) => (
          <li
            key={label.text}
            className={`absolute ${staticMode ? "" : "afr-float"}`}
            style={{
              top: label.top,
              left: label.left,
              right: label.right,
              bottom: label.bottom,
              animationDelay: label.delay,
            }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-obsidian/70 px-3 py-1.5 font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ash backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-innovation" />
              {label.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
