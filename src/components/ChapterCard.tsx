import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import {
  computeCardEdgeShadowOpacity,
  computeChapterMinHeightPx,
  computeStickyTopOffset,
} from '../utils/logic';

gsap.registerPlugin(ScrollTrigger);

interface ChapterCardProps {
  id: string;
  zIndex: number;
  bg: string;
  isFirst?: boolean;
  isFinale?: boolean;
  hasInnerPin?: boolean;
  nextTriggerId?: string;
  nextChapterLabel?: string;
  onJumpNext?: (targetId: string) => void;
  children: React.ReactNode;
}

/**
 * Full-screen stacked chapter card wrapper (desktop >= 900px, motion allowed):
 * - Non-pinned chapters (1, 2, 3, 6, 7, 8, and Finale) get pixel min-height === window.innerHeight
 *   computed on load and resize (no vh/svh units), with content vertically centered.
 * - Zero negative top margin overlap (-mt-6 removed): next chapter top sits strictly >= viewport bottom.
 * - Upward hard shadow (0 -8px 0 #111111) starts at opacity 0 below the fold and fades in via scrubbed
 *   ScrollTrigger only as the card enters, so neither shadow nor corners ever peek into the prior chapter.
 * - Subtle cover transition on the covered chapter: scale 1 -> 0.97 and dim opacity 0 -> 0.14 with scrub: true.
 * - Bouncing "Next: {chapter name}" chip at bottom centre fades out as the next chapter enters.
 * - Below 900px or with prefers-reduced-motion: normal vertical flow, zero stacking or min-height forcing.
 */
