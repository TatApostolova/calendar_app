'use client';

// components/dashboard/chicken-visuals.tsx
// Activity icons for the "Crazy Chickens" family calendar.
// Each icon is a small, distinct vignette — the chicken's pose, outfit and
// scene composition change from one activity to the next so the icons read
// as their own little characters rather than "chicken + prop".
//
// Designed to read clearly at 36–56px. Inline SVG only, no external assets,
// no emoji.

import * as React from 'react';
import { EventWithAttendees } from '@/lib/types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

export const CHICKEN_COLORS = {
  cream: '#FFF8E7',
  yolk: '#FFC93C',
  deepYolk: '#F5B82E',
  comb: '#E84C3D',
  beak: '#FF8A3D',
  sky: '#6FB7E0',
  meadow: '#7BB069',
  lilac: '#B8A5D9',
  text: '#2B1810',
} as const;

const C = CHICKEN_COLORS;

// ---------------------------------------------------------------------------
// Shared types & SVG frame
// ---------------------------------------------------------------------------

export interface ChickenIconProps {
  size?: number;
  className?: string;
}

interface SvgFrameProps extends ChickenIconProps {
  children: React.ReactNode;
  bg?: string;
}

/** Rounded square frame, 64×64 viewBox, optional tinted background. */
const SvgFrame: React.FC<SvgFrameProps> = ({ size = 48, className, children, bg }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    {bg && <rect x="2" y="2" width="60" height="60" rx="16" fill={bg} />}
    {children}
  </svg>
);

// ---------------------------------------------------------------------------
// Shared primitive: ChickenHead
// ---------------------------------------------------------------------------
// A reusable head: used directly when the icon doesn't need a custom pose
// (movie night, drinks etc.) — but most activity icons draw the chicken
// bespoke so the silhouette is unique.

interface ChickenHeadProps {
  cx: number;
  cy: number;
  r?: number;
  facing?: 'left' | 'right';
  body?: string;
  comb?: boolean;
  beak?: boolean;
  closedEyes?: boolean;
}

const ChickenHead: React.FC<ChickenHeadProps> = ({
  cx,
  cy,
  r = 8,
  facing = 'right',
  body = C.yolk,
  comb = true,
  beak = true,
  closedEyes = false,
}) => {
  const dir = facing === 'right' ? 1 : -1;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.95} fill={body} />
      {comb && (
        <path
          d={`M${cx - r * 0.45} ${cy - r * 0.85}
              q ${r * 0.22} ${-r * 0.55} ${r * 0.45} 0
              q ${r * 0.22} ${-r * 0.55} ${r * 0.45} 0 Z`}
          fill={C.comb}
        />
      )}
      {closedEyes ? (
        <path
          d={`M${cx + dir * r * 0.2} ${cy - r * 0.1}
              q ${dir * r * 0.18} ${r * 0.18} ${dir * r * 0.36} 0`}
          stroke={C.text}
          strokeWidth={r * 0.18}
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <>
          <circle cx={cx + dir * r * 0.35} cy={cy - r * 0.1} r={r * 0.18} fill={C.text} />
          <circle cx={cx + dir * r * 0.4} cy={cy - r * 0.18} r={r * 0.07} fill="#fff" />
        </>
      )}
      {beak && (
        <path
          d={`M${cx + dir * r * 0.78} ${cy + r * 0.05}
              l ${dir * r * 0.46} ${r * 0.18}
              l ${-dir * r * 0.4} ${r * 0.22} Z`}
          fill={C.beak}
        />
      )}
    </g>
  );
};

export function ChickenMascot({
  size = 64,
  className,
}: ChickenIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
    >
      <line x1="42" y1="82" x2="42" y2="93" stroke={C.beak} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="58" y1="82" x2="58" y2="93" stroke={C.beak} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="38" y1="93" x2="46" y2="93" stroke={C.beak} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="54" y1="93" x2="62" y2="93" stroke={C.beak} strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="50" cy="55" rx="32" ry="30" fill={C.yolk} />
      <ellipse cx="50" cy="62" rx="20" ry="16" fill="rgba(255,255,255,0.35)" />
      <ellipse cx="38" cy="58" rx="10" ry="14" fill="rgba(0,0,0,0.08)" transform="rotate(-8 38 58)" />
      <path d="M40 27 Q42 17, 46 25 Q50 15, 54 25 Q58 17, 60 27 Z" fill={C.comb} />
      <circle cx="60" cy="42" r="3.2" fill={C.text} />
      <circle cx="61" cy="41" r="1" fill="#fff" />
      <path d="M68 46 L78 49 L68 51 Z" fill={C.beak} />
      <ellipse cx="65" cy="54" rx="3" ry="4" fill={C.comb} />
    </svg>
  );
}

export function ChickIcon({
  size = 32,
  className,
}: ChickenIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="50" cy="55" rx="34" ry="32" fill="#FFE066" />
      <circle cx="62" cy="44" r="3.5" fill={C.text} />
      <circle cx="63" cy="43" r="1.2" fill="#fff" />
      <path d="M72 48 L82 51 L72 53 Z" fill={C.beak} />
      <path d="M44 22 L48 14 L52 22" stroke="#FFE066" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function EggIcon({
  size = 28,
  className,
}: ChickenIconProps) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 50 60"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="25" cy="34" rx="20" ry="24" fill="#F9E6B0" />
    </svg>
  );
}

export function FeedSpecks({
  className,
}: {
  className?: string;
}) {
  const seeds = [
    [8, 12, 2],
    [31, 22, 1.6],
    [55, 14, 2.2],
    [82, 24, 1.8],
    [109, 12, 2],
    [132, 20, 1.5],
  ];

  return (
    <svg width="148" height="36" viewBox="0 0 148 36" aria-hidden="true" className={className}>
      {seeds.map(([cx, cy, r], index) => (
        <circle key={index} cx={cx} cy={cy} r={r} fill="#8B5A2B" opacity={0.35 + (index % 3) * 0.15} />
      ))}
    </svg>
  );
}

export function ActivityBadge({
  event,
  compact = false,
}: {
  event: EventWithAttendees;
  compact?: boolean;
}) {
  const Icon = getChickenActivityIcon(`${event.title} ${event.description || ''} ${event.location || ''}`);

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm',
        compact ? 'h-9 w-9' : 'h-12 w-12'
      )}
      title="Activity"
      aria-label="Activity"
    >
      <Icon size={compact ? 36 : 48} />
    </span>
  );
}

