import type { CertificationInput } from "@/lib/content/schema";

/**
 * Certifications. Add `issued` ("YYYY-MM"), `credentialId` and a public
 * `verifyUrl` (https) when you want them shown; cards show only what is set.
 */
const certifications: CertificationInput[] = [
  {
    name: "Red Hat Certified System Administrator",
    abbreviation: "RHCSA",
    issuer: "Red Hat",
  },
];

export default certifications;
