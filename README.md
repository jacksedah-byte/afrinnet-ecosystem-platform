## Overview

This project uses the following tech stack:
- Vite
- Typescript
- React Router v7 (all imports from `react-router` instead of `react-router-dom`)
- React 19 (for frontend components)
- Tailwind v4 (for styling)
- Shadcn UI (for UI components library)
- Lucide Icons (for icons)
- Convex (for backend, database, and CMS content)
- Clerk (for authentication)
- Framer Motion (for animations)
- Three js (for 3d models)

All relevant files live in the 'src' directory.

Use npm for the package manager; CI and the committed `package-lock.json` use npm.

## Setup

Link a Convex development deployment before building. Convex API types are generated from the configured deployment and local schema/functions.

## DirectAdmin deployment

This repository builds a static Vite single-page application. Follow the [production cutover handover](./DEPLOYMENT_HANDOVER.md) before building or uploading. The production build is pinned to Convex production deployment `tidy-ox-557`; set `CONVEX_DEPLOYMENT=prod:tidy-ox-557` and matching production frontend values before running `npm run build:production`. The build does not deploy Convex functions or change DNS. Once the sitemap query has been deployed, it includes published, indexable CMS routes. Set `VITE_SITE_URL` to the confirmed HTTPS website origin; it defaults to the existing `https://afrinnet.org` setting. Upload the contents of `dist/` (including `.htaccess`) into the domain's `public_html/` directory in DirectAdmin.

Vite embeds the Convex URL and Clerk publishable key in the generated frontend. Never upload a build made with development service values. Deploy the Convex functions and configure the production Clerk issuer and CMS admin allowlist on `tidy-ox-557` before building or testing live sign-in.

## Environment Variables

The project is set up with project specific CONVEX_DEPLOYMENT and VITE_CONVEX_URL environment variables on the client side.

The convex server has a separate set of environment variables that are accessible by the convex backend.

Configure the Clerk publishable key in the Vite environment. In Clerk, create a JWT template named `convex` with application ID `convex`, then set its issuer domain and the approved CMS administrator user IDs in the Convex deployment environment.


# Authentication and CMS

The frontend uses Clerk, and `ConvexProviderWithClerk` passes Clerk identity tokens to Convex. Set `VITE_CLERK_PUBLISHABLE_KEY` locally and `CLERK_JWT_ISSUER_DOMAIN` in the Convex deployment environment. Clerk's JWT template must use the name `convex` and application ID `convex`.

The CMS is available at `/cms`. Add one or more Clerk user IDs to the Convex environment variable `CMS_ADMIN_USER_IDS` (comma-separated) to grant administrator access. Authorization is enforced inside Convex queries and mutations, not only in the page UI.

An allowlisted CMS owner can manage additional staff from the **CMS staff** area. Staff must already have an account in the same Clerk application; adding them here grants or revokes CMS access but does not send a Clerk invitation. Assign a designation, an administrator/editor/read-only viewer/custom role, and specific CMS areas. Staff management remains owner-only, and permission checks are enforced by Convex.

Run `npm run convex:dev` (or the equivalent Bun script) and follow the Convex CLI prompts to link the local workspace. The build generates Convex API types before compiling. Use `npm run convex:deploy` to publish functions and schema changes. Set `CMS_ADMIN_USER_IDS` with `npx convex env set CMS_ADMIN_USER_IDS user_...` after linking the deployment.

CMS records and uploaded raster images are stored in Convex. On first admin visit, `/cms` automatically loads the current About, leadership, services, IP, audience, resource, founder-story, site, and site-settings content areas into the CMS. Unchanged built-in content is published so it remains visible on the website; customized drafts are preserved. **Import current content** safely fills any missing areas and activates only unchanged default records. The import is idempotent and never overwrites edited CMS content.

A published record with a website path overrides the page at that path; a published record on a new path is served by the CMS route. The page picker opens the shared content area used by an existing route instead of creating a blank replacement. Use **Create page** to build a new CMS route. The CMS workspace has separate overview, pages, website-content, media-library, site-settings, and submissions areas. Page, news, and resource records have a visual editor with a live preview, page-width/alignment/theme/background/text-color controls, page hero visibility, SEO title/description/indexing controls, and add/remove/reorder/duplicate/hide section controls. Section styling includes alignment, spacing, background/text colors, and card/grid columns. Sections include text, headings, lists, images, videos, feature cards, card grids with selectable icons, statistics, quotes, dividers, calls to action, button groups, FAQs/accordions, galleries, testimonials, partner logos, timelines, and YouTube/Vimeo embeds (restricted to supported HTTPS hosts). Images can be uploaded or selected again from the media library; MP4, WebM, and QuickTime uploads are limited to 20 MB. Uploading stores the file in Convex immediately, but the CMS record must also be saved to retain its reference. Draft records are saved in Convex but do not change the public site until published. Upload authorization follows the edited area (page, content, settings, or media), so staff do not need unrelated media-library access just to add an image to a page or site logo.

