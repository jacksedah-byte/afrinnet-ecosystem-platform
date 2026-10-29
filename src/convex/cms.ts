import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { cmsSectionValidator } from "./schema";

type CmsCtx = QueryCtx | MutationCtx;

async function requireAdmin(ctx: CmsCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Sign in is required.");

  const claims = identity as typeof identity & {
    role?: unknown;
    email_address?: unknown;
    primary_email_address?: unknown;
    public_metadata?: unknown;
  };
  const publicMetadata =
    typeof claims.public_metadata === "object" &&
    claims.public_metadata !== null
      ? (claims.public_metadata as { role?: unknown })
      : undefined;
  const adminEmails = (process.env.CMS_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const adminSubjects = (process.env.CMS_ADMIN_SUBJECTS ?? "")
    .split(",")
    .map((subject) => subject.trim())
    .filter(Boolean);
  const identityEmails = [
    identity.email,
    claims.email_address,
    claims.primary_email_address,
  ].filter((email): email is string => typeof email === "string");
  const registeredAdmin = await ctx.db
    .query("cmsAdmins")
    .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
    .first();
  const isAdmin =
    claims.role === "admin" ||
    publicMetadata?.role === "admin" ||
    adminSubjects.includes(identity.subject) ||
    identityEmails.some((email) => adminEmails.includes(email.toLowerCase())) ||
    registeredAdmin !== null;

  if (!isAdmin) throw new Error("Administrator access is required.");
  return identity;
}

function clean(value: string, maxLength: number) {
  const result = value.trim();
  if (!result || result.length > maxLength) {
    throw new Error(`Value must contain between 1 and ${maxLength} characters.`);
  }
  return result;
}

export const currentAdmin = query({
  args: {},
  handler: async (ctx) => {
    try {
      const identity = await requireAdmin(ctx);
      return {
        subject: identity.subject,
        email: identity.email ?? null,
      };
    } catch (error) {
      if (error instanceof Error && error.message === "Administrator access is required.") {
        return null;
      }
      throw error;
    }
  },
});

export const overview = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [submissions, enquiries, subscribers, content, media] = await Promise.all([
      ctx.db.query("innovationSubmissions").collect(),
      ctx.db.query("enquiries").collect(),
      ctx.db.query("newsletterSignups").collect(),
      ctx.db.query("cmsContent").collect(),
      ctx.db.query("cmsMedia").collect(),
    ]);
    return {
      submissions: submissions.length,
      newSubmissions: submissions.filter((item) => item.status === "received").length,
      enquiries: enquiries.length,
      newEnquiries: enquiries.filter((item) => item.status === "received").length,
      subscribers: subscribers.length,
      content: content.length,
      publishedContent: content.filter((item) => item.published).length,
      media: media.length,
    };
  },
});

export const listSubmissions = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return (await ctx.db.query("innovationSubmissions").collect())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 500);
  },
});

export const listEnquiries = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return (await ctx.db.query("enquiries").collect())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 500);
  },
});

export const listSubscribers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return (await ctx.db.query("newsletterSignups").collect())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 1000);
  },
});

export const listContent = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return (await ctx.db.query("cmsContent").collect()).sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
  },
});

export const generateMediaUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const registerMedia = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    altText: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const fileName = clean(args.fileName, 180);
    const altText = clean(args.altText, 300);
    const metadata = await ctx.storage.getMetadata(args.storageId);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const contentType = metadata?.contentType;
    if (!metadata || !contentType || !allowedTypes.includes(contentType)) {
      await ctx.storage.delete(args.storageId);
      throw new Error("Upload a JPG, PNG, WebP or GIF image.");
    }
    if (metadata.size > 8 * 1024 * 1024) {
      await ctx.storage.delete(args.storageId);
      throw new Error("Images must be 8 MB or smaller.");
    }
    return await ctx.db.insert("cmsMedia", {
      storageId: args.storageId,
      fileName,
      contentType,
      size: metadata.size,
      altText,
      createdAt: Date.now(),
      createdBy: identity.subject,
    });
  },
});

export const listMedia = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const media = (await ctx.db.query("cmsMedia").collect()).sort(
      (a, b) => b.createdAt - a.createdAt,
    );
    return await Promise.all(
      media.map(async (item) => ({
        ...item,
        url: await ctx.storage.getUrl(item.storageId),
      })),
    );
  },
});

export const deleteMedia = mutation({
  args: { id: v.id("cmsMedia") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Media item not found.");
    await ctx.storage.delete(item.storageId);
    await ctx.db.delete(args.id);
  },
});

export const publishedContent = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("cmsContent").collect();
    return items
      .filter((item) => item.published)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const publishedPage = query({
  args: { path: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("cmsContent")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();
    return page?.type === "page" && page.published ? page : null;
  },
});

export const publishedSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("cmsContent")
      .withIndex("by_type_slug", (q) =>
        q.eq("type", "settings").eq("slug", "global"),
      )
      .first();
    return settings?.published ? settings : null;
  },
});

export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("cmsAdmins").collect();
  },
});

