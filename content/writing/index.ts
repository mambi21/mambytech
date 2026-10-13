import type { WritingInput } from "@/lib/content/schema";
import { needs } from "@/lib/content/owner-input";

/**
 * Blog posts (see docs/CONTENT.md). Drafts appear only in preview mode. The
 * Blog page, its navigation link and the home-page section appear once at
 * least one post is published. A published post needs its real
 * `publishedOn` date and no `needs(…)` markers.
 *
 * The drafts below are topic ideas: write each body from your own experience.
 */
const writing: WritingInput[] = [
  {
    slug: "rhel-production-patching",
    title: "Patching RHEL 8 and 9 in production",
    summary: "Planning, staging, and verifying operating-system updates on production Red Hat Enterprise Linux servers.",
    category: "Linux",
    publication: "draft",
    body: [
      { type: "paragraph", text: needs("How you plan a patch cycle: inventory, change windows, and what gets tested first.") },
      { type: "paragraph", text: needs("The commands and checks you rely on (e.g. dnf, needs-restarting, rollback options) and how you verify success.") },
    ],
  },
  {
    slug: "troubleshooting-unreachable-ec2",
    title: "Troubleshooting an unreachable EC2 instance",
    summary: "A step-by-step approach to diagnosing an EC2 instance you can no longer connect to.",
    category: "AWS",
    publication: "draft",
    body: [
      { type: "paragraph", text: needs("The symptoms and the first things you check: status checks, security groups, route tables, network ACLs.") },
      { type: "paragraph", text: needs("Recovery options you've used, such as the serial console, Systems Manager, or attaching the volume to another instance.") },
    ],
  },
  {
    slug: "terraform-drift-and-state",
    title: "Terraform drift and state management",
    summary: "Detecting configuration drift and keeping Terraform state safe, shared, and recoverable.",
    category: "Infrastructure as Code",
    publication: "draft",
    body: [
      { type: "paragraph", text: needs("How drift happens in practice and how you detect it (plan, refresh-only).") },
      { type: "paragraph", text: needs("How you store and lock state, and how you recover from a state problem.") },
    ],
  },
  {
    slug: "linux-automation-with-ansible",
    title: "Linux automation with Ansible",
    summary: "Using Ansible playbooks to make routine Linux administration repeatable and safe to re-run.",
    category: "Automation",
    publication: "draft",
    body: [
      { type: "paragraph", text: needs("A task you automated with Ansible and why it was worth automating.") },
      { type: "paragraph", text: needs("How the playbook is structured, and how you keep it idempotent and tested.") },
    ],
  },
  {
    slug: "building-secure-aws-infrastructure",
    title: "Building secure AWS infrastructure",
    summary: "Practical defaults for network isolation, identity, and visibility when building on AWS.",
    category: "AWS",
    publication: "draft",
    body: [
      { type: "paragraph", text: needs("The security defaults you apply: private subnets, least-privilege IAM, security groups.") },
      { type: "paragraph", text: needs("How you monitor and audit the environment once it's running.") },
    ],
  },
];

export default writing;