// ---------------------------------------------------------------------------
// 1. DANCE — chicken in a lilac tutu, on tiptoe, swirl of motion
// ---------------------------------------------------------------------------

export const DanceChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.lilac + '33'}>
    {/* swirl of motion */}
    <path
      d="M10 32 q 0 -16 16 -20"
      stroke={C.comb}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      opacity="0.7"
    />
    <path
      d="M54 30 q 2 14 -12 22"
      stroke={C.comb}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      opacity="0.7"
    />
    {/* body */}
    <ellipse cx="32" cy="28" rx="11" ry="12" fill={C.yolk} />
    {/* comb */}
    <path d="M27 17 q 2 -3 4 0 q 2 -3 4 0 q 2 -3 4 0 Z" fill={C.comb} />
    {/* eye + beak */}
    <circle cx="36" cy="26" r="1.6" fill={C.text} />
    <path d="M42 28 l 4 1 l -4 2 z" fill={C.beak} />
    {/* raised wings */}
    <path
      d="M22 28 q -6 -6 -8 -14"
      stroke={C.deepYolk}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M42 26 q 6 -4 12 -10"
      stroke={C.deepYolk}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    {/* tutu — ruffled disc */}
    <path
      d="M16 40 q 4 -4 8 -2 q 4 -4 8 0 q 4 -4 8 0 q 4 -2 8 2 q -4 8 -16 8 q -12 0 -16 -8 Z"
      fill={C.lilac}
    />
    <path
      d="M16 40 q 8 4 16 4 q 8 0 16 -4"
      stroke={C.cream}
      strokeWidth="1.2"
      fill="none"
      opacity="0.7"
    />
    {/* tiptoe legs */}
    <path d="M28 48 L 26 58" stroke={C.beak} strokeWidth="2" strokeLinecap="round" />
    <path d="M36 48 L 38 58" stroke={C.beak} strokeWidth="2" strokeLinecap="round" />
    <path d="M24 58 l 4 0 M36 58 l 4 0" stroke={C.beak} strokeWidth="2" strokeLinecap="round" />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 2. WATER POLO — chicken in cap, half submerged, throwing ball, splash
// ---------------------------------------------------------------------------

export const WaterPoloChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.sky + '33'}>
    {/* ball + arc */}
    <path
      d="M18 30 q 14 -22 30 -8"
      stroke={C.text}
      strokeWidth="1.4"
      strokeDasharray="2 3"
      fill="none"
      opacity="0.6"
    />
    <circle cx="48" cy="22" r="6" fill={C.deepYolk} stroke={C.text} strokeWidth="1.2" />
    <path
      d="M42 22 h12 M48 16 v12 M44 18 q4 4 8 8 M52 18 q-4 4 -8 8"
      stroke={C.text}
      strokeWidth="1"
      fill="none"
    />
    {/* head */}
    <ellipse cx="22" cy="30" rx="9" ry="8.5" fill={C.yolk} />
    {/* swim cap */}
    <path d="M14 28 q 0 -10 9 -10 q 9 0 9 10 Z" fill={C.comb} />
    <circle cx="20" cy="22" r="1.2" fill={C.cream} />
    <circle cx="26" cy="22" r="1.2" fill={C.cream} />
    {/* ear cap circle */}
    <circle cx="14.5" cy="28" r="2.4" fill={C.deepYolk} stroke={C.text} strokeWidth="0.8" />
    {/* eye + beak */}
    <circle cx="26" cy="30" r="1.4" fill={C.text} />
    <path d="M30 31 l 4 1 l -4 2 z" fill={C.beak} />
    {/* throwing wing */}
    <path
      d="M28 28 q 6 -6 14 -8"
      stroke={C.deepYolk}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    {/* water surface */}
    <path
      d="M2 40 q 4 -3 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 V 60 H 2 Z"
      fill={C.sky}
    />
    {/* splash */}
    <path
      d="M12 38 l -1 -4 M16 36 l 0 -5 M9 41 l -4 -2"
      stroke={C.cream}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M32 40 q 4 -3 8 0 t 8 0"
      stroke={C.cream}
      strokeWidth="1.2"
      fill="none"
      opacity="0.8"
    />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 3. BEACH — chick in sunglasses with sand bucket + spade, sand + sun
// ---------------------------------------------------------------------------

export const BeachChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.sky + '33'}>
    {/* sun */}
    <circle cx="50" cy="14" r="5" fill={C.deepYolk} />
    <g stroke={C.deepYolk} strokeWidth="1.4" strokeLinecap="round">
      <path d="M50 4 v3" />
      <path d="M58 8 l -2 2" />
      <path d="M42 8 l 2 2" />
      <path d="M58 22 l -2 -2" />
    </g>
    {/* sand */}
    <path d="M2 48 q 16 -6 30 -1 t 30 -1 V 60 H 2 Z" fill={C.deepYolk} opacity="0.5" />
    {/* chick body */}
    <ellipse cx="22" cy="36" rx="11" ry="10" fill={C.yolk} />
    {/* tuft on head */}
    <path d="M20 22 l 2 -4 l 2 4" stroke={C.deepYolk} strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* sunglasses */}
    <rect x="14" y="32" width="7" height="4" rx="1" fill={C.text} />
    <rect x="23" y="32" width="7" height="4" rx="1" fill={C.text} />
    <path d="M21 33 h 2" stroke={C.text} strokeWidth="1.2" />
    {/* shine on lens */}
    <path d="M16 33 l 2 -0.5" stroke={C.cream} strokeWidth="0.8" />
    {/* beak — smiling */}
    <path d="M30 36 l 4 1 l -4 2 z" fill={C.beak} />
    {/* sand bucket */}
    <path
      d="M40 36 L 56 36 L 53 50 L 43 50 Z"
      fill={C.comb}
      stroke={C.text}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M40 36 q 8 -3 16 0" stroke={C.text} strokeWidth="1.4" fill="none" />
    {/* spade */}
    <path d="M56 24 L 50 38" stroke={C.text} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M55 22 l 4 0 l 0 4 l -4 0 z" fill={C.lilac} stroke={C.text} strokeWidth="1.2" />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 4. SKIING — chicken in beanie + flowing scarf, hunched on skis down slope
// ---------------------------------------------------------------------------

