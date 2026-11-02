import { spawnSync } from "node:child_process";
import { loadEnv } from "vite";

const root = process.cwd();
const productionEnv = loadEnv("production", root, "VITE_");
const developmentEnv = loadEnv("development", root, "VITE_");
const clerkKey = process.env.VITE_CLERK_PUBLISHABLE_KEY ?? productionEnv.VITE_CLERK_PUBLISHABLE_KEY;
const convexUrl = process.env.VITE_CONVEX_URL ?? productionEnv.VITE_CONVEX_URL;

function fail(message) {
  console.error(`Production build blocked: ${message}`);
  process.exit(1);
}

if (!clerkKey?.startsWith("pk_live_")) {
  fail("set VITE_CLERK_PUBLISHABLE_KEY to the production Clerk publishable key (pk_live_...).");
}

let productionUrl;
try {
  productionUrl = new URL(convexUrl);
} catch {
  fail("set VITE_CONVEX_URL to the production Convex deployment URL.");
}

if (productionUrl.protocol !== "https:" || !productionUrl.hostname.endsWith(".convex.cloud")) {
  fail("VITE_CONVEX_URL must be an HTTPS Convex cloud URL.");
}

const developmentUrl = developmentEnv.VITE_CONVEX_URL;
if (developmentUrl && new URL(developmentUrl).origin === productionUrl.origin) {
  fail("VITE_CONVEX_URL still points to the local development deployment.");
}

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npm, ["run", "build"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    VITE_CLERK_PUBLISHABLE_KEY: clerkKey,
    VITE_CONVEX_URL: productionUrl.origin,
  },
});

if (result.error) {
  console.error("Production build failed to start:", result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
