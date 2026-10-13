import Image from "next/image";
import type { Media, Project, ProjectCategory } from "@/lib/content/schema";
import { cx } from "./ui";

/** The image that best represents a project: cover, then architecture diagram, then first media item. */
export function projectImage(project: Project): Media | undefined {
  return project.cover ?? project.caseStudy.architecture.diagram ?? project.media[0];
}

/**
 * A project's visual. Uses a real image when one has been supplied, otherwise
 * a schematic illustration of the project's category on a dark panel.
 * Illustrations are decorative and don't depict the project's actual system.
 */
export function ProjectVisual({
  project,
  sizes = "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw",
  preload,
  className,
  imageClassName,
}: {
  project: Project;
  sizes?: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const image = projectImage(project);
  return (
    <div className={cx("overflow-hidden bg-term", className)}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          preload={preload}
          className={cx("aspect-[8/5] h-auto w-full object-cover", imageClassName)}
        />
      ) : (
        <CategoryIllustration category={project.category} className={imageClassName} />
      )}
    </div>
  );
}

const C = {
  bg: "#111714",
  panel: "#18201c",
  line: "#26302b",
  text: "#d6dfda",
  dim: "#8d9993",
  mint: "#7fcfa9",
  gold: "#e8c37a",
  brand: "#0e3b31",
};

export function CategoryIllustration({ category, className }: { category: ProjectCategory; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 250" className={cx("block aspect-[8/5] h-auto w-full", className)} fill="none">
      <rect width="400" height="250" fill={C.bg} />
      <Grid />
      {[120, 84, 50].map((r) => (
        <circle key={r} cx="340" cy="24" r={r} fill={C.mint} fillOpacity="0.035" />
      ))}
      {category === "Cloud Infrastructure" ? <CloudArt /> : null}
      {category === "Linux" ? <LinuxArt /> : null}
      {category === "DevOps" ? <DevOpsArt /> : null}
      {category === "Software Projects" ? <SoftwareArt /> : null}
    </svg>
  );
}

function Grid() {
  return (
    <g stroke={C.text} strokeOpacity="0.05">
      {Array.from({ length: 15 }, (_, i) => (
        <path key={`v${i}`} d={`M${i * 28 + 4} 0v250`} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`h${i}`} d={`M0 ${i * 28 + 13}h400`} />
      ))}
    </g>
  );
}

/* A three-tier layout: load balancer, two app instances, a database, inside a network boundary. */
function CloudArt() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <rect x="44" y="40" width="312" height="180" rx="14" stroke={C.mint} strokeOpacity="0.4" strokeDasharray="5 6" />
      <g stroke={C.mint} strokeOpacity="0.55" strokeWidth="1.5">
        <path d="M200 20v30M200 82v14H130v18M200 96h70v18M130 158v12h70v10M270 158v12h-70" />
      </g>
      <rect x="152" y="50" width="96" height="32" rx="16" fill={C.brand} stroke={C.mint} strokeOpacity="0.7" />
      <path d="M182 66h36M208 59l10 7-10 7" stroke={C.text} strokeWidth="1.75" />
      {[86, 226].map((x) => (
        <g key={x}>
          <rect x={x} y="114" width="88" height="44" rx="8" fill={C.panel} stroke={C.line} strokeWidth="1.5" />
          <rect x={x + 10} y="124" width="44" height="8" rx="2" fill={C.line} />
          <rect x={x + 10} y="139" width="30" height="8" rx="2" fill={C.line} />
          <circle cx={x + 74} cy="128" r="3" fill={C.mint} />
          <circle cx={x + 74} cy="143" r="3" fill={C.mint} />
        </g>
      ))}
      <path d="M178 186c0-4.5 9.8-8 22-8s22 3.5 22 8v18c0 4.5-9.8 8-22 8s-22-3.5-22-8v-18Z" fill={C.panel} stroke={C.gold} strokeWidth="1.5" />
      <path d="M178 186c0 4.5 9.8 8 22 8s22-3.5 22-8" stroke={C.gold} strokeWidth="1.5" />
    </g>
  );
}

