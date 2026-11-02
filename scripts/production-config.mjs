export const productionDeployment = "prod:tidy-ox-557";
export const defaultSiteUrl = "https://afrinnet.org";

export function validateProductionConfig({
  clerkKey,
  convexUrl,
  developmentUrl,
  deployment,
  siteUrl,
}) {
  if (!clerkKey?.startsWith("pk_live_")) {
    return "set VITE_CLERK_PUBLISHABLE_KEY to the production Clerk publishable key (pk_live_...).";
  }

  let productionUrl;
  try {
    productionUrl = new URL(convexUrl);
  } catch {
    return "set VITE_CONVEX_URL to the production Convex deployment URL.";
  }
  if (
    productionUrl.protocol !== "https:" ||
    !productionUrl.hostname.endsWith(".convex.cloud")
  ) {
    return "VITE_CONVEX_URL must be an HTTPS Convex cloud URL.";
  }
  if (developmentUrl) {
    try {
      if (new URL(developmentUrl).origin === productionUrl.origin) {
        return "VITE_CONVEX_URL still points to the local development deployment.";
      }
    } catch {
      return "the configured development Convex URL is invalid; correct it before a production build.";
    }
  }
  if (productionUrl.hostname !== "tidy-ox-557.convex.cloud") {
    return "VITE_CONVEX_URL must point to the confirmed production deployment tidy-ox-557.";
  }
  if (deployment !== productionDeployment) {
    return `CONVEX_DEPLOYMENT must be ${productionDeployment}; production code generation must target the same deployment as the frontend.`;
  }

  let site;
  try {
    site = new URL(siteUrl || defaultSiteUrl);
  } catch {
    return "VITE_SITE_URL must be an HTTPS origin for the public website.";
  }
  if (
    site.protocol !== "https:" ||
    site.username ||
    site.password ||
    site.pathname !== "/" ||
    site.search ||
    site.hash
  ) {
    return "VITE_SITE_URL must be an HTTPS origin with no path, query, or fragment.";
  }

  return null;
}
