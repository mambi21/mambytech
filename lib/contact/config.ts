/**
 * Contact delivery configuration, read from server-side environment variables.
 * Nothing here is exposed to the browser.
 */
export type ContactConfig =
  | { available: true; provider: "resend"; apiKey: string; to: string; from: string }
  | { available: true; provider: "mock"; result: "success" | "failure" }
  | { available: false; provider: string | null; reason: string };

export function getContactConfig(env: NodeJS.ProcessEnv = process.env): ContactConfig {
  const provider = env.CONTACT_PROVIDER?.trim().toLowerCase() || null;

  if (provider === "resend") {
    const apiKey = env.RESEND_API_KEY?.trim();
    const to = env.CONTACT_TO_EMAIL?.trim();
    const from = env.CONTACT_FROM_EMAIL?.trim();
    if (!apiKey || !to || !from) {
      return {
        available: false,
        provider,
        reason: "RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are required.",
      };
    }
    return { available: true, provider, apiKey, to, from };
  }

  if (provider === "mock") {
    // The mock provider never delivers anything, so production builds refuse it.
    if (env.NODE_ENV === "production") {
      return { available: false, provider, reason: "The mock provider only works in development." };
    }
    return { available: true, provider, result: env.CONTACT_MOCK_RESULT === "failure" ? "failure" : "success" };
  }

  return {
    available: false,
    provider,
    reason: provider ? `Unknown CONTACT_PROVIDER "${provider}".` : "CONTACT_PROVIDER is not set.",
  };
}
