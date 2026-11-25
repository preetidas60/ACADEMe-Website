import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { CHAPTERS_META } from '../data/academeData';
import { computeChapterRailSegments, getAdjacentChapterIndex } from '../utils/logic';

interface ChapterProgressRailProps {
  activeIndex: number;
  inFinale: boolean;
  pinnedProgress: number;
  pageProgress: number;
  onSelectChapter: (index: number) => void;
}

export const ChapterProgressRail: React.FC<ChapterProgressRailProps> = ({
  activeIndex,
  inFinale,
  pinnedProgress,
  pageProgress,
  onSelectChapter,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [finalePhase, setFinalePhase] = useState<'none' | 'celebrating' | 'faded'>('none');
  const [showTransientLabel, setShowTransientLabel] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Briefly slide out the chapter label when moving between chapters, then tuck cleanly while reading
  useEffect(() => {
    setShowTransientLabel(true);
    const timer = window.setTimeout(() => {
      setShowTransientLabel(false);
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [activeIndex, inFinale]);

  // Finale celebration: all indigo + check icon + Pebby tuft pops for ~1s, then rail fades out
  useEffect(() => {
    if (!inFinale) {
      setFinalePhase('none');
      return;
    }
    if (reducedMotion) {
      setFinalePhase('faded');
      return;
    }
    setFinalePhase('celebrating');
    const fadeTimer = window.setTimeout(() => {
      setFinalePhase('faded');
    }, 1150);
    return () => window.clearTimeout(fadeTimer);
  }, [inFinale, reducedMotion]);

  // Keyboard PageUp / PageDown chapter-by-chapter navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'PageDown') {
        e.preventDefault();
        const nextIdx = getAdjacentChapterIndex(activeIndex, 1, CHAPTERS_META.length);
        onSelectChapter(nextIdx);
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        const prevIdx = getAdjacentChapterIndex(activeIndex, -1, CHAPTERS_META.length);
        onSelectChapter(prevIdx);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, onSelectChapter]);

  const segments = computeChapterRailSegments({
    activeIndex,
    totalChapters: CHAPTERS_META.length,
    inFinale,
    pinnedProgress,
  });

  const displayIdx = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const displayMeta = CHAPTERS_META[displayIdx] ?? CHAPTERS_META[0];
  const isRailHidden = finalePhase === 'faded';
  const isLabelVisible = hoveredIndex !== null || showTransientLabel || finalePhase === 'celebrating';
  // Vertical slide offset aligning the label pill smoothly beside the active/hovered segment
  const segmentOffsetY = (displayIdx - 3.5) * 32;

  return (
    <>
      {/* MOBILE / TABLET THIN TOP PROGRESS BAR (< 900px) */}
      <div
        aria-hidden="true"
        data-testid="mobile-progress-bar"
        className="min-[900px]:hidden fixed top-0 inset-x-0 z-[55] h-1.5 bg-[#EEF0F8]/90 border-b border-[#111111]/25 pointer-events-none"
      >
        <div
          className="h-full bg-[#5B4BFF] origin-left"
          style={{
            transform: `scaleX(${Math.max(0.02, Math.min(1, pageProgress))})`,
            transition: reducedMotion ? 'none' : 'transform 120ms linear',
          }}
        />
      </div>

      {/* DESKTOP FIXED RIGHT-EDGE CHAPTER PROGRESS RAIL (>= 900px) */}
      <aside
        aria-label="Chapter progress navigation"
        data-testid="chapter-progress-rail"
        data-active-chapter={activeIndex + 1}
        data-finale-phase={finalePhase}
        className="hidden min-[900px]:flex fixed right-3 xl:right-5 top-1/2 -translate-y-1/2 z-40 items-center gap-2.5 pointer-events-none"
        style={{
          opacity: isRailHidden ? 0 : 1,
          transform: isRailHidden
            ? 'translate3d(18px, -50%, 0)'
            : 'translate3d(0, -50%, 0)',
          transition: reducedMotion
            ? 'none'
            : 'opacity 420ms ease, transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Sliding Chapter Label Pill beside current / hovered segment */}
        <div
          data-testid="rail-chapter-label"
          className="bg-white border-[2.5px] border-[#111111] rounded-full shadow-[3px_3px_0_#111111] px-3 py-1 text-[11px] font-display font-bold text-[#111111] whitespace-nowrap select-none"
          style={{
            opacity: isLabelVisible ? 1 : 0,
            transform: `translate3d(${isLabelVisible ? 0 : 12}px, ${segmentOffsetY}px, 0)`,
            transition: reducedMotion
              ? 'none'
              : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease',
          }}
        >
          {finalePhase === 'celebrating' ? (
            <span className="text-[#5B4BFF]">All 8 chapters complete!</span>
          ) : (
            <span>
              Chapter {displayMeta.number} of {CHAPTERS_META.length} ·{' '}
              <span className="text-[#5B4BFF]">{displayMeta.shortTitle}</span>
            </span>
          )}
        </div>

        {/* Vertical 8-Segment Lesson-Bar Capsule */}
        <div
          className={`relative flex flex-col items-center gap-2 bg-white border-[3px] border-[#111111] rounded-full py-3 px-2 shadow-[4px_4px_0_#111111] ${
            isRailHidden ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          {/* Pebby Leaf Tuft + Check Celebration popping out of rail top on Finale */}
          {finalePhase === 'celebrating' && (
            <div
              aria-hidden="true"
              className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center animate-rail-tuft-pop"
            >
              <svg viewBox="0 0 46 26" className="w-8 h-5 overflow-visible">
                <ellipse
                  cx="15"
                  cy="17"
                  rx="6"
                  ry="7.5"
                  transform="rotate(-14 15 17)"
                  fill="#7C7FFF"
                  stroke="#111111"
                  strokeWidth="2.4"
                />
                <ellipse
                  cx="24"
                  cy="13"
                  rx="6.5"
                  ry="9"
                  transform="rotate(8 24 13)"
                  fill="#8F92FF"
                  stroke="#111111"
                  strokeWidth="2.4"
                />
                <ellipse
                  cx="33"
                  cy="18"
                  rx="5.5"
                  ry="6.5"
                  transform="rotate(26 33 18)"
                  fill="#7C7FFF"
                  stroke="#111111"
                  strokeWidth="2.4"
                />
              </svg>
              <span className="w-6 h-6 -mt-1 rounded-full bg-[#9BF0C2] border-2 border-[#111111] flex items-center justify-center shadow-[2px_2px_0_#111111]">
                <Check className="w-3.5 h-3.5 text-[#111111]" />
              </span>
            </div>
          )}

          {segments.map((seg) => {
            const chapter = CHAPTERS_META[seg.index];
            const isCurrent = seg.status === 'current';
            const isCompleted = seg.status === 'completed';

            return (
              <button
                key={chapter.id}
                type="button"
                aria-label={`Jump to Chapter ${chapter.number}: ${chapter.shortTitle}`}
                aria-current={isCurrent ? 'step' : undefined}
                title={`Chapter ${chapter.number} · ${chapter.shortTitle}`}
                onClick={() => onSelectChapter(seg.index)}
                onMouseEnter={() => setHoveredIndex(seg.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(seg.index)}
                onBlur={() => setHoveredIndex(null)}
                className={`relative w-3.5 rounded-full border-[2.5px] border-[#111111] overflow-hidden focus-visible:ring-2 focus-visible:ring-[#5B4BFF] ${
                  isCurrent ? 'h-9 bg-[#FFF8E1]' : 'h-6 bg-[#EEF0F8]'
                }`}
                style={{
                  transition: reducedMotion ? 'none' : 'height 260ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {/* Completed = Indigo; Current = Amber with proportional pinned fill */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 origin-top ${
                    isCompleted
                      ? 'bg-[#5B4BFF] h-full'
                      : isCurrent
                      ? 'bg-[#FFA500] h-full'
                      : 'h-0'
                  }`}
                  style={{
                    transform: isCurrent
                      ? `scaleY(${seg.fillRatio})`
                      : isCompleted
                      ? 'scaleY(1)'
                      : 'scaleY(0)',
                    transition: reducedMotion ? 'none' : 'transform 140ms linear, background-color 220ms ease',
                  }}
                />
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
