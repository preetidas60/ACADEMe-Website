import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { SUBJECT_WORLDS, type BoardId, type ClassLevel, type SubjectWorldId } from '../data/academeData';
import {
  computeChapterMinHeightPx,
  computeReflectionRay,
  computeSubjectWorldsPinDistance,
  getSyllabusForSelection,
  resolveSubjectWorldIndex,
} from '../utils/logic';
import { PebbyMascot, type PebbyProp } from './PebbyMascot';

gsap.registerPlugin(ScrollTrigger);

/* ── Mini-Scene 1: Maths Prime Factor Tree (36 & 24 -> HCF & LCM) ── */
const MathsScene: React.FC<{ active: boolean }> = ({ active }) => {
  const [stage, setStage] = useState(3);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !active) {
      setStage(3);
      return;
    }
    setStage(0);
    const t1 = window.setTimeout(() => setStage(1), 240);
    const t2 = window.setTimeout(() => setStage(2), 560);
    const t3 = window.setTimeout(() => setStage(3), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [active]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-[#111111]/75">
        <span>Prime factor trees · Class 10 Real Numbers</span>
        <span className="font-mono text-[#5B4BFF]">HCF = 12 · LCM = 72</span>
      </div>

      <svg viewBox="0 0 360 190" className="w-full h-auto" role="img" aria-label="Prime factor trees for 36 and 24 showing HCF 12 and LCM 72">
        {/* Drifting subtle geometric accents */}
        <polygon points="18,22 28,6 38,22" fill="#FFA500" stroke="#111111" strokeWidth="2" />
        <rect x="330" y="14" width="14" height="14" rx="3" transform="rotate(14 330 14)" fill="#9BF0C2" stroke="#111111" strokeWidth="2" />

        {/* TREE 1: 36 */}
        <g style={{ opacity: stage >= 0 ? 1 : 0, transition: 'opacity 280ms ease' }}>
          <circle cx="95" cy="28" r="19" fill="#FFF8E1" stroke="#111111" strokeWidth="2.8" />
          <text x="95" y="34" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="14" fill="#111111">36</text>
        </g>

        <g style={{ opacity: stage >= 1 ? 1 : 0, transition: 'opacity 300ms ease' }}>
          <line x1="84" y1="44" x2="58" y2="74" stroke="#111111" strokeWidth="2.6" />
          <line x1="106" y1="44" x2="132" y2="74" stroke="#111111" strokeWidth="2.6" />
          <circle cx="54" cy="88" r="16" fill="#FFFFFF" stroke="#111111" strokeWidth="2.6" />
          <text x="54" y="93" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="13" fill="#111111">4</text>
          <circle cx="136" cy="88" r="16" fill="#FFFFFF" stroke="#111111" strokeWidth="2.6" />
          <text x="136" y="93" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="13" fill="#111111">9</text>
        </g>

        <g style={{ opacity: stage >= 2 ? 1 : 0, transition: 'opacity 320ms ease' }}>
          <line x1="46" y1="102" x2="30" y2="132" stroke="#111111" strokeWidth="2.4" />
          <line x1="62" y1="102" x2="76" y2="132" stroke="#111111" strokeWidth="2.4" />
          <line x1="128" y1="102" x2="114" y2="132" stroke="#111111" strokeWidth="2.4" />
          <line x1="144" y1="102" x2="158" y2="132" stroke="#111111" strokeWidth="2.4" />
          {[
            { cx: 28, label: '2', hcf: true },
            { cx: 76, label: '2', hcf: true },
            { cx: 114, label: '3', hcf: true },
            { cx: 158, label: '3', hcf: false },
          ].map((n, i) => (
            <g key={i}>
              <circle
                cx={n.cx}
                cy="146"
                r="14"
                fill={stage >= 3 && n.hcf ? '#FFA500' : '#EAE5FF'}
                stroke="#111111"
                strokeWidth="2.5"
              />
              <text x={n.cx} y="151" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="13" fill="#111111">{n.label}</text>
            </g>
          ))}
        </g>

        {/* TREE 2: 24 */}
        <g style={{ opacity: stage >= 0 ? 1 : 0, transition: 'opacity 280ms ease' }}>
          <circle cx="268" cy="28" r="19" fill="#FFF8E1" stroke="#111111" strokeWidth="2.8" />
          <text x="268" y="34" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="14" fill="#111111">24</text>
        </g>

        <g style={{ opacity: stage >= 1 ? 1 : 0, transition: 'opacity 300ms ease' }}>
          <line x1="257" y1="44" x2="232" y2="74" stroke="#111111" strokeWidth="2.6" />
          <line x1="279" y1="44" x2="304" y2="74" stroke="#111111" strokeWidth="2.6" />
          <circle cx="228" cy="88" r="16" fill="#FFFFFF" stroke="#111111" strokeWidth="2.6" />
          <text x="228" y="93" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="13" fill="#111111">4</text>
          <circle cx="308" cy="88" r="16" fill="#FFFFFF" stroke="#111111" strokeWidth="2.6" />
          <text x="308" y="93" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="13" fill="#111111">6</text>
        </g>

        <g style={{ opacity: stage >= 2 ? 1 : 0, transition: 'opacity 320ms ease' }}>
          <line x1="220" y1="102" x2="204" y2="132" stroke="#111111" strokeWidth="2.4" />
          <line x1="236" y1="102" x2="248" y2="132" stroke="#111111" strokeWidth="2.4" />
          <line x1="300" y1="102" x2="288" y2="132" stroke="#111111" strokeWidth="2.4" />
          <line x1="316" y1="102" x2="332" y2="132" stroke="#111111" strokeWidth="2.4" />
          {[
            { cx: 204, label: '2', hcf: true },
            { cx: 248, label: '2', hcf: true },
            { cx: 288, label: '2', hcf: false },
            { cx: 332, label: '3', hcf: true },
          ].map((n, i) => (
            <g key={i}>
              <circle
                cx={n.cx}
                cy="146"
                r="14"
                fill={stage >= 3 && n.hcf ? '#FFA500' : '#DDF7E8'}
                stroke="#111111"
                strokeWidth="2.5"
              />
              <text x={n.cx} y="151" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="13" fill="#111111">{n.label}</text>
            </g>
          ))}
        </g>

        {/* Bottom HCF / LCM Summary Bar */}
        <g style={{ opacity: stage >= 3 ? 1 : 0.2, transition: 'opacity 320ms ease' }}>
          <rect x="26" y="168" width="144" height="20" rx="10" fill="#FFA500" stroke="#111111" strokeWidth="2" />
          <text x="98" y="182" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="10.5" fill="#111111">
            HCF = 2² × 3 = 12
          </text>
          <rect x="190" y="168" width="146" height="20" rx="10" fill="#5B4BFF" stroke="#111111" strokeWidth="2" />
          <text x="263" y="182" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="10.5" fill="#FFFFFF">
            LCM = 2³ × 3² = 72
          </text>
        </g>
      </svg>
    </div>
  );
};