export const SkiingChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.sky + '22'}>
    {/* slope */}
    <path d="M2 50 L 62 24 L 62 60 L 2 60 Z" fill={C.cream} />
    {/* snowflakes */}
    <circle cx="10" cy="10" r="1.2" fill={C.sky} />
    <circle cx="30" cy="6" r="1.2" fill={C.sky} />
    <circle cx="20" cy="18" r="1" fill={C.sky} />
    {/* skis */}
    <path d="M14 46 L 38 34" stroke={C.comb} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M18 50 L 42 38" stroke={C.comb} strokeWidth="2.4" strokeLinecap="round" />
    {/* tips */}
    <path d="M36 34 q 4 -1 4 -3" stroke={C.comb} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <path d="M40 38 q 4 -1 4 -3" stroke={C.comb} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    {/* hunched body */}
    <ellipse cx="28" cy="34" rx="10" ry="7" fill={C.yolk} transform="rotate(-18 28 34)" />
    {/* head */}
    <ellipse cx="36" cy="26" rx="7" ry="6.5" fill={C.yolk} />
    {/* beak */}
    <path d="M42 26 l 4 1 l -4 2 z" fill={C.beak} />
    {/* eye */}
    <circle cx="38" cy="25" r="1.2" fill={C.text} />
    {/* beanie */}
    <path
      d="M30 22 q 6 -8 14 -4 q -1 4 -4 5 q -4 1 -10 -1 Z"
      fill={C.lilac}
    />
    <circle cx="44" cy="17" r="2" fill={C.cream} />
    {/* scarf flowing back */}
    <path
      d="M30 30 q -8 -1 -12 -8"
      stroke={C.comb}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M18 22 l -3 1 M16 24 l -3 -1"
      stroke={C.comb}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* ski pole */}
    <path d="M28 32 L 26 50" stroke={C.text} strokeWidth="1.4" strokeLinecap="round" />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 5. SURFING — chick crouched on board inside the curl of a big wave
// ---------------------------------------------------------------------------

export const SurfingChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.sky + '33'}>
    {/* curling wave behind */}
    <path
      d="M2 22 Q 18 4 38 16 Q 56 26 62 14 L 62 60 L 2 60 Z"
      fill={C.sky}
    />
    <path
      d="M14 18 Q 26 10 38 16 Q 52 24 60 16"
      stroke={C.cream}
      strokeWidth="2"
      fill="none"
    />
    {/* curl spray */}
    <circle cx="52" cy="14" r="1.6" fill={C.cream} />
    <circle cx="58" cy="18" r="1.2" fill={C.cream} />
    <circle cx="50" cy="20" r="1.2" fill={C.cream} />
    {/* surfboard tilted */}
    <ellipse cx="26" cy="44" rx="16" ry="3.5" fill={C.comb} transform="rotate(-14 26 44)" />
    <path
      d="M14 47 L 38 41"
      stroke={C.cream}
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.6"
    />
    {/* chick — crouched */}
    <ellipse cx="26" cy="34" rx="8" ry="6.5" fill={C.yolk} transform="rotate(-12 26 34)" />
    {/* head */}
    <ellipse cx="32" cy="28" rx="6" ry="5.5" fill={C.yolk} />
    {/* tuft */}
    <path d="M30 22 l 1.5 -3 l 1.5 3" stroke={C.deepYolk} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <circle cx="34" cy="27" r="1" fill={C.text} />
    <path d="M37 28 l 3 1 l -3 1.5 z" fill={C.beak} />
    {/* arms out for balance */}
    <path d="M20 32 q -4 -2 -6 -6" stroke={C.deepYolk} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <path d="M30 35 q 4 0 7 -3" stroke={C.deepYolk} strokeWidth="2.2" fill="none" strokeLinecap="round" />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 6. SWIMMING — chicken in cap + goggles doing a stroke, mid-splash
// ---------------------------------------------------------------------------

export const SwimmingChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.sky + '33'}>
    {/* lane lines */}
    <path d="M2 14 H 62" stroke={C.cream} strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
    <path d="M2 56 H 62" stroke={C.cream} strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
    {/* horizontal body */}
    <ellipse cx="32" cy="36" rx="16" ry="7" fill={C.yolk} />
    {/* head (right side) */}
    <ellipse cx="46" cy="34" rx="7" ry="6.5" fill={C.yolk} />
    {/* swim cap on head */}
    <path d="M40 34 q 0 -8 6 -8 q 6 0 6 8 Z" fill={C.meadow} />
    {/* goggles */}
    <circle cx="48" cy="34" r="2" fill={C.cream} stroke={C.text} strokeWidth="0.8" />
    <circle cx="44" cy="34" r="2" fill={C.cream} stroke={C.text} strokeWidth="0.8" />
    {/* beak */}
    <path d="M52 36 l 4 1 l -4 1.5 z" fill={C.beak} />
    {/* extended forward wing */}
    <path
      d="M54 34 q 4 -2 8 -2"
      stroke={C.deepYolk}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    {/* back wing kicking up splash */}
    <path
      d="M18 34 q -6 -4 -10 0"
      stroke={C.deepYolk}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    {/* tail feathers */}
    <path d="M14 38 l -4 4 M12 36 l -6 2" stroke={C.deepYolk} strokeWidth="2" strokeLinecap="round" />
    {/* water splash drops */}
    <circle cx="6" cy="46" r="1.4" fill={C.cream} />
    <circle cx="14" cy="48" r="1" fill={C.cream} />
    <circle cx="60" cy="28" r="1.2" fill={C.cream} />
    {/* wave under */}
    <path
      d="M2 48 q 6 -3 12 0 t 12 0 t 12 0 t 12 0 t 12 0"
      stroke={C.sky}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 7. GYMNASTICS — chicken doing a handstand on balance beam, ribbon spiral
// ---------------------------------------------------------------------------

export const GymnasticsChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.lilac + '33'}>
    {/* ribbon spiral */}
    <path
      d="M50 12 q -8 6 -6 14 q 2 8 -8 10 q -10 2 -10 -6"
      stroke={C.comb}
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
    />
    {/* ribbon stick */}
    <path d="M52 10 L 56 6" stroke={C.text} strokeWidth="1.6" strokeLinecap="round" />
    {/* upside-down body */}
    <ellipse cx="26" cy="30" rx="8" ry="9" fill={C.yolk} />
    {/* leotard band */}
    <path d="M18 30 q 8 4 16 0" stroke={C.lilac} strokeWidth="3" fill="none" />
    {/* upside-down head */}
    <ellipse cx="26" cy="44" rx="6" ry="5.5" fill={C.yolk} />
    {/* comb pointing down */}
    <path d="M23 50 q 1.5 3 3 0 q 1.5 3 3 0 Z" fill={C.comb} />
    <circle cx="29" cy="44" r="1.2" fill={C.text} />
    <path d="M32 43 l 3 1 l -3 1.5 z" fill={C.beak} />
    {/* legs pointing up in V */}
    <path d="M22 22 L 16 10" stroke={C.beak} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M30 22 L 36 10" stroke={C.beak} strokeWidth="2.2" strokeLinecap="round" />
    {/* balance beam */}
    <rect x="6" y="50" width="44" height="4" rx="1" fill={C.deepYolk} />
    <path d="M10 54 L 8 60 M46 54 L 48 60" stroke={C.text} strokeWidth="1.6" strokeLinecap="round" />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 8. MUSIC LESSON — chicken playing violin (instrument tucked under wing)
