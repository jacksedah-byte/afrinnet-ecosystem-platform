import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIntake } from "@/hooks/use-intake";
import { container } from "./primitives";
import { Logo } from "./Logo";
import { useSiteConfiguration } from "@/hooks/use-site-configuration";

type Status = "idle" | "loading" | "success" | "error";

function NewsletterForm() {
  const { subscribeNewsletter, readError } = useIntake();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      await subscribeNewsletter({ email, consent });
      setStatus("success");
      setMessage("Thank you — you're on the list for AFRINNET updates.");
      setEmail("");
      setConsent(false);
    } catch (error) {
      setStatus("error");
      setMessage(readError(error));
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-innovation/40 bg-innovation/10 px-4 py-3 text-sm text-chalk"
      >
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@institution.org"
          className="h-12 flex-1 rounded-md border-white/15 bg-white/[0.04] px-4 text-chalk placeholder:text-ash/70 focus-visible:border-innovation"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="h-12 rounded-md bg-innovation px-6 font-display font-semibold text-obsidian hover:bg-innovation-bright"
        >
          {status === "loading" && <Loader2 className="size-4 animate-spin" />}
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>

      <label className="mt-3 flex items-start gap-2.5 text-xs leading-5 text-ash">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-white/25 bg-transparent accent-[#16A34A]"
        />
        <span>
          I agree that AFRINNET Foundation may use my email address to send
          occasional updates about services, resources and opportunities. I can
          unsubscribe at any time. See our{" "}
          <Link to="/privacy" className="text-innovation underline-offset-4 hover:underline">
            privacy policy
          </Link>
          .
        </span>
      </label>

      {status === "error" && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-400">
          {message}
        </p>
      )}
    </form>
  );
}

export function SiteFooter() {
  const { footerColumns, footerNotes, siteMeta } = useSiteConfiguration();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-obsidian">
      {/* Subtle network texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg className="afr-mask-fade h-full w-full opacity-[0.16]" viewBox="0 0 1200 480" preserveAspectRatio="xMidYMid slice">
          <g stroke="#16A34A" strokeWidth="1" fill="none">
            <path d="M-20 380 L180 300 L360 350 L560 260 L760 320 L980 240 L1220 300" className="afr-flow" />
            <path d="M-20 180 L220 120 L420 190 L640 110 L860 170 L1080 100 L1220 150" className="afr-flow" opacity="0.6" />
            <path d="M180 300 L220 120 M360 350 L420 190 M560 260 L640 110 M760 320 L860 170 M980 240 L1080 100" opacity="0.5" />
          </g>
          <g fill="#16A34A">
            {[
              [180, 300],
              [360, 350],
              [560, 260],
              [760, 320],
              [980, 240],
              [220, 120],
              [420, 190],
              [640, 110],
              [860, 170],
              [1080, 100],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3" className="afr-pulse" style={{ animationDelay: `${i * 0.35}s` }} />
            ))}
          </g>
        </svg>
      </div>

      {/* Newsletter */}
      <section
        id="newsletter"
        aria-labelledby="newsletter-heading"
        className={`relative border-b border-white/10 ${container} py-12`}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="afr-eyebrow text-innovation">Stay informed</p>
            <h2
              id="newsletter-heading"
              className="mt-3 font-display text-2xl font-bold tracking-tight text-chalk sm:text-3xl"
            >
              Opportunities, resources and updates — no noise.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ash">
              A short, occasional digest of published resources, programme
              announcements and partnership opportunities.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      {/* Footer columns */}
      <div className={`relative ${container} grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]`}>
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-6 text-ash">
            {siteMeta.description}
          </p>
          <p className="mt-4 text-xs leading-5 text-ash/70">{footerNotes.social}</p>
          <p className="mt-3 text-xs leading-5 text-ash/70">{footerNotes.contact}</p>
        </div>

        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="afr-eyebrow text-chalk">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-ash transition-colors hover:text-innovation"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div
          className={`${container} flex flex-col gap-4 py-6 text-xs text-ash md:flex-row md:items-center md:justify-between`}
        >
          <p>
            © {new Date().getFullYear()} {siteMeta.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-chalk">
              Privacy policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-chalk">
              Terms of use
            </Link>
            <Link to="/accessibility" className="transition-colors hover:text-chalk">
              Accessibility
            </Link>
            <Link to="/auth" className="transition-colors hover:text-chalk">
              Portal sign-in
            </Link>
            <Link to="/cms" className="transition-colors hover:text-chalk">
              CMS sign-in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