/* ── Mini-Scene 2: Science Interactive Reflection of Light (Drag the incoming ray!) ── */
const ScienceScene: React.FC = () => {
  const [angleDeg, setAngleDeg] = useState(40);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef(false);

  const ray = computeReflectionRay(angleDeg);

  const updateAngleFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 320;
    const y = ((clientY - rect.top) / rect.height) * 200;
    const dx = Math.max(12, 160 - x);
    const dy = Math.max(16, 170 - y);
    const deg = (Math.atan2(dx, dy) * 180) / Math.PI;
    setAngleDeg(Math.round(Math.max(15, Math.min(70, deg))));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#111111]/75">
        <span>Drag the amber light source · Law of Reflection</span>
        <span
          data-testid="reflection-angle-readout"
          className="font-mono text-[#15803D] tabular-nums"
        >
          ∠i = {ray.incidentDeg}° · ∠r = {ray.reflectedDeg}°
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 320 200"
        className="w-full h-auto touch-none select-none"
        role="img"
        aria-label={`Interactive reflection diagram showing incident angle ${ray.incidentDeg} degrees equal to reflected angle ${ray.reflectedDeg} degrees`}
        onPointerMove={(e) => {
          if (draggingRef.current) {
            updateAngleFromPointer(e.clientX, e.clientY);
          }
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        onPointerLeave={() => {
          draggingRef.current = false;
        }}
      >
        {/* Dashed Normal Line */}
        <line x1="160" y1="24" x2="160" y2="170" stroke="#111111" strokeWidth="2" strokeDasharray="5 5" opacity="0.55" />
        <text x="166" y="34" fontSize="10.5" fontFamily="Lexend, sans-serif" fontWeight="700" fill="#111111" opacity="0.65">Normal</text>

        {/* Plane Mirror Surface + hatching */}
        <rect x="44" y="170" width="232" height="12" rx="4" fill="#DFF1FF" stroke="#111111" strokeWidth="3" />
        {[58, 82, 106, 130, 154, 178, 202, 226, 250].map((hx) => (
          <line key={hx} x1={hx} y1="182" x2={hx - 8} y2="192" stroke="#111111" strokeWidth="2" />
        ))}

        {/* Incident Ray */}
        <line
          x1={ray.incidentStartX}
          y1={ray.incidentStartY}
          x2="160"
          y2="170"
          stroke="#FFA500"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Reflected Ray */}
        <line
          x1="160"
          y1="170"
          x2={ray.reflectedEndX}
          y2={ray.reflectedEndY}
          stroke="#5B4BFF"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Point of Incidence */}
        <circle cx="160" cy="170" r="6" fill="#111111" />

        {/* Angle labels */}
        <text x="122" y="142" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="11" fill="#B45309">
          i={ray.incidentDeg}°
        </text>
        <text x="168" y="142" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="11" fill="#5B4BFF">
          r={ray.reflectedDeg}°
        </text>

        {/* Draggable Torch Handle */}
        <g
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => {
            draggingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            updateAngleFromPointer(e.clientX, e.clientY);
          }}
        >
          <circle
            cx={ray.incidentStartX}
            cy={ray.incidentStartY}
            r="15"
            fill="#FFA500"
            stroke="#111111"
            strokeWidth="3"
          />
          <circle cx={ray.incidentStartX} cy={ray.incidentStartY} r="5" fill="#FFF8E1" />
        </g>
      </svg>

      {/* Accessible Keyboard & Touch Slider Fallback */}
      <div className="flex items-center gap-3 pt-0.5">
        <label htmlFor="reflection-angle-slider" className="text-[11px] font-bold text-[#111111]/75 whitespace-nowrap">
          Adjust angle:
        </label>
        <input
          id="reflection-angle-slider"
          type="range"
          min={15}
          max={70}
          value={angleDeg}
          onChange={(e) => setAngleDeg(Number(e.target.value))}
          className="w-full accent-[#5B4BFF]"
        />
      </div>
    </div>
  );
};

