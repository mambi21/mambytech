import type { projectFigures } from "@/lib/content/schema";
import { AwsThreeTierFigure } from "./aws-three-tier";
import { PipelineFigure } from "./cicd-pipeline";
import { GlomafPlatformFigure } from "./glomaf-platform";
import { LinuxOperationsFigure } from "./linux-operations";

/*
 * Project figures, drawn in code. Each one states only what is known about the
 * system it depicts, and has a wide drawing, a compact drawing for phones, and
 * a full-size view. See the individual files for each figure.
 */

export type FigureName = (typeof projectFigures)[number];

export function ProjectFigure({ name, number, className }: { name: FigureName; number: string; className?: string }) {
  switch (name) {
    case "aws-three-tier":
      return <AwsThreeTierFigure number={number} className={className} />;
    case "linux-operations":
      return <LinuxOperationsFigure number={number} className={className} />;
    case "cicd-pipeline":
      return <PipelineFigure number={number} className={className} />;
    case "glomaf-platform":
      return <GlomafPlatformFigure number={number} className={className} />;
  }
}
