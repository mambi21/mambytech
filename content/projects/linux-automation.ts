import type { ProjectInput } from "@/lib/content/schema";
import { needs } from "@/lib/content/owner-input";

/**
 * DRAFT — Linux administration / automation case study.
 *
 * Replace each `needs(…)` marker with real details, resolve the
 * ownerChecklist, then set `publication: "published"`.
 */
const project: ProjectInput = {
  slug: "linux-automation",
  title: "Linux Operations & Automation",
  summary: needs("One or two sentences: which Linux system(s) you administered or automated, and the result."),
  problemSummary: needs("One or two sentences: the manual or error-prone task this addressed."),
  contributionSummary: needs("One or two sentences: what you configured or automated yourself."),
  category: "Linux",
  technologies: ["Linux", needs("Distribution and tools used, e.g. Ubuntu Server, Bash, cron, systemd, Ansible")],
  status: "unconfirmed",
  publication: "draft",
  featured: true,
  ownerChecklist: [
    "Confirm the category — Linux or DevOps.",
    "Set `status` to planned, in-progress, completed, maintained or archived.",
    "Add a repository link if the scripts are public (never include secrets or hostnames).",
  ],
  caseStudy: {
    problem: needs("What manual or error-prone task did this address? Describe the environment (lab, home server, VM, coursework) and constraints."),
    role: needs("What did you personally do? Was this solo or part of a team?"),
    architecture: {
      summary: needs("Describe the systems involved and how the automation runs: scheduled job, service, playbook, or script triggered manually."),
    },
    implementation: [
      needs("Key steps you took to configure the system (users, permissions, packages, services, storage, networking)."),
      needs("How the automation works: the main scripts or playbooks, inputs, and outputs."),
      needs("How you handled errors, logging, and safe re-runs (idempotence)."),
    ],
    tradeoffs: [
      {
        decision: needs("A decision you made, e.g. Bash vs. Ansible, cron vs. systemd timers."),
        rationale: needs("Why, and what you gave up."),
      },
    ],
    verification: [needs("How you tested it: dry runs, test VMs, log review, checks after reboot, or restoring from a backup.")],
    outcomes: [needs("What changed as a result. Only include measurements you actually recorded.")],
    lessons: [needs("What you learned and what you would improve.")],
  },
  links: [],
  media: [],
};

export default project;