/* ── Mini-Scene 3: Social Science Rotating Globe with Popping Pins ── */
const SocialScene: React.FC = () => (
  <div className="space-y-2.5">
    <div className="flex items-center justify-between text-xs font-bold text-[#111111]/75">
      <span>Geography &amp; History · Interactive maps</span>
      <span className="font-mono text-[#B45309]">20.5° N · 78.9° E</span>
    </div>

    <svg viewBox="0 0 340 185" className="w-full h-auto" role="img" aria-label="Rotating stylized globe with highlighted pins across India and Asia">
      <defs>
        <clipPath id="globeClip">
          <circle cx="170" cy="96" r="72" />
        </clipPath>
      </defs>

      {/* Outer Globe Circle */}
      <circle cx="170" cy="96" r="72" fill="#DFF1FF" stroke="#111111" strokeWidth="3.2" />

      {/* Slowly drifting latitude/longitude & landmasses */}
      <g clipPath="url(#globeClip)">
        <g className="animate-globe-spin">
          <path d="M126 52 Q150 48 164 68 Q174 86 158 112 Q142 126 128 102 Z" fill="#9BF0C2" stroke="#111111" strokeWidth="2.4" />
          <path d="M188 64 Q212 58 228 80 Q222 108 202 118 Q186 104 188 64 Z" fill="#9BF0C2" stroke="#111111" strokeWidth="2.4" />
          <path d="M254 52 Q278 48 292 68 Q302 86 286 112 Q270 126 256 102 Z" fill="#9BF0C2" stroke="#111111" strokeWidth="2.4" />
          {/* Longitude arcs */}
          <ellipse cx="170" cy="96" rx="34" ry="72" fill="none" stroke="#111111" strokeWidth="1.5" opacity="0.28" />
          <ellipse cx="218" cy="96" rx="34" ry="72" fill="none" stroke="#111111" strokeWidth="1.5" opacity="0.28" />
        </g>
        {/* Equator & Tropic of Cancer */}
        <line x1="94" y1="96" x2="246" y2="96" stroke="#111111" strokeWidth="1.8" strokeDasharray="4 4" opacity="0.45" />
        <line x1="100" y1="74" x2="240" y2="74" stroke="#B45309" strokeWidth="2" strokeDasharray="3 3" opacity="0.65" />
      </g>

      {/* Popping Location Pins */}
      {[
        { x: 158, y: 74, label: 'Delhi' },
        { x: 194, y: 98, label: 'Deccan' },
        { x: 132, y: 102, label: 'Dandi' },
      ].map((pin) => (
        <g key={pin.label}>
          <path
            d={`M${pin.x} ${pin.y} C${pin.x - 10} ${pin.y - 12}, ${pin.x - 10} ${pin.y - 24}, ${pin.x} ${pin.y - 24} C${pin.x + 10} ${pin.y - 24}, ${pin.x + 10} ${pin.y - 12}, ${pin.x} ${pin.y} Z`}
            fill="#FFA500"
            stroke="#111111"
            strokeWidth="2.4"
          />
          <circle cx={pin.x} cy={pin.y - 16} r="3.2" fill="#111111" />
        </g>
      ))}
    </svg>
  </div>
);

