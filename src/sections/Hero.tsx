import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router";
import { LinkButton, Eyebrow } from "@/components/site/primitives";
import { NetworkHero } from "@/components/site/NetworkHero";
import { Check } from "lucide-react";
import { homepageContent } from "@/content/homepage";
import { useCmsModule } from "@/hooks/use-cms-module";

/** Homepage Section 2 — asymmetric hero with the animated network visual. */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const staticMode = !!reduceMotion;
  const { hero } = useCmsModule("homepage", homepageContent);

  const line = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-obsidian pb-16 pt-28 sm:pb-24 sm:pt-36">
      {/* Background: grid + glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 afr-grid-bg afr-mask-fade-b opacity-70" />
      {hero.heroImageUrl && (
        <img
          src={hero.heroImageUrl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-20"
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 size-[480px] rounded-full bg-innovation/10 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Left: message */}
        <motion.div
          initial={staticMode ? false : "hidden"}
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
        >
          <motion.div variants={line} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <Eyebrow className="flex items-center gap-3">
              <span className="h-px w-8 bg-innovation" aria-hidden="true" />
              {hero.eyebrow}
            </Eyebrow>
          </motion.div>

          <motion.h1
            variants={line}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-display text-[2.35rem] font-bold leading-[1.06] tracking-tight text-chalk sm:text-5xl lg:text-[3.6rem]"
          >
            {hero.titleLead}{" "}
            <span className="text-innovation">{hero.titleHighlight}</span>
            {hero.titleTail}
          </motion.h1>

          <motion.p
            variants={line}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-base leading-7 text-ash sm:text-lg"
          >
            {hero.description}
          </motion.p>

          <motion.div
            variants={line}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            {hero.actions[0] && <LinkButton href={hero.actions[0].href} variant="primary">{hero.actions[0].label}</LinkButton>}
            {hero.actions[1] && <LinkButton href={hero.actions[1].href} variant="outline">{hero.actions[1].label}</LinkButton>}
            {hero.actions[2] && (
              <Link
                to={hero.actions[2].href}
                className="ml-1 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-chalk underline-offset-4 transition-colors hover:text-innovation hover:underline"
              >
                {hero.actions[2].label} <span aria-hidden="true">→</span>
              </Link>
            )}
          </motion.div>

          <motion.ul
            variants={line}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2"
          >
            {hero.assurances.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-ash">
                <Check className="size-3.5 text-innovation" aria-hidden="true" />
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right: network visual */}
        <motion.div
          initial={staticMode ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative"
        >
          <NetworkHero />
        </motion.div>
      </div>

      {/* Principle strip */}
      <div className="relative mx-auto mt-14 w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 font-display text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ash/80">
          {hero.principles.map((principle, index) => (
            <span key={principle} className="contents">
              {index > 0 && <span className="hidden h-1 w-1 rounded-full bg-innovation sm:block" aria-hidden="true" />}
              <span>{principle}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
