import { cn } from "@/lib/utils";

/**
 * AFRINNET logo placeholder — a clearly replaceable mark, not an official logo.
 * Swap `LogoMark` for the approved asset (preserve proportions) when supplied.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="AFRINNET logo placeholder"
      className={cn("size-9 shrink-0", className)}
    >
      <rect
        x="0.75"
        y="0.75"
        width="38.5"
        height="38.5"
        rx="10.5"
        fill="#0B1210"
        stroke="rgba(22,163,74,0.55)"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 30.5 L20 10 L29.5 30.5"
        fill="none"
        stroke="#F0F4F1"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 23 H25" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="20" cy="10" r="2.6" fill="#16A34A" />
      <circle cx="10.5" cy="30.5" r="2.2" fill="#F0F4F1" />
      <circle cx="29.5" cy="30.5" r="2.2" fill="#F0F4F1" />
      <circle cx="15" cy="23" r="1.4" fill="#16A34A" />
      <circle cx="25" cy="23" r="1.4" fill="#16A34A" />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-bold tracking-[0.14em] text-chalk">
            AFRINNET
          </span>
          <span className="mt-0.5 font-display text-[0.5rem] font-semibold tracking-[0.3em] text-ash">
            FOUNDATION
          </span>
        </span>
      )}
    </span>
  );
}
