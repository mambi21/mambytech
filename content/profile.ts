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
  focusAreas: ["Cloud Infrastructure", "Linux", "DevOps", "Software Projects"],
  introduction:
    "I work on cloud infrastructure, Linux systems, automation, and software. This site documents that work as case studies: the problem, what I built, the tradeoffs I made, and how I checked the result.",

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
   * Skills are grouped by focus area. Items with `confirmed: false` are
   * suggestions only: they appear (labelled) in preview mode and are hidden in
   * production. Set `confirmed: true` for tools you can demonstrate, and delete
   * the ones that don't apply.
   */
  skillGroups: [
    {
      area: "Cloud Infrastructure",
      description: "Cloud networking, compute, storage, and identity, designed to be reproducible and secure.",
      items: [
        { name: "AWS", confirmed: false },
        { name: "VPC networking", confirmed: false },
        { name: "IAM", confirmed: false },
        { name: "EC2", confirmed: false },
        { name: "S3", confirmed: false },
        { name: "Infrastructure as Code", confirmed: false },
      ],
    },
    {
      area: "Linux",
      description: "Administering Linux systems: users, services, storage, networking, and hardening.",
      items: [
        { name: "Linux administration", confirmed: false },
        { name: "Bash scripting", confirmed: false },
        { name: "systemd", confirmed: false },
        { name: "SSH", confirmed: false },
        { name: "Permissions & users", confirmed: false },
      ],
    },
    {
      area: "DevOps",
      description: "Automation, version control, and delivery pipelines that make changes safe and repeatable.",
      items: [
        { name: "Git", confirmed: false },
        { name: "CI/CD", confirmed: false },
        { name: "Docker", confirmed: false },
        { name: "Monitoring & logging", confirmed: false },
      ],
    },
    {
      area: "Software Projects",
      description: "Building applications and tools, from data modelling to user-facing interfaces.",
      items: [
        { name: "Python", confirmed: false },
        { name: "Java", confirmed: false },
        { name: "C#", confirmed: false },
        { name: "SQL & database design", confirmed: false },
        { name: "Data structures & algorithms", confirmed: false },
      ],
    },
  ],
};

export default profile;
