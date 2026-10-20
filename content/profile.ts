import type { ProfileInput } from "@/lib/content/schema";

/** The profile URL supplied by Ibrahima. Validated as a direct LinkedIn profile at build time. */
export const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/ibrahima-bah-52a079203/";

/** Identity, public links and the four areas represented in the portfolio. */
const profile: ProfileInput = {
  name: "Ibrahima Mamby Bah",
  brand: "MambyTech",
  role: "Cloud Infrastructure & Linux Engineer",
  eyebrow: "Cloud Engineering · Technology · Leadership",
  headline: "Engineering the Cloud.",
  headlineAccent: "Building What’s Next.",
  introduction:
    "Engineer at Amazon Web Services. Co-Founder & CTO of Glomaf. Working across cloud infrastructure, Linux, DevOps, security, and platform engineering to build reliable technology that makes an impact.",
  specialties: ["Cloud Infrastructure", "DevOps Engineering", "Linux Engineering", "DevSecOps", "Platform Engineering"],
  journey: [
    {
      symbol: "☁️",
      kicker: "Engineering",
      title: "Engineer at AWS",
      text: "Engineering & Building the Infrastructure Behind Amazon Web Services.",
      organization: "Amazon Web Services",
      tone: "green",
    },
    {
      symbol: "🚀",
      kicker: "Entrepreneurship",
      title: "Co-Founder & CTO",
      text: "Leading the technology, product development, and engineering vision at Glomaf.",
      organization: "Glomaf",
      tone: "gold",
    },
  ],
  links: {
    github: undefined,
    linkedin: LINKEDIN_PROFILE_URL ? { label: "LinkedIn", href: LINKEDIN_PROFILE_URL } : undefined,
  },
  capabilities: [
    {
      area: "Linux Administration & Automation",
      summary: "Enterprise Linux administration, troubleshooting, and repeatable system maintenance.",
      tools: [
        { name: "RHEL", confirmed: true },
        { name: "Ubuntu", confirmed: true },
        { name: "Bash", confirmed: true },
        { name: "Ansible", confirmed: true },
      ],
    },
    {
      area: "AWS Infrastructure & Networking",
      summary: "Cloud environments with controlled network access, load balancing, and reliable operations.",
      tools: [
        { name: "VPC", confirmed: true },
        { name: "EC2", confirmed: true },
        { name: "IAM", confirmed: true },
        { name: "ALB/ELB", confirmed: true },
        { name: "Terraform", confirmed: true },
      ],
    },
    {
      area: "CI/CD & Container Platforms",
      summary: "Build and delivery workflows, container platforms, and infrastructure as code.",
      tools: [
        { name: "Jenkins", confirmed: true },
        { name: "Docker", confirmed: true },
        { name: "Kubernetes", confirmed: true },
        { name: "Helm", confirmed: true },
        { name: "Argo CD", confirmed: true },
      ],
    },
    {
      area: "Software & Product Engineering",
      summary: "Web and mobile product development, from application architecture to user experience.",
      tools: [
        { name: "Next.js", confirmed: true },
        { name: "React Native", confirmed: true },
        { name: "Expo", confirmed: true },
        { name: "Supabase", confirmed: true },
      ],
    },
  ],
};

export default profile;