The visual page builder can be used to add a CMS design over any route in the existing page picker, including the homepage. New form sections can connect to the existing enquiry, innovation-intake, or newsletter Convex mutations. Enquiry sections allow up to 20 additional fields and store their answers with the enquiry in the CMS inbox. Innovation submissions retain server-side validation and are visible in the submissions inbox. Existing bespoke route components and their workflows can be retained using **Keep the existing page and its working features**, or intentionally replaced by publishing a complete CMS page design.

The homepage editor can reorder, hide, restore, or re-add its existing major sections and create custom text sections; its existing copy, links, lists, and image fields are edited in the structured field editor. New CMS pages can be added to the main navigation through the visual navigation settings. Bespoke page layouts, forms, and other application interactions remain implemented by their React route components unless a CMS page override is intentionally published in their place; keep the preserve-existing-page option enabled to retain those interactions.

Site settings include visual controls for the site name, description, tagline, announcement bar, contact email, logo, favicon, and primary/background/surface colors. Uploaded assets are stored in Convex and can be removed from the settings editor. A configured contact email is rendered as a `mailto:` link in the footer and Contact page. Enquiries, innovation submissions, and newsletter signups are saved in the CMS inbox; public enquiries and innovation submissions are limited to three per email address per hour. This is not IP-based bot protection; configure a CAPTCHA before high-volume public promotion. Optional Resend notifications require `RESEND_API_KEY`, `AFRINNET_NOTIFICATION_EMAIL`, and `AFRINNET_FROM_EMAIL` on the Convex deployment. The notification outcome is reported to the submitter. Newsletter campaign delivery is not implemented; subscribers can request removal via the contact form, and authorised staff remove the record in the CMS. No automatic data-retention schedule is configured.

Imported content modules are editable through structured nested fields, list controls, image upload fields, and an advanced JSON editor. This includes leadership portraits and image fields used by the existing site components. Save records as drafts while reviewing; publish a record to make the changes active. The CMS header includes links back to the website and sign-out.

Use this hook to access authentication state in React:
```typescript
import { useAuth } from "@/hooks/use-auth";

const { isLoading, isAuthenticated, user, userId, signOut } = useAuth();
```

## Protected Routes

The starter `/dashboard` route is protected with `RequireAuth`. Extend that page
for the product's authenticated experience, and reuse `RequireAuth` when adding
another protected route — do NOT hand-roll a redirect to `/auth`, since landing
on a bare sign-in form with no explanation of what was blocked is confusing.

`RequireAuth` states the block on the page the visitor asked for and sends them
to `/auth?returnTo=<current route>` when they choose to sign in, so they come
back to it. Pass `title` and `description` to say what the page is:

```tsx
<Route
  path="/dashboard"
  element={
    <RequireAuth
      title="Sign in to view your dashboard"
      description="Your projects and settings live here."
    >
      <Dashboard />
    </RequireAuth>
  }
/>
```

Pass `redirectImmediately` for a route where bouncing straight to `/auth` really
is better.

## Sign-In Redirects

The `/auth` route uses Clerk and preserves validated same-origin `returnTo` destinations. Existing Convex data is retained; current Convex Auth accounts are not automatically migrated to Clerk.

# Frontend Conventions

You will be using the Vite frontend with React 19, Tailwind v4, and Shadcn UI.

Generally, pages should be in the `src/pages` folder, and components should be in the `src/components` folder.

Shadcn primitives are located in the `src/components/ui` folder and should be used by default.

## Page routing

Your page component should go under the `src/pages` folder.

When adding a page, update the react router configuration in `src/main.tsx` to include the new route you just added.

## Shad CN conventions

Follow these conventions when using Shad CN components, which you should use by default.
- Remember to use "cursor-pointer" to make the element clickable
- For title text, use the "tracking-tight font-bold" class to make the text more readable
- Always make apps MOBILE RESPONSIVE. This is important
- AVOID NESTED CARDS. Try and not to nest cards, borders, components, etc. Nested cards add clutter and make the app look messy.
- AVOID SHADOWS. Avoid adding any shadows to components. stick with a thin border without the shadow.
- Avoid skeletons; instead, use the loader2 component to show a spinning loading state when loading data.