// ---------------------------------------------------------------------------

export const MusicLessonChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.lilac + '33'}>
    {/* music notes floating */}
    <g fill={C.text}>
      <circle cx="52" cy="14" r="2" />
      <path d="M54 14 v -8 l 4 -1 v 2 l -4 1" />
      <circle cx="14" cy="22" r="1.6" />
      <path d="M15.6 22 v -6" stroke={C.text} strokeWidth="1.4" />
    </g>
    {/* chicken body */}
    <ellipse cx="22" cy="40" rx="11" ry="11" fill={C.yolk} />
    {/* head tilted */}
    <ellipse cx="28" cy="28" rx="7" ry="6.5" fill={C.yolk} transform="rotate(-14 28 28)" />
    {/* comb */}
    <path d="M22 22 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    <circle cx="30" cy="27" r="1.3" fill={C.text} />
    <path d="M34 28 l 4 1 l -4 1.5 z" fill={C.beak} />
    {/* violin body — tucked between head + body */}
    <path
      d="M34 32 Q 50 30 52 42 Q 50 52 38 50 Q 30 48 32 40 Z"
      fill={C.comb}
      stroke={C.text}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* violin neck */}
    <rect x="46" y="22" width="3" height="12" rx="0.6" fill={C.text} transform="rotate(-26 47.5 28)" />
    {/* strings */}
    <path
      d="M37 36 Q 46 32 50 28"
      stroke={C.cream}
      strokeWidth="0.8"
      fill="none"
    />
    {/* bow */}
    <path
      d="M16 22 L 44 36"
      stroke={C.text}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M16 23 L 44 37"
      stroke={C.cream}
      strokeWidth="0.8"
      strokeLinecap="round"
    />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 9. CAMPING — chicken in sleeping bag toasting a marshmallow under stars
// ---------------------------------------------------------------------------

export const CampingChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.text + '11'}>
    {/* stars */}
    <g fill={C.yolk}>
      <circle cx="10" cy="10" r="1.4" />
      <circle cx="54" cy="8" r="1.4" />
      <circle cx="38" cy="6" r="1" />
      <circle cx="22" cy="6" r="1" />
    </g>
    {/* tent silhouette behind */}
    <path d="M40 50 L 54 22 L 60 50 Z" fill={C.comb} opacity="0.85" />
    <path d="M54 22 L 54 50" stroke={C.cream} strokeWidth="1.2" />
    {/* ground */}
    <path d="M2 50 H 62" stroke={C.text} strokeWidth="1.4" opacity="0.4" />
    {/* sleeping bag — chicken poking out the top */}
    <path
      d="M6 46 q 0 -6 6 -6 L 32 40 q 6 0 6 6 L 38 54 q 0 4 -4 4 L 10 58 q -4 0 -4 -4 Z"
      fill={C.lilac}
      stroke={C.text}
      strokeWidth="1.2"
    />
    <path
      d="M6 48 q 4 2 8 0 q 4 2 8 0 q 4 2 8 0 q 4 2 8 0"
      stroke={C.cream}
      strokeWidth="1"
      fill="none"
      opacity="0.7"
    />
    {/* chicken head poking out */}
    <ellipse cx="16" cy="36" rx="7" ry="6.5" fill={C.yolk} />
    <path d="M13 30 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    <circle cx="19" cy="36" r="1.2" fill={C.text} />
    <path d="M22 37 l 3 1 l -3 1.5 z" fill={C.beak} />
    {/* marshmallow stick */}
    <path d="M24 38 L 46 28" stroke={C.text} strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="46" cy="28" r="3" fill={C.cream} stroke={C.text} strokeWidth="0.8" />
    {/* fire glow */}
    <path
      d="M48 36 q -2 -3 0 -6 q 1 1 2 0 q 0 3 -2 6 z"
      fill={C.beak}
    />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 10. BIRTHDAY — chicken in pointy party hat, confetti, holding cupcake
// ---------------------------------------------------------------------------

export const BirthdayChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.comb + '22'}>
    {/* confetti */}
    <rect x="8" y="14" width="2" height="4" fill={C.lilac} transform="rotate(20 9 16)" />
    <rect x="50" y="20" width="2" height="4" fill={C.meadow} transform="rotate(-30 51 22)" />
    <rect x="14" y="34" width="2" height="4" fill={C.sky} transform="rotate(40 15 36)" />
    <rect x="54" y="40" width="2" height="4" fill={C.yolk} transform="rotate(-15 55 42)" />
    {/* body */}
    <ellipse cx="24" cy="40" rx="12" ry="12" fill={C.yolk} />
    {/* head */}
    <ellipse cx="24" cy="28" rx="8" ry="7.5" fill={C.yolk} />
    {/* party hat */}
    <path d="M16 22 L 24 6 L 32 22 Z" fill={C.lilac} stroke={C.text} strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M18 18 l 12 0" stroke={C.comb} strokeWidth="1.6" />
    <circle cx="24" cy="6" r="2" fill={C.comb} />
    {/* eye + beak */}
    <circle cx="27" cy="28" r="1.4" fill={C.text} />
    <path d="M30 29 l 4 1 l -4 1.5 z" fill={C.beak} />
    {/* wing holding cupcake */}
    <path d="M30 36 q 4 0 6 -2" stroke={C.deepYolk} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    {/* cupcake */}
    <path d="M40 44 L 42 54 L 54 54 L 56 44 Z" fill={C.cream} stroke={C.text} strokeWidth="1.2" />
    <path d="M40 44 L 56 44" stroke={C.text} strokeWidth="1.2" />
    <path d="M40 38 q 6 -6 16 0 q -2 4 -8 4 q -6 0 -8 -4 z" fill={C.comb} />
    {/* candle */}
    <rect x="47" y="30" width="2" height="6" fill={C.cream} />
    <path d="M48 30 q -2 -3 0 -5 q 2 3 0 5 z" fill={C.deepYolk} />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 11. SCHOOL — chicken in graduation cap with apple and pencil