/* ── Mini-Scene 4: English Quill Typing + Grammar Underline ── */
const ENGLISH_SENTENCE = 'The patient tutor explains every chapter clearly.';

const EnglishScene: React.FC<{ active: boolean }> = ({ active }) => {
  const [count, setCount] = useState(ENGLISH_SENTENCE.length);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !active) {
      setCount(ENGLISH_SENTENCE.length);
      return;
    }
    setCount(0);
    let idx = 0;
    const timer = window.setInterval(() => {
      idx += 2;
      setCount(Math.min(ENGLISH_SENTENCE.length, idx));
      if (idx >= ENGLISH_SENTENCE.length) window.clearInterval(timer);
    }, 34);
    return () => window.clearInterval(timer);
  }, [active]);

  const shown = ENGLISH_SENTENCE.slice(0, count);
  const done = count >= ENGLISH_SENTENCE.length;

  return (
    <div className="space-y-4 py-3">
      <div className="flex items-center justify-between text-xs font-bold text-[#111111]/75">
        <span>Grammar &amp; Writing · Sentence craft</span>
        <span className="font-mono text-[#1D4ED8]">Subject · Verb · Adverb</span>
      </div>

      <div className="bg-[#FFF8E1] border-[2.5px] border-[#111111] rounded-2xl p-5 shadow-[4px_4px_0_#111111] space-y-4">
        <p className="font-display font-bold text-lg sm:text-xl text-[#111111] leading-relaxed min-h-[3.5rem]">
          {done ? (
            <>
              <span className="underline decoration-[#5B4BFF] decoration-[3.5px] underline-offset-4">
                The patient tutor
              </span>{' '}
              <span className="underline decoration-[#FFA500] decoration-[3.5px] underline-offset-4">
                explains
              </span>{' '}
              every chapter{' '}
              <span className="underline decoration-[#15803D] decoration-[3.5px] underline-offset-4">
                clearly
              </span>
              .
            </>
          ) : (
            <>
              {shown}
              <span className="inline-block w-0.5 h-5 bg-[#1D4ED8] ml-0.5 align-middle" />
            </>
          )}
        </p>

        <div className="flex flex-wrap gap-3 text-xs font-bold text-[#111111]">
          <span className="text-[#5B4BFF]">— Subject phrase</span>
          <span className="text-[#B45309]">— Action verb</span>
          <span className="text-[#15803D]">— Adverb of manner</span>
        </div>
      </div>
    </div>
  );
};

