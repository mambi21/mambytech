import Image from "next/image";
import type { Media, Project, ProjectCategory } from "@/lib/content/schema";
import { cx } from "./ui";

/** The image that best represents a project: cover, then architecture diagram, then first media item. */
export function projectImage(project: Project): Media | undefined {
  return project.cover ?? project.caseStudy.architecture.diagram ?? project.media[0];
}

/**
 * A project's visual. Uses a real image when one has been supplied, otherwise
 * a simple schematic illustration of the project's category. Illustrations are
 * decorative and don't depict the project's actual architecture.
 */
export function ProjectVisual({
  project,
  sizes = "(min-width: 1024px) 440px, 100vw",
  preload,
  className,
}: {
  project: Project;
  sizes?: string;
  preload?: boolean;
  className?: string;
}) {
  const image = projectImage(project);
  return (
    <div className={cx("overflow-hidden rounded-sm border border-rule bg-paper-2", className)}>
      {image ? (
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} preload={preload} className="aspect-[8/5] h-auto w-full object-cover" />
      ) : (
        <CategoryIllustration category={project.category} />
      )}
    </div>
  );
}

const brand = "#0e3b31";
const tint = "#e6eee9";
const rule = "#d9d2c5";
const paper = "#f7f4ee";

export function CategoryIllustration({ category, className }: { category: ProjectCategory; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 250" className={cx("block aspect-[8/5] h-auto w-full", className)} fill="none">
      {category === "Cloud Infrastructure" ? <CloudArt /> : null}
      {category === "Linux" ? <LinuxArt /> : null}
      {category === "DevOps" ? <DevOpsArt /> : null}
      {category === "Software Projects" ? <SoftwareArt /> : null}
    </svg>
  );
}

/* Network boundary with a gateway and two subnets of instances. */
function CloudArt() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <rect x="40" y="28" width="320" height="196" rx="10" stroke={brand} strokeWidth="1.5" strokeDasharray="5 5" />
      <path d="M200 76v14H127v20M200 90h72v20" stroke={brand} strokeWidth="1.5" />
      <circle cx="200" cy="60" r="16" fill={brand} />
      <path d="M192 60h16M200 52v16" stroke={paper} strokeWidth="2" />
      {[70, 215].map((x) => (
        <g key={x}>
          <rect x={x} y="110" width="115" height="88" rx="6" fill="#fff" stroke={rule} strokeWidth="1.5" />
          <rect x={x + 14} y="134" width="38" height="28" rx="4" fill={tint} stroke={brand} strokeWidth="1.5" />
          <rect x={x + 63} y="134" width="38" height="28" rx="4" fill={tint} stroke={brand} strokeWidth="1.5" />
          <path d={`M${x + 14} 178h87`} stroke={rule} strokeWidth="3" />
        </g>
      ))}
    </g>
  );
}

/* A terminal session beside a small process tree. */
function LinuxArt() {
  const lines: Array<[number, number, string]> = [
    [70, 80, "#7fcfa9"],
    [70, 150, "#8d9993"],
    [70, 120, "#8d9993"],
    [70, 64, "#7fcfa9"],
    [70, 170, "#8d9993"],
  ];
  return (
    <g strokeLinecap="round">
      <rect x="40" y="34" width="210" height="182" rx="8" fill="#111714" />
      <circle cx="58" cy="50" r="4" fill="#3a4540" />
      <circle cx="72" cy="50" r="4" fill="#3a4540" />
      <circle cx="86" cy="50" r="4" fill="#3a4540" />
      {lines.map(([x, w, color], i) => (
        <path key={i} d={`M${x - 12} ${86 + i * 24}h${w * 0.85}`} stroke={color} strokeWidth="6" />
      ))}
      <rect x="66" y={86 + 5 * 24 - 8} width="9" height="16" fill="#7fcfa9" />
      <g stroke={brand} strokeWidth="1.5">
        <path d="M300 70v120M300 100h30M300 140h30M300 180h30" />
        <circle cx="300" cy="62" r="9" fill={brand} />
        <circle cx="338" cy="100" r="8" fill={tint} />
        <circle cx="338" cy="140" r="8" fill={tint} />
        <circle cx="338" cy="180" r="8" fill={tint} />
      </g>
    </g>
  );
}

/* Commit → build → test → deploy, with a feedback loop. */
function DevOpsArt() {
  const xs = [70, 160, 250, 340];
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M340 150c0 50-270 50-270 0" stroke={brand} strokeWidth="1.5" strokeDasharray="5 5" />
      <path d="M76 157l-6-7-6 7" stroke={brand} strokeWidth="1.5" />
      {xs.slice(0, -1).map((x) => (
        <g key={x} stroke={brand} strokeWidth="1.5">
          <path d={`M${x + 22} 110h${90 - 50}`} />
          <path d={`M${x + 62} 104l6 6-6 6`} />
        </g>
      ))}
      {xs.map((x, i) =>
        i < 3 ? (
          <g key={x}>
            <circle cx={x} cy="110" r="20" fill={brand} />
            <path d={`M${x - 7} 110l5 5 9-10`} stroke={paper} strokeWidth="2.5" />
          </g>
        ) : (
          <circle key={x} cx={x} cy="110" r="20" fill={tint} stroke={brand} strokeWidth="1.5" />
        ),
      )}
      {xs.map((x) => (
        <path key={`l${x}`} d={`M${x - 16} 150h32`} stroke={rule} strokeWidth="4" />
      ))}
    </g>
  );
}

/* An application window: navigation, content blocks and a small chart. */
function SoftwareArt() {
  return (
    <g strokeLinecap="round">
      <rect x="40" y="30" width="320" height="190" rx="8" fill="#fff" stroke={rule} strokeWidth="1.5" />
      <path d="M40 54h320" stroke={rule} strokeWidth="1.5" />
      <circle cx="56" cy="42" r="4" fill={rule} />
      <circle cx="70" cy="42" r="4" fill={rule} />
      <circle cx="84" cy="42" r="4" fill={rule} />
      <rect x="41" y="55" width="78" height="164" fill={tint} />
      {[76, 96, 116, 136].map((y, i) => (
        <path key={y} d={`M56 ${y}h${i === 0 ? 44 : 34}`} stroke={i === 0 ? brand : "#a9b8b0"} strokeWidth="5" />
      ))}
      <path d="M140 80h120" stroke="#1c211f" strokeWidth="7" />
      <rect x="140" y="100" width="96" height="52" rx="4" stroke={brand} strokeWidth="1.5" />
      <rect x="248" y="100" width="96" height="52" rx="4" stroke={brand} strokeWidth="1.5" />
      {[[150, 196, 26], [168, 196, 40], [186, 196, 18], [204, 196, 32]].map(([x, y, h]) => (
        <rect key={x} x={x} y={y - h} width="12" height={h} fill={brand} />
      ))}
      <path d="M248 172h96M248 186h70M248 200h84" stroke={rule} strokeWidth="5" />
    </g>
  );
}