// ---------------------------------------------------------------------------

export const SchoolChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.meadow + '22'}>
    {/* chalkboard */}
    <rect x="6" y="36" width="34" height="20" rx="2" fill={C.text} stroke={C.deepYolk} strokeWidth="1.4" />
    <path d="M12 42 l 8 0 M12 46 l 14 0 M12 50 l 10 0" stroke={C.cream} strokeWidth="1.2" strokeLinecap="round" />
    {/* body */}
    <ellipse cx="44" cy="38" rx="11" ry="11" fill={C.yolk} />
    {/* head */}
    <ellipse cx="44" cy="22" rx="8" ry="7.5" fill={C.yolk} />
    {/* mortar board hat */}
    <rect x="36" y="14" width="16" height="3" rx="0.6" fill={C.text} />
    <path d="M40 14 L 44 8 L 48 14 Z" fill={C.text} />
    {/* tassel */}
    <path d="M52 15 q 2 2 0 6" stroke={C.comb} strokeWidth="1.4" fill="none" />
    <circle cx="52" cy="22" r="1.4" fill={C.comb} />
    {/* eye + beak */}
    <circle cx="47" cy="23" r="1.3" fill={C.text} />
    <path d="M50 24 l 4 1 l -4 1.5 z" fill={C.beak} />
    {/* wing pointing at board */}
    <path d="M38 32 q -4 2 -6 4" stroke={C.deepYolk} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    {/* pencil */}
    <path
      d="M54 42 L 60 48 L 56 52 L 50 46 Z"
      fill={C.deepYolk}
      stroke={C.text}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M50 46 L 48 44" stroke={C.text} strokeWidth="1.4" strokeLinecap="round" />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 12. DOCTOR — chicken with stethoscope around neck + nurse hat
// ---------------------------------------------------------------------------

export const DoctorChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.comb + '1f'}>
    {/* body */}
    <ellipse cx="32" cy="42" rx="14" ry="13" fill={C.yolk} />
    {/* white coat front */}
    <path
      d="M22 38 q 10 6 20 0 L 44 56 q -12 4 -24 0 Z"
      fill={C.cream}
      stroke={C.text}
      strokeWidth="1.2"
    />
    <circle cx="32" cy="46" r="0.8" fill={C.text} />
    <circle cx="32" cy="50" r="0.8" fill={C.text} />
    {/* head */}
    <ellipse cx="32" cy="22" rx="9" ry="8.5" fill={C.yolk} />
    {/* nurse cap */}
    <path d="M24 16 L 40 16 L 40 12 L 24 12 Z" fill={C.cream} stroke={C.text} strokeWidth="1.2" />
    <path d="M30 14 h 4 v -3 h -4 z" fill={C.comb} />
    <path d="M32 12.5 v -3 M30.5 11 h 3" stroke={C.comb} strokeWidth="1.2" />
    {/* eye + beak */}
    <circle cx="35" cy="22" r="1.4" fill={C.text} />
    <path d="M38 23 l 4 1 l -4 1.5 z" fill={C.beak} />
    {/* stethoscope */}
    <path
      d="M20 30 q -6 8 0 14 q 4 4 8 0"
      stroke={C.text}
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M44 30 q 6 8 0 14"
      stroke={C.text}
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="28" cy="46" r="2.6" fill={C.comb} stroke={C.text} strokeWidth="1" />
    <circle cx="44" cy="44" r="2" fill={C.cream} stroke={C.text} strokeWidth="0.8" />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 13. MOVIE NIGHT — chicken in 3D glasses with popcorn bucket
// ---------------------------------------------------------------------------

export const MovieNightChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.text + '14'}>
    {/* film strip top */}
    <rect x="2" y="6" width="60" height="6" fill={C.text} />
    <g fill={C.cream}>
      <rect x="6" y="8" width="3" height="2" />
      <rect x="14" y="8" width="3" height="2" />
      <rect x="22" y="8" width="3" height="2" />
      <rect x="30" y="8" width="3" height="2" />
      <rect x="38" y="8" width="3" height="2" />
      <rect x="46" y="8" width="3" height="2" />
      <rect x="54" y="8" width="3" height="2" />
    </g>
    {/* head */}
    <ellipse cx="22" cy="30" rx="10" ry="9" fill={C.yolk} />
    <path d="M18 22 q 1.5 -3 3 0 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    {/* 3D glasses */}
    <rect x="13" y="28" width="8" height="5" rx="1" fill={C.comb} />
    <rect x="23" y="28" width="8" height="5" rx="1" fill={C.sky} />
    <path d="M21 30.5 h 2" stroke={C.text} strokeWidth="1" />
    {/* beak */}
    <path d="M30 34 l 4 1 l -4 1.5 z" fill={C.beak} />
    {/* wing holding bucket */}
    <path d="M30 40 q 6 0 10 2" stroke={C.deepYolk} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    {/* popcorn bucket */}
    <path
      d="M36 42 L 60 42 L 56 58 L 40 58 Z"
      fill={C.comb}
      stroke={C.text}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M36 46 L 60 46" stroke={C.cream} strokeWidth="0.8" opacity="0.7" />
    <path d="M48 42 L 48 58" stroke={C.cream} strokeWidth="0.8" opacity="0.7" />
    {/* popcorn pieces */}
    <circle cx="40" cy="38" r="2.8" fill={C.cream} />
    <circle cx="48" cy="36" r="3" fill={C.cream} />
    <circle cx="56" cy="38" r="2.6" fill={C.cream} />
    <circle cx="44" cy="40" r="2" fill={C.deepYolk} />
    <circle cx="52" cy="40" r="2" fill={C.deepYolk} />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 14. THEATRE — chicken peeking from between two stage curtains, spotlight
// ---------------------------------------------------------------------------

