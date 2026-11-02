# AFRINNET production cutover handover

This is the deployment checklist for hosting this repository on the AFRINNET domain through DirectAdmin. It does not change DNS or deploy anything by itself.

## Readiness checked on 2 November 2026

- The Codespaces preview uses the development Convex deployment `energized-salamander-23` and a test Clerk publishable key. Do not upload its existing build to the live site.
- The project's production Convex deployment is `hidden-albatross-712` (`https://hidden-albatross-712.convex.cloud`).
- Production currently has no database tables and no deployed CMS functions; `cms:getAccess` is not present.
- Production has `CMS_ADMIN_USER_IDS` configured, but `CLERK_JWT_ISSUER_DOMAIN` is missing. The existing allowlist has not been verified against the production Clerk account.
- The development database has eight published built-in content modules, two draft records (`site` navigation and `site-settings`), two stored files, and no CMS staff entries or form submissions. Do not copy development records or uploads as part of this cutover unless they are specifically needed.
- The production deploy and the DirectAdmin upload have **not** been performed. No domain or DNS settings have been changed.

## What is needed before production can work

1. Access to the production Clerk application and the production Convex deployment.
2. The production Clerk publishable key (`pk_live_...`) and its issuer domain.
3. The Clerk production user ID that should own the CMS. A test-instance Clerk user ID may differ from its production user ID.
4. DirectAdmin access to the intended domain's `public_html` directory. No FTP/DirectAdmin credentials are stored in this repository.

## Cutover steps

### 1. Configure production Clerk

In the production Clerk application:

1. Add the final website origin (for example `https://afrinnet.com`) to Clerk's allowed origins and configure the production sign-in/sign-up redirect URLs.
2. Create or enable the JWT template named `convex` with application ID `convex`, as required by `src/convex/auth.config.ts`.
3. Record the exact issuer domain and production publishable key. Use the Clerk **production** instance, not a development/test instance.
4. Confirm the CMS owner's user ID in that same production instance.

Do not put a Clerk secret key in the Vite environment or in this repository. Only the publishable key belongs in the frontend.

### 2. Configure and deploy the production Convex backend

The project's production deployment is `hidden-albatross-712`. Set the Clerk issuer and the actual production CMS owner ID on that deployment:

```sh
npx convex env set CLERK_JWT_ISSUER_DOMAIN --deployment prod
npx convex env set CMS_ADMIN_USER_IDS --deployment prod
```

Each command prompts for its value. Enter the exact production Clerk issuer URL, then one or more comma-separated production Clerk user IDs. Do not use the test user ID unless it is also verified in the production Clerk instance.

Then run the production deploy interactively:

```sh
npx convex deploy
```

Before confirming, verify that the CLI names `hidden-albatross-712` as the **production** target. If it names a different project or deployment, cancel. This deploy publishes the current Convex schema and functions; it does not copy the development database's content or uploaded files.

### 3. Build the production website safely

Set the production frontend values in the shell that will build the site:

```sh
export VITE_CLERK_PUBLISHABLE_KEY='pk_live_...'
export VITE_CONVEX_URL='https://hidden-albatross-712.convex.cloud'
npm run build:production
```

`build:production` refuses test Clerk keys, non-HTTPS/non-Convex URLs, and the same Convex URL found in the local development configuration. The regular `npm run build` remains available for development and does not provide these production safeguards.

The required verification before upload is:

- The build exits successfully.
- `dist/.htaccess` exists (the hidden file is required for direct route loads and refreshes under Apache).
- The `VITE_CONVEX_URL` is the production URL and the key is from the production Clerk instance.

### 4. Upload to DirectAdmin

1. Back up the current `public_html` contents before replacing anything.
2. Upload the **contents** of `dist/`, including `.htaccess`, into the intended domain's `public_html/`. Do not upload `.env.local`, source files, or `node_modules`.
3. Keep the existing DNS configuration unchanged unless a separate DNS change is explicitly requested.
4. If DirectAdmin's web server does not honor Apache `.htaccess` rewrites, configure its SPA fallback so unknown paths serve `index.html`; otherwise `/cms` may work from a navigation click but fail on direct load or refresh.

### 5. Verify the live cutover

Using the final HTTPS website origin:

1. Open `/`, `/about`, and `/cms` directly, then refresh each route.
2. Sign in through Clerk on `/cms`. Confirm the owner can access the CMS and a non-allowlisted user cannot.
3. Confirm the imported content modules appear. A first authorized CMS visit imports the built-in content and site settings into the **production** database; it does not migrate the development database.
4. Review the `site` and `site-settings` records before publishing any existing drafts. On a fresh production database the built-in import publishes default content; never publish an unreviewed draft merely to clear a draft status.
5. In CMS, create and publish a test page, verify its public path, and remove it after testing. Test draft save separately from publish.
6. Submit a clearly identified test enquiry, innovation submission, and newsletter signup; confirm each appears in the CMS inbox, then remove the test records.
7. Test media upload, logo/favicon settings, navigation, page refreshes, and mobile layouts.

Forms currently save to Convex and appear in the CMS inbox. Email notifications are **not** configured; add an email-delivery provider separately if email alerts are required.

## Data and migration boundaries

- Each Convex deployment has its own database. The live site will not see preview data just because the frontend is uploaded.
- The production importer seeds the built-in content modules from this code, but does not copy authored development edits, form submissions, CMS staff entries, or `_storage` uploads.
- Uploaded assets and their storage IDs are deployment-specific. Upload required images/videos again in the production CMS, or plan and validate a separate explicit data/storage migration.
- The current development database contains no enquiry, innovation, or newsletter submissions to migrate. Production had no tables at the readiness check.
- The production CMS owner allowlist is configured, but its identity and Clerk issuer must be verified before login can work.

## Rollback

If the live site fails after upload, restore the backed-up `public_html` files. Keep the previous Convex deployment and database intact while diagnosing; do not overwrite or reset production data as a rollback step.
