import Image from "next/image";
import type { Profile } from "@/lib/content/schema";
import { Terminal } from "./terminal";

const C = {
  line: "#26302b",
  text: "#d6dfda",
  dim: "#8d9993",
  mint: "#7fcfa9",
  gold: "#e8c37a",
  brand: "#0e3b31",
  panel: "#18201c",
};

/**
 * Right-hand hero visual: the owner's portrait when one is configured,
 * otherwise a stylised infrastructure map. The map is decorative and doesn't
 * depict a specific system. The terminal overlaps it and is real text.
 */
export function HeroVisual({ profile, handle }: { profile: Profile; handle: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[34rem] lg:mr-0 lg:max-w-[30rem]">
      <div className="relative overflow-hidden rounded-3xl bg-term shadow-[0_40px_80px_-40px_rgb(17_23_20/0.7)] ring-1 ring-black/5">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 size-80 rounded-full bg-[radial-gradient(closest-side,rgb(127_207_169/0.22),transparent)]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-20 size-96 rounded-full bg-[radial-gradient(closest-side,rgb(14_59_49/0.9),transparent)]"
        />
        {profile.portrait ? (
          <Image
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            width={profile.portrait.width}
            height={profile.portrait.height}
            sizes="(min-width: 1024px) 34rem, 100vw"
            preload
            className="relative aspect-[12/11] h-auto w-full object-cover"
          />
        ) : (
          <InfrastructureMap />
        )}
      </div>
      {/* Overlaps the panel's empty bottom band. */}
      <div className="relative z-10 -mt-10 px-4 sm:pr-16 sm:pl-8 lg:-ml-10 lg:pr-24 lg:pl-0">
        <Terminal handle={handle} focus={profile.focusAreas} motto={profile.tagline} />
      </div>
    </div>
  );
}

function Server({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width="96" height="58" rx="9" fill={C.panel} stroke={C.line} strokeWidth="1.5" />
      {[0, 1].map((row) => (
        <g key={row}>
          <rect x={x + 10} y={y + 11 + row * 17} width="52" height="9" rx="2.5" fill={C.line} />
          <circle cx={x + 76} cy={y + 15.5 + row * 17} r="3" fill={C.mint} className="motion-safe:animate-[blink_2.4s_steps(1)_infinite]" style={{ animationDelay: `${(x + row * 400) % 1700}ms` }} />
        </g>
      ))}
      <text x={x + 48} y={y + 76} textAnchor="middle" fill={C.dim} fontSize="11" fontFamily="var(--font-mono)">
        {label}
      </text>
    </g>
  );
}

function InfrastructureMap() {
  const flow = "motion-safe:animate-[flow_1.6s_linear_infinite]";
  return (
    <svg aria-hidden="true" viewBox="0 0 480 440" className="relative block aspect-[12/11] h-auto w-full" fill="none">
      {/* Network boundary */}
      <rect x="28" y="96" width="424" height="290" rx="18" stroke={C.mint} strokeOpacity="0.35" strokeWidth="1.25" strokeDasharray="6 6" />
      <text x="46" y="120" fill={C.mint} fillOpacity="0.8" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        VPC
      </text>
      <rect x="44" y="216" width="392" height="1" fill={C.line} />
      <text x="430" y="210" textAnchor="end" fill={C.dim} fontSize="10" fontFamily="var(--font-mono)">
        private
      </text>
      <text x="430" y="120" textAnchor="end" fill={C.dim} fontSize="10" fontFamily="var(--font-mono)">
        public
      </text>

      {/* Links */}
      <g stroke={C.mint} strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 8" className={flow}>
        <path d="M240 64v62" />
        <path d="M240 162v26H96v38M240 188v38M240 188h144v38" />
        <path d="M96 310v12h288v-12M240 310v16" />
      </g>

      {/* Internet */}
      <g>
        <circle cx="240" cy="42" r="22" fill={C.panel} stroke={C.line} strokeWidth="1.5" />
        <path
          d="M231 46h17a5.5 5.5 0 0 0 .7-10.95A7.6 7.6 0 0 0 234 33.6 6 6 0 0 0 231 46Z"
          stroke={C.text}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Load balancer */}
      <rect x="182" y="126" width="116" height="36" rx="18" fill={C.brand} stroke={C.mint} strokeOpacity="0.6" strokeWidth="1.25" />
      <text x="240" y="148.5" textAnchor="middle" fill={C.text} fontSize="11.5" fontFamily="var(--font-mono)">
        load balancer
      </text>

      {/* App tier */}
      <Server x={48} y={226} label="app-01" />
      <Server x={192} y={226} label="app-02" />
      <Server x={336} y={226} label="app-03" />

      {/* Database */}
      <g>
        <path d="M206 337c0-6 15.2-11 34-11s34 5 34 11v24c0 6-15.2 11-34 11s-34-5-34-11v-24Z" fill={C.panel} stroke={C.gold} strokeOpacity="0.8" strokeWidth="1.5" />
        <path d="M206 337c0 6 15.2 11 34 11s34-5 34-11" stroke={C.gold} strokeOpacity="0.8" strokeWidth="1.5" />
        <path d="M206 350c0 6 15.2 11 34 11s34-5 34-11" stroke={C.gold} strokeOpacity="0.35" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
