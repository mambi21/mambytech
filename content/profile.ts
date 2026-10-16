import type { ProfileInput } from "@/lib/content/schema";

/**
 * Identity, public links and capabilities.
 *
 * Edit this file to change the name, headline, introduction, links or the
 * capabilities index. See docs/CONTENT.md for details.
 */
const profile: ProfileInput = {
  name: "Ibrahima Mamby Bah",
  brand: "MambyTech",
  tagline: "Building Infrastructure. Engineering Solutions.",
  role: "Cloud Infrastructure & Linux Engineer",
  headline: "Engineering the systems behind what works.",
  focusAreas: ["Cloud Infrastructure", "Linux", "DevOps", "Software Projects"],
  introduction:
    "I’m Ibrahima Mamby Bah, a Cloud Infrastructure & Linux Engineer focused on building, automating, and maintaining reliable systems.",

  /**
   * Public profiles. Leave a link undefined until it is confirmed — unset
   * links are hidden everywhere on the site. Example:
   *   github: { label: "GitHub", href: "https://github.com/your-username" },
   */
  links: {
    github: undefined,
    linkedin: undefined,
  },

  /**
   * The capabilities index, in display order. `summary` says what you do in
   * that area; `evidence` lists project slugs that show it (links appear only
   * for projects visible in the showcase). Tools with `confirmed: false` are
   * suggestions only: shown (labelled) in preview mode, hidden in production.
   */
  capabilities: [
    {
      area: "Linux engineering",
      summary: "Administering, patching, and troubleshooting enterprise Linux, from storage to system configuration.",
      tools: [
        { name: "RHEL", confirmed: true },
        { name: "Ubuntu", confirmed: true },
        { name: "Storage", confirmed: true },
        { name: "Patching", confirmed: true },
        { name: "systemd", confirmed: false },
        { name: "SSH", confirmed: false },
      ],
      evidence: ["linux-automation"],
    },
    {
      area: "AWS cloud infrastructure",
      summary: "Designing AWS networks and compute: VPCs with public and private subnets, load balancing, identity, and monitoring.",
      tools: [
        { name: "EC2", confirmed: true },
        { name: "VPC", confirmed: true },
        { name: "IAM", confirmed: true },
        { name: "S3", confirmed: false },
      ],
      evidence: ["aws-infrastructure"],
    },
    {
      area: "Infrastructure as code",
      summary: "Defining infrastructure in code so environments can be reviewed, reproduced, and changed safely.",
      tools: [{ name: "Terraform", confirmed: true }],
      evidence: [],
    },
    {
      area: "Automation & CI/CD",
      summary: "Turning routine operations into scripts and playbooks, and shipping changes through pipelines.",
      tools: [
        { name: "Ansible", confirmed: true },
        { name: "Bash", confirmed: true },
        { name: "Python", confirmed: true },
        { name: "GitHub Actions", confirmed: true },
        { name: "Git", confirmed: false },
      ],
      evidence: ["linux-automation"],
    },
    {
      area: "Networking & security",
      summary: "Segmenting networks, controlling access between tiers, and hardening what is exposed.",
      tools: [
        { name: "Networking", confirmed: true },
        { name: "Security", confirmed: true },
      ],
      evidence: ["aws-infrastructure"],
    },
    {
      area: "Reliability",
      summary: "Keeping systems observable and fast, and responding when they aren’t.",
      tools: [
        { name: "Monitoring & logging", confirmed: true },
        { name: "Incident response", confirmed: true },
        { name: "Performance optimization", confirmed: true },
      ],
      evidence: [],
    },
    {
      area: "Containers",
      summary: "Packaging and running workloads in containers.",
      tools: [
        { name: "Docker", confirmed: true },
        { name: "Kubernetes", confirmed: true },
      ],
      evidence: [],
    },
    {
      area: "Product engineering",
      summary: "Building full-stack products: web and mobile clients on a managed backend.",
      tools: [
        { name: "Next.js", confirmed: true },
        { name: "React Native", confirmed: true },
        { name: "Expo", confirmed: true },
        { name: "Supabase", confirmed: true },
        { name: "Java", confirmed: false },
        { name: "C#", confirmed: false },
        { name: "SQL & database design", confirmed: false },
      ],
      evidence: ["glomaf"],
    },
  ],
};

export default profile;
