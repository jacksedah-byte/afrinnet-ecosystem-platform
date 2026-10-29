import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const cmsSectionValidator = v.union(
  v.object({
    id: v.string(),
    type: v.literal("hero"),
    eyebrow: v.optional(v.string()),
    heading: v.string(),
    body: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageAlt: v.optional(v.string()),
    primaryLabel: v.optional(v.string()),
    primaryHref: v.optional(v.string()),
    secondaryLabel: v.optional(v.string()),
    secondaryHref: v.optional(v.string()),
  }),
  v.object({
    id: v.string(),
    type: v.literal("text"),
    heading: v.optional(v.string()),
    body: v.string(),
  }),
  v.object({
    id: v.string(),
    type: v.literal("image"),
    imageUrl: v.string(),
    imageAlt: v.string(),
    caption: v.optional(v.string()),
  }),
  v.object({
    id: v.string(),
    type: v.literal("features"),
    heading: v.optional(v.string()),
    items: v.array(v.object({ title: v.string(), body: v.string() })),
  }),
  v.object({
    id: v.string(),
    type: v.literal("cta"),
    heading: v.string(),
    body: v.optional(v.string()),
    buttonLabel: v.string(),
    buttonHref: v.string(),
  }),
);

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // add other tables here

    // Public intake: innovation submissions received through the website.
    // Not publicly readable — review access is added with the registry module.
    innovationSubmissions: defineTable({
      reference: v.string(),
      createdAt: v.number(),
      applicantName: v.string(),
      applicantEmail: v.string(),
      organisation: v.optional(v.string()),
      role: v.optional(v.string()),
      title: v.string(),
      description: v.string(),
      category: v.string(),
      stage: v.string(),
      institutionType: v.optional(v.string()),
      ipAwareness: v.optional(v.string()),
      supportNeeds: v.optional(v.string()),
      documentsNote: v.optional(v.string()),
      consent: v.boolean(),
      status: v.string(),
    }).index("by_reference", ["reference"]),

    // Categorized enquiries from the contact / partnership / IP support forms.
    enquiries: defineTable({
      createdAt: v.number(),
      type: v.string(),
      name: v.string(),
      email: v.string(),
      organisation: v.optional(v.string()),
      subject: v.optional(v.string()),
      message: v.string(),
      consent: v.boolean(),
      status: v.string(),
    }).index("by_created", ["createdAt"]),

    // Newsletter sign-ups with recorded consent.
    newsletterSignups: defineTable({
      createdAt: v.number(),
      email: v.string(),
      consent: v.boolean(),
    }).index("by_email", ["email"]),

    cmsAdmins: defineTable({
      subject: v.string(),
      email: v.optional(v.string()),
      createdAt: v.number(),
      createdBy: v.string(),
    }).index("by_subject", ["subject"]),

    cmsContent: defineTable({
      type: v.string(),
      slug: v.string(),
      path: v.optional(v.string()),
      title: v.string(),
      summary: v.optional(v.string()),
      body: v.string(),
      sections: v.optional(v.array(cmsSectionValidator)),
      published: v.boolean(),
      updatedAt: v.number(),
      updatedBy: v.string(),
    })
      .index("by_type", ["type"])
      .index("by_type_slug", ["type", "slug"])
      .index("by_path", ["path"]),

    cmsMedia: defineTable({
      storageId: v.id("_storage"),
      fileName: v.string(),
      contentType: v.string(),
      size: v.number(),
      altText: v.string(),
      createdAt: v.number(),
      createdBy: v.string(),
    }).index("by_created", ["createdAt"]),

    // tableName: defineTable({
    //   ...
    //   // table fields
    // }).index("by_field", ["field"])
  },
  {
    schemaValidation: false,
  },
);

export default schema;
