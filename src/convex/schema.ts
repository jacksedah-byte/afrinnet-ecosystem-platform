import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

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
