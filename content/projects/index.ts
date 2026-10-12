import type { ProjectInput } from "@/lib/content/schema";
import awsInfrastructure from "./aws-infrastructure";
import linuxAutomation from "./linux-automation";
import glomaf from "./glomaf";

/**
 * Every project, in display order. To add a project, copy an existing file in
 * this folder, give it a unique slug, and add it to this list.
 */
const projects: ProjectInput[] = [awsInfrastructure, linuxAutomation, glomaf];

export default projects;
