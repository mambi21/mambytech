import type { expertiseIcons } from "@/lib/content/schema";
import { cx } from "./ui";

/** Line icons drawn on a 24px grid. Decorative: always paired with visible text. */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function TerminalIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" {...base} className={cx("size-6", className)}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="m7 9 3 3-3 3M12.5 15H17" />
    </svg>
  );
}

export function CloudIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" {...base} className={cx("size-6", className)}>
      <path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.1 4.75 4.75 0 0 0 7 18.5Z" />
      <path d="M9.5 14.5h5M12 12v5" />
    </svg>
  );
}

export function PipelineIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" {...base} className={cx("size-6", className)}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 12h3M14 12h3M19 10V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
      <path d="m15 3 2 2-2 2" />
    </svg>
  );
}

export function PulseShieldIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" {...base} className={cx("size-6", className)}>
      <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.1 7.5 9.5 4.4-1.4 7.5-5.1 7.5-9.5V6L12 3Z" />
      <path d="M8 12.5h2l1.2-2.5 1.8 5 1.2-2.5H16" />
    </svg>
  );
}

export function BadgeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" {...base} className={cx("size-6", className)}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m9.5 9 1.7 1.7L14.6 7.3M8.5 13.6 7 21l5-2.5 5 2.5-1.5-7.4" />
    </svg>
  );
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={cx("size-5", className)}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" {...base} className={cx("size-4", className)}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

const expertiseIconMap: Record<(typeof expertiseIcons)[number], (props: IconProps) => React.JSX.Element> = {
  linux: TerminalIcon,
  cloud: CloudIcon,
  automation: PipelineIcon,
  reliability: PulseShieldIcon,
};

export function ExpertiseIcon({ name, className }: { name: (typeof expertiseIcons)[number]; className?: string }) {
  const Icon = expertiseIconMap[name];
  return <Icon className={className} />;
}