export const TheatreChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.text + '1c'}>
    {/* stage floor */}
    <rect x="2" y="50" width="60" height="10" fill={C.deepYolk} />
    <path d="M2 50 L 62 50" stroke={C.text} strokeWidth="1.4" />
    {/* spotlight cone */}
    <path d="M32 4 L 12 50 L 52 50 Z" fill={C.yolk} opacity="0.22" />
    {/* left curtain */}
    <path
      d="M2 6 L 22 6 L 22 50 q -4 -4 -8 0 q -4 -4 -8 0 q -4 -4 -4 0 Z"
      fill={C.comb}
    />
    <path
      d="M6 6 L 6 48 M12 6 L 12 48 M18 6 L 18 48"
      stroke={C.text}
      strokeWidth="0.8"
      opacity="0.4"
    />
    {/* right curtain */}
    <path
      d="M42 6 L 62 6 L 62 50 q -4 -4 -8 0 q -4 -4 -8 0 q -4 -4 -4 0 Z"
      fill={C.comb}
    />
    <path
      d="M46 6 L 46 48 M52 6 L 52 48 M58 6 L 58 48"
      stroke={C.text}
      strokeWidth="0.8"
      opacity="0.4"
    />
    {/* curtain top rail */}
    <rect x="0" y="2" width="64" height="4" fill={C.deepYolk} />
    {/* chicken centre stage */}
    <ellipse cx="32" cy="40" rx="9" ry="9" fill={C.yolk} />
    <ellipse cx="32" cy="28" rx="6.5" ry="6" fill={C.yolk} />
    <path d="M28 22 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    <circle cx="34" cy="28" r="1.3" fill={C.text} />
    <path d="M37 29 l 3 1 l -3 1.5 z" fill={C.beak} />
    {/* bow tie */}
    <path d="M28 36 L 32 38 L 36 36 L 36 40 L 32 38 L 28 40 Z" fill={C.lilac} />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 15. DRINKS — two chickens clinking glasses (cheers)
// ---------------------------------------------------------------------------

export const DrinksChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.beak + '22'}>
    {/* sparkle */}
    <path
      d="M32 8 l 1 -2 l 1 2 l 2 1 l -2 1 l -1 2 l -1 -2 l -2 -1 z"
      fill={C.yolk}
    />
    {/* left chicken */}
    <ellipse cx="14" cy="42" rx="10" ry="10" fill={C.yolk} />
    <ellipse cx="16" cy="30" rx="6.5" ry="6" fill={C.yolk} />
    <path d="M13 24 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    <circle cx="18" cy="30" r="1.2" fill={C.text} />
    <path d="M21 31 l 3 1 l -3 1.5 z" fill={C.beak} />
    {/* right chicken */}
    <ellipse cx="50" cy="42" rx="10" ry="10" fill={C.deepYolk} />
    <ellipse cx="48" cy="30" rx="6.5" ry="6" fill={C.deepYolk} />
    <path d="M45 24 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    <circle cx="46" cy="30" r="1.2" fill={C.text} />
    <path d="M43 31 l -3 1 l 3 1.5 z" fill={C.beak} />
    {/* left wine glass tilted right */}
    <path
      d="M22 26 L 32 32 L 28 38 q -4 -1 -8 -4 z"
      fill={C.comb}
      stroke={C.text}
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path d="M28 38 L 26 44" stroke={C.text} strokeWidth="1.2" strokeLinecap="round" />
    {/* right wine glass tilted left */}
    <path
      d="M42 26 L 32 32 L 36 38 q 4 -1 8 -4 z"
      fill={C.comb}
      stroke={C.text}
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path d="M36 38 L 38 44" stroke={C.text} strokeWidth="1.2" strokeLinecap="round" />
    {/* clink lines */}
    <path
      d="M30 22 l 0 -3 M28 24 l -2 -2 M34 24 l 2 -2"
      stroke={C.deepYolk}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 16. MEDITATION — chicken sitting cross-legged with halo + lotus
// ---------------------------------------------------------------------------

export const MeditationChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.meadow + '22'}>
    {/* halo */}
    <ellipse
      cx="32"
      cy="14"
      rx="10"
      ry="2.4"
      fill="none"
      stroke={C.yolk}
      strokeWidth="2"
    />
    {/* serenity rings */}
    <path
      d="M6 32 q 8 -3 12 0 M46 32 q 8 -3 12 0"
      stroke={C.meadow}
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
      opacity="0.6"
    />
    {/* crossed legs base */}
    <path
      d="M14 50 q 18 -10 36 0 q -8 6 -18 6 q -10 0 -18 -6 z"
      fill={C.beak}
      stroke={C.text}
      strokeWidth="1"
    />
    {/* body */}
    <ellipse cx="32" cy="36" rx="13" ry="11" fill={C.yolk} />
    {/* head */}
    <ellipse cx="32" cy="22" rx="8" ry="7.5" fill={C.yolk} />
    {/* comb */}
    <path d="M28 16 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    {/* closed eyes */}
    <path d="M27 22 q 1.5 1.5 3 0" stroke={C.text} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <path d="M34 22 q 1.5 1.5 3 0" stroke={C.text} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    {/* gentle beak */}
    <path d="M38 24 l 3 1 l -3 1.2 z" fill={C.beak} />
    {/* wings resting palms-up */}
    <path
      d="M20 40 q -4 4 -2 8 M44 40 q 4 4 2 8"
      stroke={C.deepYolk}
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
    />
    {/* tiny lotus petals at base */}
    <path
      d="M28 56 q 0 -4 4 -4 q 4 0 4 4"
      stroke={C.lilac}
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 17. WORKSHOP — chicken in safety goggles + apron with hammer over shoulder
// ---------------------------------------------------------------------------

export const WorkshopChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.deepYolk + '22'}>
    {/* sawdust specks */}
    <circle cx="8" cy="50" r="1.2" fill={C.beak} />
    <circle cx="14" cy="54" r="1" fill={C.beak} />
    <circle cx="56" cy="52" r="1.2" fill={C.beak} />
    {/* body */}
    <ellipse cx="28" cy="42" rx="12" ry="12" fill={C.yolk} />
    {/* apron */}
    <path
      d="M20 36 L 36 36 L 38 56 L 18 56 Z"
      fill={C.comb}
      stroke={C.text}
      strokeWidth="1.2"
    />
    {/* apron pocket */}
    <rect x="22" y="46" width="12" height="6" rx="1" fill={C.cream} stroke={C.text} strokeWidth="0.8" />
    <path d="M26 46 v 6 M30 46 v 6" stroke={C.text} strokeWidth="0.6" opacity="0.5" />
    {/* head */}
    <ellipse cx="28" cy="24" rx="9" ry="8.5" fill={C.yolk} />
    {/* comb */}
    <path d="M24 18 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    {/* safety goggles — wraparound */}
    <path
      d="M19 24 q 9 -6 18 0 L 37 27 q -9 5 -18 0 Z"
      fill={C.sky}
      stroke={C.text}
      strokeWidth="1"
    />
    <path d="M28 22 v 6" stroke={C.text} strokeWidth="0.8" />
    {/* shine */}
    <path d="M22 24 l 2 -0.5 M32 24 l 2 -0.5" stroke={C.cream} strokeWidth="0.8" />
    {/* beak */}
    <path d="M36 28 l 3 1 l -3 1.5 z" fill={C.beak} />
    {/* hammer over shoulder */}
    <rect
      x="42"
      y="18"
      width="3"
      height="22"
      rx="0.6"
      fill={C.deepYolk}
      transform="rotate(20 43.5 29)"
    />
    <path
      d="M44 8 L 58 14 L 56 22 L 42 16 Z"
      fill={C.lilac}
      stroke={C.text}
      strokeWidth="1.2"
      strokeLinejoin="round"
      transform="rotate(20 50 15)"
    />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 18. COMPETITION — chicken on a podium with medal around neck, sparkles
