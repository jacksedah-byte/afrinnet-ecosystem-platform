import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";

/**
 * Thin wrappers around public intake actions.
 *
 * They save validated records first, then report whether email notifications
 * were delivered. The client never receives submitted records back.
 */
export function useIntake() {
  const submitInnovation = useAction(api.intakeActions.submitInnovation);
  const sendEnquiry = useAction(api.intakeActions.sendEnquiry);
  const subscribeNewsletter = useAction(api.intakeActions.subscribeNewsletter);

  /** Convex surfaces validation failures as Error messages. */
  const readError = (error: unknown) =>
    error instanceof Error && error.message
      ? error.message
      : "Something went wrong. Please try again.";

  return { submitInnovation, sendEnquiry, subscribeNewsletter, readError };
}
