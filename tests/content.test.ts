import { describe, expect, it } from "vitest";
import awsProject from "@/content/projects/aws-infrastructure";
import { containsOwnerInput, listOwnerInput, needs, splitOwnerInput } from "@/lib/content/owner-input";
import { projectSchema } from "@/lib/content/schema";

describe("owner-input markers", () => {
  it("round-trips markers through split and list", () => {
    const text = `Before ${needs("first")} middle ${needs("second")}`;
    expect(listOwnerInput({ a: [text] })).toEqual(["first", "second"]);
    expect(splitOwnerInput(text).map((s) => s.type)).toEqual(["text", "owner-input", "text", "owner-input"]);
    expect(containsOwnerInput("plain text")).toBe(false);
  });
});

describe("project schema", () => {
  it("accepts the draft projects", () => {
    expect(projectSchema.safeParse(awsProject).success).toBe(true);
  });

  it("refuses to publish a project that still needs owner input", () => {
    const result = projectSchema.safeParse({ ...awsProject, publication: "published" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message).join(" ")).toMatch(/owner-input markers/);
  });

  it("publishes complete projects and rejects insecure links", () => {
    const complete = {
      ...awsProject,
      summary: "A summary.",
      problemSummary: "The problem.",
      contributionSummary: "What I did.",
      technologies: ["AWS"],
      status: "completed",
      publication: "published",
      ownerChecklist: [],
      caseStudy: {
        problem: "p",
        role: "r",
        architecture: { summary: "a" },
        implementation: ["i"],
        tradeoffs: [{ decision: "d", rationale: "r" }],
        verification: ["v"],
        outcomes: ["o"],
        lessons: ["l"],
      },
    };
    expect(projectSchema.safeParse(complete).success).toBe(true);
    const insecure = { ...complete, links: [{ label: "Repo", href: "http://example.com", kind: "repository" }] };
    expect(projectSchema.safeParse(insecure).success).toBe(false);
  });
});
