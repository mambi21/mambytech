import type { ProjectInput } from "@/lib/content/schema";
import { needs } from "@/lib/content/owner-input";

/**
 * LISTED — CI/CD pipeline.
 *
 * Shown in the showcase with its title, summary, scope and tools. The stage
 * order in the figure is a standard design built from the tools used; check
 * it against the real pipeline. Replace each `needs(…)` marker, resolve the
 * ownerChecklist, then set `publication: "published"` for the full case study.
 */
const project: ProjectInput = {
  slug: "cicd-pipeline",
  title: "CI/CD Pipeline: GitOps to EKS",
  summary:
    "A GitOps pipeline design: Jenkins CI with a SonarQube gate and Trivy image scans, one versioned build promoted by Argo CD and Helm from staging to production on EKS, monitoring with rollback, and Terraform plan/apply.",
  problemSummary: needs("One or two sentences: what releasing looked like before this pipeline, and what had to improve."),
  contributionSummary: needs("One or two sentences: which parts of the pipeline you designed, built, and maintain."),
  category: "DevOps",
  technologies: ["GitHub", "Jenkins", "SonarQube", "Nexus", "Docker", "Trivy", "Amazon ECR", "Helm", "Argo CD", "Amazon EKS", "Amazon EC2", "Terraform", "Amazon S3", "IAM", "Prometheus", "Grafana"],
  scope: [
    "Pull-request checks",
    "Quality gate",
    "Versioned builds & image scanning",
    "GitOps delivery",
    "Staging → production promotion",
    "Approval gates",
    "Rolling deploys & rollback",
    "Infrastructure pipeline",
  ],
  figure: "cicd-pipeline",
  status: "unconfirmed",
  publication: "listed",
  featured: true,
  ownerChecklist: [
    "The figure is a best-practice design built from your tools. Before publishing the case study, make sure it describes what you actually run (or label the parts that are a target design).",
    "Set `status` honestly — planned, in-progress, completed, maintained or archived.",
    "Add a repository link only if the pipeline code is public (never include credentials or internal hostnames).",
  ],
  caseStudy: {
    problem: needs("What problem did the pipeline solve? How were builds and releases done before, and what went wrong?"),
    role: needs("Your role: did you design the pipeline, build it, maintain it? Solo or with a team?"),
    architecture: {
      summary: needs("How the pipeline is structured: the Jenkinsfile stages, how SonarQube, Nexus and ECR fit in, and how deployments reach EKS and EC2."),
    },
    implementation: [
      needs("How builds are triggered and run (webhooks, agents, Jenkinsfile)."),
      needs("How quality gates and artifact versioning work."),
      needs("How deployments to EKS and EC2 are done, and how rollbacks work."),
    ],
    tradeoffs: [
      {
        decision: needs("An important design choice, e.g. Jenkins over a hosted CI, or Nexus alongside ECR."),
        rationale: needs("Why you made it and what it cost."),
      },
    ],
    verification: [needs("How you know the pipeline works: test results, quality gate history, deployment checks, Prometheus alerts.")],
    outcomes: [needs("What changed after the pipeline was in place. Only include real figures.")],
    lessons: [needs("What you learned building and running it.")],
  },
  links: [],
  media: [],
};

export default project;
