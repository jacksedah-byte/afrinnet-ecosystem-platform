import {
  ClerkProvider,
  SignIn,
  useAuth,
  useClerk,
  useUser,
} from "@clerk/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Check, Clipboard, Loader2, ShieldAlert } from "lucide-react";
import CmsAdmin from "./CmsAdmin";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexClient = new ConvexReactClient(
  convexUrl || "http://127.0.0.1:3210",
);

function CmsContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [copied, setCopied] = useState(false);
  const admin = useQuery(api.cms.currentAdmin, isSignedIn ? {} : "skip");

  const copyUserId = async () => {
    if (!user) return;
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
    } catch (error) {
      console.error("Could not copy Clerk user ID:", error);
    }
  };

  if (!isLoaded || (isSignedIn && admin === undefined)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-obsidian text-chalk">
        <Loader2 className="size-6 animate-spin" aria-label="Loading CMS" />
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-obsidian px-4 py-10 text-chalk">
        <div className="w-full max-w-md">
          <p className="afr-eyebrow text-innovation">AFRINNET administration</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
            CMS sign in
          </h1>
          <p className="mb-6 mt-2 text-sm text-ash">
            Sign in with an authorized administrator account.
          </p>
          <SignIn routing="hash" />
        </div>
      </main>
    );
  }

  if (!admin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-obsidian px-4 py-10 text-chalk">
        <section className="w-full max-w-lg border border-white/10 p-8">
          <ShieldAlert className="size-6 text-innovation" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
            Administrator access required
          </h1>
          <p className="mt-3 text-sm leading-6 text-ash">
            {user.primaryEmailAddress?.emailAddress ?? "This account"} is signed in,
            but is not authorized as an AFRINNET administrator.
          </p>
          <p className="mt-3 text-sm leading-6 text-ash">
            Copy the Clerk user ID below and send it to the site administrator.
            It will be allowlisted directly on the backend, so you do not need
            to change Clerk session claims.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <code className="break-all rounded bg-white/5 px-3 py-2 text-xs">
              {user.id}
            </code>
            <Button variant="outline" size="sm" onClick={copyUserId}>
              {copied ? (
                <Check className="mr-2 size-4" aria-hidden="true" />
              ) : (
                <Clipboard className="mr-2 size-4" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy ID"}
            </Button>
          </div>
          <Button className="mt-6" onClick={() => signOut({ redirectUrl: "/cms" })}>
            Sign out
          </Button>
        </section>
      </main>
    );
  }

  return (
    <div>
      <div className="absolute right-5 top-5 z-10">
        <Button variant="outline" onClick={() => signOut({ redirectUrl: "/cms" })}>
          Sign out {user.primaryEmailAddress?.emailAddress}
        </Button>
      </div>
      <CmsAdmin />
    </div>
  );
}

function CmsSetupRequired() {
  const missing = [
    !publishableKey && "VITE_CLERK_PUBLISHABLE_KEY",
    !convexUrl && "VITE_CONVEX_URL",
  ].filter((name): name is string => Boolean(name));

  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian px-6 text-chalk">
      <section className="max-w-lg border border-white/10 p-8">
        <p className="afr-eyebrow text-innovation">AFRINNET administration</p>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
          CMS setup required
        </h1>
        <p className="mt-3 text-sm leading-6 text-ash">
          Add the missing frontend value{missing.length > 1 ? "s" : ""}{" "}
          {missing.map((name, index) => (
            <span key={name}>
              {index > 0 ? " and " : ""}
              <code>{name}</code>
            </span>
          ))}{" "}
          to <code>.env.local</code>. Then check the Clerk issuer and CMS
          administrator access settings described in the README, and restart
          the website.
        </p>
      </section>
    </main>
  );
}

export default function CmsPage() {
  if (!publishableKey || !convexUrl) return <CmsSetupRequired />;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
        <CmsContent />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}