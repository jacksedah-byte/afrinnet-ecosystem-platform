import { SignIn } from "@clerk/react";
import { useSearchParams } from "react-router";

interface ClerkAuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

export default function ClerkAuth({
  redirectAfterAuth = "/dashboard",
}: ClerkAuthProps) {
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <SignIn
        routing="hash"
        forceRedirectUrl={redirect}
        fallbackRedirectUrl={redirect}
      />
    </main>
  );
}