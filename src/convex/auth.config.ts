import type { AuthConfig } from "convex/server";

// Freebuff-signed federated tokens remain supported alongside Clerk.
const freebuffIssuer =
  process.env.VLY_CONVEX_AUTH_ISSUER ?? "https://freebuff.com";

export default {
  providers: [
    ...(process.env.CLERK_JWT_ISSUER_DOMAIN
      ? [
          {
            domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
            applicationID: "convex",
          },
        ]
      : []),
    {
      type: "customJwt",
      issuer: freebuffIssuer,
      jwks: `${freebuffIssuer}/api/web/.well-known/jwks.json`,
      applicationID: "vly-convex",
      algorithm: "RS256",
    },
  ],
} satisfies AuthConfig;
