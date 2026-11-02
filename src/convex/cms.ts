import { v } from "convex/values";
import type { GenericId } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";

const cmsPermissionValidator = v.union(
  v.literal("pages"),
  v.literal("content"),
  v.literal("media"),
  v.literal("settings"),
  v.literal("inbox"),
);
const cmsRoleValidator = v.union(
  v.literal("admin"),
  v.literal("editor"),
  v.literal("viewer"),
  v.literal("custom"),
);
type CmsPermission = "pages" | "content" | "media" | "settings" | "inbox";
const allPermissions: CmsPermission[] = ["pages", "content", "media", "settings", "inbox"];

function adminUserIds() {
  return (process.env.CMS_ADMIN_USER_IDS ?? "")
    .split(",")
    .map((userId) => userId.trim())
    .filter(Boolean);
}

type CmsContext = Pick<MutationCtx, "auth"> & {
  db: Pick<MutationCtx["db"], "query">;
};

async function cmsAccess(ctx: CmsContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  if (adminUserIds().includes(identity.subject)) {
    return {
      clerkUserId: identity.subject,
      email: identity.email,
      name: identity.name,
      designation: "Owner",
      role: "admin" as const,
      permissions: allPermissions,
      active: true,
      canManageUsers: true,
    };
  }
  const user = await ctx.db
    .query("cmsUsers")
    .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
    .first();
  if (!user || !user.active) return null;
  return {
    ...user,
    canManageUsers: false,
  };
}

async function requirePermission(ctx: CmsContext, permission: CmsPermission, write = false) {
  const access = await cmsAccess(ctx);
  if (!access || !access.permissions.includes(permission)) {
    throw new Error(`CMS permission required: ${permission}.`);
  }
  if (write && access.role === "viewer") {
    throw new Error("Viewer access is read-only.");
  }
  return access.clerkUserId;
}

async function requireUserManager(ctx: CmsContext) {
  const access = await cmsAccess(ctx);
  if (!access?.canManageUsers) {
    throw new Error("Only the CMS owner can manage staff access.");
  }
  return access.clerkUserId;
}

function recordPermission(record: { type: string; path?: string }): CmsPermission {
  if (record.type === "settings") return "settings";
  if (record.type === "media") return "media";
  if (record.path || ["page", "news", "resource"].includes(record.type)) return "pages";
  return "content";
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

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
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

export const isAdmin = query({
  args: {},
  handler: async (ctx) => Boolean(await cmsAccess(ctx)),
});

export const getAccess = query({
  args: {},
  handler: async (ctx) => {
    const access = await cmsAccess(ctx);
    if (!access) return null;
    return {
      email: access.email ?? null,
      name: access.name ?? null,
      designation: access.designation,
      role: access.role,
      permissions: access.permissions,
      canManageUsers: access.canManageUsers,
    };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const access = await cmsAccess(ctx);
    if (!access) throw new Error("CMS access required.");
    const records = await ctx.db.query("siteContent").order("desc").collect();
    return records.filter((record) => access.permissions.includes(recordPermission(record)));
  },
});

export const listCmsUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireUserManager(ctx);
    return await ctx.db.query("cmsUsers").order("desc").collect();
  },
});

export const saveCmsUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    designation: v.string(),
    role: cmsRoleValidator,
    permissions: v.array(cmsPermissionValidator),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const actor = await requireUserManager(ctx);
    const clerkUserId = args.clerkUserId.trim();
    const designation = args.designation.trim();
    const email = args.email?.trim().toLowerCase();
    const name = args.name?.trim();
    if (!/^user_[A-Za-z0-9]+$/.test(clerkUserId)) {
      throw new Error("Enter a valid Clerk user ID beginning with user_.");
    }
    if (adminUserIds().includes(clerkUserId)) {
      throw new Error("This user is configured as an owner. Manage owner access through the Convex environment variable.");
    }
    if (!designation || designation.length > 120) {
      throw new Error("Enter a designation of 1–120 characters.");
    }
    if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      throw new Error("Enter a valid email address.");
    }
    const permissions = [...new Set(args.permissions)];
    if (args.role === "admin") permissions.splice(0, permissions.length, ...allPermissions);
    if (args.role === "viewer") {
      const readPermissions: CmsPermission[] = ["pages", "content", "media"];
      permissions.splice(0, permissions.length, ...permissions.filter((item) => readPermissions.includes(item)));
    }
    if (args.active && permissions.length === 0) {
      throw new Error("An active CMS user must have at least one access area.");
    }
    const existing = await ctx.db
      .query("cmsUsers")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", clerkUserId))
      .first();
    const now = Date.now();
    const userData = {
      clerkUserId,
      email,
      name,
      designation,
      role: args.role,
      permissions,
      active: args.active,
      updatedAt: now,
      updatedBy: actor,
    };
    if (existing) {
      await ctx.db.patch(existing._id, userData);
      return existing._id;
    }
    return await ctx.db.insert("cmsUsers", {
      ...userData,
      createdAt: now,
      createdBy: actor,
    });
  },
});

