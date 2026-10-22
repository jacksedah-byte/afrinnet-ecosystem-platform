import { v } from "convex/values";
import type { GenericId } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";

function adminUserIds() {
  return (process.env.CMS_ADMIN_USER_IDS ?? "")
    .split(",")
    .map((userId) => userId.trim())
    .filter(Boolean);
}

function collectStorageIds(value: unknown): GenericId<"_storage">[] {
  if (Array.isArray(value)) return value.flatMap(collectStorageIds);
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  const ownId = typeof record.storageId === "string"
    ? [record.storageId as GenericId<"_storage">]
    : [];
  return [...ownId, ...Object.values(record).flatMap(collectStorageIds)];
}

async function deleteRemovedStorage(
  ctx: MutationCtx,
  recordId: GenericId<"siteContent">,
  previous: unknown,
  next: unknown,
) {
  const retained = new Set(collectStorageIds(next));
  const otherRecords = await ctx.db.query("siteContent").collect();
  for (const record of otherRecords) {
    if (record._id !== recordId) {
      for (const storageId of collectStorageIds(record.content)) retained.add(storageId);
    }
  }
  for (const storageId of new Set(collectStorageIds(previous))) {
    if (!retained.has(storageId)) await ctx.storage.delete(storageId);
  }
}

async function requireCmsAdmin(ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || !adminUserIds().includes(identity.subject)) {
    throw new Error("CMS administrator access required.");
  }
  return identity.subject;
}

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return Boolean(identity && adminUserIds().includes(identity.subject));
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireCmsAdmin(ctx);
    return await ctx.db.query("siteContent").order("desc").collect();
  },
});

export const getPublishedByKey = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const record = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    return record?.status === "published" ? record : null;
  },
});

export const importStaticModules = mutation({
  args: {
    modules: v.array(
      v.object({
        key: v.union(
          v.literal("about"),
          v.literal("audiences"),
          v.literal("founderStory"),
          v.literal("ip"),
          v.literal("leadership"),
          v.literal("resources"),
          v.literal("services"),
          v.literal("site"),
        ),
        title: v.string(),
        content: v.any(),
      }),
    ),
  },
  handler: async (ctx, { modules }) => {
    const userId = await requireCmsAdmin(ctx);
    if (modules.length > 8) throw new Error("Too many content modules.");
    let imported = 0;
    for (const module of modules) {
      const key = `module:${module.key}`;
      const existing = await ctx.db
        .query("siteContent")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();
      if (existing) continue;
      const contentJson = JSON.stringify(module.content);
      if (!contentJson || contentJson.length > 700_000) {
        throw new Error(`Module ${module.key} is too large to import.`);
      }
      await ctx.db.insert("siteContent", {
        key,
        type: "site-module",
        title: module.title,
        status: "draft",
        content: module.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: userId,
        updatedBy: userId,
      });
      imported++;
    }
    return imported;
  },
});

export const listPublishedByType = query({
  args: { type: v.string() },
  handler: async (ctx, { type }) =>
    await ctx.db
      .query("siteContent")
      .withIndex("by_type_status", (q) =>
        q.eq("type", type).eq("status", "published"),
      )
      .order("desc")
      .collect(),
});

export const getPublishedByPath = query({
  args: { path: v.string() },
  handler: async (ctx, { path }) => {
    return await ctx.db
      .query("siteContent")
      .withIndex("by_path", (q) => q.eq("path", path))
      .filter((q) => q.eq(q.field("status"), "published"))
      .first();
  },
});

export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => await ctx.storage.getUrl(storageId),
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireCmsAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const inbox = query({
  args: {},
  handler: async (ctx) => {
    await requireCmsAdmin(ctx);
    const [submissions, enquiries, newsletterSignups] = await Promise.all([
      ctx.db.query("innovationSubmissions").order("desc").collect(),
      ctx.db.query("enquiries").order("desc").collect(),
      ctx.db.query("newsletterSignups").order("desc").collect(),
    ]);
    return { submissions, enquiries, newsletterSignups };
  },
});

