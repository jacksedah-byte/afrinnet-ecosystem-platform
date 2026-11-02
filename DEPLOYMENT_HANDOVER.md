# AFRINNET production readiness and cutover

This handover describes the repo's required production configuration. It does not deploy the site, change DNS, remove Vercel, or modify a domain.

## Confirmed deployment target

On 2 November 2026, the project owner identified Convex production deployment `tidy-ox-557` (`https://tidy-ox-557.convex.cloud`, US East / N. Virginia). The Convex dashboard showed **Never deployed** and **No backup yet**. The production functions/schema have not been deployed by this handover, and account settings have not been independently inspected.

The local workspace remains linked to development deployment `energized-salamander-23` and uses a test Clerk key. Its local build is not suitable for production.

Before production sign-in can work, configure the production Clerk publishable key, Clerk issuer domain, and the correct production Clerk owner user ID. Never put Clerk secret keys or email-provider API keys in the frontend or repository.

## Production setup

### 1. Configure production Clerk

In the production Clerk application:

1. Add the final website origin (for example `https://afrinnet.com`) to Clerk's allowed origins and configure the production sign-in/sign-up redirect URLs.
2. Create or enable the JWT template named `convex` with application ID `convex`, as required by `src/convex/auth.config.ts`.
3. Record the exact issuer domain and production publishable key. Use the Clerk **production** instance, not a development/test instance.
4. Confirm the CMS owner's user ID in that same production instance.

Do not put a Clerk secret key in the Vite environment or in this repository. Only the publishable key belongs in the frontend.

### 2. Configure and deploy the production Convex backend

Use the Convex project dashboard to configure `CLERK_JWT_ISSUER_DOMAIN` and `CMS_ADMIN_USER_IDS` on `tidy-ox-557`. The owner ID must belong to the same **production** Clerk instance as the publishable key and JWT issuer. Do not deploy until these values are confirmed.

```sh
CONVEX_DEPLOYMENT=prod:tidy-ox-557 npx convex env set CLERK_JWT_ISSUER_DOMAIN
CONVEX_DEPLOYMENT=prod:tidy-ox-557 npx convex env set CMS_ADMIN_USER_IDS
```

Each command prompts for its value. Enter the exact production Clerk issuer URL, then one or more comma-separated production Clerk user IDs. Do not use the test user ID unless it is also verified in the production Clerk instance.

Then run the production deploy:

```sh
CONVEX_DEPLOYMENT=prod:tidy-ox-557 npx convex deploy
```

Before confirming, verify that the CLI names `tidy-ox-557` as the **production** target. If it names a different project or deployment, cancel. This first deploy creates the application's tables and functions on that deployment; it does not copy development content or uploaded files. The dashboard reported no backup, so confirm that the deployment is new and has no production records before proceeding.

### 3. Build the production website safely

Set the production frontend values in the shell that will build the site:

```sh
export VITE_CLERK_PUBLISHABLE_KEY='pk_live_...'
export VITE_CONVEX_URL='https://tidy-ox-557.convex.cloud'
export CONVEX_DEPLOYMENT='prod:tidy-ox-557'
# Set this only to the confirmed public site origin; otherwise existing default is afrinnet.org.
export VITE_SITE_URL='https://afrinnet.org'
npm run build:production
```

`build:production` requires the production Clerk key, exact Convex URL, and deployment selector to agree. It compiles the frontend and then queries the deployed CMS sitemap function to include published, indexable CMS routes. It fails if the backend query cannot be reached. The regular `npm run build` is for development only.

The required verification before upload is:

- The build exits successfully.
- `dist/.htaccess` exists (the hidden file is required for direct route loads and refreshes under Apache).
- The `VITE_CONVEX_URL` is the production URL and the key is from the production Clerk instance.

### 4. Configure optional operational email notifications

The app supports Resend notifications after an enquiry, innovation submission, or new newsletter signup is saved. Set these **Convex production environment variables** on `tidy-ox-557`:

- `RESEND_API_KEY`: Resend API key (keep it in Convex, never in the frontend or Git).
- `AFRINNET_NOTIFICATION_EMAIL`: team inbox for submission alerts.
- `AFRINNET_FROM_EMAIL`: sender address verified in Resend.
- `AFRINNET_SITE_URL`: confirmed HTTPS website origin used in CMS alert links.
- `AFRINNET_CONVEX_SITE_URL`: HTTPS Convex HTTP Actions origin, normally `https://tidy-ox-557.convex.site`, used for one-click unsubscribe.

If these values are absent or delivery fails, the record is still saved in Convex, the submitter is told the alert was not sent, and the failure is logged. Test with an approved recipient before launch. Newsletter campaign delivery is not implemented. When Resend is configured, signup confirmation email includes an unsubscribe link and advertises the Convex one-click unsubscribe endpoint; users can also request removal through the contact form.

### 5. Upload to DirectAdmin

1. Back up the current `public_html` contents before replacing anything.
2. Upload the **contents** of `dist/`, including `.htaccess`, into the intended domain's `public_html/`. Do not upload `.env.local`, source files, or `node_modules`.
3. Keep the existing DNS configuration unchanged unless a separate DNS change is explicitly requested.
4. If DirectAdmin's web server does not honor Apache `.htaccess` rewrites, configure its SPA fallback so unknown paths serve `index.html`; otherwise `/cms` may work from a navigation click but fail on direct load or refresh.

### 6. Verify the live cutover

Using the final HTTPS website origin:

1. Open `/`, `/about`, and `/cms` directly, then refresh each route.
2. Sign in through Clerk on `/cms`. Confirm the owner can access the CMS and a non-allowlisted user cannot.
3. Confirm the imported content modules appear. A first authorized CMS visit imports the built-in content and site settings into the **production** database; it does not migrate the development database.
4. Review the `site` and `site-settings` records before publishing any existing drafts. On a fresh production database the built-in import publishes default content; never publish an unreviewed draft merely to clear a draft status.
5. In CMS, create and publish a test page, verify its public path, and remove it after testing. Test draft save separately from publish.
6. Submit a clearly identified test enquiry, innovation submission, and newsletter signup; confirm each appears in the CMS inbox, then remove the test records.
7. Test media upload, logo/favicon settings, navigation, page refreshes, and mobile layouts.

Forms save to Convex and appear in the CMS inbox. Resend alerts and newsletter signup confirmation emails are optional and require the environment variables above. Newsletter campaign emails are not sent by the current application.

## Data and migration boundaries

- Each Convex deployment has its own database. Production `tidy-ox-557` must receive the schema/functions before the live frontend uses it.
- The production importer seeds the built-in content modules from this code, but does not copy authored development edits, form submissions, CMS staff entries, or `_storage` uploads.
- Uploaded assets and their storage IDs are deployment-specific. Upload required images/videos again in the production CMS, or plan and validate a separate explicit data/storage migration.
- Previous development data is separate and is not copied by deployment. Do not assume production is empty without checking its dashboard before the first deploy.
- The production CMS owner ID and Clerk issuer still need to be supplied and verified before login can work.

## Rollback

If the live site fails after upload, restore the backed-up `public_html` files. Keep the previous Convex deployment and database intact while diagnosing; do not overwrite or reset production data as a rollback step.
