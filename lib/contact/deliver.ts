import type { ContactConfig } from "./config";
import type { ContactFields } from "./validation";

/**
 * Sends a contact message through the configured provider. Resolves to true
 * only when the provider has accepted the message. Never logs message contents.
 */
export async function deliverContactMessage(
  config: Extract<ContactConfig, { available: true }>,
  fields: ContactFields,
): Promise<boolean> {
  if (config.provider === "mock") {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return config.result === "success";
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: fields.email,
        subject: `MambyTech contact form: ${fields.name}`.slice(0, 150),
        text: `Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}\n\n— Sent from the MambyTech contact form`,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    const body = (await response.json().catch(() => null)) as { id?: unknown } | null;
    if (response.ok && typeof body?.id === "string") return true;
    console.error("[contact] provider rejected message", { provider: "resend", status: response.status });
    return false;
  } catch (error) {
    console.error("[contact] provider request failed", {
      provider: "resend",
      error: error instanceof Error ? error.name : "unknown",
    });
    return false;
  }
}
