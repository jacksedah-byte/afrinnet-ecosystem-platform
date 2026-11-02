import { useState } from "react";
import { useSearchParams } from "react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";

type State = "idle" | "loading" | "removed" | "invalid" | "error";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const unsubscribe = useAction(api.intakeActions.unsubscribeNewsletter);
  const [state, setState] = useState<State>("idle");

  const handleUnsubscribe = async () => {
    if (state === "loading") return;
    setState("loading");
    try {
      const result = await unsubscribe({ token });
      setState(result.removed ? "removed" : "invalid");
    } catch {
      setState("error");
    }
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Newsletter unsubscribe" }]}
        eyebrow="Email preferences"
        title="Manage AFRINNET updates"
        lede="Use this secure link to remove the email address associated with this signup from the AFRINNET updates list."
      />
      <section className="bg-obsidian py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-ink/70 p-6 text-chalk sm:p-8">
            {state === "removed" ? (
              <p role="status">Your email address has been removed from the updates list.</p>
            ) : state === "invalid" ? (
              <p role="status">This link has expired, was already used, or is invalid.</p>
            ) : state === "error" ? (
              <p role="alert">We could not process this request. Please try again later or contact AFRINNET.</p>
            ) : (
              <>
                <p className="text-sm leading-6 text-ash">
                  This action removes the matching newsletter signup. It does
                  not delete other enquiries or innovation submissions.
                </p>
                {!/^[\da-f]{64}$/.test(token) && (
                  <p role="alert" className="mt-4 text-sm text-red-300">
                    The unsubscribe link is missing or invalid.
                  </p>
                )}
                <Button
                  type="button"
                  disabled={state === "loading" || !/^[\da-f]{64}$/.test(token)}
                  onClick={() => void handleUnsubscribe()}
                  className="mt-6"
                >
                  {state === "loading" ? "Removing…" : "Unsubscribe"}
                </Button>
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
