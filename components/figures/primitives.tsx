/*
 * Shared drawing primitives for the project figures: palette constants, AWS
 * group notation (official AWS Architecture Icons in public/aws-icons), icon
 * and logo tiles (Simple Icons in public/tool-icons), labels and arrows. The
 * AWS colours appear only inside the figures.
 */
import type { ReactNode } from "react";

export const ink = "#1c211f";

export const subtle = "#626a65";

export const rule = "#d9d2c5";

export const brand = "#0e3b31";

export const paper = "#f7f4ee";

export const white = "#ffffff";

export const night = { bg: "#111714", line: "#26302b", text: "#d6dfda", dim: "#8d9993", mint: "#7fcfa9" };

export function Arrowhead({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M1 1.5 9 5 1 8.5" fill="none" stroke={color} strokeWidth="1.5" />
    </marker>
  );
}

/*
 * Group containers and icons follow AWS's architecture-diagram conventions,
 * using the official AWS Architecture Icons (public/aws-icons, from the
 * 07/31/2026 asset package). The AWS colours appear only inside these figures.
 */
export const aws = {
  squid: "#232F3E",
  teal: "#00A4A6",
  purple: "#8C4FFF",
  green: "#7AA116",
  greenFill: "#F2F6E8",
  tealFill: "#E6F6F7",
  orange: "#ED7100",
  red: "#DD344C",
  grey: "#7D8998",
};

export type GroupKind = "cloud" | "region" | "vpc" | "public" | "private" | "asg" | "generic";

const groupStyle: Record<GroupKind, { stroke: string; fill?: string; dash?: string; icon?: string }> = {
  cloud: { stroke: aws.squid, icon: "group-aws-cloud" },
  region: { stroke: aws.teal, dash: "2 3", icon: "group-region" },
  vpc: { stroke: aws.purple, icon: "group-vpc" },
  public: { stroke: aws.green, fill: aws.greenFill, icon: "group-public-subnet" },
  private: { stroke: aws.teal, fill: aws.tealFill, icon: "group-private-subnet" },
  asg: { stroke: aws.orange, dash: "6 4", icon: "group-auto-scaling" },
  generic: { stroke: aws.grey, dash: "6 4" },
};

export function Group({
  kind,
  x,
  y,
  w,
  h,
  label,
  size = 12,
  icon = 24,
  color = ink,
}: {
  kind: GroupKind;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  size?: number;
  icon?: number;
  color?: string;
}) {
  const style = groupStyle[kind];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={style.fill ?? "none"} stroke={style.stroke} strokeWidth="1.25" strokeDasharray={style.dash} />
      {style.icon ? <image href={`/aws-icons/${style.icon}.svg`} x={x} y={y} width={icon} height={icon} /> : null}
      <text x={x + (style.icon ? icon + 7 : 10)} y={y + icon / 2 + size * 0.36} fill={color} fontSize={size} fontWeight={500} className="font-sans">
        {label}
      </text>
    </g>
  );
}

/** Availability Zone: dashed teal outline with a centred label, per AWS notation. */
export function Zone({ x, y, w, h, label, size = 12 }: { x: number; y: number; w: number; h: number; label: string; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={aws.teal} strokeWidth="1.25" strokeDasharray="6 4" />
      <text x={x + w / 2} y={y + size + 6} textAnchor="middle" fill={ink} fontSize={size} fontWeight={500} className="font-sans">
        {label}
      </text>
    </g>
  );
}

/** Text with a halo in the ground colour, so it stays legible where it crosses lines. */
export function Halo({
  x,
  y,
  children,
  size = 12,
  weight = 600,
  fill = ink,
  halo = paper,
  anchor = "middle",
  mono,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  weight?: number;
  fill?: string;
  halo?: string;
  anchor?: "start" | "middle" | "end";
  mono?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={fill}
      fontSize={size}
      fontWeight={weight}
      stroke={halo}
      strokeWidth="4"
      strokeLinejoin="round"
      paintOrder="stroke"
      letterSpacing={mono ? "0.04em" : undefined}
      className={mono ? "font-mono" : "font-sans"}
    >
      {children}
    </text>
  );
}

/** An official icon centred on (x, y), with optional label lines beneath. */
export function Icon({
  name,
  x,
  y,
  size = 48,
  lines = [],
  labelSize = 12,
  fill = ink,
  halo = paper,
}: {
  name: string;
  x: number;
  y: number;
  size?: number;
  lines?: string[];
  labelSize?: number;
  fill?: string;
  halo?: string;
}) {
  return (
    <g>
      <image href={`/aws-icons/${name}.svg`} x={x - size / 2} y={y - size / 2} width={size} height={size} />
      {lines.map((line, i) => (
        <Halo key={line} x={x} y={y + size / 2 + labelSize + 4 + i * (labelSize + 3)} size={labelSize} fill={fill} halo={halo}>
          {line}
        </Halo>
      ))}
    </g>
  );
}

export function SecurityGroupBox({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} fill="none" stroke={aws.red} strokeWidth="1.25" />;
}

/** A third-party tool logo (Simple Icons, public/tool-icons) on a white tile, draw.io style. */
export function Tile({
  logo,
  x,
  y,
  size = 52,
  lines = [],
  sub,
  labelSize = 12,
  halo = paper,
}: {
  logo: string;
  x: number;
  y: number;
  size?: number;
  lines?: string[];
  sub?: string;
  labelSize?: number;
  halo?: string;
}) {
  const inner = size * 0.58;
  return (
    <g>
      <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx="7" fill={white} stroke={rule} strokeWidth="1.25" />
      <image href={`/tool-icons/${logo}.svg`} x={x - inner / 2} y={y - inner / 2} width={inner} height={inner} />
      {lines.map((line, i) => (
        <Halo key={line} x={x} y={y + size / 2 + labelSize + 5 + i * (labelSize + 3)} size={labelSize} halo={halo}>
          {line}
        </Halo>
      ))}
      {sub ? (
        <Halo x={x} y={y + size / 2 + labelSize + 5 + lines.length * (labelSize + 3)} size={labelSize - 2} weight={400} fill={subtle} halo={halo} mono>
          {sub.toUpperCase()}
        </Halo>
      ) : null}
    </g>
  );
}

export function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill={brand} />
      <text x={x} y={y + 3.8} textAnchor="middle" fill={paper} fontSize="11" className="font-mono">
        {n}
      </text>
    </g>
  );
}

/** A plain dashed group with a label, used for non-AWS boundaries. */
export function Box({ x, y, w, h, label, logo }: { x: number; y: number; w: number; h: number; label: string; logo?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={aws.grey} strokeWidth="1.25" strokeDasharray="6 4" />
      {logo ? <image href={`/tool-icons/${logo}.svg`} x={x + 8} y={y + 7} width="16" height="16" /> : null}
      <text x={x + (logo ? 30 : 10)} y={y + 20} fill={subtle} fontSize="12" fontWeight={500} className="font-sans">
        {label}
      </text>
    </g>
  );
}

export function Note({ x, y, children, anchor = "start", size = 10 }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end"; size?: number }) {
  return (
    <Halo x={x} y={y} anchor={anchor} size={size} weight={400} fill={subtle} mono>
      {children.toUpperCase()}
    </Halo>
  );
}
