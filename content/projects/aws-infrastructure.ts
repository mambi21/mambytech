import type { ProjectInput } from "@/lib/content/schema";
import { needs } from "@/lib/content/owner-input";

/**
 * DRAFT — AWS infrastructure case study.
 *
 * Every `needs(…)` marker is a question only the owner can answer. Replace each
 * one with real details, remove the ownerChecklist items you've resolved, then
 * set `publication: "published"`. The build refuses to publish while any
 * marker remains.
 */
const project: ProjectInput = {
  slug: "aws-infrastructure",
  title: "AWS Three-Tier Infrastructure",
  summary:
    "A three-tier network on AWS: a load balancer in public subnets, application compute and the database in private subnets, and security groups controlling traffic between each tier.",
  problemSummary: needs("One or two sentences: the problem this AWS infrastructure solved."),
  contributionSummary: needs("One or two sentences: what you personally designed and built."),
  category: "Cloud Infrastructure",
  technologies: ["AWS", "VPC"],
  scope: ["VPC design", "Public & private subnets", "Load balancing", "Compute", "Database", "Security"],
  figure: "aws-three-tier",
  status: "unconfirmed",
  publication: "listed",
  featured: true,
  ownerChecklist: [
    "Set `status` to planned, in-progress, completed, maintained or archived.",
    "Add a repository or documentation link if one is public.",
    "List the compute and database services and any IaC tool actually used (e.g. EC2, RDS, Terraform) in `technologies`.",
    "Check the drawn three-tier figure matches the real design (tiers, subnets, load balancer, database), or add your own diagram image.",
  ],
  caseStudy: {
    problem: needs(
      "What problem or goal did this infrastructure address? Who or what needed it, and what constraints applied (budget, security, availability, learning goals)?",
    ),
    role: needs("What was your role? Did you work alone or with others, and which parts did you personally design and build?"),
    architecture: {
      summary: needs(
        "Describe the architecture: which services are involved, how traffic and data flow between them, how networking (VPC, subnets, security groups) and access (IAM) are arranged.",
      ),
    },
    implementation: [
      needs("Step 1 — how you set up the foundation (account, networking, identity)."),
      needs("Step 2 — how you deployed compute, storage or application components."),
      needs("Step 3 — how the infrastructure is provisioned or changed (console, CLI, IaC) and how secrets are handled."),
    ],
    tradeoffs: [
      {
        decision: needs("A design decision you made (e.g. a service or instance choice)."),
        rationale: needs("Why you chose it and what you gave up (cost, complexity, availability)."),
      },
    ],
    verification: [
      needs("How you confirmed it worked: connectivity tests, health checks, access tests, cost checks, or monitoring."),
    ],
    outcomes: [needs("What the result was. Only include measurements you actually recorded.")],
    lessons: [needs("What you learned, and what you would do differently next time.")],
  },
  links: [],
  media: [],
};

export default project;