export const setSubmissionStatus = mutation({
  args: {
    id: v.id("innovationSubmissions"),
    status: v.union(
      v.literal("received"),
      v.literal("reviewing"),
      v.literal("contacted"),
      v.literal("closed"),
    ),
  },
  handler: async (ctx, { id, status }) => {
    await requireCmsAdmin(ctx);
    await ctx.db.patch(id, { status });
  },
});

export const setEnquiryStatus = mutation({
  args: {
    id: v.id("enquiries"),
    status: v.union(
      v.literal("received"),
      v.literal("reviewing"),
      v.literal("contacted"),
      v.literal("closed"),
    ),
  },
  handler: async (ctx, { id, status }) => {
    await requireCmsAdmin(ctx);
    await ctx.db.patch(id, { status });
  },
});

export const removeSubmission = mutation({
  args: { id: v.id("innovationSubmissions") },
  handler: async (ctx, { id }) => {
    await requireCmsAdmin(ctx);
    await ctx.db.delete(id);
  },
});

export const removeEnquiry = mutation({
  args: { id: v.id("enquiries") },
  handler: async (ctx, { id }) => {
    await requireCmsAdmin(ctx);
    await ctx.db.delete(id);
  },
});

export const removeNewsletterSignup = mutation({
  args: { id: v.id("newsletterSignups") },
  handler: async (ctx, { id }) => {
    await requireCmsAdmin(ctx);
    await ctx.db.delete(id);
  },
});

export const save = mutation({
  args: {
    id: v.optional(v.id("siteContent")),
    key: v.string(),
    type: v.string(),
    title: v.string(),
    path: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCmsAdmin(ctx);
    const key = args.key.trim();
    const title = args.title.trim();
    const type = args.type.trim();
    const path = args.path?.trim() || undefined;

    if (!key || !title || !type) {
      throw new Error("Key, type, and title are required.");
    }
    if (args.status === "published" && (type === "news" || type === "resource") && !path) {
      throw new Error("Published news and resource records need a website path.");
    }
    if (path && (!path.startsWith("/") || path.startsWith("//"))) {
      throw new Error("Content paths must be same-site paths beginning with one slash.");
    }
    if (key.length > 120 || type.length > 80 || title.length > 240 || (path?.length ?? 0) > 240) {
      throw new Error("Content metadata exceeds the allowed length.");
    }
    const contentJson = JSON.stringify(args.content);
    if (!contentJson || contentJson.length > 700_000) {
      throw new Error("Content is too large. Reduce the record size or upload large assets separately.");
    }

    const existing = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (existing && existing._id !== args.id) {
      throw new Error("A content record with this key already exists.");
    }
    if (path && args.status === "published") {
      const publishedAtPath = await ctx.db
        .query("siteContent")
        .withIndex("by_path", (q) => q.eq("path", path))
        .filter((q) => q.eq(q.field("status"), "published"))
        .first();
      if (publishedAtPath && publishedAtPath._id !== args.id) {
        throw new Error("Another published record already uses this path.");
      }
    }

    const now = Date.now();
    if (args.id) {
      const record = await ctx.db.get(args.id);
      if (!record) throw new Error("Content record not found.");
      await deleteRemovedStorage(ctx, args.id, record.content, args.content);
      await ctx.db.patch(args.id, {
        key,
        type,
        title,
        path,
        status: args.status,
        content: args.content,
        updatedAt: now,
        updatedBy: userId,
      });
      return args.id;
    }

    return await ctx.db.insert("siteContent", {
      key,
      type,
      title,
      path,
      status: args.status,
      content: args.content,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("siteContent") },
  handler: async (ctx, { id }) => {
    await requireCmsAdmin(ctx);
    const record = await ctx.db.get(id);
    if (!record) return false;
    await deleteRemovedStorage(ctx, id, record.content, null);
    await ctx.db.delete(id);
    return true;
  },
});