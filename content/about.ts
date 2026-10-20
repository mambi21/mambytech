import type { AboutInput } from "@/lib/content/schema";

/**
 * About page content, written from facts Ibrahima has confirmed. The first
 * section opens the page; the rest follow in order. Add a section about the
 * roles or collaboration you're looking for, in your own words, when ready.
 */
const about: AboutInput = {
  sections: [
    {
      id: "introduction",
      heading: "Introduction",
      paragraphs: [
        "I’m Ibrahima Mamby Bah, a Cloud Infrastructure and Linux Engineer. I’ve worked professionally with enterprise Linux environments since 2020, and that foundation carries through my work in AWS infrastructure, DevOps, and software engineering.",
      ],
    },
    {
      id: "background",
      heading: "From Linux to the cloud",
      paragraphs: [
        "I started in Linux administration: running RHEL and Ubuntu systems, managing services and storage, applying patches, troubleshooting issues, and automating routine work with Bash and Ansible.",
        "My work then expanded to designing, deploying, and managing AWS infrastructure, including VPCs, subnets, EC2, IAM, security groups, and load balancing, and to infrastructure as code with Terraform, configuration management with Ansible, Kubernetes, and CI/CD.",
      ],
    },
    {
      id: "current-work",
      heading: "What I’m building now",
      paragraphs: [
        "Alongside infrastructure work, I’m building Glomaf, a marketplace with a Next.js web app and a React Native (Expo) mobile app. My work covers application architecture, authentication, real-time messaging, deployment configuration, UI/UX, and performance optimization.",
      ],
    },
  ],
};

export default about;
