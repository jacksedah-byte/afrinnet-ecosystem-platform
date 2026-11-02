import { useState, type FormEvent } from "react";
import { useIntake } from "@/hooks/use-intake";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultCmsFormFields, type CmsFormData } from "@/components/site/cms-form-schema";

export function CmsIntakeForm({ form }: { form: CmsFormData }) {
  const { sendEnquiry, submitInnovation, subscribeNewsletter, readError } = useIntake();
  const kind = form.formKind ?? "enquiry";
  const fields = form.fields?.length ? form.fields : defaultCmsFormFields(kind);
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [deliveryNotice, setDeliveryNotice] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;
    for (const field of fields) {
      if (field.required && !values[field.id]?.trim()) {
        setError(`${field.label} is required.`);
        return;
      }
    }
    if (!consent) {
      setError("Please confirm consent before sending this message.");
      return;
    }
    setError("");
    setIsSending(true);
    try {
      if (kind === "newsletter") {
        const result = await subscribeNewsletter({ email: values.email?.trim() ?? "", consent: true });
        setDeliveryNotice(
          result.confirmationEmail === "sent"
            ? "A confirmation email with an unsubscribe link has been sent. Newsletter campaigns are not being sent yet."
            : result.confirmationEmail === "failed"
              ? "Your signup was saved, but the confirmation email could not be sent. Contact AFRINNET if you need to unsubscribe."
              : result.confirmationEmail === "not_configured"
                ? "Your signup was saved, but confirmation email is not configured. Contact AFRINNET if you need to unsubscribe."
                : result.emailNotice === "sent"
                  ? "AFRINNET has been notified, but no confirmation email was sent. Contact AFRINNET if you need to unsubscribe."
                  : "Your signup was saved. No confirmation email was sent; contact AFRINNET if you need to unsubscribe.",
        );
      } else if (kind === "innovation") {
        const result = await submitInnovation({
          applicantName: values.applicantName?.trim() ?? "",
          applicantEmail: values.applicantEmail?.trim() ?? "",
          organisation: values.organisation?.trim() || undefined,
          role: values.role?.trim() || undefined,
          title: values.title?.trim() ?? "",
          description: values.description?.trim() ?? "",
          category: values.category ?? "",
          stage: values.stage ?? "",
          institutionType: values.institutionType || undefined,
          ipAwareness: values.ipAwareness || undefined,
          supportNeeds: values.supportNeeds?.trim() || undefined,
          documentsNote: values.documentsNote?.trim() || undefined,
          consent: true,
        });
        setDeliveryNotice(
          result.emailNotice === "sent"
            ? "AFRINNET has been notified."
            : result.emailNotice === "failed"
              ? "Your submission was saved, but AFRINNET could not be notified by email."
              : "Your submission was saved, but the AFRINNET notification email is not configured.",
        );
      } else {
        const name = values.name?.trim();
        const email = values.email?.trim();
        const message = values.message?.trim();
        if (!name || !email || !message) throw new Error("This form needs name, email and message fields to submit enquiries.");
        const result = await sendEnquiry({
          type: form.enquiryType?.trim() || "general",
          name,
          email,
          organisation: values.organisation?.trim() || undefined,
          subject: values.subject?.trim() || undefined,
          message,
          customFields: fields
            .filter((field) => !["name", "email", "organisation", "subject", "message"].includes(field.id))
            .map((field) => ({ label: field.label, value: values[field.id] ?? "" })),
          consent: true,
        });
        setDeliveryNotice(
          result.emailNotice === "sent"
            ? "AFRINNET has been notified."
            : result.emailNotice === "failed"
              ? "Your enquiry was saved, but AFRINNET could not be notified by email."
              : "Your enquiry was saved, but the AFRINNET notification email is not configured.",
        );
      }
      setSent(true);
    } catch (submitError) {
      setError(readError(submitError));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="rounded-xl border bg-card p-5 sm:p-8">
      {form.heading && <h2 className="font-display text-2xl font-bold tracking-tight">{form.heading}</h2>}
      {form.body && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">{form.body}</p>}
      {sent ? (
        <p role="status" className="mt-6 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm">
          {form.successMessage || "Thank you. Your message has been received."}{" "}
          {deliveryNotice}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          {fields.map((field) => (
            <label key={field.id} className="block space-y-1.5 text-sm font-medium">
              {field.label}{field.required && <span aria-hidden="true"> *</span>}
              {field.type === "textarea" ? (
                <Textarea required={field.required} value={values[field.id] ?? ""} placeholder={field.placeholder} onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))} className="min-h-28" />
              ) : field.type === "select" ? (
                <select required={field.required} value={values[field.id] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Choose an option…</option>
                  {(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : (
                <Input required={field.required} type={field.type} value={values[field.id] ?? ""} placeholder={field.placeholder} onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))} />
              )}
            </label>
          ))}
          <label className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 size-4" />
            <span>{kind === "newsletter" ? "I agree to receive occasional AFRINNET updates. I can unsubscribe using the link in the confirmation email or request removal through the contact form." : "I consent to AFRINNET using the information I provided to process this submission. See the privacy policy."} <a href="/privacy" className="underline">Privacy policy</a>.</span>
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={isSending}>{isSending ? "Sending…" : form.submitLabel || "Send enquiry"}</Button>
        </form>
      )}
    </section>
  );
}
