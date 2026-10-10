import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

/**
 * Thin wrappers around the public intake mutations.
 *
 * These are create-only endpoints with server-side validation — there is no
 * public read path. Review queues arrive with the registry module.
 */
export function useIntake() {
  const submitInnovation = useMutation(api.intake.submitInnovation);
  const sendEnquiry = useMutation(api.intake.sendEnquiry);
  const subscribeNewsletter = useMutation(api.intake.subscribeNewsletter);

  /** Convex surfaces validation failures as Error messages. */
  const readError = (error: unknown) =>
    error instanceof Error && error.message
      ? error.message
      : "Something went wrong. Please try again.";

  return { submitInnovation, sendEnquiry, subscribeNewsletter, readError };
}
