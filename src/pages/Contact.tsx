import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { Loader2, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton } from "@/components/site/primitives";
import { useIntake } from "@/hooks/use-intake";
import { footerNotes } from "@/content/site";

const ENQUIRY_TYPES = [
  {
    id: "general",
    label: "General enquiry",
    description: "Anything not covered elsewhere on the site.",
  },
  {
    id: "government",
    label: "Government & institutional partnership",
    description: "Public bodies, ministries, agencies and institutional cooperation.",
  },
  {
    id: "institution",
    label: "University, TVET or school",
    description: "Academic and training institutions joining the network.",
  },
  {
    id: "support",
    label: "Innovation & IP support request",
    description: "Guidance, readiness conversations and professional referrals.",
  },
  {
    id: "partnership",
    label: "Development partner / funder",
    description: "Collaboration, programmes and funding conversations.",
  },
  {
    id: "media",
    label: "Media & speaking",
    description: "Press, interviews, panels and event invitations.",
  },
];

const PRESET_MAP: Record<string, string> = {
  government: "government",
  institution: "institution",
  support: "support",
  partnership: "partnership",
  media: "media",
};

type Status = "idle" | "loading" | "error";

export default function Contact({
  variant = "contact",
}: {
  /** `ip-support` renders the dedicated Request IP Support entry point. */
  variant?: "contact" | "ip-support";
} = {}) {
  const [searchParams] = useSearchParams();
  const preset = variant === "ip-support" ? "support" : (searchParams.get("type") ?? "");
  const { sendEnquiry, readError } = useIntake();

  const [type, setType] = useState(PRESET_MAP[preset] ?? "general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please provide your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      next.email = "Please provide a valid email address.";
    if (message.trim().length < 20)
      next.message = "Please provide a message of at least 20 characters.";
    if (!consent) next.consent = "Consent is required so we can respond to you.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    if (!validate()) return;

    setStatus("loading");
    try {
      await sendEnquiry({
        type,
        name: name.trim(),
        email: email.trim(),
        organisation: organisation.trim() || undefined,
        subject: subject.trim() || undefined,
        message: message.trim(),
        consent: true,
      });
      setSent(true);
      toast.success("Enquiry sent", {
        description: "Your message has been recorded and routed.",
      });
    } catch (error) {
      setStatus("error");
      setErrors({ form: readError(error) });
    } finally {
      setStatus("idle");
    }
  };

  const inputClass = (field: string) =>
    `h-11 w-full rounded-md border bg-ink/80 px-3.5 text-sm text-chalk placeholder:text-ash/60 outline-none transition-colors ${
      errors[field] ? "border-red-500/70" : "border-white/15 focus:border-innovation"
    }`;

  return (
    <>
      <PageHeader
        crumbs={
          variant === "ip-support"
            ? [
                { label: "Intellectual Property Services", href: "/ip" },
                { label: "Request IP Support" },
              ]
            : [{ label: "Contact" }]
        }
        eyebrow={variant === "ip-support" ? "Intellectual Property" : "Partnerships & Contact"}
        title={variant === "ip-support" ? "Request IP Support" : "Talk to the right team"}
        lede={
          variant === "ip-support"
            ? "Tell us where you are with your innovation and what you need — AFRINNET will help structure the picture, explain the options and refer you to a qualified professional or registration authority where appropriate."
            : "Choose the enquiry type and your message is routed to the people responsible for it. Every field below is validated before sending."
        }
        tone="navy"
        actions={
          <>
            <LinkButton href="/ip" variant="primary">
              {variant === "ip-support" ? "Explore IP services" : "Partnership options"}
            </LinkButton>
            <LinkButton href={variant === "ip-support" ? "/ip/readiness" : "/submit"} variant="outline">
              {variant === "ip-support" ? "Readiness guidance" : "Submit an innovation"}
            </LinkButton>
          </>
        }
      />

      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
            {/* Form */}
            <div className="rounded-2xl border border-white/10 bg-ink/70 p-6 sm:p-8">
              {sent ? (
                <div className="py-8 text-center" role="status">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-innovation/50 bg-innovation/10 text-innovation">
                    <Send className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-chalk">
                    Your enquiry has been recorded
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ash">
                    It has been routed under{" "}
                    <span className="font-semibold text-chalk">
                      {ENQUIRY_TYPES.find((t) => t.id === type)?.label}
                    </span>
                    . Keep any correspondence in your inbox — we respond from an
                    AFRINNET address.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <LinkButton href="/" variant="outline">
                      Back to home
                    </LinkButton>
                    <LinkButton
                      href="/#newsletter"
                      variant="primary"
                    >
                      Subscribe for updates
                    </LinkButton>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <fieldset>
                    <legend className="font-display text-base font-bold tracking-tight text-chalk">
                      1. What is your enquiry about?
                    </legend>
                    <p className="mt-1.5 text-sm text-ash">
                      Select the closest match — it determines who receives your
                      message.
                    </p>
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {ENQUIRY_TYPES.map((option) => (
                        <label
                          key={option.id}
                          className={`flex cursor-pointer gap-3 rounded-lg border p-3.5 transition-colors ${
                            type === option.id
                              ? "border-innovation bg-innovation/10"
                              : "border-white/12 bg-obsidian/60 hover:border-white/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="enquiry-type"
                            value={option.id}
                            checked={type === option.id}
                            onChange={() => setType(option.id)}
                            className="mt-1 size-4 accent-[#16A34A]"
                          />
                          <span>
                            <span className="block font-display text-sm font-semibold text-chalk">
                              {option.label}
                            </span>
                            <span className="mt-0.5 block text-xs leading-5 text-ash">
                              {option.description}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-chalk">
                        Full name <span className="text-innovation">*</span>
                      </label>
                      <input
                        id="contact-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        className={inputClass("name")}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-chalk">
                        Email <span className="text-innovation">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        className={inputClass("email")}
                        placeholder="you@institution.org"
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-org" className="mb-1.5 block text-sm font-medium text-chalk">
                        Organisation
                      </label>
                      <input
                        id="contact-org"
                        value={organisation}
                        onChange={(e) => setOrganisation(e.target.value)}
                        autoComplete="organization"
                        className={inputClass("organisation")}
                        placeholder="Institution or company (optional)"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-chalk">
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className={inputClass("subject")}
                        placeholder="Short summary (optional)"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-chalk">
                      Message <span className="text-innovation">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      aria-invalid={!!errors.message}
                      className={`${inputClass("message")} min-h-36 py-3 leading-6`}
                      placeholder="Tell us about your institution, request or question."
                    />
                    <div className="mt-1.5 flex items-start justify-between gap-4">
                      {errors.message ? (
                        <p className="text-xs text-red-400">{errors.message}</p>
                      ) : (
                        <span className="text-xs text-ash/60">
                          Do not include confidential technical detail.
                        </span>
                      )}
                      <span className="text-xs text-ash/60">{message.length}/4000</span>
                    </div>
                  </div>

                  <label className="mt-5 flex items-start gap-2.5 text-xs leading-5 text-ash">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 rounded border-white/25 bg-transparent accent-[#16A34A]"
                    />
                    <span>
                      I consent to AFRINNET Foundation storing this information
                      for the purpose of responding to my enquiry, as described in
                      the <span className="text-innovation">privacy policy</span>.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.consent}</p>
                  )}

                  {errors.form && (
                    <p role="alert" className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                      {errors.form}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-innovation px-6 font-display text-sm font-semibold text-obsidian transition-colors hover:bg-innovation-bright disabled:opacity-60 sm:w-auto"
                  >
                    {status === "loading" && <Loader2 className="size-4 animate-spin" />}
                    <Send className="size-4" aria-hidden="true" />
                    {status === "loading" ? "Sending…" : "Send enquiry"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact information */}
            <aside className="space-y-5">
              <Reveal className="rounded-2xl border border-white/10 bg-ink/70 p-6">
                <h2 className="font-display text-lg font-bold tracking-tight text-chalk">
                  Contact details
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-6 text-ash">
                  <p className="flex gap-3">
                    <Mail className="mt-1 size-4 shrink-0 text-innovation" aria-hidden="true" />
                    {footerNotes.contact}
                  </p>
                  <p className="flex gap-3">
                    <MapPin className="mt-1 size-4 shrink-0 text-innovation" aria-hidden="true" />
                    Postal address will be published once verified.
                  </p>
                </div>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-xs leading-5 text-ash/70">{footerNotes.social}</p>
                </div>
              </Reveal>

              <Callout tone="navy" title="How enquiries are handled">
                Every submission is routed by enquiry type to the team
                responsible. Enquiries are stored securely and used only to
                respond — they are never published or shared publicly.
              </Callout>

              <Callout tone="green" title="Looking for something specific?">
                <ul className="space-y-1.5">
                  <li>
                    <Link to="/submit" className="font-semibold underline-offset-4 hover:underline">
                      Submit an innovation →
                    </Link>
                  </li>
                  <li>
                    <Link to="/request-ip-support" className="font-semibold underline-offset-4 hover:underline">
                      Request IP support →
                    </Link>
                  </li>
                  <li>
                    <Link to="/knowledge" className="font-semibold underline-offset-4 hover:underline">
                      Browse resources →
                    </Link>
                  </li>
                </ul>
              </Callout>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
