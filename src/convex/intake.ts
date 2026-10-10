import { v } from "convex/values";
import { mutation, type MutationCtx } from "./_generated/server";

/**
 * Public intake mutations.
 *
 * Deliberately minimal: create-only, server-side validation, no public read
 * path. Review queues, authentication-gated reads and audit logging arrive
 * with the registry module (platform Phase 2).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: string, max: number) {
  return value.trim().slice(0, max);
}

function assertEmail(email: string) {
  if (!EMAIL_RE.test(email)) throw new Error("Please provide a valid email address.");
}

/** Server-generated reference: AFR-YYYY-XXXXXX (unique within the table). */
async function makeReference(ctx: MutationCtx) {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 6; attempt++) {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    const reference = `AFR-${year}-${suffix}`;
    const existing = await ctx.db
      .query("innovationSubmissions")
      .withIndex("by_reference", (q) => q.eq("reference", reference))
      .first();
    if (!existing) return reference;
  }
  return `AFR-${year}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export const submitInnovation = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const applicantName = clean(args.applicantName, 120);
    const applicantEmail = clean(args.applicantEmail, 200);
    const title = clean(args.title, 200);
    const description = clean(args.description, 4000);

    if (applicantName.length < 2) throw new Error("Please provide your full name.");
    assertEmail(applicantEmail);
    if (title.length < 4) throw new Error("Please provide the innovation title.");
    if (description.length < 40)
      throw new Error("Please provide a non-confidential description of at least 40 characters.");
    if (!args.category) throw new Error("Please select a category.");
    if (!args.stage) throw new Error("Please select a development stage.");
    if (!args.consent) throw new Error("Consent is required before a submission can be recorded.");

    const reference = await makeReference(ctx);

    await ctx.db.insert("innovationSubmissions", {
      reference,
      createdAt: Date.now(),
      applicantName,
      applicantEmail,
      organisation: args.organisation ? clean(args.organisation, 200) : undefined,
      role: args.role ? clean(args.role, 120) : undefined,
      title,
      description,
      category: clean(args.category, 80),
      stage: clean(args.stage, 80),
      institutionType: args.institutionType ? clean(args.institutionType, 80) : undefined,
      ipAwareness: args.ipAwareness ? clean(args.ipAwareness, 80) : undefined,
      supportNeeds: args.supportNeeds ? clean(args.supportNeeds, 1500) : undefined,
      documentsNote: args.documentsNote ? clean(args.documentsNote, 400) : undefined,
      consent: true,
      status: "received",
    });

    return { reference };
  },
});

export const sendEnquiry = mutation({
  args: {
    type: v.string(),
    name: v.string(),
    email: v.string(),
    organisation: v.optional(v.string()),
    subject: v.optional(v.string()),
    message: v.string(),
    consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const name = clean(args.name, 120);
    const email = clean(args.email, 200);
    const message = clean(args.message, 4000);

    if (!args.type) throw new Error("Please choose an enquiry type.");
    if (name.length < 2) throw new Error("Please provide your name.");
    assertEmail(email);
    if (message.length < 20) throw new Error("Please provide a message of at least 20 characters.");
    if (!args.consent) throw new Error("Consent is required before a message can be sent.");

    await ctx.db.insert("enquiries", {
      createdAt: Date.now(),
      type: clean(args.type, 60),
      name,
      email,
      organisation: args.organisation ? clean(args.organisation, 200) : undefined,
      subject: args.subject ? clean(args.subject, 200) : undefined,
      message,
      consent: true,
      status: "received",
    });

    return { ok: true as const };
  },
});

export const subscribeNewsletter = mutation({
  args: {
    email: v.string(),
    consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const email = clean(args.email, 200).toLowerCase();
    assertEmail(email);
    if (!args.consent)
      throw new Error("Please confirm you consent to receiving AFRINNET updates.");

    const existing = await ctx.db
      .query("newsletterSignups")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existing) return { ok: true as const, alreadySubscribed: true };

    await ctx.db.insert("newsletterSignups", {
      createdAt: Date.now(),
      email,
      consent: true,
    });

    return { ok: true as const, alreadySubscribed: false };
  },
});
