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
/* AWS diagram notation                                                */
/* ------------------------------------------------------------------ */

/*
 * Group containers and icons follow AWS's architecture-diagram conventions,
 * using the official AWS Architecture Icons (public/aws-icons, from the
 * 07/31/2026 asset package). The AWS colours appear only inside these figures.
 */
const aws = {
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

type GroupKind = "cloud" | "region" | "vpc" | "public" | "private" | "asg" | "generic";

const groupStyle: Record<GroupKind, { stroke: string; fill?: string; dash?: string; icon?: string }> = {
  cloud: { stroke: aws.squid, icon: "group-aws-cloud" },
  region: { stroke: aws.teal, dash: "2 3", icon: "group-region" },
  vpc: { stroke: aws.purple, icon: "group-vpc" },
  public: { stroke: aws.green, fill: aws.greenFill, icon: "group-public-subnet" },
  private: { stroke: aws.teal, fill: aws.tealFill, icon: "group-private-subnet" },
  asg: { stroke: aws.orange, dash: "6 4", icon: "group-auto-scaling" },
  generic: { stroke: aws.grey, dash: "6 4" },
};

function Group({
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
function Zone({ x, y, w, h, label, size = 12 }: { x: number; y: number; w: number; h: number; label: string; size?: number }) {
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
function Halo({
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
function Icon({
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

function SecurityGroupBox({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} fill="none" stroke={aws.red} strokeWidth="1.25" />;
}

/* ------------------------------------------------------------------ */
/* Fig. 01 — AWS three-tier                                            */
/* ------------------------------------------------------------------ */

function AwsWide() {
  const a = "url(#aws-arrow-w)";
  const zones = [
    { x: 200, label: "Availability Zone 1" },
    { x: 572, label: "Availability Zone 2" },
  ];
  return (
    <svg viewBox="0 0 980 664" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="aws-arrow-w" color={ink} />
      </defs>
      <Icon name="users" x={50} y={232} size={44} lines={["Users"]} />

      <Group kind="cloud" x={110} y={12} w={860} h={640} label="AWS Cloud" />
      <Group kind="region" x={128} y={50} w={826} h={590} label="Region" />
      <Group kind="vpc" x={150} y={88} w={788} h={536} label="VPC" />

      {zones.map((zone) => (
        <g key={zone.label}>
          <Zone x={zone.x} y={126} w={348} h={484} label={zone.label} />
          <Group kind="public" x={zone.x + 14} y={158} w={320} h={126} label="Public subnet" />
          <Group kind="private" x={zone.x + 14} y={302} w={320} h={150} label="Private subnet" />
          <Group kind="private" x={zone.x + 14} y={470} w={320} h={124} label="Private subnet" />
        </g>
      ))}

      <Group kind="asg" x={226} y={340} w={668} h={104} label="Auto Scaling group" />
      <Group kind="generic" x={222} y={500} w={676} h={84} label="DB subnet group" color={subtle} />

      {/* Request path */}
      <g stroke={ink} strokeWidth="1.4">
        <path d="M76 232H124" markerEnd={a} />
        <path d="M176 232H190V194H560V204" markerEnd={a} />
        <path d="M560 258V294H374V364" markerEnd={a} />
        <path d="M560 294H746V364" markerEnd={a} />
        <path d="M364 440V512" markerEnd={a} />
        <path d="M746 440V461H386V512" markerEnd={a} />
      </g>
      {/* Outbound traffic from private instances */}
      <g stroke={ink} strokeWidth="1.2" strokeDasharray="5 4">
        <path d="M398 392H450V260" markerEnd={a} />
        <path d="M770 392H822V260" markerEnd={a} />
      </g>

      <Icon name="internet-gateway" x={150} y={232} size={44} lines={["Internet", "gateway"]} />
      <SecurityGroupBox x={530} y={202} w={60} h={60} />
      <Icon name="alb" x={560} y={232} size={44} lines={["Application", "Load Balancer"]} />
      {zones.map((zone) => (
        <g key={`r-${zone.label}`}>
          <Icon name="nat-gateway" x={zone.x + 250} y={232} size={44} lines={["NAT gateway"]} labelSize={11.5} halo={aws.greenFill} />
          <SecurityGroupBox x={zone.x + 144} y={362} w={60} h={60} />
          <Icon name="ec2-instance" x={zone.x + 174} y={392} size={44} lines={["EC2 instance"]} labelSize={11.5} halo={aws.tealFill} />
        </g>
      ))}
      <SecurityGroupBox x={334} y={506} w={60} h={60} />
      <Icon name="rds-instance" x={364} y={536} size={44} lines={["Amazon RDS"]} labelSize={11.5} halo={aws.tealFill} />
    </svg>
  );
}

function AwsCompact() {
  const a = "url(#aws-arrow-c)";
  const zones = [
    { x: 40, label: "AZ 1" },
    { x: 204, label: "AZ 2" },
  ];
  return (
    <svg viewBox="0 0 400 724" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="aws-arrow-c" color={ink} />
      </defs>
      <Icon name="users" x={200} y={30} size={36} />
      <Halo x={226} y={34} anchor="start" size={11}>
        Users
      </Halo>

      <Group kind="cloud" x={8} y={74} w={384} h={642} label="AWS Cloud" size={11} icon={20} />
      <Group kind="region" x={18} y={104} w={364} h={602} label="Region" size={11} icon={20} />
      <Group kind="vpc" x={28} y={140} w={344} h={556} label="VPC" size={11} icon={20} />

      {zones.map((zone) => (
        <g key={zone.label}>
          <Zone x={zone.x} y={180} w={156} h={504} label={zone.label} size={11} />
          <Group kind="public" x={zone.x + 6} y={206} w={144} h={160} label="Public" size={10.5} icon={18} />
          <Group kind="private" x={zone.x + 6} y={378} w={144} h={140} label="Private" size={10.5} icon={18} />
          <Group kind="private" x={zone.x + 6} y={530} w={144} h={146} label="Private" size={10.5} icon={18} />
        </g>
      ))}
      <Group kind="asg" x={52} y={404} w={296} h={102} label="Auto Scaling group" size={10.5} icon={18} />
      <Group kind="generic" x={52} y={556} w={296} h={110} label="DB subnet group" size={10.5} color={subtle} />

      <g stroke={ink} strokeWidth="1.3">
        <path d="M200 50V122" markerEnd={a} />
        <path d="M200 162V292" markerEnd={a} />
        <path d="M200 340V372H118V428" markerEnd={a} />
        <path d="M200 372H282V428" markerEnd={a} />
        <path d="M110 486V598" markerEnd={a} />
        <path d="M282 486V522H126V598" markerEnd={a} />
      </g>
      <g stroke={ink} strokeWidth="1.1" strokeDasharray="4 4">
        <path d="M136 452H172V262H137" markerEnd={a} />
        <path d="M300 452H346V262H301" markerEnd={a} />
      </g>

      <Icon name="internet-gateway" x={200} y={142} size={34} />
      <Halo x={222} y={146} anchor="start" size={10.5}>
        Internet gateway
      </Halo>
      {zones.map((zone) => (
        <g key={`r-${zone.label}`}>
          <Icon name="nat-gateway" x={zone.x + 78} y={262} size={34} lines={["NAT gateway"]} labelSize={10} halo={aws.greenFill} />
          <SecurityGroupBox x={zone.x + 58} y={432} w={40} h={40} />
          <Icon name="ec2-instance" x={zone.x + 78} y={452} size={32} lines={["EC2"]} labelSize={10} halo={aws.tealFill} />
        </g>
      ))}
      <SecurityGroupBox x={180} y={296} w={40} h={40} />
      <Icon name="alb" x={200} y={316} size={32} />
      <Halo x={200} y={356} size={10}>
        Load Balancer
      </Halo>
      <SecurityGroupBox x={98} y={602} w={40} h={40} />
      <Icon name="rds-instance" x={118} y={622} size={32} lines={["RDS"]} labelSize={10} halo={paper} />
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
          AWS three-tier architecture across two Availability Zones. Solid arrows are the request path: internet gateway,
          Application Load Balancer, EC2 instances in an Auto Scaling group, Amazon RDS. Dashed arrows are outbound traffic
          through each zone’s NAT gateway. Red outlines are security groups. Icons: AWS Architecture Icons.
        </>
      }
    >
      <Responsive
        label="AWS architecture diagram. In an AWS Region, a VPC spans two Availability Zones, each with a public subnet, a private application subnet, and a private data subnet. Users reach an internet gateway, then an Application Load Balancer across the public subnets, which forwards to EC2 instances in an Auto Scaling group across the private application subnets. The instances connect to an Amazon RDS database in a DB subnet group across the private data subnets, and reach the internet outbound through a NAT gateway in each public subnet. Security groups surround the load balancer, the instances, and the database."
        wide={<AwsWide />}
        compact={<AwsCompact />}
      />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* Fig. 02 — Linux operations                                          */
/* ------------------------------------------------------------------ */

const lanes: Array<{ name: string; detail: string; icon: string | null }> = [
  { name: "Administer", detail: "users · services · storage", icon: null },
  { name: "Patch", detail: "OS updates", icon: "shield" },
  { name: "Configure", detail: "managed configuration", icon: "gear" },
  { name: "Troubleshoot", detail: "logs · diagnosis", icon: "document" },
];

function LinuxWide() {
  const a = "url(#linux-arrow-w)";
  const ys = [96, 188, 280, 372];
  return (
    <svg viewBox="0 0 960 452" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="linux-arrow-w" color={ink} />
      </defs>
      <Halo x={80} y={190}>
        Admin workstation
      </Halo>
      <Icon name="client" x={80} y={232} size={52} />

      <Group kind="generic" x={700} y={36} w={236} h={392} label="Linux hosts" color={subtle} />
      {[124, 232, 340].map((y, i) => (
        <Icon key={y} name="servers" x={818} y={y} size={52} lines={[`host-0${i + 1}`]} labelSize={11} />
      ))}

      <g stroke={ink} strokeWidth="1.4">
        <path d="M108 232H180V96H690" markerEnd={a} />
        <path d="M180 188H370" />
        <path d="M430 188H690" markerEnd={a} />
        <path d="M180 232V280H370" />
        <path d="M430 280H690" markerEnd={a} />
      </g>
      <g stroke={ink} strokeWidth="1.4" strokeDasharray="5 4">
        <path d="M690 372H432" markerEnd={a} />
        <path d="M368 372H80V266" markerEnd={a} />
      </g>

      {lanes.map((lane, i) => (
        <g key={lane.name}>
          {lane.icon ? <Icon name={lane.icon} x={400} y={ys[i]} size={44} /> : null}
          <Halo x={456} y={ys[i] - 26} anchor="start" size={15}>
            {`0${i + 1}  ${lane.name}`}
          </Halo>
          <Halo x={456} y={ys[i] - 10} anchor="start" size={10.5} weight={400} fill={subtle} mono>
            {lane.detail.toUpperCase()}
          </Halo>
        </g>
      ))}
    </svg>
  );
}

function LinuxCompact() {
  const a = "url(#linux-arrow-c)";
  const ys = [170, 262, 354, 446];
  return (
    <svg viewBox="0 0 400 712" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="linux-arrow-c" color={ink} />
      </defs>
      <Icon name="client" x={200} y={44} size={48} lines={["Admin workstation"]} />

      <g stroke={ink} strokeWidth="1.3">
        <path d="M228 44H372V528" markerEnd={a} />
      </g>
      <g stroke={ink} strokeWidth="1.3" strokeDasharray="5 4">
        <path d="M44 600H22V44H172" markerEnd={a} />
      </g>

      {lanes.map((lane, i) => (
        <g key={lane.name}>
          {lane.icon ? (
            <Icon name={lane.icon} x={74} y={ys[i]} size={40} />
          ) : (
            <g>
              <circle cx="74" cy={ys[i]} r="18" fill={white} stroke={ink} strokeWidth="1.25" />
              <path d={`M64 ${ys[i]}h20M74 ${ys[i] - 10}v20`} stroke={ink} strokeWidth="1.25" />
            </g>
          )}
          <Halo x={108} y={ys[i] - 2} anchor="start" size={16}>
            {`0${i + 1}  ${lane.name}`}
          </Halo>
          <Halo x={108} y={ys[i] + 16} anchor="start" size={10} weight={400} fill={subtle} mono>
            {lane.detail.toUpperCase()}
          </Halo>
        </g>
      ))}

      <Group kind="generic" x={44} y={540} w={312} h={156} label="Linux hosts" color={subtle} />
      {[110, 200, 290].map((x, i) => (
        <Icon key={x} name="servers" x={x} y={616} size={44} lines={[`host-0${i + 1}`]} labelSize={10.5} />
      ))}
    </svg>
  );
}

export function LinuxOperationsFigure({ number, className }: { number: string; className?: string }) {
  return (
    <Plate
      number={number}
      className={className}
      caption="Scope of the operations work: from an admin workstation, the Linux hosts are administered, patched, and configured; logs and diagnostics come back for troubleshooting (dashed). Icons: AWS Architecture Icons (general)."
    >
      <Responsive
        label="Operations diagram. An admin workstation connects to a group of three Linux hosts through four lanes: administer (users, services, storage), patch (OS updates), and configure (managed configuration) go to the hosts; troubleshoot (logs and diagnosis) returns from the hosts to the workstation."
        wide={<LinuxWide />}
        compact={<LinuxCompact />}
      />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* Fig. 03 — Glomaf platform outline (dark)                            */
/* ------------------------------------------------------------------ */

function NightGroup({ x, y, w, h, label, dashed }: { x: number; y: number; w: number; h: number; label: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={dashed ? night.dim : night.mint} strokeWidth="1.25" strokeDasharray={dashed ? "6 4" : undefined} />
      <text x={x + 12} y={y + 20} fill={dashed ? night.dim : night.mint} fontSize="11" letterSpacing="0.06em" className="font-mono uppercase">
        {label}
      </text>
    </g>
  );
}

function Feature({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="36" fill={night.line} />
      <text x={x + 14} y={y + 22} fill={night.text} fontSize="11" letterSpacing="0.06em" className="font-mono uppercase">
        {label}
      </text>
    </g>
  );
}

function GlomafWide() {
  const a = "url(#glomaf-arrow-w)";
  const label = { fill: "#ffffff", halo: night.bg };
  return (
    <svg viewBox="0 0 960 420" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="glomaf-arrow-w" color={night.mint} />
      </defs>
      <g stroke={night.mint} strokeWidth="1.4">
        <path d="M96 210H190V118H290" markerEnd={a} />
        <path d="M190 210V302H290" markerEnd={a} />
        <path d="M370 118H556" markerEnd={a} />
        <path d="M370 302H470V118" />
      </g>
      <Icon name="users-dark" x={66} y={210} size={52} lines={["Users"]} {...label} />
      <Icon name="client-dark" x={330} y={118} size={52} lines={["Web app"]} {...label} />
      <Halo x={330} y={186} size={10.5} weight={400} fill={night.dim} halo={night.bg} mono>
        NEXT.JS
      </Halo>
      <Icon name="mobile-client-dark" x={330} y={302} size={52} lines={["Mobile app"]} {...label} />
      <Halo x={330} y={370} size={10.5} weight={400} fill={night.dim} halo={night.bg} mono>
        REACT NATIVE · EXPO
      </Halo>

      <NightGroup x={566} y={40} w={370} h={156} label="Backend" />
      <Icon name="database-dark" x={640} y={124} size={52} />
      <Halo x={684} y={120} anchor="start" size={17} {...label}>
        Supabase
      </Halo>
      <Halo x={684} y={140} anchor="start" size={10.5} weight={400} fill={night.dim} halo={night.bg} mono>
        MANAGED BACKEND
      </Halo>

      <NightGroup x={566} y={228} w={370} h={152} label="Product features" dashed />
      <Feature x={586} y={264} w={330} label="Authentication" />
      <Feature x={586} y={314} w={330} label="Messaging" />
    </svg>
  );
}

function GlomafCompact() {
  const a = "url(#glomaf-arrow-c)";
  const label = { fill: "#ffffff", halo: night.bg };
  return (
    <svg viewBox="0 0 400 680" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="glomaf-arrow-c" color={night.mint} />
      </defs>
      <g stroke={night.mint} strokeWidth="1.3">
        <path d="M200 70V112H110V140" markerEnd={a} />
        <path d="M200 112H290V140" markerEnd={a} />
        <path d="M110 262V292H200V320" markerEnd={a} />
        <path d="M290 262V292H200" />
      </g>
      <Icon name="users-dark" x={200} y={44} size={44} />
      <Halo x={232} y={48} anchor="start" size={12} {...label}>
        Users
      </Halo>
      <Icon name="client-dark" x={110} y={176} size={44} lines={["Web app"]} {...label} />
      <Halo x={110} y={246} size={10} weight={400} fill={night.dim} halo={night.bg} mono>
        NEXT.JS
      </Halo>
      <Icon name="mobile-client-dark" x={290} y={176} size={44} lines={["Mobile app"]} {...label} />
      <Halo x={290} y={246} size={10} weight={400} fill={night.dim} halo={night.bg} mono>
        RN · EXPO
      </Halo>

      <NightGroup x={16} y={330} w={368} h={140} label="Backend" />
      <Icon name="database-dark" x={78} y={408} size={48} />
      <Halo x={118} y={404} anchor="start" size={16} {...label}>
        Supabase
      </Halo>
      <Halo x={118} y={422} anchor="start" size={10} weight={400} fill={night.dim} halo={night.bg} mono>
        MANAGED BACKEND
      </Halo>

      <NightGroup x={16} y={498} w={368} h={154} label="Product features" dashed />
      <Feature x={34} y={536} w={332} label="Authentication" />
      <Feature x={34} y={588} w={332} label="Messaging" />
    </svg>
  );
}

export function GlomafPlatformFigure({ number, className }: { number: string; className?: string }) {
  return (
    <Plate
      number={number}
      className={className}
      tone="dark"
      caption="Platform outline: users reach a Next.js web app and a React Native (Expo) mobile app, both on one Supabase backend. Authentication and messaging are among the product’s features."
    >
      <Responsive
        label="Platform diagram. Users reach a Next.js web app and a React Native Expo mobile app; both connect to a Supabase backend. Product features include authentication and messaging."
        wide={<GlomafWide />}
        compact={<GlomafCompact />}
      />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* Fig. — CI/CD pipeline                                               */
/* ------------------------------------------------------------------ */

/** A third-party tool logo (Simple Icons, public/tool-icons) on a white tile, draw.io style. */
function Tile({
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

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
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
function Box({ x, y, w, h, label, logo }: { x: number; y: number; w: number; h: number; label: string; logo?: string }) {
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

function PipelineWide() {
  const a = "url(#cicd-arrow-w)";
  return (
    <svg viewBox="0 0 1000 650" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="cicd-arrow-w" color={ink} />
      </defs>

      {/* Groups */}
      <Box x={264} y={40} w={716} h={210} label="Jenkins pipeline" logo="jenkins" />
      <Group kind="cloud" x={420} y={300} w={560} h={186} label="AWS Cloud" />
      <Box x={420} y={520} w={560} h={116} label="Monitoring" />
      <Box x={20} y={300} w={360} h={186} label="Infrastructure as code" />

      {/* Flow */}
      <g stroke={ink} strokeWidth="1.4">
        <path d="M84 130H148" markerEnd={a} />
        <path d="M208 130H298" markerEnd={a} />
        <path d="M358 130H458" markerEnd={a} />
        <path d="M518 130H618" markerEnd={a} />
        <path d="M678 130H778" markerEnd={a} />
        <path d="M810 202V272H900V352" markerEnd={a} />
        <path d="M650 202V284H530V352" markerEnd={a} />
        <path d="M876 380H728" markerEnd={a} />
        <path d="M624 578H786" markerEnd={a} />
      </g>
      <g stroke={ink} strokeWidth="1.2" strokeDasharray="5 4">
        <path d="M490 102V66H180V100" markerEnd={a} />
        <path d="M530 436V500H586V548" markerEnd={a} />
        <path d="M700 436V500H614V548" markerEnd={a} />
        <path d="M380 393H414" markerEnd={a} />
      </g>

      {/* Nodes */}
      <Icon name="client" x={56} y={130} size={48} lines={["Developer"]} />
      <Halo x={56} y={186} size={10} weight={400} fill={subtle} mono>
        PUSH · PR
      </Halo>
      <Tile logo="github" x={180} y={130} lines={["GitHub"]} />
      <Tile logo="jenkins" x={330} y={130} lines={["Build & test"]} sub="Jenkins" />
      <Tile logo="sonarqubeserver" x={490} y={130} lines={["Quality gate"]} sub="SonarQube" />
      <Tile logo="sonatype" x={650} y={130} lines={["Publish artifact"]} sub="Nexus" />
      <Tile logo="docker" x={810} y={130} lines={["Build image"]} sub="Docker" />

      <Icon name="ec2" x={530} y={380} size={48} lines={["Amazon EC2"]} />
      <Icon name="eks" x={700} y={380} size={48} lines={["Amazon EKS"]} />
      <Icon name="ecr" x={900} y={380} size={48} lines={["Amazon ECR"]} />

      <Tile logo="prometheus" x={600} y={578} lines={["Prometheus"]} labelSize={11.5} />
      <Tile logo="grafana" x={812} y={578} lines={["Grafana"]} labelSize={11.5} />

      <Tile logo="terraform" x={92} y={386} lines={["Terraform"]} />
      <Halo x={150} y={376} anchor="start" size={11} weight={400} fill={subtle} mono>
        PROVISIONS VPC, EKS,
      </Halo>
      <Halo x={150} y={392} anchor="start" size={11} weight={400} fill={subtle} mono>
        EC2 AND NETWORKING
      </Halo>

      {/* Edge labels */}
      <Halo x={234} y={120} size={10} weight={400} fill={subtle} mono>
        WEBHOOK
      </Halo>
      <Halo x={500} y={60} anchor="start" size={10} weight={400} fill={subtle} mono>
        GATE FAILS → BUILD STOPS, STATUS TO GITHUB
      </Halo>
      <Halo x={830} y={266} anchor="start" size={10} weight={400} fill={subtle} mono>
        PUSH IMAGE
      </Halo>
      <Halo x={548} y={278} anchor="start" size={10} weight={400} fill={subtle} mono>
        DEPLOY ARTIFACT
      </Halo>
      <Halo x={802} y={372} size={10} weight={400} fill={subtle} mono halo={paper}>
        PULL IMAGE
      </Halo>
      <Halo x={636} y={516} size={10} weight={400} fill={subtle} mono>
        METRICS
      </Halo>

      <Badge x={120} y={112} n={1} />
      <Badge x={234} y={98} n={2} />
      <Badge x={408} y={112} n={3} />
      <Badge x={568} y={112} n={4} />
      <Badge x={728} y={112} n={5} />
      <Badge x={810} y={240} n={6} />
      <Badge x={650} y={240} n={7} />
      <Badge x={700} y={470} n={8} />
    </svg>
  );
}

function PipelineCompact() {
  const a = "url(#cicd-arrow-c)";
  const stages = [
    { logo: "jenkins", name: "Build & test", tool: "Jenkins", y: 182 },
    { logo: "sonarqubeserver", name: "Quality gate", tool: "SonarQube", y: 280 },
    { logo: "sonatype", name: "Publish artifact", tool: "Nexus", y: 378 },
    { logo: "docker", name: "Build image", tool: "Docker", y: 476 },
  ];
  return (
    <svg viewBox="0 0 400 1084" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="cicd-arrow-c" color={ink} />
      </defs>

      <Box x={16} y={112} w={368} h={432} label="Jenkins pipeline" logo="jenkins" />
      <Group kind="cloud" x={16} y={600} w={368} h={176} label="AWS Cloud" size={11} icon={20} />
      <Box x={16} y={808} w={368} h={124} label="Monitoring" />
      <Box x={16} y={964} w={368} h={108} label="Infrastructure as code" />

      <g stroke={ink} strokeWidth="1.3">
        <path d="M138 44H252" markerEnd={a} />
        <path d="M290 70V144H110V152" markerEnd={a} />
        {stages.slice(0, -1).map((stage, i) => (
          <path key={stage.y} d={`M110 ${stage.y + 26}V${stages[i + 1].y - 30}`} markerEnd={a} />
        ))}
        <path d="M110 502V570H320V646" markerEnd={a} />
        <path d="M84 378H44V580H80V646" markerEnd={a} />
        <path d="M296 672H226" markerEnd={a} />
        <path d="M144 870H256" markerEnd={a} />
      </g>
      <g stroke={ink} strokeWidth="1.1" strokeDasharray="4 4">
        <path d="M84 280H28V44H84" markerEnd={a} />
        <path d="M80 720V790H106V840" markerEnd={a} />
        <path d="M200 720V790H126V840" markerEnd={a} />
        <path d="M8 1018V688H14" markerEnd={a} />
      </g>

      <Icon name="client" x={110} y={44} size={40} />
      <Halo x={110} y={86} size={11}>
        Developer
      </Halo>
      <Tile logo="github" x={290} y={44} size={48} />
      <Halo x={290} y={86} size={11}>
        GitHub
      </Halo>

      {stages.map((stage, i) => (
        <g key={stage.name}>
          <Tile logo={stage.logo} x={110} y={stage.y} size={52} />
          <Halo x={152} y={stage.y - 2} anchor="start" size={15}>
            {`0${i + 2}  ${stage.name}`}
          </Halo>
          <Halo x={152} y={stage.y + 15} anchor="start" size={10} weight={400} fill={subtle} mono>
            {stage.tool.toUpperCase()}
          </Halo>
        </g>
      ))}
      <Halo x={36} y={268} anchor="start" size={9.5} weight={400} fill={subtle} mono>
        FAIL
      </Halo>

      <Icon name="ec2" x={80} y={672} size={40} lines={["EC2"]} labelSize={11} />
      <Icon name="eks" x={200} y={672} size={40} lines={["EKS"]} labelSize={11} />
      <Icon name="ecr" x={320} y={672} size={40} lines={["ECR"]} labelSize={11} />

      <Tile logo="prometheus" x={116} y={870} size={48} lines={["Prometheus"]} labelSize={11} />
      <Tile logo="grafana" x={284} y={870} size={48} lines={["Grafana"]} labelSize={11} />

      <Tile logo="terraform" x={76} y={1022} size={48} />
      <Halo x={116} y={1016} anchor="start" size={14}>
        Terraform
      </Halo>
      <Halo x={116} y={1032} anchor="start" size={9.5} weight={400} fill={subtle} mono>
        PROVISIONS VPC, EKS, EC2
      </Halo>
    </svg>
  );
}

export function PipelineFigure({ number, className }: { number: string; className?: string }) {
  return (
    <Plate
      number={number}
      className={className}
      caption={
        <>
          Pipeline design: (1) a push or pull request triggers Jenkins through a GitHub webhook; (2) build and unit tests;
          (3) SonarQube quality gate, which stops the build and reports to GitHub on failure; (4) the versioned artifact is
          published to Nexus; (5) a Docker image is built and (6) pushed to Amazon ECR; (7) EC2 receives the artifact and
          Amazon EKS pulls the image; (8) Prometheus collects metrics for Grafana. Terraform provisions the AWS
          infrastructure. Logos: Simple Icons; AWS icons: AWS Architecture Icons.
        </>
      }
    >
      <Responsive
        label="CI/CD pipeline diagram. A developer pushes to GitHub, which triggers a Jenkins pipeline by webhook. Jenkins builds and tests the code, runs a SonarQube quality gate (a failure stops the build and reports back to GitHub), publishes the artifact to Nexus, and builds a Docker image that is pushed to Amazon ECR. The Nexus artifact is deployed to Amazon EC2 and Amazon EKS pulls the image from ECR. Prometheus collects metrics from EC2 and EKS for Grafana dashboards. Terraform provisions the VPC, EKS, EC2 and networking."
        wide={<PipelineWide />}
        compact={<PipelineCompact />}
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
    case "cicd-pipeline":
      return <PipelineFigure number={number} className={className} />;
    case "glomaf-platform":
      return <GlomafPlatformFigure number={number} className={className} />;
  }
}

/** Figures drawn on the night ground. */
export const darkFigures: ReadonlySet<FigureName> = new Set(["glomaf-platform"]);