## Landing Pages

You must always create good-looking designer-level styles to your application. 
- Make it well animated and fit a certain "theme", ie neo brutalist, retro, neumorphism, glass morphism, etc

Use known images and emojis from online.

If the user is logged in already, show the get started button to say "Dashboard" or "Profile" instead to take them there.

## Responsiveness and formatting

Make sure pages are wrapped in a container to prevent the width stretching out on wide screens. Always make sure they are centered aligned and not off-center.

Always make sure that your designs are mobile responsive. Verify the formatting to ensure it has correct max and min widths as well as mobile responsiveness.

- Always create sidebars for protected dashboard pages and navigate between pages
- Always create navbars for landing pages
- On these bars, the created logo should be clickable and redirect to the index page

## Animating with Framer Motion

You must add animations to components using Framer Motion. It is already installed and configured in the project.

To use it, import the `motion` component from `framer-motion` and use it to wrap the component you want to animate.


### Other Items to animate
- Fade in and Fade Out
- Slide in and Slide Out animations
- Rendering animations
- Button clicks and UI elements

Animate for all components, including on landing page and app pages.

## Three JS Graphics

Your app comes with three js by default. You can use it to create 3D graphics for landing pages, games, etc.


## Colors

You can override colors in: `src/index.css`

This uses the oklch color format for tailwind v4.

Always use these color variable names.

Make sure all ui components are set up to be mobile responsive and compatible with both light and dark mode.

Set theme using `dark` or `light` variables at the parent className.

## Styling and Theming

When changing the theme, always change the underlying theme of the shad cn components app-wide under `src/components/ui` and the colors in the index.css file.

Avoid hardcoding in colors unless necessary for a use case, and properly implement themes through the underlying shad cn ui components.

When styling, ensure buttons and clickable items have pointer-click on them (don't by default).

Always follow a set theme style and ensure it is tuned to the user's liking.

## Toasts

You should always use toasts to display results to the user, such as confirmations, results, errors, etc.

Use the shad cn Sonner component as the toaster. For example:

```
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}
```

Remember to import { toast } from "sonner". Usage: `toast("Event has been created.")`

## Dialogs

Always ensure your larger dialogs have a scroll in its content to ensure that its content fits the screen size. Make sure that the content is not cut off from the screen.

Ideally, instead of using a new page, use a Dialog instead. 

# Using the Convex backend

You will be implementing the convex backend. Follow your knowledge of convex and the documentation to implement the backend.

## The Convex Schema

You must correctly follow the convex schema implementation.

The schema is defined in `src/convex/schema.ts`.

Do not include the `_id` and `_creationTime` fields in your queries (it is included by default for each table).
Do not index `_creationTime` as it is indexed for you. Never have duplicate indexes.


## Convex Actions: Using CRUD operations

When running anything that involves external connections, you must use a convex action with "use node" at the top of the file.

You cannot have queries or mutations in the same file as a "use node" action file. Thus, you must use pre-built queries and mutations in other files.

You can also use the pre-installed internal crud functions for the database:

```ts
// in convex/users.ts
import { crud } from "convex-helpers/server/crud";
import schema from "./schema.ts";

export const { create, read, update, destroy } = crud(schema, "users");

// in some file, in an action:
const user = await ctx.runQuery(internal.users.read, { id: userId });

await ctx.runMutation(internal.users.update, {
  id: userId,
  patch: {
    status: "inactive",
  },
});
```


## Common Convex Mistakes To Avoid

When using convex, make sure:
- Document IDs are referenced as `_id` field, not `id`.
- Document ID types are referenced as `Id<"TableName">`, not `string`.
- Document object types are referenced as `Doc<"TableName">`.
- Keep schemaValidation to false in the schema file.
- You must correctly type your code so that it passes the type checker.
- You must handle null / undefined cases of your convex queries for both frontend and backend, or else it will throw an error that your data could be null or undefined.
- Always use the `@/folder` path, with `@/convex/folder/file.ts` syntax for importing convex files.
- This includes importing generated files like `@/convex/_generated/server`, `@/convex/_generated/api`
- Remember to import functions like useQuery, useMutation, useAction, etc. from `convex/react`
- NEVER have return type validators.
