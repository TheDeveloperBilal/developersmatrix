/**
 * One icon per tool, used on every surface (header menu, homepage sections,
 * /tools, search, blog recommendations). Change an icon here and it changes
 * everywhere. No two tools may share an icon.
 */
import {
  BadgeDollarSign,
  CalendarClock,
  FileSearch,
  FileUser,
  Fingerprint,
  Gamepad2,
  Library,
  Lightbulb,
  Mic,
  NotebookPen,
  PiggyBank,
  Radar,
  Repeat,
  Send,
  type LucideIcon,
} from 'lucide-react';

export const TOOL_ICONS = {
  'website-audit': FileSearch,
  'ai-content-detector': Fingerprint,
  'ai-resume-builder': FileUser,
  'ai-cover-letter-generator': NotebookPen,
  'ai-interview-simulator': Mic,
  'salary-estimator': BadgeDollarSign,
  'habit-tracker': Repeat,
  'startup-idea-generator': Lightbulb,
  'productivity-planner': CalendarClock,
  'ai-prompt-library': Library,
  'ai-email-assistant': Send,
  'budget-planner': PiggyBank,
  'can-you-run-it': Gamepad2,
} as const satisfies Record<string, LucideIcon>;

export type ToolSlug = keyof typeof TOOL_ICONS;

/** The trend radar is not a tool, but it gets its own icon and the slow sweep. */
export const TREND_RADAR_ICON: LucideIcon = Radar;

/** Interaction touches. Driven by CSS in globals.css (see "Tool icons"). */
const SIGNATURE: Partial<Record<ToolSlug, 'scan' | 'glow' | 'ping'>> = {
  'ai-content-detector': 'scan',
  'startup-idea-generator': 'glow',
  'ai-interview-simulator': 'ping',
};

/** Accepts a slug, "/tools/slug" or a deeper path like "/tools/can-you-run-it/gta-6". */
export function toolSlugFrom(hrefOrSlug: string): ToolSlug | undefined {
  const clean = hrefOrSlug.replace(/^https?:\/\/[^/]+/, '').replace(/[?#].*$/, '');
  const slug = clean.startsWith('/tools/') ? clean.split('/')[2] : clean.replace(/^\//, '');
  return slug in TOOL_ICONS ? (slug as ToolSlug) : undefined;
}

export function toolIconFor(hrefOrSlug: string): LucideIcon | undefined {
  const slug = toolSlugFrom(hrefOrSlug);
  return slug ? TOOL_ICONS[slug] : undefined;
}

interface ToolIconProps {
  /** Tool slug or link. */
  tool: string;
  className?: string;
  /** Fallback when the link is not a tool (rare; keeps call sites simple). */
  fallback?: LucideIcon;
  /** For the interview simulator: show the ping ring while a session runs. */
  active?: boolean;
  /** Draw the strokes in when scrolled into view (hero and eyebrow icons). */
  draw?: boolean;
  /** Classes for the wrapper, for icons sized as a percentage of their tile. */
  wrapClassName?: string;
}

/**
 * Renders the tool's icon at strokeWidth 2 inside a wrapper that carries the
 * hover tilt and the signature touch. The wrapper is inline-flex and sized by
 * the icon, so swapping a bare icon for <ToolIcon> does not move anything.
 */
export function ToolIcon({ tool, className, fallback, active, draw, wrapClassName }: ToolIconProps) {
  const slug = toolSlugFrom(tool);
  const Icon = slug ? TOOL_ICONS[slug] : fallback;
  if (!Icon) return null;
  const sig = slug ? SIGNATURE[slug] : undefined;
  return (
    <span
      className={wrapClassName ? `tool-icon ${wrapClassName}` : "tool-icon"}
      data-sig={sig}
      data-active={active ? 'true' : undefined}
      aria-hidden="true"
    >
      <Icon className={className} strokeWidth={2} data-draw={draw ? '' : undefined} />
    </span>
  );
}

/** Radar with the slow sweep, for the trends goal and the Trend Radar link. */
export function RadarIcon({ className }: { className?: string }) {
  return (
    <span className="tool-icon" data-sig="sweep" aria-hidden="true">
      <Radar className={className} strokeWidth={2} />
    </span>
  );
}

/** Icon for a link that may be a tool, the trend radar, or something else. */
export function LinkIcon({
  href,
  icon,
  className,
  wrapClassName,
}: {
  href: string;
  icon?: LucideIcon;
  className?: string;
  wrapClassName?: string;
}) {
  if (href === '/trends') return <RadarIcon className={className} />;
  return <ToolIcon tool={href} fallback={icon} className={className} wrapClassName={wrapClassName} />;
}

/**
 * Icon chosen by component rather than by link (goal buttons, section cards).
 * A tool's icon keeps that tool's signature touch wherever it appears.
 */
export function SignedIcon({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  if (Icon === Radar) return <RadarIcon className={className} />;
  const slug = (Object.keys(TOOL_ICONS) as ToolSlug[]).find((k) => TOOL_ICONS[k] === Icon);
  if (slug) return <ToolIcon tool={slug} className={className} />;
  return (
    <span className="tool-icon" aria-hidden="true">
      <Icon className={className} strokeWidth={2} />
    </span>
  );
}
