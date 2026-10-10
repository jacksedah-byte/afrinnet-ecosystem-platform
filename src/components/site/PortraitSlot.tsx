import { cn } from "@/lib/utils";

/**
 * Professional portrait placeholder — never an AI-generated face.
 * Replace with the approved photograph when supplied (portrait orientation,
 * controlled cropping, restrained background).
 */
export function PortraitSlot({
  initials,
  note,
  className,
  name,
}: {
  initials: string;
  note: string;
  className?: string;
  /** Used in the accessible label when a photo is absent. */
  name?: string;
}) {
  return (
    <figure className={cn("w-full", className)}>
      <div
        role="img"
        aria-label={
          name
            ? `Portrait of ${name} — professional photograph pending approval`
            : note
        }
        className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-gradient-to-b from-ink to-obsidian"
      >
        {/* Faint network texture */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-25"
          viewBox="0 0 200 250"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke="#16A34A" strokeWidth="0.8" fill="none" opacity="0.55">
            <path d="M20 210 L60 150 L110 175 L150 110 L190 140" />
            <path d="M10 90 L55 60 L105 95 L150 55 L195 80" />
            <path d="M60 150 L55 60 M110 175 L105 95 M150 110 L150 55" />
          </g>
          <g fill="#16A34A">
            {[
              [60, 150],
              [110, 175],
              [150, 110],
              [55, 60],
              [105, 95],
              [150, 55],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2" opacity="0.8" />
            ))}
          </g>
        </svg>

        <span className="relative font-display text-5xl font-bold tracking-tight text-white/25 sm:text-6xl">
          {initials}
        </span>

        <span className="absolute bottom-3 left-3 rounded-full border border-innovation/40 bg-obsidian/80 px-2.5 py-1 font-display text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-innovation">
          Portrait pending
        </span>
      </div>

      {note && (
        <figcaption className="mt-2.5 text-[0.72rem] leading-4 text-ash/70">
          {note}
        </figcaption>
      )}
    </figure>
  );
}
