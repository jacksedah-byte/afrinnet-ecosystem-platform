import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";
import {
  enquiryArgs,
  innovationArgs,
  newsletterArgs,
} from "./intake";
import { hashUnsubscribeToken } from "./lib/unsubscribe";

type EmailNotice = "sent" | "not_configured" | "failed" | "not_needed";

function clean(value: string, max: number) {
  return value.trim().slice(0, max);
}

function emailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.AFRINNET_FROM_EMAIL;
  if (!apiKey || !sender) return null;
  return { apiKey, sender };
}

async function deliverEmail(
  to: string,
  subject: string,
  text: string,
  headers?: Record<string, string>,
): Promise<EmailNotice> {
  const config = emailConfiguration();
  if (!config) return "not_configured";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.sender,
        to: [to],
        subject,
        text,
        headers,
      }),
    });
    if (!response.ok) {
      console.error("[intake] Email notification rejected by provider", {
        status: response.status,
      });
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("[intake] Email notification request failed", error);
    return "failed";
  }
}

async function notifyInbox(subject: string, text: string): Promise<EmailNotice> {
  const config = emailConfiguration();
  const recipient = process.env.AFRINNET_NOTIFICATION_EMAIL;
  if (!config || !recipient) return "not_configured";
  return deliverEmail(recipient, subject, text);
}

function makeUnsubscribeToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function unsubscribeUrls(token: string) {
  const siteOrigin = process.env.AFRINNET_SITE_URL;
  if (!siteOrigin) return null;
  const siteUrl = new URL(siteOrigin);
  if (
    siteUrl.protocol !== "https:" ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash ||
    siteUrl.username ||
    siteUrl.password
  ) {
    throw new Error("AFRINNET_SITE_URL must be a secure HTTPS origin.");
  }
  const pageUrl = new URL("/unsubscribe", siteUrl);
  pageUrl.searchParams.set("token", token);
  const convexSiteOrigin =
    process.env.AFRINNET_CONVEX_SITE_URL ?? process.env.CONVEX_SITE_URL;
  let oneClickUrl: URL | undefined;
  if (convexSiteOrigin) {
    const convexSiteUrl = new URL(convexSiteOrigin);
    if (
      convexSiteUrl.protocol !== "https:" ||
      convexSiteUrl.pathname !== "/" ||
      convexSiteUrl.search ||
      convexSiteUrl.hash ||
      convexSiteUrl.username ||
      convexSiteUrl.password
    ) {
      throw new Error("Convex HTTP Actions URL must be a secure HTTPS origin.");
    }
    oneClickUrl = new URL("/newsletter/unsubscribe", convexSiteUrl);
    oneClickUrl.searchParams.set("token", token);
  }
  return { pageUrl, oneClickUrl };
}

export const submitInnovation = action({
  args: innovationArgs,
  handler: async (
    ctx,
    args,
  ): Promise<{ reference: string; emailNotice: EmailNotice }> => {
    const saved = await ctx.runMutation(
      internal.intake.recordInnovationSubmission,
      args,
    );
    const emailNotice = await notifyInbox(
      `New AFRINNET innovation submission: ${saved.reference}`,
      `A new innovation submission has been saved in the AFRINNET CMS inbox.\nReference: ${saved.reference}\nReview it at ${process.env.AFRINNET_SITE_URL ?? "https://afrinnet.org"}/cms.`,
    );
    return { ...saved, emailNotice };
  },
});

export const sendEnquiry = action({
  args: enquiryArgs,
  handler: async (
    ctx,
    args,
  ): Promise<{ ok: true; emailNotice: EmailNotice }> => {
    const saved = await ctx.runMutation(internal.intake.recordEnquiry, args);
    const emailNotice = await notifyInbox(
      `New AFRINNET enquiry: ${clean(args.type, 60)}`,
      `A new enquiry has been saved in the AFRINNET CMS inbox.\nType: ${clean(args.type, 60)}\nReview it at ${process.env.AFRINNET_SITE_URL ?? "https://afrinnet.org"}/cms.`,
    );
    return { ...saved, emailNotice };
  },
});

export const subscribeNewsletter = action({
  args: newsletterArgs,
  handler: async (
    ctx,
    args,
  ): Promise<{
    ok: true;
    alreadySubscribed: boolean;
    emailNotice: EmailNotice;
    confirmationEmail: EmailNotice;
  }> => {
    const token = makeUnsubscribeToken();
    const saved = await ctx.runMutation(
      internal.intake.recordNewsletterSignup,
      {
        ...args,
        unsubscribeTokenHash: await hashUnsubscribeToken(token),
      },
    );
    const emailNotice = saved.alreadySubscribed
      ? "not_needed"
      : await notifyInbox(
          "New AFRINNET newsletter signup",
          "A new newsletter signup has been saved in the AFRINNET CMS inbox.",
        );
    let confirmationEmail: EmailNotice = "not_needed";
    if (saved.unsubscribeTokenUpdated) {
      try {
        const urls = unsubscribeUrls(token);
        confirmationEmail = urls
          ? await deliverEmail(
              args.email.trim(),
              "Confirm your AFRINNET updates signup",
              `Your email address was added to the AFRINNET updates list. Newsletter campaigns are not being sent yet.\n\nTo remove your address from the list, use this secure link:\n${urls.pageUrl.toString()}\n\nIf you did not sign up, you can use the same link to remove the address.`,
              urls.oneClickUrl
                ? {
                    "List-Unsubscribe": `<${urls.oneClickUrl.toString()}>`,
                    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                  }
                : undefined,
            )
          : "not_configured";
      } catch (error) {
        console.error("[intake] Could not create newsletter unsubscribe URLs", error);
        confirmationEmail = "failed";
      }
    }
    return { ...saved, emailNotice, confirmationEmail };
  },
});

export const unsubscribeNewsletter = action({
  args: { token: v.string() },
  handler: async (ctx, { token }): Promise<{ removed: boolean }> => {
    if (!/^[\da-f]{64}$/.test(token)) return { removed: false };
    const removed = await ctx.runMutation(
      internal.intake.removeNewsletterSignupByToken,
      { tokenHash: await hashUnsubscribeToken(token) },
    );
    return { removed };
  },
});
