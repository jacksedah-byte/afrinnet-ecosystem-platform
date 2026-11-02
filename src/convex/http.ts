import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { hashUnsubscribeToken } from "./lib/unsubscribe";

const http = httpRouter();

http.route({
  path: "/newsletter/unsubscribe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const token = new URL(request.url).searchParams.get("token") ?? "";
    if (/^[\da-f]{64}$/.test(token)) {
      await ctx.runMutation(
        internal.intake.removeNewsletterSignupByToken,
        { tokenHash: await hashUnsubscribeToken(token) },
      );
    }
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  }),
});

export default http;