// ---------------------------------------------------------------------------

export const CompetitionChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.yolk + '33'}>
    {/* sparkles */}
    <path d="M10 14 l 1 -2 l 1 2 l 2 1 l -2 1 l -1 2 l -1 -2 l -2 -1 z" fill={C.comb} />
    <path d="M54 18 l 1 -2 l 1 2 l 2 1 l -2 1 l -1 2 l -1 -2 l -2 -1 z" fill={C.comb} />
    {/* chicken body */}
    <ellipse cx="32" cy="32" rx="11" ry="11" fill={C.yolk} />
    {/* head */}
    <ellipse cx="32" cy="20" rx="7.5" ry="7" fill={C.yolk} />
    <path d="M28 14 q 1.5 -3 3 0 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    <circle cx="35" cy="20" r="1.3" fill={C.text} />
    <path d="M38 21 l 3 1 l -3 1.5 z" fill={C.beak} />
    {/* wings raised in triumph */}
    <path d="M22 28 q -6 -6 -8 -12" stroke={C.deepYolk} strokeWidth="2.8" fill="none" strokeLinecap="round" />
    <path d="M42 28 q 6 -6 8 -12" stroke={C.deepYolk} strokeWidth="2.8" fill="none" strokeLinecap="round" />
    {/* medal ribbon */}
    <path d="M28 26 L 32 38" stroke={C.comb} strokeWidth="1.8" />
    <path d="M36 26 L 32 38" stroke={C.comb} strokeWidth="1.8" />
    {/* medal */}
    <circle cx="32" cy="40" r="4" fill={C.deepYolk} stroke={C.text} strokeWidth="1" />
    <path d="M32 38 l 0.6 1.2 l 1.4 0.2 l -1 1 l 0.2 1.4 l -1.2 -0.6 l -1.2 0.6 l 0.2 -1.4 l -1 -1 l 1.4 -0.2 z" fill={C.cream} />
    {/* podium */}
    <rect x="20" y="48" width="24" height="12" fill={C.lilac} stroke={C.text} strokeWidth="1.2" />
    <rect x="8" y="52" width="12" height="8" fill={C.lilac} opacity="0.7" stroke={C.text} strokeWidth="1.2" />
    <rect x="44" y="54" width="12" height="6" fill={C.lilac} opacity="0.5" stroke={C.text} strokeWidth="1.2" />
    <path d="M30 54 L 30 58 M32 54 L 32 58 M34 54 L 34 58" stroke={C.text} strokeWidth="0.8" opacity="0.6" />
    <text x="32" y="58.5" textAnchor="middle" fontSize="6" fontWeight="700" fill={C.text} fontFamily="system-ui">1</text>
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 19. SPORT — running chicken in sweatband with soccer ball at feet
// ---------------------------------------------------------------------------

export const SportChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.meadow + '22'}>
    {/* motion lines */}
    <path d="M2 22 l 8 0" stroke={C.comb} strokeWidth="2" strokeLinecap="round" />
    <path d="M4 28 l 6 0" stroke={C.comb} strokeWidth="2" strokeLinecap="round" />
    <path d="M2 34 l 8 0" stroke={C.comb} strokeWidth="2" strokeLinecap="round" />
    {/* running body — tilted forward */}
    <ellipse cx="30" cy="32" rx="12" ry="9" fill={C.yolk} transform="rotate(-10 30 32)" />
    {/* head */}
    <ellipse cx="38" cy="24" rx="7.5" ry="7" fill={C.yolk} />
    {/* sweatband */}
    <rect x="32" y="20" width="14" height="3" fill={C.comb} />
    <path d="M36 20 L 36 23 M42 20 L 42 23" stroke={C.cream} strokeWidth="0.8" />
    {/* comb peeking out */}
    <path d="M36 18 q 1 -2 2 0 q 1 -2 2 0 Z" fill={C.comb} />
    {/* eye + beak */}
    <circle cx="41" cy="25" r="1.3" fill={C.text} />
    <path d="M44 26 l 3 1 l -3 1.5 z" fill={C.beak} />
    {/* arm pumping forward */}
    <path d="M36 32 q 4 -2 8 -1" stroke={C.deepYolk} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    {/* legs running */}
    <path d="M26 40 L 22 50" stroke={C.beak} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M32 40 L 38 48" stroke={C.beak} strokeWidth="2.4" strokeLinecap="round" />
    {/* soccer ball */}
    <circle cx="50" cy="52" r="6" fill={C.cream} stroke={C.text} strokeWidth="1.4" />
    <path
      d="M50 47 L 46 50 L 47.5 55 L 52.5 55 L 54 50 Z"
      fill={C.text}
    />
    <path d="M44 52 L 46 50 M56 52 L 54 50" stroke={C.text} strokeWidth="0.8" />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// 20. FAMILY — a row of three chickens (big, medium, tiny), holding wings
// ---------------------------------------------------------------------------