export const removeCmsUser = mutation({
  args: { id: v.id("cmsUsers") },
  handler: async (ctx, { id }) => {
    await requireUserManager(ctx);
    const user = await ctx.db.get(id);
    if (!user) return false;
    await ctx.db.delete(id);
    return true;
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
          v.literal("homepage"),
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
    settings: v.optional(v.any()),
  },
  handler: async (ctx, { modules, settings }) => {
    const userId = await requirePermission(ctx, "content", true);
    if (settings !== undefined) await requirePermission(ctx, "settings", true);
    if (modules.length > 9) throw new Error("Too many content modules.");
    let imported = 0;
    for (const module of modules) {
      const key = `module:${module.key}`;
      const existing = await ctx.db
        .query("siteContent")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();
      if (existing) {
        if (
          existing.type === "site-module" &&
          existing.status === "draft" &&
          existing.createdAt === existing.updatedAt &&
          canonicalJson(existing.content) === canonicalJson(module.content)
        ) {
          await ctx.db.patch(existing._id, {
            status: "published",
            updatedAt: Date.now(),
            updatedBy: userId,
          });
          imported++;
        }
        continue;
      }
      const contentJson = JSON.stringify(module.content);
      if (!contentJson || contentJson.length > 700_000) {
        throw new Error(`Module ${module.key} is too large to import.`);
      }
      await ctx.db.insert("siteContent", {
        key,
        type: "site-module",
        title: module.title,
        status: "published",
        content: module.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: userId,
        updatedBy: userId,
      });
      imported++;
    }
    if (settings !== undefined) {
      const key = "site-settings";
      const existing = await ctx.db
        .query("siteContent")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();
      if (existing) {
        if (
          existing.type === "settings" &&
          existing.status === "draft" &&
          existing.createdAt === existing.updatedAt &&
          canonicalJson(existing.content) === canonicalJson(settings)
        ) {
          await ctx.db.patch(existing._id, {
            status: "published",
            updatedAt: Date.now(),
            updatedBy: userId,
          });
          imported++;
        }
      } else {
        const contentJson = JSON.stringify(settings);
        if (!contentJson || contentJson.length > 700_000) {
          throw new Error("Site settings are too large to import.");
        }
        await ctx.db.insert("siteContent", {
          key,
          type: "settings",
          title: "Site-wide settings",
          status: "published",
          content: settings,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          createdBy: userId,
          updatedBy: userId,
        });
        imported++;
      }
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

export const sitemapEntries = query({
  args: {},
  handler: async (ctx) => {
    const records = await Promise.all(
      ["page", "news", "resource"].map((type) =>
        ctx.db
          .query("siteContent")
          .withIndex("by_type_status", (q) =>
            q.eq("type", type).eq("status", "published"),
          )
          .collect(),
      ),
    );
    return records.flatMap((group) =>
      group.flatMap((record) => {
        if (!record.path) return [];
        const content =
          record.content && typeof record.content === "object"
            ? (record.content as Record<string, unknown>)
            : {};
        if (content.noIndex === true) return [];
        return [{ path: record.path, updatedAt: record.updatedAt }];
      }),
    );
  },
});

export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => await ctx.storage.getUrl(storageId),
});

export const generateUploadUrl = mutation({
  args: {
    purpose: v.union(
      v.literal("pages"),
      v.literal("content"),
      v.literal("media"),
      v.literal("settings"),
    ),
  },
  handler: async (ctx, { purpose }) => {
    await requirePermission(ctx, purpose, true);
    return await ctx.storage.generateUploadUrl();
  },
});

export const inbox = query({
  args: {},
  handler: async (ctx) => {
    await requirePermission(ctx, "inbox");
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
    await requirePermission(ctx, "inbox", true);
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
    await requirePermission(ctx, "inbox", true);
    await ctx.db.patch(id, { status });
  },
});

export const removeSubmission = mutation({
  args: { id: v.id("innovationSubmissions") },
  handler: async (ctx, { id }) => {
    await requirePermission(ctx, "inbox", true);
    await ctx.db.delete(id);
  },
});

export const removeEnquiry = mutation({
  args: { id: v.id("enquiries") },
  handler: async (ctx, { id }) => {
    await requirePermission(ctx, "inbox", true);
    await ctx.db.delete(id);
  },
});

export const removeNewsletterSignup = mutation({
  args: { id: v.id("newsletterSignups") },
  handler: async (ctx, { id }) => {
    await requirePermission(ctx, "inbox", true);
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
    const type = args.type.trim();
    const path = args.path?.trim() || undefined;
    const permission: CmsPermission = type === "settings"
      ? "settings"
      : type === "media"
        ? "media"
        : path || ["page", "news", "resource"].includes(type)
          ? "pages"
          : "content";
    const userId = await requirePermission(ctx, permission, true);
    const key = args.key.trim();
    const title = args.title.trim();

    if (!key || !title || !type) {
      throw new Error("Key, type, and title are required.");
    }
    if (args.status === "published" && ["page", "news", "resource"].includes(type) && !path) {
      throw new Error("Published pages, news, and resource records need a website path.");
    }
    if (path && (!path.startsWith("/") || path.startsWith("//"))) {
      throw new Error("Content paths must be same-site paths beginning with one slash.");
    }
    if (type === "page" && path && !/^(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)+$/.test(path)) {
      throw new Error("Page routes can contain lowercase letters, numbers, and hyphens separated by slashes.");
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
      const previousPermission = recordPermission(record);
      if (previousPermission !== permission) await requirePermission(ctx, previousPermission, true);
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
    const record = await ctx.db.get(id);
    if (!record) return false;
    await requirePermission(ctx, recordPermission(record), true);
    await deleteRemovedStorage(ctx, id, record.content, null);
    await ctx.db.delete(id);
    return true;
  },
});