/* A terminal session beside a process tree. */
function LinuxArt() {
  const lines: Array<[number, string]> = [
    [96, C.mint],
    [150, C.dim],
    [122, C.dim],
    [70, C.mint],
    [164, C.dim],
  ];
  return (
    <g strokeLinecap="round">
      <rect x="36" y="32" width="220" height="188" rx="12" fill={C.panel} stroke={C.line} strokeWidth="1.5" />
      <path d="M36 58h220" stroke={C.line} strokeWidth="1.5" />
      {[54, 68, 82].map((x) => (
        <circle key={x} cx={x} cy="45" r="4" fill={C.line} />
      ))}
      {lines.map(([w, color], i) => (
        <g key={i}>
          <path d={`M54 ${80 + i * 24}h8`} stroke={C.mint} strokeWidth="5" />
          <path d={`M72 ${80 + i * 24}h${w}`} stroke={color} strokeOpacity={color === C.dim ? 0.7 : 1} strokeWidth="5" />
        </g>
      ))}
      <rect x="54" y={80 + 5 * 24 - 8} width="9" height="16" fill={C.mint} />
      <g stroke={C.mint} strokeOpacity="0.6" strokeWidth="1.5">
        <path d="M300 74v112M300 104h36M300 144h36M300 184h36" />
      </g>
      <circle cx="300" cy="64" r="11" fill={C.brand} stroke={C.mint} strokeWidth="1.5" />
      {[104, 144, 184].map((y, i) => (
        <circle key={y} cx="346" cy={y} r="9" fill={C.panel} stroke={i === 1 ? C.gold : C.mint} strokeWidth="1.5" />
      ))}
    </g>
  );
}

/* Commit → build → test → deploy, with a feedback loop. */
function DevOpsArt() {
  const xs = [70, 160, 250, 340];
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M340 150c0 54-270 54-270 0" stroke={C.mint} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="5 6" />
      <path d="M76 157l-6-7-6 7" stroke={C.mint} strokeOpacity="0.7" strokeWidth="1.5" />
      {xs.slice(0, -1).map((x) => (
        <g key={x} stroke={C.mint} strokeOpacity="0.7" strokeWidth="1.5">
          <path d={`M${x + 24} 110h42`} />
          <path d={`M${x + 60} 104l6 6-6 6`} />
        </g>
      ))}
      {xs.map((x, i) =>
        i < 3 ? (
          <g key={x}>
            <circle cx={x} cy="110" r="22" fill={C.brand} stroke={C.mint} strokeWidth="1.5" />
            <path d={`M${x - 7} 110l5 5 9-10`} stroke={C.text} strokeWidth="2.5" />
          </g>
        ) : (
          <circle key={x} cx={x} cy="110" r="22" fill={C.panel} stroke={C.gold} strokeWidth="1.5" />
        ),
      )}
      {xs.map((x) => (
        <path key={`l${x}`} d={`M${x - 16} 152h32`} stroke={C.line} strokeWidth="4" />
      ))}
    </g>
  );
}

/* A web app beside a mobile app: listings, and a conversation. */
function SoftwareArt() {
  return (
    <g strokeLinecap="round">
      <rect x="30" y="34" width="250" height="180" rx="12" fill={C.panel} stroke={C.line} strokeWidth="1.5" />
      <path d="M30 58h250" stroke={C.line} strokeWidth="1.5" />
      {[46, 58, 70].map((x) => (
        <circle key={x} cx={x} cy="46" r="3.5" fill={C.line} />
      ))}
      <path d="M48 78h70" stroke={C.text} strokeWidth="6" />
      {[0, 1, 2].map((col) =>
        [0, 1].map((row) => (
          <g key={`${col}-${row}`}>
            <rect x={48 + col * 76} y={94 + row * 58} width="64" height="34" rx="5" fill={col === 1 && row === 0 ? C.brand : C.line} />
            <path d={`M${48 + col * 76} ${136 + row * 58}h40`} stroke={C.dim} strokeOpacity="0.7" strokeWidth="4" />
          </g>
        )),
      )}
      <rect x="290" y="62" width="82" height="160" rx="14" fill={C.bg} stroke={C.text} strokeOpacity="0.6" strokeWidth="1.5" />
      <path d="M318 72h26" stroke={C.line} strokeWidth="4" />
      <rect x="300" y="92" width="48" height="18" rx="9" fill={C.line} />
      <rect x="314" y="118" width="48" height="18" rx="9" fill={C.brand} stroke={C.mint} strokeOpacity="0.6" />
      <rect x="300" y="144" width="40" height="18" rx="9" fill={C.line} />
      <rect x="300" y="196" width="62" height="14" rx="7" stroke={C.mint} strokeOpacity="0.6" strokeWidth="1.25" />
    </g>
  );
}
