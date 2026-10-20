import { Arrowhead, Halo, Icon, night } from "./primitives";
import { Plate, Responsive } from "./plate";

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

function GlomafWide({ marker = "glomaf-arrow-w" }: { marker?: string }) {
  const a = `url(#${marker})`;
  const label = { fill: "#ffffff", halo: night.bg };
  return (
    <svg viewBox="0 0 960 420" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id={marker} color={night.mint} />
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
        full={<GlomafWide marker="glomaf-arrow-w-full" />}
        compact={<GlomafCompact />}
      />
    </Plate>
  );
}