export const saveContent = mutation({
  args: {
    id: v.optional(v.id("cmsContent")),
    type: v.string(),
    slug: v.string(),
    path: v.optional(v.string()),
    title: v.string(),
    summary: v.optional(v.string()),
    body: v.string(),
    sections: v.optional(v.array(cmsSectionValidator)),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const type = clean(args.type, 40);
    const slug = clean(args.slug, 120).toLowerCase();
    const title = clean(args.title, 200);
    if (args.body.length > 100_000) {
      throw new Error("Content body exceeds 100 KB.");
    }
    if (!["page", "news", "resource", "settings"].includes(type)) {
      throw new Error("Unsupported CMS content type.");
    }
    if (type !== "page" && args.sections?.length) {
      throw new Error("Structured page sections can only be used on website pages.");
    }
    if ((args.sections?.length ?? 0) > 30) {
      throw new Error("A page can contain no more than 30 sections.");
    }
    if (JSON.stringify(args.sections ?? []).length > 100_000) {
      throw new Error("Page sections exceed the 100 KB content limit.");
    }
    const sectionIds = new Set<string>();
    for (const section of args.sections ?? []) {
      if (!section.id || section.id.length > 80 || sectionIds.has(section.id)) {
        throw new Error("Page section identifiers must be unique and valid.");
      }
      sectionIds.add(section.id);
      const links =
        section.type === "hero"
          ? [section.primaryHref, section.secondaryHref]
          : section.type === "cta"
            ? [section.buttonHref]
            : [];
      for (const href of links) {
        if (
          href &&
          !(
            (href.startsWith("/") && !href.startsWith("//")) ||
            /^https:\/\//i.test(href)
          )
        ) {
          throw new Error("Links must be local paths or secure HTTPS URLs.");
        }
      }
      if (
        (section.type === "hero" || section.type === "image") &&
        section.imageUrl &&
        !(
          (section.imageUrl.startsWith("/") && !section.imageUrl.startsWith("//")) ||
          /^https:\/\//i.test(section.imageUrl)
        )
      ) {
        throw new Error("Images must use a local path or secure HTTPS URL.");
      }
      if (section.type === "image" && !section.imageUrl.trim()) {
        throw new Error("Choose an image for every image section.");
      }
      if (section.type === "features" && section.items.length === 0) {
        throw new Error("Feature sections need at least one feature card.");
      }
    }
    if (type === "settings") {
      try {
        JSON.parse(args.body);
      } catch {
        throw new Error("Site settings must be valid JSON.");
      }
      if (slug !== "global") {
        throw new Error('The site settings slug must be "global".');
      }
    }
    const path = args.path?.trim();
    if (type === "page" && !path) {
      throw new Error("Website pages need a local route path.");
    }
    if (path && (!path.startsWith("/") || path.startsWith("//"))) {
      throw new Error("Page path must be a local path beginning with one slash.");
    }
    if (path) {
      const duplicatePath = await ctx.db
        .query("cmsContent")
        .withIndex("by_path", (q) => q.eq("path", path))
        .first();
      if (duplicatePath && duplicatePath._id !== args.id) {
        throw new Error("Another CMS item already uses this website path.");
      }
    }

    const duplicate = await ctx.db
      .query("cmsContent")
      .withIndex("by_type_slug", (q) => q.eq("type", type).eq("slug", slug))
      .first();
    if (duplicate && duplicate._id !== args.id) {
      throw new Error(`A ${type} item with this slug already exists.`);
    }

    const value = {
      type,
      slug,
      path: path || undefined,
      title,
      summary: args.summary?.trim().slice(0, 1000) || undefined,
      body: args.body,
      sections: args.sections,
      published: args.published,
      updatedAt: Date.now(),
      updatedBy: identity.subject,
    };
    if (args.id) {
      await ctx.db.patch(args.id, value);
      return args.id;
    }
    return await ctx.db.insert("cmsContent", value);
  },
});

export const deleteContent = mutation({
  args: { id: v.id("cmsContent") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

export const setSubmissionStatus = mutation({
  args: {
    id: v.id("innovationSubmissions"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const allowed = ["received", "reviewing", "approved", "rejected", "archived"];
    if (!allowed.includes(args.status)) throw new Error("Invalid intake status.");
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const setEnquiryStatus = mutation({
  args: {
    id: v.id("enquiries"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const allowed = ["received", "reviewing", "approved", "rejected", "archived"];
    if (!allowed.includes(args.status)) throw new Error("Invalid enquiry status.");
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const addAdmin = mutation({
  args: {
    subject: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const subject = clean(args.subject, 200);
    const existing = await ctx.db
      .query("cmsAdmins")
      .withIndex("by_subject", (q) => q.eq("subject", subject))
      .first();
    if (existing) throw new Error("This user already has CMS admin access.");
    return await ctx.db.insert("cmsAdmins", {
      subject,
      email: args.email?.trim().toLowerCase() || undefined,
      createdAt: Date.now(),
      createdBy: identity.subject,
    });
  },
});

export const removeAdmin = mutation({
  args: { id: v.id("cmsAdmins") },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const admin = await ctx.db.get(args.id);
    if (!admin) throw new Error("CMS administrator not found.");
    if (admin.subject === identity.subject) {
      throw new Error("You cannot remove your own CMS administrator access.");
    }
    await ctx.db.delete(args.id);
  },
});
