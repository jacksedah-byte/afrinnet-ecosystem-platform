import { spawnSync } from "node:child_process";
import { loadEnv } from "vite";
import {
  defaultSiteUrl,
  productionDeployment,
  validateProductionConfig,
} from "./production-config.mjs";

const root = process.cwd();
const publicLaunch = process.argv.includes("--public-launch");
const productionEnv = loadEnv("production", root, "VITE_");
const developmentEnv = loadEnv("development", root, "VITE_");
const clerkKey = process.env.VITE_CLERK_PUBLISHABLE_KEY ?? productionEnv.VITE_CLERK_PUBLISHABLE_KEY;
const convexUrl = process.env.VITE_CONVEX_URL ?? productionEnv.VITE_CONVEX_URL;
const siteUrl = process.env.VITE_SITE_URL ?? productionEnv.VITE_SITE_URL ?? defaultSiteUrl;
const deployment = process.env.CONVEX_DEPLOYMENT;

function fail(message) {
  console.error(`Production build blocked: ${message}`);
  process.exit(1);
}

const configurationError = validateProductionConfig({
  clerkKey,
  convexUrl,
  developmentUrl: developmentEnv.VITE_CONVEX_URL,
  deployment,
  siteUrl,
  publicLaunch,
});
if (configurationError) fail(configurationError);

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(
  npm,
  ["run", publicLaunch ? "build:client" : "build"],
  {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    VITE_CLERK_PUBLISHABLE_KEY: publicLaunch ? "" : clerkKey,
    VITE_CONVEX_URL: new URL(convexUrl).origin,
    VITE_SITE_URL: new URL(siteUrl).origin,
    VITE_PUBLIC_LAUNCH_MODE: publicLaunch ? "true" : "false",
    CONVEX_DEPLOYMENT: productionDeployment,
  },
  },
);

if (result.error) {
  console.error("Production build failed to start:", result.error.message);
  process.exit(1);
}
if (result.status !== 0) process.exit(result.status ?? 1);

const sitemap = spawnSync(
  process.execPath,
  [
    "scripts/generate-sitemap.mjs",
    ...(publicLaunch ? ["--static-only"] : []),
  ],
  {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_CONVEX_URL: new URL(convexUrl).origin,
      VITE_SITE_URL: new URL(siteUrl).origin,
    },
  },
);
if (sitemap.error) {
  console.error("Production sitemap generation failed to start:", sitemap.error.message);
  process.exit(1);
}
process.exit(sitemap.status ?? 1);
