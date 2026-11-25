import React, { useEffect, useRef, useState } from 'react';
import {
  PEBBY_MASTER_SRC,
  getCachedPebbyCutoutSync,
  loadPebbyTransparentCutout,
} from '../utils/pebbyCutout';

export type PebbyPose =
  | 'waving'
  | 'reading'
  | 'thinking'
  | 'cheering'
  | 'magnifying'
  | 'sleeping'
  | 'waking'
  | 'pointing'
  | 'stamping';

export type PebbyProp =
  | 'none'
  | 'maths'
  | 'science'
  | 'social'
  | 'english'
  | 'hindi'
  | 'sanskrit'
  | 'stamp'
  | 'rocket';

interface PebbyMascotProps {
  pose?: PebbyPose;
  prop?: PebbyProp;
  className?: string;
  trackCursor?: boolean;
  glanceX?: number | null;
  showShadow?: boolean;
  ariaLabel?: string;
}

export const PebbyMascot: React.FC<PebbyMascotProps> = ({
  pose = 'waving',
  prop = 'none',
  className = 'w-64 h-64',
  trackCursor = true,
  glanceX = null,
  showShadow = true,
  ariaLabel = 'Pebby, the ACADEMe tutor mascot',
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(() => getCachedPebbyCutoutSync());
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Prepare seamless transparent cutout directly from the user's master 3D PNG once
  useEffect(() => {
    let mounted = true;
    if (cutoutSrc) return;
    loadPebbyTransparentCutout().then((url) => {
      if (mounted) setCutoutSrc(url);
    });
    return () => {
      mounted = false;
    };
  }, [cutoutSrc]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Subtle 3D cursor-follow tilt & parallax
  useEffect(() => {
    if (!trackCursor || reducedMotion || pose === 'sleeping') {
      setLook({ x: 0, y: 0 });
      return;
    }

    let rafId = 0;
    const handleMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const el = stageRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 420));
        const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 360));
        setLook({ x: dx, y: dy });
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [trackCursor, reducedMotion, pose]);

  const activeX = glanceX !== null ? glanceX / 6 : look.x;
  const activeY = glanceX !== null ? 0 : look.y;
  const rotateY = reducedMotion ? 0 : activeX * 11;
  const rotateX = reducedMotion ? 0 : -activeY * 7;
  const shiftX = reducedMotion ? 0 : activeX * 4;
  const shiftY = reducedMotion ? 0 : activeY * 3;
  const isSleeping = pose === 'sleeping';

  const poseAnimClass =
    reducedMotion || isSleeping
      ? ''
      : pose === 'cheering'
      ? 'animate-pebby-3d-cheer'
      : pose === 'stamping'
      ? 'animate-pebby-3d-stamp'
      : pose === 'thinking'
      ? 'animate-pebby-3d-think'
      : pose === 'reading'
      ? 'animate-pebby-3d-read'
      : pose === 'pointing'
      ? 'animate-pebby-3d-point'
      : pose === 'waking'
      ? 'animate-pebby-3d-wake'
      : 'animate-pebby-3d-wave';

  const hasCutout = Boolean(cutoutSrc && cutoutSrc !== PEBBY_MASTER_SRC);

  return (
    <div
      ref={stageRef}
      role="img"
      aria-label={ariaLabel}
      data-testid="pebby-mascot"
      data-pose={pose}
      data-prop={prop}
      className={`relative select-none flex items-center justify-center overflow-visible ${className}`}
    >
      {/* Synced Soft Ground Shadow */}
      {showShadow && prop !== 'rocket' && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[3%] left-1/2 -translate-x-1/2 w-[56%] h-[8.5%] rounded-full bg-[#111111]/20 blur-[2px] ${
            isSleeping || reducedMotion ? '' : 'animate-pebby-shadow'
          }`}
        />
      )}

      {/* 3D Interactive Tilt + Pose Animation Wrapper */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `perspective(680px) translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(
            1
          )}px, 0) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg)`,
          transition:
            glanceX !== null
              ? 'transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1)'
              : 'transform 140ms ease-out',
        }}
      >
        <div className={`relative w-full h-full flex items-center justify-center ${poseAnimClass}`}>
          {/* Paper Rocket Under Pebby (Curtain Footer Back-to-Top Launch) */}
          {prop === 'rocket' && (
            <svg
              aria-hidden="true"
              viewBox="0 0 260 260"
              className="pointer-events-none absolute inset-0 w-full h-full overflow-visible z-0"
            >
              <g id="pebby-paper-rocket">
                <path
                  d="M112 222 L130 266 L148 222 Z"
                  fill="#FFA500"
                  stroke="#111111"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path d="M120 222 L130 250 L140 222 Z" fill="#FFF8E1" />
                <path
                  d="M84 212 L48 236 L82 188 Z"
                  fill="#FFA500"
                  stroke="#111111"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M176 212 L212 236 L178 188 Z"
                  fill="#FFA500"
                  stroke="#111111"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M130 162 L182 224 L130 212 L78 224 Z"
                  fill="#FFF8E1"
                  stroke="#111111"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          )}

          {/* User's 3D Pebby Master Artwork (Transparent Cutout) */}
          <img
            src={cutoutSrc ?? PEBBY_MASTER_SRC}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={`relative z-10 w-[86%] h-[86%] object-contain pointer-events-none ${
              hasCutout
                ? 'drop-shadow-[0_6px_0_rgba(17,17,17,0.14)]'
                : 'rounded-full border-[3px] border-[#111111] object-cover'
            }`}
          />

          {/* Expressive Pose & Subject Prop SVG Overlay */}
          <svg
            aria-hidden="true"
            viewBox="0 0 260 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute inset-0 w-full h-full overflow-visible z-20"
          >
            {/* Waving motion arcs near Pebby's raised left hand */}
            {pose === 'waving' && prop === 'none' && (
              <g className="animate-wave-arcs" style={{ transformOrigin: '38px 104px' }}>
                <path
                  d="M28 96 Q20 108 28 122"
                  stroke="#FFA500"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M17 101 Q10 110 17 120"
                  stroke="#5B4BFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Cheering Confetti Sparkles */}
            {pose === 'cheering' && (
              <g className="animate-prop-pop" style={{ transformOrigin: '130px 110px' }}>
                <rect
                  x="22"
                  y="36"
                  width="13"
                  height="13"
                  rx="3"
                  transform="rotate(-18 22 36)"
                  fill="#FFA500"
                  stroke="#111111"
                  strokeWidth="2.8"
                />
                <circle cx="228" cy="48" r="8" fill="#5B4BFF" stroke="#111111" strokeWidth="2.8" />
                <path
                  d="M46 14 L51 25 L62 28 L51 32 L46 43 L42 32 L31 28 L42 25 Z"
                  fill="#9BF0C2"
                  stroke="#111111"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M214 14 L218 23 L227 26 L218 29 L214 38 L210 29 L201 26 L210 23 Z"
                  fill="#FFE3EC"
                  stroke="#111111"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* Thinking "?" Bubble */}
            {pose === 'thinking' && (
              <g className="animate-prop-pop" style={{ transformOrigin: '216px 46px' }}>
                <circle cx="196" cy="76" r="5" fill="#FFF8E1" stroke="#111111" strokeWidth="2.6" />
                <circle cx="208" cy="60" r="7.5" fill="#FFF8E1" stroke="#111111" strokeWidth="2.6" />
                <rect
                  x="202"
                  y="10"
                  width="44"
                  height="44"
                  rx="14"
                  fill="#FFA500"
                  stroke="#111111"
                  strokeWidth="3"
                />
                <text
                  x="224"
                  y="40"
                  textAnchor="middle"
                  fill="#111111"
                  fontFamily="Lexend, sans-serif"
                  fontWeight="800"
                  fontSize="24"
                >
                  ?
                </text>
              </g>
            )}

            {/* Reading Open Amber Book Badge */}
            {pose === 'reading' && prop === 'none' && (
              <g className="animate-prop-pop" style={{ transformOrigin: '198px 192px' }}>
                <path
                  d="M168 184 L198 192 L198 220 L166 210 Z"
                  fill="#FFA500"
                  stroke="#111111"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M228 184 L198 192 L198 220 L230 210 Z"
                  fill="#FFA500"
                  stroke="#111111"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M173 179 L198 187 L198 214 L172 205 Z"
                  fill="#FFF8E1"
                  stroke="#111111"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M223 179 L198 187 L198 214 L224 205 Z"
                  fill="#FFF8E1"
                  stroke="#111111"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* Waking Sparkle Rays */}
            {pose === 'waking' && prop === 'none' && (
              <g stroke="#FFA500" strokeWidth="4" strokeLinecap="round" className="animate-wave-arcs">
                <line x1="130" y1="2" x2="130" y2="15" />
                <line x1="186" y1="16" x2="177" y2="27" />
                <line x1="74" y1="16" x2="83" y2="27" />
              </g>
            )}

            {/* Sleeping Zzz */}
            {isSleeping && (
              <g
                fontFamily="Lexend, sans-serif"
                fontWeight="800"
                fill="#FFF8E1"
                stroke="#111111"
                strokeWidth="1.2"
              >
                <text x="194" y="76" fontSize="18" className="animate-zzz-1">
                  z
                </text>
                <text x="210" y="54" fontSize="22" className="animate-zzz-2">
                  z
                </text>
                <text x="228" y="32" fontSize="26" className="animate-zzz-3">
                  Z
                </text>
              </g>
            )}

            {/* Magnifying Glass (Check my answer tab) */}
            {pose === 'magnifying' && (
              <g className="animate-prop-pop" style={{ transformOrigin: '214px 138px' }}>
                <line
                  x1="196"
                  y1="176"
                  x2="214"
                  y2="152"
                  stroke="#111111"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <line
                  x1="196"
                  y1="176"
                  x2="214"
                  y2="152"
                  stroke="#FFA500"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="224"
                  cy="132"
                  r="23"
                  fill="#DFF1FF"
                  fillOpacity="0.88"
                  stroke="#111111"
                  strokeWidth="3.6"
                />
                <path
                  d="M214 124 A12 12 0 0 1 228 119"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Pointing Arrow Accent (Curtain Footer Play hover) */}
            {pose === 'pointing' && prop === 'none' && (
              <g className="animate-prop-pop" style={{ transformOrigin: '226px 146px' }}>
                <rect
                  x="194"
                  y="130"
                  width="54"
                  height="32"
                  rx="16"
                  fill="#FFA500"
                  stroke="#111111"
                  strokeWidth="3.2"
                />
                <path
                  d="M208 146 H234 M226 138 L235 146 L226 154"
                  stroke="#111111"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* SUBJECT PROP: Maths (Compass + Pencil) */}
            {prop === 'maths' && (
              <g key="prop-maths" className="animate-prop-pop" style={{ transformOrigin: '130px 140px' }}>
                <g transform="translate(-4, 4)">
                  <line x1="40" y1="126" x2="26" y2="174" stroke="#111111" strokeWidth="3.8" strokeLinecap="round" />
                  <line x1="40" y1="126" x2="54" y2="174" stroke="#111111" strokeWidth="3.8" strokeLinecap="round" />
                  <circle cx="40" cy="124" r="6.5" fill="#FFA500" stroke="#111111" strokeWidth="3" />
                </g>
                <g transform="translate(4, 0)">
                  <path
                    d="M202 172 L236 122 L248 130 L214 180 Z"
                    fill="#FFA500"
                    stroke="#111111"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M202 172 L195 188 L214 180 Z"
                    fill="#FFF8E1"
                    stroke="#111111"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            )}

            {/* SUBJECT PROP: Science (Goggles + Bubbling Green Flask) */}
            {prop === 'science' && (
              <g key="prop-science" className="animate-prop-pop" style={{ transformOrigin: '130px 130px' }}>
                <g transform="translate(0, 6)">
                  <rect
                    x="86"
                    y="108"
                    width="36"
                    height="28"
                    rx="11"
                    fill="#DFF1FF"
                    fillOpacity="0.48"
                    stroke="#111111"
                    strokeWidth="3.2"
                  />
                  <rect
                    x="134"
                    y="108"
                    width="36"
                    height="28"
                    rx="11"
                    fill="#DFF1FF"
                    fillOpacity="0.48"
                    stroke="#111111"
                    strokeWidth="3.2"
                  />
                  <line x1="122" y1="122" x2="134" y2="122" stroke="#111111" strokeWidth="3.2" />
                </g>
                <g transform="translate(4, 2)">
                  <path
                    d="M214 134 H228 V148 L242 176 C244 180 241 184 236 184 H206 C201 184 198 180 200 176 L214 148 Z"
                    fill="#FFFFFF"
                    stroke="#111111"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M205 166 H237 L241 176 C242 179 240 182 236 182 H206 C202 182 200 179 201 176 Z"
                    fill="#9BF0C2"
                  />
                  <circle cx="221" cy="122" r="4.5" fill="#9BF0C2" stroke="#111111" strokeWidth="2.2" />
                  <circle cx="231" cy="112" r="3.5" fill="#FFA500" stroke="#111111" strokeWidth="2.2" />
                </g>
              </g>
            )}

            {/* SUBJECT PROP: Social Science (Explorer Hat on top) */}
            {prop === 'social' && (
              <g key="prop-social" className="animate-prop-pop" style={{ transformOrigin: '130px 44px' }}>
                <g transform="rotate(-6 130 48)">
                  <ellipse cx="130" cy="54" rx="64" ry="12" fill="#FFA500" stroke="#111111" strokeWidth="3.4" />
                  <path
                    d="M90 52 C94 24, 166 24, 170 52 Z"
                    fill="#FFF1B8"
                    stroke="#111111"
                    strokeWidth="3.4"
                    strokeLinejoin="round"
                  />
                  <path d="M92 44 Q130 52 168 44" stroke="#5B4BFF" strokeWidth="6" strokeLinecap="round" />
                </g>
              </g>
            )}

            {/* SUBJECT PROP: English (Feather Quill) */}
            {prop === 'english' && (
              <g key="prop-english" className="animate-prop-pop" style={{ transformOrigin: '220px 148px' }}>
                <path
                  d="M200 178 C208 148, 232 118, 250 108 C248 134, 230 160, 204 178 Z"
                  fill="#DFF1FF"
                  stroke="#111111"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                <line x1="194" y1="188" x2="244" y2="114" stroke="#111111" strokeWidth="2.8" strokeLinecap="round" />
              </g>
            )}

            {/* SUBJECT PROP: Hindi (Small Book Flag with अ) */}
            {prop === 'hindi' && (
              <g key="prop-hindi" className="animate-prop-pop" style={{ transformOrigin: '206px 144px' }}>
                <line x1="202" y1="186" x2="202" y2="122" stroke="#111111" strokeWidth="3.4" strokeLinecap="round" />
                <path
                  d="M202 124 L250 135 L202 150 Z"
                  fill="#FF6B9D"
                  stroke="#111111"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <text
                  x="212"
                  y="141"
                  fontSize="14"
                  fontWeight="700"
                  fill="#FFF8E1"
                  fontFamily="Noto Sans Devanagari, sans-serif"
                >
                  अ
                </text>
              </g>
            )}

            {/* SUBJECT PROP: Sanskrit (Palm-Leaf Scroll) */}
            {prop === 'sanskrit' && (
              <g key="prop-sanskrit" className="animate-prop-pop" style={{ transformOrigin: '216px 152px' }}>
                <rect
                  x="192"
                  y="136"
                  width="52"
                  height="28"
                  rx="7"
                  transform="rotate(-12 192 136)"
                  fill="#FFF1B8"
                  stroke="#111111"
                  strokeWidth="3.2"
                />
                <circle cx="194" cy="150" r="6.5" fill="#FFA500" stroke="#111111" strokeWidth="2.6" />
                <circle cx="244" cy="140" r="6.5" fill="#FFA500" stroke="#111111" strokeWidth="2.6" />
                <line x1="206" y1="145" x2="232" y2="140" stroke="#111111" strokeWidth="2.4" strokeLinecap="round" />
              </g>
            )}

            {/* FIX-IT BOARD PROP: Big Neo-Brutalist Rubber Stamp */}
            {prop === 'stamp' && (
              <g
                id="pebby-prop-stamp"
                transform={
                  pose === 'stamping'
                    ? 'translate(10, 14) rotate(18 214 162)'
                    : 'translate(2, 0) rotate(-6 214 162)'
                }
                style={{ transition: 'transform 160ms cubic-bezier(0.22, 1, 0.36, 1)' }}
              >
                <rect
                  x="190"
                  y="162"
                  width="56"
                  height="15"
                  rx="5"
                  fill="#5B4BFF"
                  stroke="#111111"
                  strokeWidth="3.2"
                />
                <rect x="195" y="177" width="46" height="8" rx="2.5" fill="#111111" />
                <path
                  d="M209 162 L213 134 C213 128 223 128 223 134 L227 162 Z"
                  fill="#FFA500"
                  stroke="#111111"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                <circle cx="218" cy="124" r="12" fill="#FFA500" stroke="#111111" strokeWidth="3.2" />
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

interface PebbyLogoMarkProps {
  isBlinking?: boolean;
  size?: 'sm' | 'md';
}

/**
 * Tiny Pebby mark matching the user's 3D Pebby silhouette:
 * 3 rounded violet tuft lobes, white rounded-square face, big glossy dark-navy oval eyes & happy smile.
 * Blinks smoothly whenever the navbar morphs between integrated and floating states.
 */
export const PebbyLogoMark: React.FC<PebbyLogoMarkProps> = ({
  isBlinking = false,
  size = 'md',
}) => {
  const dims = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  return (
    <svg
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`${dims} shrink-0 transition-transform duration-300`}
    >
      {/* 3 Signature Periwinkle-Violet Tuft Lobes */}
      <ellipse
        cx="19"
        cy="8.5"
        rx="3.8"
        ry="4.5"
        transform="rotate(-12 19 8.5)"
        fill="#7C7FFF"
        stroke="#111111"
        strokeWidth="2.2"
      />
      <ellipse
        cx="25"
        cy="7.5"
        rx="4"
        ry="5.2"
        transform="rotate(8 25 7.5)"
        fill="#8E91FF"
        stroke="#111111"
        strokeWidth="2.2"
      />
      <ellipse
        cx="30.5"
        cy="10.5"
        rx="3.5"
        ry="3.8"
        transform="rotate(26 30.5 10.5)"
        fill="#7C7FFF"
        stroke="#111111"
        strokeWidth="2.2"
      />

      {/* Soft Periwinkle-Violet Rounded Body/Head */}
      <rect
        x="5"
        y="11"
        width="36"
        height="31"
        rx="14"
        fill="#7C7FFF"
        stroke="#111111"
        strokeWidth="2.6"
      />

      {/* Creamy White Rounded-Square Face Screen */}
      <rect
        x="10.5"
        y="16.5"
        width="25"
        height="19.5"
        rx="7.5"
        fill="#FFFFFF"
        stroke="#111111"
        strokeWidth="2"
      />

      {/* Glossy Dark-Navy Oval Eyes (collapse flat when navbar morph-blinks) */}
      {isBlinking ? (
        <>
          <line x1="15.5" y1="25" x2="20" y2="25" stroke="#12163A" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="26" y1="25" x2="30.5" y2="25" stroke="#12163A" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="18" cy="25" rx="2.7" ry="3.6" fill="#12163A" />
          <circle cx="17.2" cy="23.6" r="1.05" fill="#FFFFFF" />
          <ellipse cx="28" cy="25.3" rx="2.7" ry="3.6" fill="#12163A" />
          <circle cx="27.2" cy="23.9" r="1.05" fill="#FFFFFF" />
        </>
      )}

      {/* Happy Open Smile with Coral Tongue */}
      <path d="M20 30 Q23 34 26 30 Z" fill="#12163A" />
      <ellipse cx="23" cy="31.8" rx="1.7" ry="0.9" fill="#E86A7D" />
    </svg>
  );
};
