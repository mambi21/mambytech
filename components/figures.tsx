import type { ReactNode } from "react";
import type { projectFigures } from "@/lib/content/schema";
import { cx } from "./ui";

/*
 * Technical figures, drawn in code. Each one states only what is known about
 * the system it depicts; labels are real terms, not decoration. Figures that
 * are too dense for a phone have a separate compact drawing rather than a
 * scaled-down copy.
 */

export type FigureName = (typeof projectFigures)[number];

const ink = "#1c211f";
const subtle = "#626a65";
const rule = "#d9d2c5";
const brand = "#0e3b31";
const tint = "#e6eee9";
const paper = "#f7f4ee";
const white = "#ffffff";

const night = { bg: "#111714", line: "#26302b", text: "#d6dfda", dim: "#8d9993", mint: "#7fcfa9" };

/* ------------------------------------------------------------------ */
/* Frame                                                               */
/* ------------------------------------------------------------------ */

/** A figure plate: hairline frame with crop marks and a numbered caption. */
export function Plate({
  number,
  caption,
  tone = "light",
  className,
  children,
}: {
  number: string;
  caption: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
}) {
  const dark = tone === "dark";
  const mark = cx("absolute size-3", dark ? "border-term-dim" : "border-ink");
  return (
    <figure className={className}>
      <div className={cx("relative border p-3 sm:p-5", dark ? "border-term-line bg-term" : "border-rule bg-paper-2/70")}>
        <span aria-hidden="true" className={cx(mark, "-top-px -left-px border-t border-l")} />
        <span aria-hidden="true" className={cx(mark, "-top-px -right-px border-t border-r")} />
        <span aria-hidden="true" className={cx(mark, "-bottom-px -left-px border-b border-l")} />
        <span aria-hidden="true" className={cx(mark, "-right-px -bottom-px border-r border-b")} />
        {children}
        {/* On the night ground the caption stays inside the frame, so it reads on any page background. */}
        {dark ? <Caption number={number} caption={caption} dark className="-mx-3 -mb-3 mt-4 border-t border-term-line px-3 py-3 sm:-mx-5 sm:-mb-5 sm:px-5" /> : null}
      </div>
      {dark ? null : <Caption number={number} caption={caption} className="mt-3" />}
    </figure>
  );
}

function Caption({ number, caption, dark, className }: { number: string; caption: ReactNode; dark?: boolean; className?: string }) {
  return (
    <figcaption className={cx("type-mono flex gap-3 text-[0.8125rem]", dark ? "text-term-dim" : "text-ink-muted", className)}>
      <span className={cx("shrink-0", dark ? "text-term-prompt" : "text-brand")}>Fig. {number}</span>
      <span>{caption}</span>
    </figcaption>
  );
}

/** Two drawings of one figure: a wide one from the md breakpoint, a compact one below it. */
function Responsive({ label, wide, compact }: { label: string; wide: ReactNode; compact: ReactNode }) {
  return (
    <>
      <div className="hidden md:block" role="img" aria-label={label}>
        {wide}
      </div>
      <div className="md:hidden" role="img" aria-label={label}>
        {compact}
      </div>
    </>
  );
}

function Mono({ x, y, children, anchor = "start", fill = subtle, size = 11 }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; fill?: string; size?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} letterSpacing="0.06em" className="font-mono uppercase">
      {children}
    </text>
  );
}

function Name({ x, y, children, anchor = "start", fill = ink, size = 15 }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; fill?: string; size?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} fontWeight={600} className="font-sans">
      {children}
    </text>
  );
}

function Arrowhead({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M1 1.5 9 5 1 8.5" fill="none" stroke={color} strokeWidth="1.5" />
    </marker>
  );
}

