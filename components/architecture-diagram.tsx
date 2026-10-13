import type { architectureDrawings } from "@/lib/content/schema";

type Drawing = (typeof architectureDrawings)[number];

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

const descriptions: Record<Drawing, string> = {
  "aws-three-tier":
    "Three-tier architecture inside a VPC: internet traffic reaches a load balancer in public subnets, which forwards to application compute in private subnets, which connects to a database in isolated private subnets. Security groups restrict traffic between each tier.",
};

/** A labelled architecture diagram drawn in code, for projects without a diagram image. */
export function ArchitectureDiagram({ drawing }: { drawing: Drawing }) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-term ring-1 ring-term-line">
      <svg role="img" aria-label={descriptions[drawing]} viewBox="0 0 720 440" className="block h-auto w-full" fill="none">
        <rect width="720" height="440" fill={C.bg} />
        {drawing === "aws-three-tier" ? <ThreeTier /> : null}
      </svg>
      <figcaption className="border-t border-term-line px-5 py-3 text-sm text-term-dim">
        Simplified view of the tiers and traffic flow. Arrows show request direction.
      </figcaption>
    </figure>
  );
}

function Label({ x, y, children, color = C.dim, size = 12, anchor = "start" }: { x: number; y: number; children: string; color?: string; size?: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontFamily="var(--font-mono)" textAnchor={anchor}>
      {children}
    </text>
  );
}

function Tier({ y, title, subnet, color }: { y: number; title: string; subnet: string; color: string }) {
  return (
    <g>
      <rect x="150" y={y} width="530" height="86" rx="12" fill={C.panel} stroke={C.line} strokeWidth="1.5" />
      <rect x="150" y={y} width="4" height="86" rx="2" fill={color} />
      <Label x={168} y={y + 24} color={C.text} size={13}>
        {title}
      </Label>
      <Label x={168} y={y + 42} size={11}>
        {subnet}
      </Label>
    </g>
  );
}

function Box({ x, y, label, accent }: { x: number; y: number; label: string; accent: string }) {
  return (
    <g>
      <rect x={x} y={y} width="136" height="46" rx="9" fill={C.bg} stroke={accent} strokeOpacity="0.8" strokeWidth="1.5" />
      <rect x={x - 6} y={y - 6} width="148" height="58" rx="12" stroke={C.gold} strokeOpacity="0.45" strokeDasharray="3 4" />
      <Label x={x + 68} y={y + 28} color={C.text} size={12} anchor="middle">
        {label}
      </Label>
    </g>
  );
}

function Arrow({ d }: { d: string }) {
  return <path d={d} stroke={C.mint} strokeWidth="1.5" markerEnd="url(#arrow-three-tier)" />;
}

function ThreeTier() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <marker id="arrow-three-tier" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1 1l8 4-8 4" stroke={C.mint} strokeWidth="1.5" fill="none" />
        </marker>
      </defs>

      {/* Internet */}
      <circle cx="68" cy="88" r="30" fill={C.panel} stroke={C.line} strokeWidth="1.5" />
      <path d="M55 95h24a8 8 0 0 0 1-15.9A11 11 0 0 0 59.5 77 8.6 8.6 0 0 0 55 95Z" stroke={C.text} strokeWidth="1.5" />
      <Label x={68} y={138} anchor="middle">
        Internet
      </Label>

      {/* VPC boundary */}
      <rect x="126" y="22" width="574" height="396" rx="18" stroke={C.mint} strokeOpacity="0.45" strokeDasharray="6 6" strokeWidth="1.25" />
      <Label x={142} y={44} color={C.mint} size={12}>
        VPC
      </Label>

      <Tier y={56} title="Web tier" subnet="public subnets" color={C.mint} />
      <Tier y={190} title="Application tier" subnet="private subnets" color={C.text} />
      <Tier y={314} title="Data tier" subnet="private subnets" color={C.gold} />

      <Box x={430} y={76} label="Load balancer" accent={C.mint} />
      <Box x={360} y={210} label="Compute" accent={C.text} />
      <Box x={520} y={210} label="Compute" accent={C.text} />
      <Box x={430} y={334} label="Database" accent={C.gold} />

      <Arrow d="M98 88h320" />
      <Arrow d="M480 128c0 40-52 34-52 72" />
      <Arrow d="M516 128c0 40 72 34 72 72" />
      <Arrow d="M428 262c0 34 40 30 50 62" />
      <Arrow d="M588 262c0 34-40 30-50 62" />

      {/* Legend */}
      <rect x="20" y="368" width="12" height="12" rx="3" stroke={C.gold} strokeOpacity="0.6" strokeDasharray="3 3" />
      <Label x={20} y={402} size={11}>
        security
      </Label>
      <Label x={20} y={416} size={11}>
        group
      </Label>
    </g>
  );
}
