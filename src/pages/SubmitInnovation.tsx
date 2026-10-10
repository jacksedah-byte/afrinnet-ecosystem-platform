import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  FileText,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/PageHeader";
import { Callout, Container, LinkButton, StatusBadge } from "@/components/site/primitives";
import { useIntake } from "@/hooks/use-intake";

const DRAFT_KEY = "afrinnet-submission-draft";

const CATEGORIES = [
  "Agriculture & food systems",
  "Health & biotechnology",
  "Energy, climate & environment",
  "ICT, AI & data systems",
  "Manufacturing & materials",
  "Education & learning",
  "Financial inclusion & commerce",
  "Transport & logistics",
  "Water & sanitation",
  "Other / cross-cutting",
];

const STAGES = [
  "Idea / concept",
  "Research findings",
  "Prototype / proof of concept",
  "Pilot or field testing",
  "Early-stage venture — in market",
  "Scaling",
];

const INSTITUTION_TYPES = [
  "University or research organisation",
  "TVET / technical training institution",
  "School (K-12)",
  "Startup or enterprise",
  "Government or public institution",
  "Non-governmental organisation",
  "Independent innovator — no affiliation",
  "Other",
];

const IP_AWARENESS = [
  "No IP protection considered yet",
  "Currently considering protection",
  "Protection applied for",
  "Protection already in place",
  "Not sure — I need guidance",
];

interface DraftState {
  applicantName: string;
  applicantEmail: string;
  organisation: string;
  role: string;
  institutionType: string;
  title: string;
  description: string;
  category: string;
  stage: string;
  ipAwareness: string;
  supportNeeds: string;
  documentsNote: string;
  consent: boolean;
}

const EMPTY: DraftState = {
  applicantName: "",
  applicantEmail: "",
  organisation: "",
  role: "",
  institutionType: "",
  title: "",
  description: "",
  category: "",
  stage: "",
  ipAwareness: "",
  supportNeeds: "",
  documentsNote: "",
  consent: false,
};

const STEPS = [
  { id: "applicant", title: "Applicant", short: "Your details" },
  { id: "affiliation", title: "Affiliation", short: "Institution" },
  { id: "innovation", title: "Innovation", short: "What it is" },
  { id: "classification", title: "Classification", short: "Category & stage" },
  { id: "support", title: "IP & support", short: "What you need" },
  { id: "documents", title: "Documents", short: "What exists" },
  { id: "review", title: "Review", short: "Confirm & send" },
];

