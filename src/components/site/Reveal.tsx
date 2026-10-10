import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Scroll-triggered reveal: opacity + 18–24px rise, triggered once when the
 * element enters the viewport. Fully disabled for prefers-reduced-motion, and
 * never blocks reading — content is always in the DOM.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  duration = 0.6,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Seconds of delay — keep staggered groups under ~0.5s total. */
  delay?: number;
  y?: number;
  duration?: number;
  /** Render as `li` when the reveal wraps a list item (keeps valid markup). */
  as?: "div" | "li";
}) {
  const reduceMotion = useReducedMotion();
  const Comp = as === "li" ? motion.li : motion.div;
  const Plain = as === "li" ? "li" : "div";

  if (reduceMotion) {
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

/** Staggered children wrapper — animates each direct child in sequence. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  y = 22,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -50px 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
