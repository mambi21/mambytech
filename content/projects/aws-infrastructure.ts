import type { ProjectInput } from "@/lib/content/schema";

const project: ProjectInput = {
  slug: "aws-infrastructure",
  title: "AWS Three-Tier Infrastructure",
  summary:
    "A three-tier AWS architecture with public load balancing, private application and database tiers, and security groups controlling traffic between them.",
  context: "Professional Cloud Infrastructure Engineering",
  contribution:
    "I design, configure, deploy, manage, and troubleshoot AWS environments, including VPCs, subnets, EC2, IAM, security groups, networking, and load balancing, with attention to reliable operation.",
  category: "Cloud Infrastructure",
  technologies: ["AWS", "VPC", "EC2", "IAM", "Security groups", "ALB/ELB"],
  figure: "aws-three-tier",
  publication: "published",
  featured: true,
  links: [],
  media: [],
};

export default project;
