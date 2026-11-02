import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultSiteUrl,
  productionDeployment,
  validateProductionConfig,
} from "./production-config.mjs";

const validConfig = {
  clerkKey: "pk_live_example",
  convexUrl: "https://tidy-ox-557.convex.cloud",
  developmentUrl: "https://energized-salamander-23.convex.cloud",
  deployment: productionDeployment,
  siteUrl: defaultSiteUrl,
};

test("accepts the confirmed production target and secure site origin", () => {
  assert.equal(validateProductionConfig(validConfig), null);
});

test("rejects a development deployment even when the frontend URL is production", () => {
  assert.match(
    validateProductionConfig({ ...validConfig, deployment: "dev:energized-salamander-23" }),
    /CONVEX_DEPLOYMENT must be prod:tidy-ox-557/,
  );
});

test("rejects a frontend Convex URL that does not match the confirmed production", () => {
  assert.match(
    validateProductionConfig({ ...validConfig, convexUrl: "https://other.convex.cloud" }),
    /must point to the confirmed production deployment/,
  );
});

test("rejects test Clerk keys", () => {
  assert.match(
    validateProductionConfig({ ...validConfig, clerkKey: "pk_test_example" }),
    /production Clerk publishable key/,
  );
});

test("rejects non-origin or insecure public site URLs", () => {
  assert.match(
    validateProductionConfig({ ...validConfig, siteUrl: "http://afrinnet.org/path" }),
    /must be an HTTPS origin/,
  );
});