/* ── Mini-Scene 5: Hindi Devanagari Glyphs Assembling ── */
const HINDI_GLYPHS = ['अ', 'भ्', 'या', 'स'];

const HindiScene: React.FC<{ active: boolean }> = ({ active }) => {
  const [assembled, setAssembled] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !active) {
      setAssembled(true);
      return;
    }
    setAssembled(false);
    const t = window.setTimeout(() => setAssembled(true), 240);
    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <div className="space-y-4 py-3">
      <div className="flex items-center justify-between text-xs font-bold text-[#111111]/75">
        <span>हिन्दी व्याकरण · अक्षर संयोजन</span>
        <span className="font-mono text-[#BE185D]">Abhyaas · Practice</span>
      </div>

      <div className="bg-[#FFF8E1] border-[2.5px] border-[#111111] rounded-2xl p-6 shadow-[4px_4px_0_#111111] text-center space-y-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {HINDI_GLYPHS.map((glyph, idx) => (
            <span
              key={glyph}
              style={{
                transform: assembled
                  ? 'translate(0, 0) rotate(0deg)'
                  : `translate(${(idx - 1.5) * 28}px, ${idx % 2 === 0 ? -18 : 18}px) rotate(${(idx - 1.5) * 9}deg)`,
                transition: `transform 520ms cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 75}ms`,
              }}
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFE3EC] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] font-bold text-2xl sm:text-3xl text-[#111111]"
            >
              {glyph}
            </span>
          ))}
        </div>

        <p className="text-sm font-semibold text-[#111111]">
          <span className="text-[#BE185D] font-bold text-base">अभ्यास</span> — Steady daily practice builds exam confidence.
        </p>
      </div>
    </div>
  );
};

/* ── Mini-Scene 6: Sanskrit Shloka Fading Character by Character ── */
const SHLOKA = 'विद्या ददाति विनयम्।';

const SanskritScene: React.FC<{ active: boolean }> = ({ active }) => {
  const chars = Array.from(SHLOKA);
  const [visibleChars, setVisibleChars] = useState(chars.length);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !active) {
      setVisibleChars(chars.length);
      return;
    }
    setVisibleChars(0);
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setVisibleChars(i);
      if (i >= chars.length) window.clearInterval(timer);
    }, 65);
    return () => window.clearInterval(timer);
  }, [active, chars.length]);

  return (
    <div className="space-y-4 py-3">
      <div className="flex items-center justify-between text-xs font-bold text-[#111111]/75">
        <span>संस्कृत सुभाषितानि · Shloka study</span>
        <span className="font-mono text-[#9A3412]">Anvaya &amp; meaning</span>
      </div>

      <div className="bg-[#FFF8E1] border-[2.5px] border-[#111111] rounded-2xl p-6 shadow-[4px_4px_0_#111111] text-center space-y-3">
        <p className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-wide min-h-[2.6rem]">
          {chars.map((ch, idx) => (
            <span
              key={idx}
              style={{
                opacity: idx < visibleChars ? 1 : 0.08,
                transition: 'opacity 220ms ease',
              }}
            >
              {ch}
            </span>
          ))}
        </p>
        <p className="text-xs sm:text-sm font-medium text-[#111111]/80">
          “Vidya dadati vinayam” — True knowledge brings humility.
        </p>
      </div>
    </div>
  );
};

const renderWorldScene = (id: SubjectWorldId, isActive: boolean) => {
  switch (id) {
    case 'maths':
      return <MathsScene active={isActive} />;
    case 'science':
      return <ScienceScene />;
    case 'social':
      return <SocialScene />;
    case 'english':
      return <EnglishScene active={isActive} />;
    case 'hindi':
      return <HindiScene active={isActive} />;
    case 'sanskrit':
      return <SanskritScene active={isActive} />;
  }
};

interface SubjectWorldsSectionProps {
  board?: BoardId;
  classLevel?: ClassLevel;
  onPinnedProgress?: (progress: number) => void;
}

