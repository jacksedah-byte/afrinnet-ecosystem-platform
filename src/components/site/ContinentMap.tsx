import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { mapRegions } from "@/content/audiences";
import { AFRICA_PATH, AFRICA_VIEWBOX, COUNTRIES, MADAGASCAR_PATH } from "./africa";
import { cn } from "@/lib/utils";

/**
 * "Building Connections Across Africa" — regional exploration with honest data
 * states. No institutional locations or coverage claims are drawn until
 * verified data exists. Zoom is gentle and keyboard-operable; markers reveal
 * once on entry and stay static for reduced-motion users.
 */
export function ContinentMap() {
  const reduceMotion = useReducedMotion();
  const staticMode = !!reduceMotion;
  const [activeId, setActiveId] = useState<string>(mapRegions[0].id);
  const [zoom, setZoom] = useState(1);

  const active = mapRegions.find((r) => r.id === activeId) ?? mapRegions[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-start">
      {/* Map */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink/60">
          <div
            className="relative aspect-[420/500] w-full transition-transform duration-500 ease-out"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          >
            <svg
              viewBox={AFRICA_VIEWBOX}
              className="absolute inset-0 h-full w-full p-6 sm:p-10"
              role="img"
              aria-label="Map of Africa showing all 51 countries with five regional markers"
            >
              {/* Real country geometry (Natural Earth 1:110m) — borders read like a proper map. */}
              <g>
                {COUNTRIES.map((country) => (
                  <path
                    key={country.name}
                    d={country.d}
                    fill="rgba(24,54,91,0.55)"
                    stroke="rgba(165,174,169,0.35)"
                    strokeWidth="0.7"
                    strokeLinejoin="round"
                  />
                ))}
              </g>
              {/* Crisper continental coastline over the country fill */}
              <path
                d={AFRICA_PATH}
                fill="none"
                stroke="rgba(165,174,169,0.75)"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d={MADAGASCAR_PATH}
                fill="none"
                stroke="rgba(165,174,169,0.75)"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />

              {/* Aspirational connective lines between regions (decorative) */}
              <g stroke="#16A34A" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="3 7">
                <path d="M200.4 102.5 L223.5 248.7" />
                <path d="M95.7 193.6 L223.5 248.7" />
                <path d="M223.5 248.7 L322.2 231.4" />
                <path d="M223.5 248.7 L244.9 386.9" />
                <path d="M322.2 231.4 L244.9 386.9" />
              </g>

              {mapRegions.map((region, i) => {
                const isActive = region.id === activeId;
                return (
                  <motion.g
                    key={region.id}
                    initial={staticMode ? false : { opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.45,
                      delay: staticMode ? 0 : 0.25 + i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveId(region.id)}
                    role="presentation"
                  >
                    <circle
                      cx={region.x}
                      cy={region.y}
                      r={isActive ? 13 : 9}
                      fill={isActive ? "rgba(22,163,74,0.25)" : "rgba(8,11,10,0.75)"}
                      stroke={isActive ? "#22C55E" : "rgba(165,174,169,0.7)"}
                      strokeWidth={isActive ? 2 : 1.2}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={region.x}
                      cy={region.y}
                      r="3"
                      fill={isActive ? "#22C55E" : "#A5AEA9"}
                    />
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
              className="flex size-9 items-center justify-center rounded-md border border-white/15 bg-obsidian/85 text-chalk transition-colors hover:border-innovation/60 hover:text-innovation"
            >
              <Minus className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Reset zoom"
              onClick={() => setZoom(1)}
              className="flex size-9 items-center justify-center rounded-md border border-white/15 bg-obsidian/85 text-chalk transition-colors hover:border-innovation/60 hover:text-innovation"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.2).toFixed(2)))}
              className="flex size-9 items-center justify-center rounded-md border border-white/15 bg-obsidian/85 text-chalk transition-colors hover:border-innovation/60 hover:text-innovation"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-ash/70">
          Generalised outline and country borders (Natural Earth 1:110m, public
          domain) for orientation only — markers indicate regions, not
          institutions or coverage.
        </p>
      </div>

      {/* Region selector + detail */}
      <div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select a region">
          {mapRegions.map((region) => (
            <button
              key={region.id}
              type="button"
              aria-pressed={region.id === activeId}
              onClick={() => setActiveId(region.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-display text-xs font-semibold transition-all duration-200",
                region.id === activeId
                  ? "border-innovation bg-innovation/15 text-chalk"
                  : "border-white/15 text-ash hover:border-white/35 hover:text-chalk",
              )}
            >
              {region.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-ink/70 p-5">
          <p className="afr-eyebrow text-innovation">Selected region</p>
          <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-chalk">
            {active.label}
          </h3>
          <p className="mt-3 text-sm leading-6 text-ash">{active.blurb}</p>

          <div className="mt-4 rounded-lg border border-white/10 bg-obsidian/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ash/80">
              Verified data
            </p>
            <p className="mt-1.5 text-sm leading-6 text-ash">
              Participating institutions, programmes and published innovation
              stories for this region are not yet available. Records will appear
              here as they are verified and approved for publication.
            </p>
          </div>

          <a
            href="#newsletter"
            className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-innovation transition-colors hover:text-innovation-bright"
          >
            Get updates as connections are confirmed →
          </a>
        </div>
      </div>
    </div>
  );
}