function Step({ x, y, n, fill = brand, color = paper }: { x: number; y: number; n: number; fill?: string; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill={fill} />
      <text x={x} y={y + 3.8} textAnchor="middle" fill={color} fontSize="11" className="font-mono">
        {n}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Fig. 00 — the stack (home hero)                                     */
/* ------------------------------------------------------------------ */

const layers: Array<{ name: string; tools: string[] }> = [
  { name: "Workloads", tools: ["Docker / Kubernetes (EKS)"] },
  { name: "Automation & CI/CD", tools: ["Ansible / Bash / Python", "Jenkins / GitHub Actions"] },
  { name: "Infrastructure as code", tools: ["Terraform"] },
  { name: "Cloud network & compute", tools: ["AWS: VPC / EC2 / IAM"] },
  { name: "Operating system", tools: ["Linux: RHEL / Ubuntu"] },
];

/** Marks drawn on each plate's top face, in a 100×100 square mapped onto the rhombus. */
function PlateMarks({ index }: { index: number }) {
  const s = { vectorEffect: "non-scaling-stroke" as const, stroke: ink, strokeWidth: 1, fill: "none" };
  switch (index) {
    case 0: // containers
      return (
        <g>
          {[20, 55].flatMap((u) => [20, 55].map((v) => <rect key={`${u}-${v}`} x={u} y={v} width="25" height="25" {...s} fill={tint} />))}
        </g>
      );
    case 1: // a loop
      return <circle cx="50" cy="50" r="28" {...s} stroke={brand} strokeDasharray="6 5" />;
    case 2: // lines of code
      return (
        <g>
          {[22, 36, 50, 64, 78].map((v, i) => (
            <path key={v} d={`M18 ${v}h${[60, 42, 52, 30, 48][i]}`} {...s} stroke={i === 1 ? brand : ink} />
          ))}
        </g>
      );
    case 3: // VPC with two subnets
      return (
        <g>
          <rect x="12" y="12" width="76" height="76" {...s} strokeDasharray="5 4" />
          <path d="M50 18v64" {...s} />
          <rect x="20" y="24" width="22" height="22" {...s} fill={tint} />
          <rect x="58" y="54" width="22" height="22" {...s} fill={tint} />
        </g>
      );
    default: // hosts
      return (
        <g>
          {[18, 44, 70].map((u) => (
            <rect key={u} x={u} y="30" width="14" height="40" {...s} fill={white} />
          ))}
        </g>
      );
  }
}

function StackDrawing({ compact }: { compact?: boolean }) {
  const cx0 = compact ? 104 : 192;
  const w = compact ? 76 : 140;
  const h = w / 2;
  const t = 9;
  const gap = compact ? 70 : 104;
  const top = compact ? 50 : 80;
  const labelX = compact ? 196 : 384;
  const width = compact ? 360 : 640;
  const height = top + gap * (layers.length - 1) + h + t + 26;
  // Upper plates sit in front of lower ones, so draw from the bottom up.
  const backToFront = layers.map((layer, i) => ({ layer, i })).reverse();
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" fill="none">
      {/* Cross-cutting concern */}
      <path d={`M14 ${top - 6}v${gap * (layers.length - 1) + 12}`} stroke={brand} strokeWidth="1.25" />
      <path d={`M10 ${top - 6}h8M10 ${top + gap * (layers.length - 1) + 6}h8`} stroke={brand} strokeWidth="1.25" />
      <text
        transform={`translate(30 ${top + (gap * (layers.length - 1)) / 2}) rotate(-90)`}
        textAnchor="middle"
        fill={brand}
        fontSize={compact ? 9.5 : 10.5}
        letterSpacing="0.08em"
        className="font-mono uppercase"
      >
        Monitoring & incident response
      </text>

      {backToFront.map(({ layer, i }) => {
        const cy = top + gap * i;
        const left = cx0 - w;
        const right = cx0 + w;
        return (
          <g
            key={layer.name}
            className="group/plate motion-safe:animate-[settle_900ms_var(--ease-out-quint)_both]"
            style={{ animationDelay: `${(layers.length - 1 - i) * 110}ms` }}
          >
            <path d={`M${left} ${cy}L${cx0} ${cy + h}V${cy + h + t}L${left} ${cy + t}Z`} fill={rule} stroke={ink} strokeWidth="1" />
            <path d={`M${cx0} ${cy + h}L${right} ${cy}V${cy + t}L${cx0} ${cy + h + t}Z`} fill={paper} stroke={ink} strokeWidth="1" />
            <path
              d={`M${left} ${cy}L${cx0} ${cy - h}L${right} ${cy}L${cx0} ${cy + h}Z`}
              fill={white}
              stroke={ink}
              strokeWidth="1.1"
              className="transition-[fill] duration-300 group-hover/plate:fill-brand-tint"
            />
            <g transform={`matrix(${w / 100} ${-h / 100} ${w / 100} ${h / 100} ${left} ${cy})`}>
              <PlateMarks index={i} />
            </g>
            <path d={`M${right + 6} ${cy}H${labelX - 12}`} stroke={ink} strokeWidth="0.75" strokeDasharray="2 3" />
            <circle cx={right} cy={cy} r="2.5" fill={ink} />
            <Mono x={labelX} y={cy - 6} size={compact ? 9.5 : 10.5}>
              {`0${layers.length - i} ${layer.name}`}
            </Mono>
            {layer.tools.map((line, j) => (
              <Name key={line} x={labelX} y={cy + 12 + j * 18} size={compact ? 12.5 : 15}>
                {line}
              </Name>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function StackFigure({ className }: { className?: string }) {
  return (
    <Plate
      number="00"
      className={className}
      caption="The layers I work across, from the operating system up to the workloads it runs, with the tools I use at each. Monitoring and incident response run through all of them."
    >
      <Responsive
        label="Exploded diagram of five layers. From the bottom: operating system (Linux: RHEL, Ubuntu); cloud network and compute (AWS: VPC, EC2, IAM); infrastructure as code (Terraform); automation and CI/CD (Ansible, Bash, Python, Jenkins, GitHub Actions); workloads (Docker, Kubernetes on EKS). Monitoring and incident response span every layer."
        wide={<StackDrawing />}
        compact={<StackDrawing compact />}
      />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* Fig. 01 — AWS three-tier                                            */
/* ------------------------------------------------------------------ */

function Box({ x, y, w, h, label, sub }: { x: number; y: number; w: number; h: number; label: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={white} stroke={ink} strokeWidth="1.25" />
      <Name x={x + w / 2} y={y + (sub ? h / 2 - 1 : h / 2 + 5)} anchor="middle">
        {label}
      </Name>
      {sub ? (
        <Mono x={x + w / 2} y={y + h / 2 + 15} anchor="middle" size={9.5}>
          {sub}
        </Mono>
      ) : null}
    </g>
  );
}

function SecurityGroup({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} stroke={brand} strokeWidth="1.25" strokeDasharray="5 4" />;
}

function Band({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={paper} stroke={rule} strokeWidth="1" />
      <Mono x={x + 14} y={y + 22}>
        {label}
      </Mono>
    </g>
  );
}

function AwsWide() {
  const a = "url(#aws-arrow-w)";
  return (
    <svg viewBox="0 0 880 504" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="aws-arrow-w" color={brand} />
      </defs>
      <circle cx="58" cy="136" r="26" fill={white} stroke={ink} strokeWidth="1.25" />
      <path d="M45 143h24a7 7 0 0 0 .8-13.9A10 10 0 0 0 51 128a7.4 7.4 0 0 0-6 15Z" stroke={ink} strokeWidth="1.25" />
      <Mono x={58} y={184} anchor="middle">
        Internet
      </Mono>

      <rect x="150" y="24" width="712" height="460" stroke={ink} strokeWidth="1.25" />
      <Mono x={166} y={46} fill={ink}>
        VPC
      </Mono>

      <Band x={182} y={62} w={662} h={124} label="Public subnets" />
      <Band x={182} y={204} w={662} h={130} label="Private subnets · application" />
      <Band x={182} y={352} w={662} h={114} label="Private subnets · data" />

      <rect x="136" y="114" width="28" height="44" fill={white} stroke={ink} strokeWidth="1.25" />
      <Mono x={150} y={176} anchor="middle" size={9.5}>
        IGW
      </Mono>

      <SecurityGroup x={462} y={90} w={212} h={76} />
      <Box x={474} y={102} w={188} h={52} label="Load balancer" />

      <SecurityGroup x={364} y={234} w={408} h={78} />
      <Box x={376} y={246} w={170} h={54} label="Compute" sub="app instance" />
      <Box x={590} y={246} w={170} h={54} label="Compute" sub="app instance" />

      <SecurityGroup x={474} y={382} w={188} h={72} />
      <Box x={486} y={394} w={164} h={48} label="Database" />

      <g stroke={brand} strokeWidth="1.5">
        <path d="M86 136H132" markerEnd={a} />
        <path d="M166 128H470" markerEnd={a} />
        <path d="M540 156v26H461v60" markerEnd={a} />
        <path d="M596 156v26h79v60" markerEnd={a} />
        <path d="M461 302v40h82v48" markerEnd={a} />
        <path d="M675 302v40h-82v48" markerEnd={a} />
      </g>
      <Step x={108} y={118} n={1} />
      <Step x={320} y={110} n={2} />
      <Step x={568} y={182} n={3} />
      <Step x={568} y={342} n={4} />

      <g transform="translate(694 104)">
        <path d="M0 6h22" stroke={brand} strokeWidth="1.5" />
        <Mono x={30} y={10} size={9.5}>
          Request path
        </Mono>
        <rect x="0" y="22" width="22" height="12" stroke={brand} strokeWidth="1.25" strokeDasharray="5 4" />
        <Mono x={30} y={32} size={9.5}>
          Security group
        </Mono>
      </g>
    </svg>
  );
}

function AwsCompact() {
  const a = "url(#aws-arrow-c)";
  return (
    <svg viewBox="0 0 360 660" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="aws-arrow-c" color={brand} />
      </defs>
      <circle cx="180" cy="30" r="20" fill={white} stroke={ink} strokeWidth="1.25" />
      <path d="M170 35h19a5.5 5.5 0 0 0 .6-11A8 8 0 0 0 174.5 23a5.8 5.8 0 0 0-4.5 12Z" stroke={ink} strokeWidth="1.2" />
      <Mono x={210} y={34}>
        Internet
      </Mono>

      <rect x="10" y="84" width="340" height="562" stroke={ink} strokeWidth="1.25" />
      <Mono x={24} y={104} fill={ink}>
        VPC
      </Mono>
      <rect x="164" y="72" width="32" height="24" fill={white} stroke={ink} strokeWidth="1.25" />
      <Mono x={206} y={89} size={9.5}>
        IGW
      </Mono>

      <Band x={24} y={116} w={312} h={126} label="Public subnets" />
      <Band x={24} y={258} w={312} h={190} label="Private · application" />
      <Band x={24} y={464} w={312} h={166} label="Private · data" />

      <SecurityGroup x={84} y={158} w={192} h={70} />
      <Box x={96} y={170} w={168} h={46} label="Load balancer" />

      <SecurityGroup x={34} y={334} w={292} h={78} />
      <Box x={46} y={346} w={124} h={54} label="Compute" sub="app" />
      <Box x={190} y={346} w={124} h={54} label="Compute" sub="app" />

      <SecurityGroup x={84} y={538} w={192} h={70} />
      <Box x={96} y={550} w={168} h={46} label="Database" />

      <g stroke={brand} strokeWidth="1.5">
        <path d="M180 50v18" markerEnd={a} />
        <path d="M180 98v66" markerEnd={a} />
        <path d="M180 230v52H108v58" markerEnd={a} />
        <path d="M180 282h72v58" markerEnd={a} />
        <path d="M108 414v80h64v38" markerEnd={a} />
        <path d="M252 414v80h-64v38" markerEnd={a} />
      </g>
      <Step x={156} y={60} n={1} />
      <Step x={200} y={134} n={2} />
      <Step x={196} y={300} n={3} />
      <Step x={196} y={500} n={4} />
    </svg>
  );
}

export function AwsThreeTierFigure({ number, className }: { number: string; className?: string }) {
  return (
    <Plate
      number={number}
      className={className}
      caption={
        <>
          Request path through the three tiers: (1) the internet gateway, (2) the load balancer in the public subnets, (3) compute
          in the private application subnets, (4) the database in the private data subnets. Dashed outlines are security groups.
        </>
      }
    >
      <Responsive
        label="AWS three-tier network diagram. Inside a VPC, requests from the internet pass through an internet gateway to a load balancer in public subnets, then to two compute instances in private application subnets, then to a database in private data subnets. Each tier sits inside its own security group."
        wide={<AwsWide />}
        compact={<AwsCompact />}
      />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* Fig. 02 — Linux operations scope                                    */
/* ------------------------------------------------------------------ */

const operations = [
  { name: "Administer", detail: "users · services · storage" },
  { name: "Patch", detail: "OS updates" },
  { name: "Configure", detail: "managed config" },
  { name: "Troubleshoot", detail: "logs · diagnosis" },
];

function Hosts({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={x} y={y + i * 42} width={w} height="34" fill={white} stroke={ink} strokeWidth="1.25" />
          {[0, 1, 2, 3].map((j) => (
            <path key={j} d={`M${x + 12 + j * 7} ${y + i * 42 + 10}v14`} stroke={rule} strokeWidth="2" />
          ))}
          <circle cx={x + w - 16} cy={y + i * 42 + 17} r="3.5" fill={brand} />
          <Mono x={x + w - 28} y={y + i * 42 + 21} anchor="end" size={9.5}>
            {`host-0${i + 1}`}
          </Mono>
        </g>
      ))}
    </g>
  );
}

function LinuxWide() {
  const a = "url(#linux-arrow-w)";
  const nodes = [
    { x: 320, y: 75, lx: 320, ly: 26, anchor: "middle" as const },
    { x: 480, y: 235, lx: 512, ly: 231, anchor: "start" as const },
    { x: 320, y: 395, lx: 320, ly: 440, anchor: "middle" as const },
    { x: 160, y: 235, lx: 128, ly: 231, anchor: "end" as const },
  ];
  return (
    <svg viewBox="0 0 640 476" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="linux-arrow-w" color={brand} />
      </defs>
      <g stroke={brand} strokeWidth="1.5">
        <path d="M345 77A160 160 0 0 1 478 210" markerEnd={a} />
        <path d="M478 260A160 160 0 0 1 345 393" markerEnd={a} />
        <path d="M295 393A160 160 0 0 1 162 260" markerEnd={a} />
        <path d="M162 210A160 160 0 0 1 295 77" markerEnd={a} />
      </g>
      <Hosts x={250} y={180} w={140} />
      <Mono x={320} y={330} anchor="middle" fill={ink}>
        Linux hosts
      </Mono>
      {operations.map((op, i) => {
        const n = nodes[i];
        return (
          <g key={op.name}>
            <circle cx={n.x} cy={n.y} r="20" fill={paper} stroke={ink} strokeWidth="1.25" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill={brand} fontSize="11" className="font-mono">
              {`0${i + 1}`}
            </text>
            <Name x={n.lx} y={n.ly} anchor={n.anchor} size={17}>
              {op.name}
            </Name>
            <Mono x={n.lx} y={n.ly + 18} anchor={n.anchor} size={10}>
              {op.detail}
            </Mono>
          </g>
        );
      })}
    </svg>
  );
}

function LinuxCompact() {
  const a = "url(#linux-arrow-c)";
  const ys = [222, 316, 410, 504];
  return (
    <svg viewBox="0 0 360 560" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="linux-arrow-c" color={brand} />
      </defs>
      <Hosts x={70} y={16} w={220} />
      <Mono x={180} y={166} anchor="middle" fill={ink}>
        Linux hosts
      </Mono>
      <g stroke={brand} strokeWidth="1.5">
        {ys.slice(0, -1).map((y, i) => (
          <path key={y} d={`M46 ${y + 20}V${ys[i + 1] - 22}`} markerEnd={a} />
        ))}
        <path d="M46 524v18H16V222h6" markerEnd={a} />
      </g>
      {operations.map((op, i) => (
        <g key={op.name}>
          <circle cx="46" cy={ys[i]} r="18" fill={paper} stroke={ink} strokeWidth="1.25" />
          <text x="46" y={ys[i] + 4} textAnchor="middle" fill={brand} fontSize="11" className="font-mono">
            {`0${i + 1}`}
          </text>
          <Name x={80} y={ys[i] - 1} size={17}>
            {op.name}
          </Name>
          <Mono x={80} y={ys[i] + 17} size={10}>
            {op.detail}
          </Mono>
        </g>
      ))}
    </svg>
  );
}

export function LinuxOperationsFigure({ number, className }: { number: string; className?: string }) {
  return (
    <Plate number={number} className={className} caption="Scope of the operations work: the routine cycle of administering, patching, configuring, and troubleshooting Linux hosts.">
      <Responsive
        label="Cycle diagram around a group of Linux hosts with four stages: administer (users, services, storage), patch (OS updates), configure (managed configuration), and troubleshoot (logs and diagnosis)."
        wide={<LinuxWide />}
        compact={<LinuxCompact />}
      />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* Fig. 03 — Glomaf platform outline (dark)                            */
/* ------------------------------------------------------------------ */

function NightLabel({ x, y, children, anchor = "start", sub }: { x: number; y: number; children: string; anchor?: "start" | "middle"; sub?: string }) {
  return (
    <g>
      <Name x={x} y={y} anchor={anchor} fill="#ffffff" size={15}>
        {children}
      </Name>
      {sub ? (
        <Mono x={x} y={y + 17} anchor={anchor} fill={night.dim} size={10}>
          {sub}
        </Mono>
      ) : null}
    </g>
  );
}

function Browser({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={night.bg} stroke={night.text} strokeWidth="1.25" />
      <path d={`M${x} ${y + 20}h${w}`} stroke={night.line} strokeWidth="1.25" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 12 + i * 10} cy={y + 10} r="2.5" fill={night.dim} />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x + 14 + i * ((w - 28) / 3 + 0)} y={y + 36} width={(w - 28) / 3 - 8} height={h * 0.32} fill={night.line} />
      ))}
      <path d={`M${x + 14} ${y + h - 24}h${w * 0.4}M${x + 14} ${y + h - 13}h${w * 0.25}`} stroke={night.line} strokeWidth="4" />
    </g>
  );
}

function Phone({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="12" fill={night.bg} stroke={night.text} strokeWidth="1.25" />
      <path d={`M${x + w / 2 - 12} ${y + 10}h24`} stroke={night.line} strokeWidth="3" />
      <rect x={x + 10} y={y + 26} width={w * 0.55} height="14" rx="7" fill={night.line} />
      <rect x={x + w * 0.35} y={y + 48} width={w * 0.55} height="14" rx="7" fill={night.mint} fillOpacity="0.35" />
      <rect x={x + 10} y={y + 70} width={w * 0.45} height="14" rx="7" fill={night.line} />
      <rect x={x + 10} y={y + h - 26} width={w - 20} height="14" rx="7" stroke={night.dim} strokeWidth="1" />
    </g>
  );
}

function Backend({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={night.bg} stroke={night.mint} strokeWidth="1.25" />
      <NightLabel x={x + 20} y={y + h / 2 - 2} sub="backend">
        Supabase
      </NightLabel>
    </g>
  );
}

/** Product features confirmed so far, drawn apart from the backend: which service implements them isn't stated. */
function Features({ x, y, w }: { x: number; y: number; w: number }) {
  const rows = ["Authentication", "Messaging"];
  return (
    <g>
      <rect x={x} y={y} width={w} height={44 + rows.length * 50} stroke={night.dim} strokeWidth="1" strokeDasharray="4 4" />
      <Mono x={x + 20} y={y + 28} fill={night.dim} size={10}>
        Product features
      </Mono>
      {rows.map((row, i) => (
        <g key={row}>
          <rect x={x + 20} y={y + 44 + i * 50} width={w - 40} height="38" fill={night.line} />
          <Mono x={x + 34} y={y + 44 + i * 50 + 23} fill={night.text} size={10.5}>
            {row}
          </Mono>
        </g>
      ))}
    </g>
  );
}

function GlomafWide() {
  const a = "url(#glomaf-arrow-w)";
  return (
    <svg viewBox="0 0 640 430" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="glomaf-arrow-w" color={night.mint} />
      </defs>
      <Browser x={24} y={30} w={220} h={136} />
      <NightLabel x={24} y={194} sub="Next.js">
        Web app
      </NightLabel>
      <Phone x={62} y={240} w={92} h={150} />
      <NightLabel x={172} y={318} sub="React Native · Expo">
        Mobile app
      </NightLabel>
      <g stroke={night.mint} strokeWidth="1.5">
        <path d="M248 98h80v14h46" markerEnd={a} />
        <path d="M158 284h170V112" />
      </g>
      <Backend x={380} y={62} w={236} h={100} />
      <Features x={380} y={196} w={236} />
    </svg>
  );
}

function GlomafCompact() {
  const a = "url(#glomaf-arrow-c)";
  return (
    <svg viewBox="0 0 360 512" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="glomaf-arrow-c" color={night.mint} />
      </defs>
      <Browser x={12} y={14} w={196} h={124} />
      <NightLabel x={12} y={164} sub="Next.js">
        Web app
      </NightLabel>
      <Phone x={248} y={8} w={92} h={136} />
      <NightLabel x={294} y={164} anchor="middle" sub="RN · Expo">
        Mobile app
      </NightLabel>
      <g stroke={night.mint} strokeWidth="1.5">
        <path d="M110 196v22h70v22" markerEnd={a} />
        <path d="M294 196v22H180" />
      </g>
      <Backend x={12} y={244} w={336} h={92} />
      <Features x={12} y={364} w={336} />
    </svg>
  );
}

export function GlomafPlatformFigure({ number, className }: { number: string; className?: string }) {
  return (
    <Plate
      number={number}
      className={className}
      tone="dark"
      caption="Platform outline: a Next.js web app and a React Native (Expo) mobile app on one Supabase backend. Authentication and messaging are among the product’s features."
    >
      <Responsive
        label="Platform diagram. A Next.js web app and a React Native Expo mobile app both connect to a Supabase backend. Product features include authentication and messaging."
        wide={<GlomafWide />}
        compact={<GlomafCompact />}
      />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* Lookup                                                              */
/* ------------------------------------------------------------------ */

export function ProjectFigure({ name, number, className }: { name: FigureName; number: string; className?: string }) {
  switch (name) {
    case "aws-three-tier":
      return <AwsThreeTierFigure number={number} className={className} />;
    case "linux-operations":
      return <LinuxOperationsFigure number={number} className={className} />;
    case "glomaf-platform":
      return <GlomafPlatformFigure number={number} className={className} />;
  }
}

/** Figures drawn on the night ground. */
export const darkFigures: ReadonlySet<FigureName> = new Set(["glomaf-platform"]);