export const SubjectWorldsSection: React.FC<SubjectWorldsSectionProps> = ({
  board = 'CBSE',
  classLevel = 10,
  onPinnedProgress,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const progressCbRef = useRef(onPinnedProgress);
  progressCbRef.current = onPinnedProgress;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isPinningActive, setIsPinningActive] = useState(false);
  const [stageMinHeightPx, setStageMinHeightPx] = useState<number | undefined>(undefined);

  const currentWorld = SUBJECT_WORLDS[activeIndex];
  const syllabus = getSyllabusForSelection(board, classLevel);
  const matchingChapters = syllabus.chapters.filter(
    (ch) => ch.subject.toLowerCase() === currentWorld.name.toLowerCase()
  );

  // Lazy-activate heavy scene animations only when near viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setIsNearViewport(entries[0].isIntersecting);
      },
      { rootMargin: '320px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Compute exact pixel viewport height on load & resize (no vh/svh CSS units)
  useEffect(() => {
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateStageHeight = () => {
      setStageMinHeightPx(
        computeChapterMinHeightPx(window.innerHeight, window.innerWidth >= 900, mqReduce.matches)
      );
    };
    updateStageHeight();
    window.addEventListener('resize', updateStageHeight, { passive: true });
    mqReduce.addEventListener('change', updateStageHeight);
    return () => {
      window.removeEventListener('resize', updateStageHeight);
      mqReduce.removeEventListener('change', updateStageHeight);
    };
  }, []);

  // Desktop (>= 900px) GSAP ScrollTrigger Pin with scrub: true (no double-smoothing with Lenis)
  useEffect(() => {
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqDesktop = window.matchMedia('(min-width: 900px)');
    const pinEl = pinRef.current;
    if (!pinEl) return;

    let ctx: gsap.Context | null = null;

    const setupPin = () => {
      if (ctx) {
        ctx.revert();
        ctx = null;
        scrollTriggerRef.current = null;
      }
      if (mqReduce.matches || !mqDesktop.matches) {
        setIsPinningActive(false);
        return;
      }

      ctx = gsap.context(() => {
        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${computeSubjectWorldsPinDistance(window.innerHeight, SUBJECT_WORLDS.length)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => setIsPinningActive(self.isActive),
          onUpdate: (self) => {
            const idx = resolveSubjectWorldIndex(self.progress, SUBJECT_WORLDS.length);
            setActiveIndex(idx);
            progressCbRef.current?.(self.progress);
          },
        });
      }, sectionRef);
    };

    setupPin();
    mqDesktop.addEventListener('change', setupPin);
    mqReduce.addEventListener('change', setupPin);

    return () => {
      mqDesktop.removeEventListener('change', setupPin);
      mqReduce.removeEventListener('change', setupPin);
      scrollTriggerRef.current = null;
      if (ctx) ctx.revert();
    };
  }, []);

  // Jump to a specific subject world (clicking rail dot or using arrow keys)
  const jumpToWorld = (targetIdx: number) => {
    const clamped = Math.max(0, Math.min(SUBJECT_WORLDS.length - 1, targetIdx));
    setActiveIndex(clamped);

    // Sync desktop ScrollTrigger scroll position smoothly if active
    const st = scrollTriggerRef.current;
    if (st && window.innerWidth >= 900) {
      const targetProgress = (clamped + 0.15) / SUBJECT_WORLDS.length;
      const targetScrollY = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }

    // Sync mobile snap track if visible
    const track = mobileTrackRef.current;
    if (track && window.innerWidth < 900) {
      const child = track.children[clamped] as HTMLElement | undefined;
      child?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  // Keyboard arrow navigation when section is focused
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      e.preventDefault();
      jumpToWorld((activeIndex + 1) % SUBJECT_WORLDS.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      e.preventDefault();
      jumpToWorld((activeIndex - 1 + SUBJECT_WORLDS.length) % SUBJECT_WORLDS.length);
    }
  };

  // Mobile horizontal snap scroll background morph
  const handleMobileScroll = () => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const cardWidth = track.clientWidth;
    if (!cardWidth) return;
    const idx = Math.round(track.scrollLeft / cardWidth);
    const clamped = Math.max(0, Math.min(SUBJECT_WORLDS.length - 1, idx));
    if (clamped !== activeIndex) {
      setActiveIndex(clamped);
    }
  };

  return (
    <section
      id="worlds"
      ref={sectionRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Subject Worlds interactive showcase"
      data-testid="subject-worlds-section"
      data-active-subject={currentWorld.id}
      style={{
        backgroundColor: currentWorld.pastel,
        transition: 'background-color 480ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="relative outline-none focus-visible:ring-4 focus-visible:ring-[#5B4BFF]"
    >
      {/* DESKTOP PINNED IMMERSIVE STAGE (>= 900px) */}
      <div
        ref={pinRef}
        style={{
          minHeight: stageMinHeightPx ? `${stageMinHeightPx}px` : undefined,
          willChange: isPinningActive ? 'transform' : 'auto',
        }}
        className="hidden min-[900px]:flex items-center pt-20 pb-8 relative overflow-hidden"
      >
        <div className="mx-auto max-w-[1240px] w-full px-6 relative z-10">
          {/* Header Row */}
          <div className="flex items-end justify-between gap-6 mb-3.5">
            <div className="space-y-1">
              <p
                data-testid="worlds-board-context"
                className="font-display font-bold text-xs text-[#111111]/80"
              >
                Class {classLevel} {board} · Subject worlds · Scroll or use arrow keys
              </p>
              <div className="flex flex-wrap items-center gap-3.5">
                <h2
                  key={currentWorld.id}
                  data-testid="active-world-title"
                  className="font-display font-extrabold text-outlined-ink leading-none tracking-[-0.03em] select-none"
                  style={{ fontSize: 'clamp(2.5rem, 4.4vw, 3.85rem)' }}
                >
                  {currentWorld.name}
                </h2>

                {/* Honest Status Chip */}
                <span
                  data-testid="active-world-status"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] font-display font-bold text-xs whitespace-nowrap ${
                    currentWorld.status === 'live'
                      ? 'bg-[#9BF0C2] text-[#111111]'
                      : 'bg-white text-[#111111]'
                  }`}
                >
                  {currentWorld.status === 'live' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{currentWorld.statusLabel}</span>
                </span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-xs font-bold text-[#111111]/70">
                New lessons are added regularly.
              </p>
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous subject world"
                  onClick={() => jumpToWorld((activeIndex - 1 + SUBJECT_WORLDS.length) % SUBJECT_WORLDS.length)}
                  className="neo-btn-sm w-8 h-8 bg-white hover:bg-[#FFF8E1] flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4 text-[#111111]" />
                </button>
                <span className="font-mono font-bold text-xs tabular-nums px-1.5">
                  0{activeIndex + 1} / 0{SUBJECT_WORLDS.length}
                </span>
                <button
                  type="button"
                  aria-label="Next subject world"
                  onClick={() => jumpToWorld((activeIndex + 1) % SUBJECT_WORLDS.length)}
                  className="neo-btn-sm w-8 h-8 bg-white hover:bg-[#FFF8E1] flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4 text-[#111111]" />
                </button>
              </div>
            </div>
          </div>

          {/* Stage Content: Interactive Mini-Scene + Pebby with Subject Prop + Vertical Progress Rail */}
          <div className="grid grid-cols-12 gap-6 items-center">
            {/* Interactive Subject Mini-Scene Card */}
            <div className="col-span-7 neo-card bg-white p-4 sm:p-5 space-y-3">
              <p className="text-sm font-medium text-[#111111]/85 leading-snug">
                {currentWorld.tagline}
              </p>
              <div>{renderWorldScene(currentWorld.id, isNearViewport)}</div>

              {/* Chosen Board & Class Sample Chapter Strip */}
              <div className="pt-2 border-t-2 border-[#111111]/10 flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-[11px] text-[#5B4BFF]">
                  Class {classLevel} {board}:
                </span>
                {matchingChapters.length > 0 ? (
                  matchingChapters.slice(0, 3).map((ch) => (
                    <span
                      key={`${ch.number}-${ch.title}`}
                      className="text-[11px] font-semibold bg-[#EEF0F8] border border-[#111111] rounded-full px-2.5 py-0.5 text-[#111111]"
                    >
                      {ch.number} · {ch.title}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] font-medium text-[#111111]/70">
                    Coming soon for Class {classLevel} {board} — new lessons are added regularly.
                  </span>
                )}
              </div>
            </div>

            {/* Pebby with World-Specific Prop */}
            <div className="col-span-4 flex flex-col items-center justify-center">
              <div className="w-[204px] h-[204px] rounded-full bg-white/85 border-[3.5px] border-[#111111] shadow-[7px_7px_0_#111111] flex items-center justify-center">
                <PebbyMascot
                  pose={currentWorld.id === 'maths' || currentWorld.id === 'science' ? 'waking' : 'reading'}
                  prop={currentWorld.id as PebbyProp}
                  className="w-[180px] h-[180px]"
                  trackCursor={isNearViewport}
                  ariaLabel={currentWorld.pebbyCaption}
                />
              </div>
              <p className="mt-3 font-display font-bold text-xs text-[#111111]/80 bg-white border-2 border-[#111111] rounded-full px-4 py-1 shadow-[3px_3px_0_#111111]">
                {currentWorld.pebbyCaption}
              </p>
            </div>

            {/* Vertical 6-Dot Progress Rail */}
            <div className="col-span-1 flex flex-col items-end justify-center">
              <div
                role="tablist"
                aria-label="Jump to subject world"
                className="flex flex-col items-center gap-3 bg-white border-[2.5px] border-[#111111] rounded-full py-3.5 px-2.5 shadow-[4px_4px_0_#111111]"
              >
                {SUBJECT_WORLDS.map((w, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Jump to ${w.name} world (${w.statusLabel})`}
                      title={`${w.name} — ${w.statusLabel}`}
                      onClick={() => jumpToWorld(idx)}
                      className={`rounded-full border-2 border-[#111111] transition-all ${
                        isActive
                          ? 'w-4 h-8 bg-[#5B4BFF]'
                          : 'w-3.5 h-3.5 bg-[#EEF0F8] hover:bg-[#FFA500]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET HORIZONTAL SNAP-SCROLLING CARDS (< 900px) */}
      <div className="min-[900px]:hidden py-6 space-y-3.5">
        <div className="px-4 sm:px-6 flex items-center justify-between gap-3">
          <div>
            <p className="font-display font-bold text-xs text-[#111111]/75">
              Class {classLevel} {board} · Subject worlds · Swipe across
            </p>
            <p className="text-xs text-[#111111]/70 mt-0.5">
              New lessons are added regularly.
            </p>
          </div>
          <span className="font-mono font-bold text-xs tabular-nums bg-white border-2 border-[#111111] rounded-full px-3 py-1">
            0{activeIndex + 1} / 0{SUBJECT_WORLDS.length}
          </span>
        </div>

        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 gap-4 pb-2"
        >
          {SUBJECT_WORLDS.map((world, idx) => (
            <div
              key={world.id}
              className="snap-center shrink-0 w-[calc(100vw-2rem)] sm:w-[88vw] neo-card bg-white p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display font-extrabold text-3xl text-[#111111]">
                  {world.name}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#111111] font-display font-bold text-xs ${
                    world.status === 'live' ? 'bg-[#9BF0C2]' : 'bg-[#EEF0F8]'
                  }`}
                >
                  {world.status === 'live' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {world.statusLabel}
                </span>
              </div>

              <p className="text-sm text-[#111111]/80 leading-snug">{world.tagline}</p>

              <div>{renderWorldScene(world.id, isNearViewport && idx === activeIndex)}</div>

              <div className="flex items-center gap-3 pt-2 border-t-2 border-[#111111]/10">
                <PebbyMascot
                  pose="waving"
                  prop={world.id as PebbyProp}
                  className="w-20 h-20 shrink-0"
                  trackCursor={false}
                  ariaLabel={world.pebbyCaption}
                />
                <p className="text-xs font-display font-bold text-[#111111]/80">
                  {world.pebbyCaption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Dot Jumpers */}
        <div className="flex items-center justify-center gap-2 px-4">
          {SUBJECT_WORLDS.map((w, idx) => (
            <button
              key={w.id}
              type="button"
              aria-label={`Go to ${w.name}`}
              onClick={() => jumpToWorld(idx)}
              className={`h-3 rounded-full border-2 border-[#111111] transition-all ${
                idx === activeIndex ? 'w-7 bg-[#5B4BFF]' : 'w-3 bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