export const ChapterCard: React.FC<ChapterCardProps> = ({
  id,
  zIndex,
  bg,
  isFirst = false,
  isFinale = false,
  hasInnerPin = false,
  nextTriggerId,
  nextChapterLabel,
  onJumpNext,
  children,
}) => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const nextChipRef = useRef<HTMLDivElement | null>(null);

  const [enableStack, setEnableStack] = useState(false);
  const [viewportHeightPx, setViewportHeightPx] = useState<number | undefined>(undefined);
  const [stickyTop, setStickyTop] = useState(0);
  const [isNearCoverZone, setIsNearCoverZone] = useState(isFirst);
  const [isNearOwnTop, setIsNearOwnTop] = useState(false);

  // Track desktop (>= 900px) & reduced-motion + pixel viewport height on load & resize
  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 900px)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMetrics = () => {
      const desktop = mqDesktop.matches;
      const reduced = mqReduce.matches;
      setEnableStack(desktop && !reduced);
      setViewportHeightPx(computeChapterMinHeightPx(window.innerHeight, desktop, reduced));
    };

    updateMetrics();
    mqDesktop.addEventListener('change', updateMetrics);
    mqReduce.addEventListener('change', updateMetrics);
    window.addEventListener('resize', updateMetrics, { passive: true });
    return () => {
      mqDesktop.removeEventListener('change', updateMetrics);
      mqReduce.removeEventListener('change', updateMetrics);
      window.removeEventListener('resize', updateMetrics);
    };
  }, []);

  // Recompute pixel sticky offset on load, content resize, and viewport resize
  useEffect(() => {
    if (!enableStack || hasInnerPin || isFinale) {
      setStickyTop(0);
      return;
    }

    const el = outerRef.current;
    if (!el) return;

    const recalc = () => {
      const h = el.offsetHeight;
      const vh = window.innerHeight;
      setStickyTop(computeStickyTopOffset(h, vh));
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    window.addEventListener('resize', recalc, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recalc);
    };
  }, [enableStack, hasInnerPin, isFinale, viewportHeightPx]);

  // Lazy-observe proximity to the next card so off-screen cover ScrollTriggers are killed cleanly
  useEffect(() => {
    if (!enableStack || !nextTriggerId || isFinale) return;
    const nextEl = document.getElementById(nextTriggerId);
    if (!nextEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsNearCoverZone(Boolean(entries[0]?.isIntersecting));
      },
      { rootMargin: '480px 0px 480px 0px', threshold: 0 }
    );
    observer.observe(nextEl);
    return () => observer.disconnect();
  }, [enableStack, nextTriggerId, isFinale]);

  // Lazy-observe proximity to own top edge for the upward shadow fade-in ScrollTrigger
  useEffect(() => {
    if (!enableStack || isFirst) return;
    const outerEl = outerRef.current;
    if (!outerEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsNearOwnTop(Boolean(entries[0]?.isIntersecting));
      },
      { rootMargin: '480px 0px 480px 0px', threshold: 0 }
    );
    observer.observe(outerEl);
    return () => observer.disconnect();
  }, [enableStack, isFirst]);

  // Fade in this card's upward hard shadow (0 -8px 0 #111111) ONLY once its top crosses viewport bottom
  useEffect(() => {
    const shadowEl = shadowRef.current;
    const outerEl = outerRef.current;
    if (!shadowEl || !outerEl || !enableStack || isFirst) return;

    // Immediately enforce accurate initial opacity (strictly 0 when below fold)
    const initialOpacity = computeCardEdgeShadowOpacity(
      outerEl.getBoundingClientRect().top,
      window.innerHeight,
      72
    );
    shadowEl.style.opacity = String(initialOpacity);

    if (!isNearOwnTop) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outerEl,
        start: 'top bottom',
        end: 'top bottom-=72',
        scrub: true,
        onToggle: (self) => {
          shadowEl.style.willChange = self.isActive ? 'opacity' : 'auto';
        },
        onUpdate: (self) => {
          shadowEl.style.opacity = String(self.progress);
        },
        onLeaveBack: () => {
          shadowEl.style.opacity = '0';
        },
        onLeave: () => {
          shadowEl.style.opacity = '1';
        },
      });
    });

    return () => {
      shadowEl.style.willChange = 'auto';
      ctx.revert();
    };
  }, [enableStack, isFirst, isNearOwnTop]);

  // Subtle cover transition (scale 1 -> 0.97, dim 0 -> 0.14) + fade out "Next" chip with scrub: true
  useEffect(() => {
    if (!enableStack || !nextTriggerId || isFinale || !isNearCoverZone) return;

    const innerEl = innerRef.current;
    const veilEl = veilRef.current;
    const chipEl = nextChipRef.current;
    const nextEl = document.getElementById(nextTriggerId);
    if (!innerEl || !veilEl || !nextEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: nextEl,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          onToggle: (self) => {
            innerEl.style.willChange = self.isActive ? 'transform' : 'auto';
            veilEl.style.willChange = self.isActive ? 'opacity' : 'auto';
          },
        },
      });

      tl.to(
        innerEl,
        {
          scale: 0.97,
          borderRadius: 28,
          transformOrigin: 'center top',
          ease: 'none',
        },
        0
      ).to(
        veilEl,
        {
          opacity: 0.14,
          ease: 'none',
        },
        0
      );

      if (chipEl) {
        gsap.fromTo(
          chipEl,
          { opacity: 1 },
          {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: nextEl,
              start: 'top bottom',
              end: 'top bottom-=120',
              scrub: true,
              onToggle: (self) => {
                chipEl.style.willChange = self.isActive ? 'opacity' : 'auto';
              },
            },
          }
        );
      }
    });

    return () => {
      innerEl.style.willChange = 'auto';
      veilEl.style.willChange = 'auto';
      if (chipEl) chipEl.style.willChange = 'auto';
      ctx.revert();
    };
  }, [enableStack, nextTriggerId, isFinale, isNearCoverZone]);

  const useSticky = enableStack && !hasInnerPin && !isFinale;
  const useCardEdge = !isFirst && enableStack;
  const forceFullScreen = enableStack && !hasInnerPin && viewportHeightPx !== undefined;
  const showNextChip = Boolean(enableStack && !isFirst && !isFinale && nextChapterLabel && nextTriggerId);

  return (
    <div
      id={id}
      ref={outerRef}
      data-chapter-card={id}
      style={{
        zIndex,
        backgroundColor: bg,
        position: useSticky ? 'sticky' : 'relative',
        top: useSticky ? `${stickyTop}px` : undefined,
        minHeight: forceFullScreen ? `${viewportHeightPx}px` : undefined,
      }}
      className={`scroll-mt-0 ${useCardEdge ? 'chapter-stack-card' : ''} ${
        isFinale ? 'overflow-visible' : ''
      }`}
    >
      {/* Fade-in Upward Hard Shadow Overlay (strictly opacity 0 while below the fold -> zero peeking) */}
      {useCardEdge && (
        <div
          ref={shadowRef}
          aria-hidden="true"
          data-testid={`chapter-shadow-${id}`}
          style={{ opacity: 0 }}
          className="chapter-stack-shadow pointer-events-none absolute -inset-x-0 -top-[3px] h-10 z-0"
        />
      )}

      <div
        ref={innerRef}
        style={{
          minHeight: forceFullScreen ? `${viewportHeightPx}px` : undefined,
        }}
        className={`relative w-full ${
          forceFullScreen ? 'flex flex-col justify-center' : ''
        } ${isFinale ? 'overflow-visible' : 'overflow-x-clip'}`}
      >
        <div className={forceFullScreen ? 'w-full flex-1 flex flex-col justify-center' : 'w-full'}>
          {children}
        </div>

        {/* Bottom-Centre Bouncing "Next: {chapter name}" Chip (desktop full-screen chapters, fades on next entry) */}
        {showNextChip && (
          <div
            ref={nextChipRef}
            data-testid={`next-chip-${id}`}
            className="relative z-20 mx-auto pb-4 pt-1 flex justify-center"
          >
            <button
              type="button"
              onClick={() => nextTriggerId && onJumpNext?.(nextTriggerId)}
              className="animate-scroll-hint inline-flex items-center gap-2 bg-white hover:bg-[#FFF8E1] border-[2.5px] border-[#111111] rounded-full shadow-[3px_3px_0_#111111] px-3.5 py-1 font-display font-bold text-xs text-[#111111]"
            >
              <span className="text-[#111111]/65">Next:</span>
              <span className="text-[#5B4BFF]">{nextChapterLabel}</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#111111]" aria-hidden="true" />
            </button>
          </div>
        )}

        {!isFinale && (
          <div
            ref={veilRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 bg-[#111111] opacity-0 rounded-[inherit]"
          />
        )}
      </div>
    </div>
  );
};
