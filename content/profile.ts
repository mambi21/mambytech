import type { ProfileInput } from "@/lib/content/schema";

/**
 * Identity, public links and skills.
 *
 * Edit this file to change the name, tagline, introduction, links or skills.
 * See docs/CONTENT.md for details.
 */
const profile: ProfileInput = {
  name: "Ibrahima Mamby Bah",
  brand: "MambyTech",
  tagline: "Building Infrastructure. Engineering Solutions.",
  role: "Cloud Infrastructure & Linux Engineer",
  focusAreas: ["Cloud Infrastructure", "Linux", "DevOps", "Software Projects"],
  introduction:
    "I design, automate, and troubleshoot reliable infrastructure, from enterprise Linux systems to modern cloud environments. This site documents that work as case studies: the problem, what I built, and how I checked the result.",

  /** The four cards under the hero. `icon` is one of: linux, cloud, automation, reliability. */
  expertise: [
    {
      title: "Linux Engineering",
      icon: "linux",
      description: "Administering and troubleshooting enterprise Linux, from storage to patching.",
      items: ["RHEL", "Ubuntu", "System administration", "Troubleshooting", "Storage", "Patching"],
    },
    {
      title: "AWS Cloud Infrastructure",
      icon: "cloud",
      description: "Designing cloud networks and compute with security and visibility built in.",
      items: ["EC2", "VPC", "IAM", "Networking", "Monitoring", "Cloud architecture"],
    },
    {
      title: "DevOps & Automation",
      icon: "automation",
      description: "Turning repeatable work into code, pipelines, and scripts.",
      items: ["Terraform", "Ansible", "GitHub Actions", "Bash", "Python"],
    },
    {
      title: "Infrastructure Reliability",
      icon: "reliability",
      description: "Keeping systems observable, secure, and fast, and responding when they aren't.",
      items: ["Monitoring", "Incident response", "Security", "Performance optimization"],
    },
  ],

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
   * Skills are grouped by area. Items with `confirmed: false` are suggestions
   * only: they appear (labelled) in preview mode and are hidden in production,
   * and a group with no confirmed items is hidden entirely. Set
   * `confirmed: true` for tools you can demonstrate, and delete the rest.
   */
  skillGroups: [
    {
      area: "Linux & Operating Systems",
      description: "Enterprise Linux administration, storage, patching, and troubleshooting.",
      items: [
        { name: "RHEL", confirmed: true },
        { name: "Ubuntu", confirmed: true },
        { name: "Linux administration", confirmed: true },
        { name: "Storage", confirmed: true },
        { name: "Patching", confirmed: true },
        { name: "Troubleshooting", confirmed: true },
        { name: "systemd", confirmed: false },
        { name: "Permissions & users", confirmed: false },
      ],
    },
    {
      area: "AWS & Cloud",
      description: "Cloud compute, networking, and identity on AWS.",
      items: [
        { name: "AWS", confirmed: true },
        { name: "EC2", confirmed: true },
        { name: "VPC", confirmed: true },
        { name: "IAM", confirmed: true },
        { name: "Cloud architecture", confirmed: true },
        { name: "S3", confirmed: false },
      ],
    },
    {
      area: "Infrastructure as Code",
      description: "Reproducible infrastructure defined and reviewed as code.",
      items: [
        { name: "Terraform", confirmed: true },
        { name: "Infrastructure as Code", confirmed: true },
      ],
    },
    {
      area: "DevOps & CI/CD",
      description: "Pipelines and practices that make changes safe and repeatable.",
      items: [
        { name: "GitHub Actions", confirmed: true },
        { name: "CI/CD", confirmed: true },
        { name: "Monitoring & logging", confirmed: true },
        { name: "Git", confirmed: false },
      ],
    },
    {
      area: "Containers & Kubernetes",
      description: "Packaging and running workloads in containers.",
      items: [
        { name: "Docker", confirmed: true },
        { name: "Kubernetes", confirmed: true },
      ],
    },
    {
      area: "Networking & Security",
      description: "Network design, access control, and hardening.",
      items: [
        { name: "Networking", confirmed: true },
        { name: "Security", confirmed: true },
        { name: "Incident response", confirmed: true },
        { name: "SSH", confirmed: false },
      ],
    },
    {
      area: "Scripting & Automation",
      description: "Automating operational work end to end.",
      items: [
        { name: "Bash", confirmed: true },
        { name: "Python", confirmed: true },
        { name: "Ansible", confirmed: true },
      ],
    },
    {
      area: "Software Development",
      description: "Building applications and tools.",
      items: [
        { name: "Java", confirmed: false },
        { name: "C#", confirmed: false },
        { name: "SQL & database design", confirmed: false },
        { name: "Data structures & algorithms", confirmed: false },
      ],
    },
  ],
};

export default profile;
