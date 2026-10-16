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
      summary: "Building, hardening, patching, and tuning RHEL, CentOS, and Ubuntu systems, from storage and services to the web servers they run.",
      tools: [
        { name: "RHEL", confirmed: true },
        { name: "CentOS", confirmed: true },
        { name: "Ubuntu", confirmed: true },
        { name: "LVM", confirmed: true },
        { name: "systemd", confirmed: true },
        { name: "Patching", confirmed: true },
        { name: "Performance tuning", confirmed: true },
        { name: "Apache", confirmed: true },
        { name: "Nginx", confirmed: true },
      ],
      evidence: ["linux-automation"],
    },
    {
      area: "AWS cloud infrastructure",
      summary: "Designing secure, highly available AWS environments: VPCs with custom routing, load balancing and auto scaling, multi-account setups, and identity.",
      tools: [
        { name: "VPC", confirmed: true },
        { name: "EC2", confirmed: true },
        { name: "ALB/ELB", confirmed: true },
        { name: "Auto Scaling", confirmed: true },
        { name: "RDS", confirmed: true },
        { name: "S3", confirmed: true },
        { name: "EBS", confirmed: true },
        { name: "ECR", confirmed: true },
        { name: "IAM", confirmed: true },
        { name: "Route 53", confirmed: true },
      ],
      evidence: ["aws-infrastructure"],
    },
    {
      area: "Infrastructure as code",
      summary: "Provisioning environments with Terraform modules, so they can be reviewed, repeated, and kept consistent.",
      tools: [{ name: "Terraform", confirmed: true }],
      evidence: ["cicd-pipeline"],
    },
    {
      area: "Containers & Kubernetes",
      summary: "Packaging workloads with Docker and running them on Kubernetes, including EKS clusters with self-managed nodes: deployments, services, ingress, upgrades, and troubleshooting.",
      tools: [
        { name: "Docker", confirmed: true },
        { name: "Kubernetes", confirmed: true },
        { name: "EKS", confirmed: true },
      ],
      evidence: ["cicd-pipeline"],
    },
    {
      area: "CI/CD & automation",
      summary: "Building delivery pipelines with code-quality and artifact stages, and automating configuration and maintenance.",
      tools: [
        { name: "Jenkins", confirmed: true },
        { name: "GitHub", confirmed: true },
        { name: "GitHub Actions", confirmed: true },
        { name: "SonarQube", confirmed: true },
        { name: "Nexus", confirmed: true },
        { name: "Ansible", confirmed: true },
        { name: "Bash", confirmed: true },
      ],
      evidence: ["linux-automation", "cicd-pipeline"],
    },
    {
      area: "Networking & security",
      summary: "Segmenting networks and controlling traffic between tiers, from protocols and VLANs to security groups, NACLs, firewalls, and TLS.",
      tools: [
        { name: "TCP/IP", confirmed: true },
        { name: "HTTP", confirmed: true },
        { name: "SSH", confirmed: true },
        { name: "VLANs", confirmed: true },
        { name: "Security groups", confirmed: true },
        { name: "NACLs", confirmed: true },
        { name: "Firewalls", confirmed: true },
        { name: "SSL/TLS", confirmed: true },
      ],
      evidence: ["aws-infrastructure"],
    },
    {
      area: "Monitoring & reliability",
      summary: "Watching system and cloud performance through metrics, dashboards, and logs, and resolving incidents with clear runbooks.",
      tools: [
        { name: "Prometheus", confirmed: true },
        { name: "Grafana", confirmed: true },
        { name: "CloudWatch", confirmed: true },
        { name: "CloudTrail", confirmed: true },
        { name: "Incident response", confirmed: true },
      ],
      evidence: ["cicd-pipeline"],
    },
    {
      area: "Software engineering",
      summary: "Writing the code behind automation and products, from scripts to full-stack web and mobile apps.",
      tools: [
        { name: "Python", confirmed: true },
        { name: "Java", confirmed: true },
        { name: "Next.js", confirmed: true },
        { name: "React Native", confirmed: true },
        { name: "Expo", confirmed: true },
        { name: "Supabase", confirmed: true },
        { name: "C#", confirmed: false },
        { name: "SQL & database design", confirmed: false },
      ],
      evidence: ["glomaf"],
    },
  ],
};

export default profile;
