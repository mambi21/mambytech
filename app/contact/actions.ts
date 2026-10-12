"use server";

import { headers } from "next/headers";
import { getContactConfig } from "@/lib/contact/config";
import { deliverContactMessage } from "@/lib/contact/deliver";
import { checkRateLimit, getClientIp } from "@/lib/contact/rate-limit";
import { checkSpam, validateContact, type ContactState } from "@/lib/contact/validation";

const field = (formData: FormData, name: string, max: number) => {
  const value = formData.get(name);
  // Hard cap before validation so oversized payloads are never processed in full.
  return typeof value === "string" ? value.slice(0, max) : "";
};

export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: field(formData, "name", 1_000),
    email: field(formData, "email", 1_000),
    message: field(formData, "message", 20_000),
  };

  const config = getContactConfig();
  if (!config.available) {
    return {
      status: "unavailable",
      message: "The contact form isn't connected to an email service yet, so your message was not sent.",
      values,
    };
  }

  const spam = checkSpam({ honeypot: field(formData, "website", 500), startedAt: field(formData, "startedAt", 30) });
  if (spam) {
    return {
      status: "rejected",
      message:
        spam === "too-fast"
          ? "That was quicker than expected. Please wait a few seconds and send again."
          : "Your message couldn't be sent. Please try again.",
      values,
    };
  }

  const validation = validateContact(values);
  if (!validation.ok) {
    return {
      status: "invalid",
      message: "Please fix the highlighted fields and send again.",
      fieldErrors: validation.fieldErrors,
      values,
    };
  }

  const { allowed } = await checkRateLimit(getClientIp(await headers()));
  if (!allowed) {
    return {
      status: "rate-limited",
      message: "Too many messages have been sent from your connection recently. Please try again in about 10 minutes.",
      values,
    };
  }

  const delivered = await deliverContactMessage(config, validation.fields);
  if (!delivered) {
    return {
      status: "error",
      message: "Your message could not be delivered because the email service returned an error. Nothing was sent — please try again later.",
      values,
    };
  }

  return { status: "success" };
}