export const FamilyChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.lilac + '22'}>
    {/* ground */}
    <path d="M2 54 H 62" stroke={C.meadow} strokeWidth="2" strokeLinecap="round" />
    {/* big chicken (parent) */}
    <ellipse cx="16" cy="42" rx="10" ry="11" fill={C.deepYolk} />
    <path d="M11 32 q 1.5 -3 3 0 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    <circle cx="20" cy="38" r="1.4" fill={C.text} />
    <path d="M23 39 l 3 1 l -3 1.5 z" fill={C.beak} />
    <path d="M14 52 v 4 M18 52 v 4" stroke={C.beak} strokeWidth="1.6" strokeLinecap="round" />
    {/* medium chicken */}
    <ellipse cx="34" cy="44" rx="7" ry="8" fill={C.yolk} />
    <path d="M31 36 q 1 -2 2 0 q 1 -2 2 0 Z" fill={C.comb} />
    <circle cx="36" cy="42" r="1.2" fill={C.text} />
    <path d="M38 43 l 3 1 l -3 1.2 z" fill={C.beak} />
    <path d="M32 52 v 3 M36 52 v 3" stroke={C.beak} strokeWidth="1.4" strokeLinecap="round" />
    {/* tiny chick */}
    <ellipse cx="50" cy="48" rx="5" ry="5.5" fill={C.cream} stroke={C.deepYolk} strokeWidth="1.2" />
    <path d="M50 42 l 1.5 -3 l 1.5 3" stroke={C.deepYolk} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <circle cx="51.5" cy="47" r="1" fill={C.text} />
    <path d="M53 48 l 2.5 1 l -2.5 1 z" fill={C.beak} />
    <path d="M49 53 v 2 M51 53 v 2" stroke={C.beak} strokeWidth="1.2" strokeLinecap="round" />
    {/* heart between them */}
    <path
      d="M26 18 q -3 -4 0 -6 q 3 -2 4 2 q 1 -4 4 -2 q 3 2 0 6 q -2 3 -4 5 q -2 -2 -4 -5 z"
      fill={C.comb}
    />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// Default / fallback icon — calendar with a chick poking out
// ---------------------------------------------------------------------------

export const DefaultChicken: React.FC<ChickenIconProps> = ({ size, className }) => (
  <SvgFrame size={size} className={className} bg={C.yolk + '33'}>
    {/* calendar */}
    <rect x="10" y="14" width="44" height="40" rx="3" fill={C.cream} stroke={C.text} strokeWidth="1.4" />
    <rect x="10" y="14" width="44" height="9" fill={C.comb} />
    <path d="M18 10 L 18 18 M46 10 L 46 18" stroke={C.text} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 30 H 48 M16 38 H 48 M16 46 H 48" stroke={C.text} strokeWidth="0.8" opacity="0.4" />
    <path d="M24 30 V 50 M32 30 V 50 M40 30 V 50" stroke={C.text} strokeWidth="0.8" opacity="0.4" />
    {/* chick poking out top */}
    <ellipse cx="32" cy="14" rx="7" ry="6.5" fill={C.yolk} />
    <path d="M28 8 q 1.5 -3 3 0 q 1.5 -3 3 0 Z" fill={C.comb} />
    <circle cx="35" cy="14" r="1.3" fill={C.text} />
    <path d="M38 15 l 3 1 l -3 1.2 z" fill={C.beak} />
  </SvgFrame>
);

// ---------------------------------------------------------------------------
// Helper: keyword-based activity matcher
// ---------------------------------------------------------------------------

type IconComponent = React.FC<ChickenIconProps>;

/**
 * Ordered keyword → icon mapping.
 * Order matters: the FIRST matching entry wins, so more specific keywords
 * (e.g. "water polo", "birthday party") must appear before broader ones
 * (e.g. "polo", "birthday").
 */
const KEYWORD_MAP: ReadonlyArray<readonly [string, IconComponent]> = [
  // multi-word / specific first
  ['water polo', WaterPoloChicken],
  ['birthday party', BirthdayChicken],
  ['movie night', MovieNightChicken],
  ['soccer match', SportChicken],
  ['soccer practice', SportChicken],
  ['tennis lesson', SportChicken],
  ['music lesson', MusicLessonChicken],
  ['pick-up', FamilyChicken],
  ['pickup', FamilyChicken],
  ['drop-off', FamilyChicken],
  ['dropoff', FamilyChicken],

  // dance
  ['ballet', DanceChicken],
  ['dance', DanceChicken],

  // swim
  ['swimming', SwimmingChicken],
  ['swim', SwimmingChicken],

  // surf
  ['surfing', SurfingChicken],
  ['surf', SurfingChicken],

  // ski
  ['skiing', SkiingChicken],
  ['ski', SkiingChicken],

  // beach
  ['beach', BeachChicken],

  // gymnastics — must come before generic "gym"
  ['gymnastics', GymnasticsChicken],
  ['gym', GymnasticsChicken],

  // music
  ['piano', MusicLessonChicken],
  ['guitar', MusicLessonChicken],
  ['violin', MusicLessonChicken],
  ['music', MusicLessonChicken],

  // camping
  ['camping', CampingChicken],
  ['camp', CampingChicken],

  // birthday
  ['birthday', BirthdayChicken],

  // school
  ['homework', SchoolChicken],
  ['school', SchoolChicken],

  // health
  ['doctor', DoctorChicken],
  ['dentist', DoctorChicken],
  ['health', DoctorChicken],

  // movies
  ['cinema', MovieNightChicken],
  ['movie', MovieNightChicken],
  ['film', MovieNightChicken],

  // errands / outings
  ['grocery', FamilyChicken],
  ['groceries', FamilyChicken],
  ['market', FamilyChicken],
  ['errand', FamilyChicken],
  ['shopping', FamilyChicken],

  // theatre
  ['theatre', TheatreChicken],
  ['theater', TheatreChicken],
  ['musical', TheatreChicken],
  ['show', TheatreChicken],

  // social
  ['drinks', DrinksChicken],
  ['social', DrinksChicken],
  ['friends', DrinksChicken],

  // mindfulness
  ['meditation', MeditationChicken],
  ['mindfulness', MeditationChicken],

  // work / workshop
  ['workshop', WorkshopChicken],
  ['work', WorkshopChicken],

  // competition — must come before generic "comp"
  ['competition', CompetitionChicken],
  ['comp', CompetitionChicken],

  // sport / training
  ['training', SportChicken],
  ['soccer', SportChicken],
  ['football', SportChicken],
  ['tennis', SportChicken],
  ['netball', SportChicken],
  ['sport', SportChicken],

  // family logistics
  ['family', FamilyChicken],

  // bare "polo" → water polo
  ['polo', WaterPoloChicken],
];

/**
 * Return the most appropriate chicken activity icon for an activity name.
 * Matching is case-insensitive and runs against the lowered input string.
 * Falls back to {@link DefaultChicken} when no keyword matches.
 *
 * @example
 *   const Icon = getChickenActivityIcon("Ella's water polo training");
 *   <Icon size={48} />
 */
export function getChickenActivityIcon(activityName: string): IconComponent {
  if (!activityName) return DefaultChicken;
  const haystack = activityName.toLowerCase();
  for (const [keyword, Icon] of KEYWORD_MAP) {
    if (haystack.includes(keyword)) return Icon;
  }
  return DefaultChicken;
}
