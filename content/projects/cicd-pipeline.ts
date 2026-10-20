import type { ProjectInput } from "@/lib/content/schema";

const project: ProjectInput = {
  slug: "cicd-pipeline",
  title: "CI/CD Pipeline: GitOps to EKS",
  summary:
    "A delivery workflow connecting code checks, versioned builds, image scanning, GitOps promotion, and Kubernetes deployments, with monitoring and rollback paths.",
  context: "Professional DevOps Engineering",
  contribution:
    "I work with Terraform and Ansible for infrastructure as code and configuration management, alongside Kubernetes and CI/CD workflows. The diagram brings together the build, delivery, and infrastructure stages of the workflow.",
  category: "DevOps",
  technologies: ["GitHub", "Jenkins", "SonarQube", "Nexus", "Docker", "Trivy", "Amazon ECR", "Helm", "Argo CD", "Amazon EKS", "Amazon EC2", "Terraform", "Ansible", "Amazon S3", "IAM", "Prometheus", "Grafana"],
  figure: "cicd-pipeline",
  publication: "published",
  featured: true,
  links: [],
  media: [],
};

export default project;
