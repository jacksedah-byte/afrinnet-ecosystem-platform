# AFRINNET public-first launch and production cutover

This handover describes the public-first launch at `afrinnet.com`. The live domain currently returns a Vercel `DEPLOYMENT_NOT_FOUND` response. No DNS records or DirectAdmin files have been changed. The public-first build intentionally leaves Clerk sign-in, the CMS, member portal and all online forms unavailable until production authentication and services are configured.

## Confirmed deployment target

On 2 November 2026, the project owner identified Convex production deployment `tidy-ox-557` (`https://tidy-ox-557.convex.cloud`, US East / N. Virginia). The Convex dashboard showed **Never deployed** and **No backup yet**. The production functions/schema have not been deployed by this handover, and account settings have not been independently inspected.

The local workspace remains linked to development deployment `energized-salamander-23` and uses a test Clerk key. Its local build is not suitable for production.

Before production sign-in can work, configure the production Clerk publishable key, Clerk issuer domain, and the correct production Clerk owner user ID. Never put Clerk secret keys or email-provider API keys in the frontend or repository.

## Public-first launch

### 1. Deploy the production Convex backend

The public site reads published CMS content when available and otherwise uses the content included in this repository. A blank production deployment is sufficient for the initial public site. Clerk is intentionally omitted from the first public-only backend deployment; CMS and member-account operations are unavailable in the public-first frontend. Add the Clerk provider to `src/convex/auth.config.ts` and configure its production issuer only when production Clerk is ready.

The current workspace's Convex CLI does not have access to `tidy-ox-557`, so use a production-only deploy key through GitHub Actions:

1. In the [Convex production dashboard](https://dashboard.convex.dev/t/jack-seddah/afrinnet-cms/tidy-ox-557), open **Settings → Deploy Keys** and create a deploy key for the `tidy-ox-557` production deployment. Do not copy a development key.
2. In [GitHub repository Actions secrets](https://github.com/jacksedah-byte/afrinnet-ecosystem-platform/settings/secrets/actions), create a repository secret named `CONVEX_PRODUCTION_DEPLOY_KEY` and paste the key there. Do not send it in chat.
3. Open the repository's [Actions tab](https://github.com/jacksedah-byte/afrinnet-ecosystem-platform/actions), select **Deploy Convex production**, and choose **Run workflow**.
4. Confirm the workflow succeeds before uploading the website files.

```sh
CONVEX_DEPLOYMENT=prod:tidy-ox-557 npx convex deploy
```

The CLI command above is the equivalent if you later have a CLI session authenticated to the correct production project. The GitHub workflow's deploy key is bound to the deployment you create it for. This deploy creates the schema and functions; it does not copy development content, uploads, or account records.

### 2. Build the public-only site

```sh
export CONVEX_DEPLOYMENT='prod:tidy-ox-557'
export VITE_CONVEX_URL='https://tidy-ox-557.convex.cloud'
export VITE_SITE_URL='https://afrinnet.com'
npm run build:public
```

This mode does not require Clerk and explicitly leaves `/auth`, `/dashboard`, `/cms`, contact/innovation forms, and newsletter sign-up unavailable. It never uses the development Convex deployment. Verify the build succeeds and `dist/.htaccess` exists before upload.

### 3. Upload through DirectAdmin

1. Sign in to DirectAdmin yourself and open the domain `afrinnet.com`'s **File Manager**.
2. Before replacing anything, download a backup of that domain's current `public_html` directory. Do not delete the backup.
3. Upload the **contents** of `dist/` (including `.htaccess`) into `public_html`. Do not upload `.env.local`, source files, or `node_modules`.
4. Test `https://afrinnet.com/`, `/about`, and `/contact`, including direct route refreshes. The forms and admin routes should clearly say they are not available yet.

I cannot access your DirectAdmin account from this workspace. Do not send passwords, FTP credentials, or account codes here. If you want the domain to stop showing the current Vercel 404 and resolve to DirectAdmin, the DNS records must point at the DirectAdmin server. Find the hosting server IP in DirectAdmin's **Account Manager → Domain Setup** or ask the host, then set the domain's apex A record and `www` record as instructed by the host. This is a DNS cutover and should be done only after the DirectAdmin files are uploaded and tested on the host's preview/staging URL. Keep the current DNS values recorded for rollback.

## Full production setup (later)

### 1. Configure production Clerk

In the production Clerk application:

1. Add `https://afrinnet.com` to Clerk's allowed origins and configure the production sign-in/sign-up redirect URLs.
2. Create or enable the JWT template named `convex` with application ID `convex`, as required by `src/convex/auth.config.ts`.
3. Record the exact issuer domain and production publishable key. Use the Clerk **production** instance, not a development/test instance.
4. Confirm the CMS owner's user ID in that same production instance.

Do not put a Clerk secret key in the Vite environment or in this repository. Only the publishable key belongs in the frontend.

### 2. Configure and redeploy the production Convex backend

Once a production Clerk instance exists, configure `CLERK_JWT_ISSUER_DOMAIN` and `CMS_ADMIN_USER_IDS` on `tidy-ox-557`. The owner ID must belong to the same **production** Clerk instance as the publishable key and JWT issuer.

```sh
CONVEX_DEPLOYMENT=prod:tidy-ox-557 npx convex env set CLERK_JWT_ISSUER_DOMAIN
CONVEX_DEPLOYMENT=prod:tidy-ox-557 npx convex env set CMS_ADMIN_USER_IDS
```

Each command prompts for its value. Enter the exact production Clerk issuer URL, then one or more comma-separated production Clerk user IDs. Do not use the test user ID unless it is also verified in the production Clerk instance.

Then run the production deploy:

```sh
CONVEX_DEPLOYMENT=prod:tidy-ox-557 npx convex deploy
```

Before confirming, verify that the CLI names `tidy-ox-557` as the **production** target. If it names a different project or deployment, cancel. This deploy updates the application's tables and functions; it does not copy development content or uploaded files.

### 3. Build the production website safely

Set the production frontend values in the shell that will build the site:

```sh
export VITE_CLERK_PUBLISHABLE_KEY='pk_live_...'
export VITE_CONVEX_URL='https://tidy-ox-557.convex.cloud'
export CONVEX_DEPLOYMENT='prod:tidy-ox-557'
export VITE_SITE_URL='https://afrinnet.com'
npm run build:production
```

`build:production` requires the production Clerk key, exact Convex URL, and deployment selector to agree. It compiles the full frontend and then queries the deployed CMS sitemap function to include published, indexable CMS routes. It fails if the backend query cannot be reached.

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

### 5. Redeploy and restore full site features

Run `npm run build:production`, then upload its `dist/` contents to DirectAdmin using the same backup procedure above. Verify CMS login, authorized/unauthorized staff access, forms, unsubscribe, uploads, and direct route refreshes.

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
