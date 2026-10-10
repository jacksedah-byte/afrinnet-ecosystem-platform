import { motion, useReducedMotion } from "framer-motion";
import { journeySteps } from "@/content/services";
import { cn } from "@/lib/utils";

/**
 * Discover → Submit → Review → Connect → Advance.
 * Horizontal with a progressively filling line on desktop, vertical timeline
 * on mobile. Steps activate in sequence once, as the section enters view.
 */
export function JourneyTimeline({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const staticMode = !!reduceMotion;

  // Desktop rail fills horizontally, mobile rail fills vertically.
  const initial = staticMode ? { scaleX: 1, scaleY: 1 } : undefined;
  const fillX = { scaleX: 1, scaleY: 1 };
  const fillY = { scaleX: 1, scaleY: 1 };

  return (
    <div className={className}>
      {/* Desktop: horizontal */}
      <div className="relative hidden md:block">
        {/* Rail */}
        <div className="absolute left-0 right-0 top-[26px] h-px bg-white/12" aria-hidden="true" />
        <motion.div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[26px] h-px origin-left bg-innovation"
          initial={initial ?? { scaleX: 0, scaleY: 1 }}
          whileInView={fillX}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: staticMode ? 0 : 1.6, ease: "easeInOut" }}
        />

        <ol className="relative grid grid-cols-5 gap-6">
          {journeySteps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={staticMode ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: staticMode ? 0 : 0.25 + i * 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div
                className={cn(
                  "flex size-[52px] items-center justify-center rounded-full border font-display text-sm font-bold tracking-tight transition-colors duration-300",
                  "border-innovation/60 bg-obsidian text-innovation",
                )}
              >
                {step.number}
              </div>
              <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-chalk">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ash">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="relative md:hidden">
        <div
          className="absolute bottom-4 left-[21px] top-4 w-px bg-white/12"
          aria-hidden="true"
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-4 left-[21px] top-4 w-px origin-top bg-innovation"
          initial={initial ?? { scaleX: 1, scaleY: 0 }}
          whileInView={fillY}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: staticMode ? 0 : 1.4, ease: "easeInOut" }}
        />
        <ol className="relative space-y-7">
          {journeySteps.map((step, i) => (
            <motion.li
              key={step.title}
              className="flex gap-4"
              initial={staticMode ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.45,
                delay: staticMode ? 0 : 0.15 + i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-innovation/60 bg-obsidian font-display text-xs font-bold text-innovation">
                {step.number}
              </div>
              <div className="pt-1.5">
                <h3 className="font-display text-base font-bold tracking-tight text-chalk">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-ash">{step.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
