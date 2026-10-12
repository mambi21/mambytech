import { beforeEach, describe, expect, it } from "vitest";
import { getContactConfig } from "@/lib/contact/config";
import { clientKey, getClientIp, memoryLimit, resetMemoryLimiter } from "@/lib/contact/rate-limit";
import { checkSpam, validateContact } from "@/lib/contact/validation";

const valid = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello, I would like to talk about a project." };

describe("validateContact", () => {
  it("accepts a valid message and trims fields", () => {
    const result = validateContact({ ...valid, name: "  Ada  " });
    expect(result.ok && result.fields.name).toBe("Ada");
  });

  it("reports an error per invalid field", () => {
    const result = validateContact({ name: "", email: "nope", message: "short" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.fieldErrors).sort()).toEqual(["email", "message", "name"]);
  });

  it("enforces length limits, line breaks and link count", () => {
    expect(validateContact({ ...valid, name: "x".repeat(101) }).ok).toBe(false);
    expect(validateContact({ ...valid, message: "x".repeat(5001) }).ok).toBe(false);
    expect(validateContact({ ...valid, name: "Ada\r\nBcc: x@y.z" }).ok).toBe(false);
    expect(validateContact({ ...valid, email: "a@b.co\nBcc: x@y.z" }).ok).toBe(false);
    expect(validateContact({ ...valid, message: "http://a http://b http://c http://d" }).ok).toBe(false);
  });
});

describe("checkSpam", () => {
  const now = 1_000_000;
  it("flags the honeypot and too-fast submissions", () => {
    expect(checkSpam({ honeypot: "http://spam", startedAt: "" }, now)).toBe("honeypot");
    expect(checkSpam({ honeypot: "", startedAt: String(now - 500) }, now)).toBe("too-fast");
    expect(checkSpam({ honeypot: "", startedAt: "garbage" }, now)).toBe("too-fast");
  });

  it("allows normal and no-JavaScript submissions", () => {
    expect(checkSpam({ honeypot: "", startedAt: String(now - 10_000) }, now)).toBeNull();
    expect(checkSpam({ honeypot: "", startedAt: "" }, now)).toBeNull();
  });
});

describe("memoryLimit", () => {
  beforeEach(() => resetMemoryLimiter());

  it("allows up to the limit within a window, then resets", () => {
    const limit = { max: 2, windowMs: 1000 };
    expect(memoryLimit("k", 0, limit).allowed).toBe(true);
    expect(memoryLimit("k", 10, limit).allowed).toBe(true);
    expect(memoryLimit("k", 20, limit).allowed).toBe(false);
    expect(memoryLimit("k", 1001, limit).allowed).toBe(true);
  });

  it("hashes client keys so raw IPs are not stored", () => {
    expect(clientKey("203.0.113.9", "salt")).not.toContain("203.0.113.9");
  });

  it("prefers Cloudflare's client IP header, then proxy headers", () => {
    const headers = new Headers({ "cf-connecting-ip": "203.0.113.1", "x-forwarded-for": "198.51.100.2, 10.0.0.1" });
    expect(getClientIp(headers)).toBe("203.0.113.1");
    expect(getClientIp(new Headers({ "x-forwarded-for": "198.51.100.2, 10.0.0.1" }))).toBe("198.51.100.2");
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});

describe("getContactConfig", () => {
  it("is unavailable without a provider or with missing credentials", () => {
    expect(getContactConfig({ NODE_ENV: "test" }).available).toBe(false);
    expect(getContactConfig({ NODE_ENV: "test", CONTACT_PROVIDER: "resend", RESEND_API_KEY: "k" }).available).toBe(false);
  });

  it("is available with complete Resend settings", () => {
    const config = getContactConfig({
      NODE_ENV: "production",
      CONTACT_PROVIDER: "resend",
      RESEND_API_KEY: "k",
      CONTACT_TO_EMAIL: "a@b.co",
      CONTACT_FROM_EMAIL: "c@d.co",
    });
    expect(config.available).toBe(true);
  });

  it("refuses the mock provider in production", () => {
    expect(getContactConfig({ NODE_ENV: "production", CONTACT_PROVIDER: "mock" }).available).toBe(false);
    expect(getContactConfig({ NODE_ENV: "development", CONTACT_PROVIDER: "mock" }).available).toBe(true);
  });
});
