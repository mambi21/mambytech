import { describe, expect, it } from "vitest";
import awsProject from "@/content/projects/aws-infrastructure";
import { containsOwnerInput, listOwnerInput, needs, splitOwnerInput } from "@/lib/content/owner-input";
import { linkedinProfileUrlSchema, projectSchema } from "@/lib/content/schema";

describe("owner-input markers", () => {
  it("round-trips markers through split and list", () => {
    const text = `Before ${needs("first")} middle ${needs("second")}`;
    expect(listOwnerInput({ a: [text] })).toEqual(["first", "second"]);
    expect(splitOwnerInput(text).map((s) => s.type)).toEqual(["text", "owner-input", "text", "owner-input"]);
    expect(containsOwnerInput("plain text")).toBe(false);
  });
});

describe("project schema", () => {
  it("accepts the published projects", () => {
    expect(projectSchema.safeParse(awsProject).success).toBe(true);
  });

  it("refuses to publish a project that still needs owner input", () => {
    const result = projectSchema.safeParse({ ...awsProject, contribution: needs("what I did") });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message).join(" ")).toMatch(/owner-input markers/);
  });

  it("allows placeholders in drafts and rejects insecure links", () => {
    expect(projectSchema.safeParse({ ...awsProject, publication: "draft", contribution: needs("what I did") }).success).toBe(true);
    const insecure = { ...awsProject, links: [{ label: "Repo", href: "http://example.com", kind: "repository" }] };
    expect(projectSchema.safeParse(insecure).success).toBe(false);
  });
});

describe("LinkedIn profile URL", () => {
  it("accepts a direct https profile link only", () => {
    expect(linkedinProfileUrlSchema.safeParse("https://www.linkedin.com/in/ibrahima-bah-52a079203/").success).toBe(true);
    expect(linkedinProfileUrlSchema.safeParse("http://www.linkedin.com/in/someone/").success).toBe(false);
    expect(linkedinProfileUrlSchema.safeParse("https://www.linkedin.com/company/someone/").success).toBe(false);
    expect(linkedinProfileUrlSchema.safeParse("https://linkedin.example.com/in/someone/").success).toBe(false);
  });
});