function readDraft(): DraftState {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DraftState>;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-chalk">
        {label} {required && <span className="text-innovation">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs leading-5 text-ash/70">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function SubmitInnovation() {
  const { submitInnovation, readError } = useIntake();

  const [step, setStep] = useState(0);
  const [state, setState] = useState<DraftState>(readDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState(false);

  const set = <K extends keyof DraftState>(key: K, value: DraftState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Save-and-resume: draft persists on this device only.
  useEffect(() => {
    if (reference) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
      setSavedNote(true);
      const t = setTimeout(() => setSavedNote(false), 2200);
      return () => clearTimeout(t);
    } catch {
      /* storage unavailable — the form still works without drafts */
    }
  }, [state, reference]);

  const validateStep = (index: number): Record<string, string> => {
    const next: Record<string, string> = {};
    if (index === 0) {
      if (state.applicantName.trim().length < 2)
        next.applicantName = "Please provide your full name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.applicantEmail.trim()))
        next.applicantEmail = "Please provide a valid email address.";
    }
    if (index === 2) {
      if (state.title.trim().length < 4)
        next.title = "Please provide the innovation's title.";
      if (state.description.trim().length < 40)
        next.description =
          "Please provide a non-confidential description of at least 40 characters.";
    }
    if (index === 3) {
      if (!state.category) next.category = "Please select a category.";
      if (!state.stage) next.stage = "Please select a development stage.";
    }
    if (index === 6) {
      if (!state.consent)
        next.consent =
          "You must confirm the privacy acknowledgement before submitting.";
    }
    return next;
  };

  const goNext = () => {
    const found = validateStep(step);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Please check the highlighted fields.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearDraft = () => {
    setState(EMPTY);
    setErrors({});
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setStep(0);
    toast("Draft cleared");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateStep(step);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("loading");
    try {
      const result = await submitInnovation({
        applicantName: state.applicantName.trim(),
        applicantEmail: state.applicantEmail.trim(),
        organisation: state.organisation.trim() || undefined,
        role: state.role.trim() || undefined,
        title: state.title.trim(),
        description: state.description.trim(),
        category: state.category,
        stage: state.stage,
        institutionType: state.institutionType || undefined,
        ipAwareness: state.ipAwareness || undefined,
        supportNeeds: state.supportNeeds.trim() || undefined,
        documentsNote: state.documentsNote.trim() || undefined,
        consent: true,
      });
      setReference(result.reference);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      toast.success("Submission received", {
        description: `Reference ${result.reference}`,
      });
    } catch (error) {
      setErrors({ form: readError(error) });
      toast.error("Submission failed");
    } finally {
      setStatus("idle");
    }
  };

  const inputClass = (field: string) =>
    `h-11 w-full rounded-md border bg-ink/80 px-3.5 text-sm text-chalk placeholder:text-ash/60 outline-none transition-colors ${
      errors[field] ? "border-red-500/70" : "border-white/15 focus:border-innovation"
    }`;

  const progress = useMemo(
    () => ((step + 1) / STEPS.length) * 100,
    [step],
  );

  /* ------------------------------ Receipt ------------------------------ */
  if (reference) {
    return (
      <>
        <PageHeader
          crumbs={[{ label: "Get Involved" }, { label: "Submit an Innovation" }]}
          eyebrow="Submission received"
          title="Your innovation has been recorded"
          lede="Keep the reference number below — it identifies your submission in any follow-up correspondence with AFRINNET."
        />
        <section className="bg-obsidian py-14 sm:py-20">
          <Container>
            <div className="mx-auto max-w-2xl rounded-2xl border border-innovation/40 bg-ink/70 p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border border-innovation/50 bg-innovation/10 text-innovation">
                  <CircleCheck className="size-5" aria-hidden="true" />
                </span>
                <StatusBadge tone="available">Received</StatusBadge>
              </div>

              <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.16em] text-ash">
                Reference number
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight text-innovation sm:text-4xl">
                {reference}
              </p>

              <div className="mt-7 space-y-4 border-t border-white/10 pt-6 text-sm leading-6 text-ash">
                <p>
                  <span className="font-semibold text-chalk">What happens next:</span>{" "}
                  your submission is checked for completeness. If anything is
                  missing, we will contact you at the email address you provided.
                </p>
                <p>
                  Suitable submissions may be routed to IP support, institutional
                  expertise or development pathways. Submission does not
                  automatically qualify an innovation for registration, funding or
                  commercialisation, and does not itself establish intellectual
                  property rights.
                </p>
                <p>
                  Your record is stored securely and is not published. Public
                  listing only happens with your explicit consent.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <LinkButton href="/ip" variant="primary">
                  Explore IP support
                </LinkButton>
                <LinkButton href="/" variant="outline">
                  Back to home
                </LinkButton>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-md px-3 py-2 font-display text-sm font-semibold text-ash transition-colors hover:text-chalk"
                >
                  Print this receipt
                </button>
              </div>
            </div>
          </Container>
        </section>
      </>
    );
  }

  /* ------------------------------- Form -------------------------------- */
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Get Involved" }, { label: "Submit an Innovation" }]}
        eyebrow="Get Involved"
        title="Submit an Innovation"
        lede="A guided, confidentiality-first submission. Describe what the innovation does — not how it works — and tell us what support you are looking for."
        actions={
          <>
            <LinkButton href="/ecosystem/discovery" variant="outline">
              How discovery works
            </LinkButton>
            <LinkButton href="/ip" variant="soft">
              Understand IP first
            </LinkButton>
          </>
        }
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StatusBadge tone="available">Submissions open</StatusBadge>
          <span className="flex items-center gap-1.5 text-xs text-ash">
            <Save className="size-3.5" aria-hidden="true" />
            {savedNote ? "Draft saved on this device" : "Draft saves automatically on this device"}
          </span>
        </div>
      </PageHeader>

      <section className="bg-obsidian py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Progress */}
            <div className="rounded-2xl border border-white/10 bg-ink/70 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-display text-sm font-bold tracking-tight text-chalk">
                  <span className="text-innovation">Step {step + 1}</span> of {STEPS.length}
                  <span className="hidden text-ash"> — {STEPS[step].title}</span>
                </p>
                <span className="text-xs text-ash">{Math.round(progress)}% complete</span>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-innovation transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={step + 1}
                  aria-valuemin={1}
                  aria-valuemax={STEPS.length}
                  aria-label="Submission progress"
                />
              </div>

              <ol className="mt-4 hidden grid-cols-7 gap-2 md:grid">
                {STEPS.map((s, i) => (
                  <li key={s.id} className="text-center">
                    <span
                      className={`mx-auto flex size-7 items-center justify-center rounded-full border font-display text-[0.65rem] font-bold ${
                        i < step
                          ? "border-innovation bg-innovation text-obsidian"
                          : i === step
                            ? "border-innovation text-innovation"
                            : "border-white/20 text-ash"
                      }`}
                    >
                      {i < step ? <Check className="size-3.5" /> : i + 1}
                    </span>
                    <span
                      className={`mt-1.5 block text-[0.62rem] leading-4 ${
                        i === step ? "text-chalk" : "text-ash/70"
                      }`}
                    >
                      {s.short}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Step body */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-6 rounded-2xl border border-white/10 bg-ink/70 p-6 sm:p-8"
            >
              <h2 className="font-display text-xl font-bold tracking-tight text-chalk">
                {STEPS[step].title}
              </h2>

              {/* Step 1 — applicant */}
              {step === 0 && (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field id="applicantName" label="Full name" required error={errors.applicantName}>
                    <input
                      id="applicantName"
                      value={state.applicantName}
                      onChange={(e) => set("applicantName", e.target.value)}
                      autoComplete="name"
                      className={inputClass("applicantName")}
                      placeholder="Your full name"
                    />
                  </Field>
                  <Field
                    id="applicantEmail"
                    label="Email"
                    required
                    error={errors.applicantEmail}
                    hint="Used only to contact you about this submission."
                  >
                    <input
                      id="applicantEmail"
                      type="email"
                      value={state.applicantEmail}
                      onChange={(e) => set("applicantEmail", e.target.value)}
                      autoComplete="email"
                      className={inputClass("applicantEmail")}
                      placeholder="you@example.org"
                    />
                  </Field>
                  <Field id="role" label="Role / title">
                    <input
                      id="role"
                      value={state.role}
                      onChange={(e) => set("role", e.target.value)}
                      className={inputClass("role")}
                      placeholder="e.g. Researcher, Founder, Student"
                    />
                  </Field>
                </div>
              )}

              {/* Step 2 — affiliation */}
              {step === 1 && (
                <div className="mt-6 grid gap-5">
                  <Field
                    id="organisation"
                    label="Institution or organisation"
                    hint="Optional — independent innovators can leave this blank."
                  >
                    <input
                      id="organisation"
                      value={state.organisation}
                      onChange={(e) => set("organisation", e.target.value)}
                      className={inputClass("organisation")}
                      placeholder="University, TVET, company, school…"
                    />
                  </Field>
                  <Field id="institutionType" label="Type of institution">
                    <select
                      id="institutionType"
                      value={state.institutionType}
                      onChange={(e) => set("institutionType", e.target.value)}
                      className={inputClass("institutionType")}
                    >
                      <option value="" className="bg-obsidian">
                        Select one (optional)
                      </option>
                      {INSTITUTION_TYPES.map((opt) => (
                        <option key={opt} value={opt} className="bg-obsidian">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              {/* Step 3 — innovation */}
              {step === 2 && (
                <div className="mt-6 grid gap-5">
                  <Field id="title" label="Innovation title" required error={errors.title}>
                    <input
                      id="title"
                      value={state.title}
                      onChange={(e) => set("title", e.target.value)}
                      className={inputClass("title")}
                      placeholder="A short, working title"
                    />
                  </Field>
                  <Field
                    id="description"
                    label="Non-confidential description"
                    required
                    error={errors.description}
                    hint="Describe what it does and the problem it solves — not the technical how."
                  >
                    <textarea
                      id="description"
                      rows={7}
                      value={state.description}
                      onChange={(e) => set("description", e.target.value)}
                      className={`${inputClass("description")} min-h-40 py-3 leading-6`}
                      placeholder="What does the innovation do, who is it for, and what stage is it at?"
                    />
                    <p className="mt-1.5 text-xs text-ash/60">
                      {state.description.length} characters — minimum 40
                    </p>
                  </Field>

                  <Callout tone="green" title="Before you write">
                    Do not disclose confidential technical detail — formulas,
                    source code, unpublished parameters or manufacturing
                    processes. Public disclosure can affect certain intellectual
                    property rights, and submission to AFRINNET is not itself
                    legal protection.
                  </Callout>
                </div>
              )}

              {/* Step 4 — classification */}
              {step === 3 && (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field id="category" label="Category" required error={errors.category}>
                    <select
                      id="category"
                      value={state.category}
                      onChange={(e) => set("category", e.target.value)}
                      className={inputClass("category")}
                    >
                      <option value="" className="bg-obsidian">
                        Select a category
                      </option>
                      {CATEGORIES.map((opt) => (
                        <option key={opt} value={opt} className="bg-obsidian">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field id="stage" label="Development stage" required error={errors.stage}>
                    <select
                      id="stage"
                      value={state.stage}
                      onChange={(e) => set("stage", e.target.value)}
                      className={inputClass("stage")}
                    >
                      <option value="" className="bg-obsidian">
                        Select a stage
                      </option>
                      {STAGES.map((opt) => (
                        <option key={opt} value={opt} className="bg-obsidian">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              {/* Step 5 — IP & support */}
              {step === 4 && (
                <div className="mt-6 grid gap-5">
                  <Field
                    id="ipAwareness"
                    label="Current intellectual property position"
                    hint="An honest answer helps us route you correctly — there is no wrong answer."
                  >
                    <select
                      id="ipAwareness"
                      value={state.ipAwareness}
                      onChange={(e) => set("ipAwareness", e.target.value)}
                      className={inputClass("ipAwareness")}
                    >
                      <option value="" className="bg-obsidian">
                        Select one (optional)
                      </option>
                      {IP_AWARENESS.map((opt) => (
                        <option key={opt} value={opt} className="bg-obsidian">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    id="supportNeeds"
                    label="Support you are looking for"
                    hint="e.g. IP guidance, readiness assessment, institutional connection, incubation, partnership introductions."
                  >
                    <textarea
                      id="supportNeeds"
                      rows={4}
                      value={state.supportNeeds}
                      onChange={(e) => set("supportNeeds", e.target.value)}
                      className={`${inputClass("supportNeeds")} min-h-28 py-3 leading-6`}
                      placeholder="What would be most useful to you right now?"
                    />
                  </Field>
                </div>
              )}

              {/* Step 6 — documents */}
              {step === 5 && (
                <div className="mt-6 grid gap-5">
                  <Field
                    id="documentsNote"
                    label="Supporting documents that exist"
                    hint="List them — do not upload anything yet."
                  >
                    <textarea
                      id="documentsNote"
                      rows={4}
                      value={state.documentsNote}
                      onChange={(e) => set("documentsNote", e.target.value)}
                      className={`${inputClass("documentsNote")} min-h-28 py-3 leading-6`}
                      placeholder="e.g. concept note, test results, prior art summary — titles only"
                    />
                  </Field>

                  <Callout tone="navy" title="File upload arrives in Phase 2">
                    Secure document storage is part of AFRINNET's Phase 2
                    infrastructure. Until it is live, uploads are not accepted
                    here — list what exists and we will request specific files
                    through a secure channel during review. Accepted formats will
                    be PDF, DOCX and PNG, up to 10 MB each.
                  </Callout>
                </div>
              )}

              {/* Step 7 — review */}
              {step === 6 && (
                <div className="mt-6">
                  <dl className="divide-y divide-white/10 rounded-xl border border-white/10 bg-obsidian/60">
                    {[
                      ["Applicant", state.applicantName],
                      ["Email", state.applicantEmail],
                      ["Organisation", state.organisation || "—"],
                      ["Role", state.role || "—"],
                      ["Institution type", state.institutionType || "—"],
                      ["Innovation title", state.title],
                      ["Category", state.category],
                      ["Stage", state.stage],
                      ["IP position", state.ipAwareness || "—"],
                      ["Support needs", state.supportNeeds || "—"],
                      ["Documents", state.documentsNote || "—"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-4"
                      >
                        <dt className="w-40 shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-ash/70">
                          {label}
                        </dt>
                        <dd className="text-sm leading-6 text-chalk">
                          {value === "" ? "—" : (value as string)}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ash/70">
                      Description
                    </p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-chalk">
                      {state.description}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <Callout tone="green" title="What submission means">
                      <ul className="list-disc space-y-1.5 pl-5">
                        <li>
                          Submission does not establish or guarantee intellectual
                          property rights.
                        </li>
                        <li>
                          It does not qualify the innovation for registration,
                          funding or commercialisation.
                        </li>
                        <li>
                          Your record is private by default and reviewed for
                          completeness first.
                        </li>
                      </ul>
                    </Callout>

                    <label className="flex items-start gap-2.5 text-sm leading-6 text-ash">
                      <input
                        type="checkbox"
                        checked={state.consent}
                        onChange={(e) => set("consent", e.target.checked)}
                        className="mt-1 size-4 shrink-0 rounded border-white/25 bg-transparent accent-[#16A34A]"
                      />
                      <span>
                        I confirm the information above is non-confidential, that
                        I have the right to share it, and I consent to AFRINNET
                        Foundation storing this submission for review purposes, as
                        described in the{" "}
                        <Link
                          to="/privacy"
                          className="font-semibold text-innovation underline-offset-4 hover:underline"
                        >
                          privacy policy
                        </Link>
                        . <span className="font-semibold text-chalk">*</span>
                      </span>
                    </label>
                    {errors.consent && (
                      <p role="alert" className="text-xs font-medium text-red-400">
                        {errors.consent}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {errors.form && (
                <p
                  role="alert"
                  className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                >
                  {errors.form}
                </p>
              )}

              {/* Navigation */}
              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex h-10 items-center gap-1.5 rounded-md border border-white/20 px-4 font-display text-sm font-semibold text-chalk transition-colors hover:border-innovation hover:text-innovation"
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="px-2 py-2 text-xs font-medium text-ash underline-offset-4 transition-colors hover:text-chalk hover:underline"
                  >
                    Clear draft
                  </button>
                </div>

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-innovation px-6 font-display text-sm font-semibold text-obsidian transition-colors hover:bg-innovation-bright"
                  >
                    Continue
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-innovation px-6 font-display text-sm font-semibold text-obsidian transition-colors hover:bg-innovation-bright disabled:opacity-60"
                  >
                    {status === "loading" && <Loader2 className="size-4 animate-spin" />}
                    {status === "loading" ? "Submitting…" : "Submit innovation"}
                  </button>
                )}
              </div>
            </form>

            {/* Side notes */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-ink/50 p-5">
                <p className="flex items-center gap-2 font-display text-sm font-bold text-chalk">
                  <FileText className="size-4 text-innovation" aria-hidden="true" />
                  What you'll need
                </p>
                <ul className="mt-2.5 space-y-1.5 text-sm leading-6 text-ash">
                  <li>• A working title and short description</li>
                  <li>• Your development stage</li>
                  <li>• Affiliation, if any</li>
                  <li>• A sense of the support you need</li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-ink/50 p-5">
                <p className="flex items-center gap-2 font-display text-sm font-bold text-chalk">
                  <AlertTriangle className="size-4 text-innovation" aria-hidden="true" />
                  Keep it non-confidential
                </p>
                <p className="mt-2.5 text-sm leading-6 text-ash">
                  Describe the problem and the outcome, not the mechanism.
                  Confidential detail can be shared later through an appropriate
                  channel if review progresses.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
