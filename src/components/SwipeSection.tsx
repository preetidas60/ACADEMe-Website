import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Lightbulb, Table2, HelpCircle, ChevronRight } from 'lucide-react';
import { SWIPE_CARDS } from '../data/academeData';
import {
  computeChapterMinHeightPx,
  computeSwipePinDistance,
  computeSwipeState,
} from '../utils/logic';

gsap.registerPlugin(ScrollTrigger);

interface SwipeSectionProps {
  onPinnedProgress?: (progress: number) => void;
}

export const SwipeSection: React.FC<SwipeSectionProps> = ({ onPinnedProgress }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const progressCbRef = useRef(onPinnedProgress);
  progressCbRef.current = onPinnedProgress;

  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(25);
  const [xp, setXp] = useState(25);
  const [selectedQuickOpt, setSelectedQuickOpt] = useState<number | null>(null);
  const [stageMinHeightPx, setStageMinHeightPx] = useState<number | undefined>(undefined);
  const [isPinningActive, setIsPinningActive] = useState(false);

  // Recompute exact pixel viewport height on load and resize without CSS vh/svh units
  useEffect(() => {
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateHeight = () => {
      setStageMinHeightPx(
        computeChapterMinHeightPx(window.innerHeight, window.innerWidth >= 900, mqReduce.matches)
      );
    };
    updateHeight();
    window.addEventListener('resize', updateHeight, { passive: true });
    mqReduce.addEventListener('change', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      mqReduce.removeEventListener('change', updateHeight);
    };
  }, []);

  // Desktop (>= 900px) shortened pinned ScrollTrigger with scrub: true (zero double smoothing with Lenis)
  useEffect(() => {
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqDesktop = window.matchMedia('(min-width: 900px)');
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    let ctx: gsap.Context | null = null;

    const setupPin = () => {
      if (ctx) {
        ctx.revert();
        ctx = null;
      }
      if (mqReduce.matches || !mqDesktop.matches) {
        setIsPinningActive(false);
        return;
      }

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top top',
          end: () => `+=${computeSwipePinDistance(window.innerHeight, SWIPE_CARDS.length)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => setIsPinningActive(self.isActive),
          onUpdate: (self) => {
            const state = computeSwipeState(self.progress);
            setActiveIndex(state.activeIndex);
            setProgressPercent(state.progressPercent);
            setXp(state.xp);
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
      if (ctx) ctx.revert();
    };
  }, []);

  const handleManualStep = (idx: number) => {
    const card = SWIPE_CARDS[idx];
    setActiveIndex(idx);
    setProgressPercent(Math.round(((idx + 1) / SWIPE_CARDS.length) * 100));
    setXp(card.xpValue);
  };

  const activeCard = SWIPE_CARDS[activeIndex];
  const stepIcons = [Lightbulb, Table2, CheckCircle2, HelpCircle];

  return (
    <section
      ref={sectionRef}
      className="bg-[#FFF1B8] relative"
    >
      <div
        ref={triggerRef}
        style={{
          minHeight: stageMinHeightPx ? `${stageMinHeightPx}px` : undefined,
          willChange: isPinningActive ? 'transform' : 'auto',
        }}
        className="mx-auto max-w-[1240px] px-4 sm:px-6 py-5 min-[900px]:pt-20 min-[900px]:pb-8 flex items-center"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 min-[900px]:gap-8 items-center">
          {/* Left Column: Narrative + Clickable Card Stepper */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] font-display font-bold text-xs text-[#B45309]">
                Chapter 5 · Learn by swiping
              </span>
              <h2
                className="font-display font-extrabold text-[#111111] leading-[1.08] tracking-[-0.025em]"
                style={{ fontSize: 'clamp(1.75rem, 3.1vw, 2.65rem)', textWrap: 'balance' }}
              >
                5–8 minute decks you can finish on a bus ride.
              </h2>
            </div>

            <p className="text-sm text-[#111111]/80 leading-relaxed max-w-[50ch]">
              Every chapter breaks into focused swipe cards: one clear concept, a quick table, a rule to remember, and a two-second check.
            </p>

            {/* Step Selector List (updates live on scroll, and also clickable!) */}
            <div className="space-y-2" role="tablist" aria-label="Lesson deck cards">
              {SWIPE_CARDS.map((card, idx) => {
                const isActive = idx === activeIndex;
                const Icon = stepIcons[idx];
                return (
                  <button
                    key={card.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleManualStep(idx)}
                    className={`w-full text-left flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-[16px] border-[3px] border-[#111111] transition-all ${
                      isActive
                        ? 'bg-white shadow-[4px_4px_0_#111111] -translate-x-0.5 -translate-y-0.5'
                        : 'bg-white/65 hover:bg-white shadow-[2px_2px_0_#111111]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        style={{ backgroundColor: card.accentBg }}
                        className="w-9 h-9 rounded-xl border-2 border-[#111111] flex items-center justify-center shrink-0"
                      >
                        <Icon className="w-4 h-4 text-[#111111]" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-[#111111]/65">{card.kicker}</p>
                        <p className="font-display font-bold text-sm sm:text-base text-[#111111] truncate">
                          {card.title}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-mono font-bold text-xs tabular-nums shrink-0 px-2.5 py-0.5 rounded-full border-2 border-[#111111] ${
                        isActive ? 'bg-[#FFA500] text-[#111111]' : 'bg-[#EEF0F8] text-[#111111]/70'
                      }`}
                    >
                      +{card.xpValue} XP
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-medium text-[#111111]/65 hidden min-[900px]:block">
              Scroll to swipe through the deck, or tap any card above.
            </p>
          </div>

          {/* Right Column: Fixed Neo-Brutalist Phone with Swiping Lesson Deck */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[380px] bg-white border-[4px] border-[#111111] rounded-[38px] shadow-[9px_9px_0_#111111] p-4">
              {/* Top Phone Hardware Bar */}
              <div className="flex items-center justify-between px-2 pb-2.5">
                <span className="font-mono text-xs font-bold text-[#111111]/70">9:41</span>
                <div className="w-18 h-2 bg-[#111111] rounded-full" />
                <span className="font-mono text-xs font-bold text-[#111111]/70">CBSE 10</span>
              </div>

              {/* Deck Progress & XP Header */}
              <div className="bg-[#FFF8E1] border-[2.5px] border-[#111111] rounded-[20px] p-3 mb-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-xs text-[#111111]">
                    Ch 01 · Real Numbers
                  </span>
                  <span
                    data-testid="swipe-xp-counter"
                    className="font-mono font-bold text-xs tabular-nums bg-[#FFA500] border-2 border-[#111111] rounded-full px-2.5 py-0.5 text-[#111111]"
                  >
                    +{xp} XP
                  </span>
                </div>
                <div
                  className="w-full h-2.5 bg-white border-2 border-[#111111] rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Lesson deck completion progress"
                >
                  <div
                    className="h-full bg-[#5B4BFF] transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stacked Card Viewport */}
              <div className="relative min-h-[256px] min-[900px]:min-h-[296px]" data-testid="swipe-card-stage">
                {SWIPE_CARDS.map((card, idx) => {
                  const offset = idx - activeIndex;
                  const isCurrent = idx === activeIndex;
                  const translateY = offset * 12;
                  const scale = isCurrent ? 1 : Math.max(0.9, 1 - Math.abs(offset) * 0.04);
                  const opacity = offset < 0 ? 0 : isCurrent ? 1 : 0.45;
                  const translateX = offset < 0 ? -40 : 0;

                  return (
                    <div
                      key={card.id}
                      aria-hidden={!isCurrent}
                      style={{
                        backgroundColor: card.accentBg,
                        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                        opacity,
                        zIndex: SWIPE_CARDS.length - Math.abs(offset),
                        pointerEvents: isCurrent ? 'auto' : 'none',
                        transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease',
                      }}
                      className="absolute inset-0 border-[3px] border-[#111111] rounded-[22px] shadow-[5px_5px_0_#111111] p-4 sm:p-5 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <p className="font-mono text-xs font-bold text-[#111111]/75">
                          {card.kicker}
                        </p>
                        <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#111111] leading-tight">
                          {card.title}
                        </h3>

                        {/* Kind 1: Concept Card */}
                        {card.kind === 'concept' && (
                          <div className="space-y-3 pt-1">
                            <p className="text-sm leading-relaxed text-[#111111]/90">
                              {card.body}
                            </p>
                            <div className="bg-white border-[2.5px] border-[#111111] rounded-2xl p-3 font-mono text-sm font-bold text-[#5B4BFF] text-center tabular-nums">
                              {card.formula}
                            </div>
                          </div>
                        )}

                        {/* Kind 2: In One Look Table Card */}
                        {card.kind === 'table' && card.tableRows && (
                          <div className="bg-white border-[2.5px] border-[#111111] rounded-2xl overflow-hidden mt-1.5">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-[#EEF0F8] border-b-2 border-[#111111]">
                                  <th className="p-2 font-display font-bold">Compare</th>
                                  <th className="p-2 font-display font-bold text-[#5B4BFF]">HCF</th>
                                  <th className="p-2 font-display font-bold text-[#B45309]">LCM</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#111111]/15 tabular-nums">
                                {card.tableRows.map((row) => (
                                  <tr key={row.label}>
                                    <td className="p-2 font-bold text-[#111111]">{row.label}</td>
                                    <td className="p-2 text-[#111111]/85">{row.hcf}</td>
                                    <td className="p-2 text-[#111111]/85">{row.lcm}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Kind 3: Remember Callout */}
                        {card.kind === 'remember' && (
                          <div className="space-y-2.5 pt-1">
                            <div className="bg-white border-[2.5px] border-[#111111] rounded-2xl p-3 font-mono text-sm font-bold text-center text-[#111111] tabular-nums">
                              {card.formula}
                            </div>
                            <p className="text-sm text-[#111111]/90">{card.rememberNote}</p>
                            <div className="bg-[#FFF8E1] border-2 border-[#111111] rounded-xl p-2.5 text-xs font-semibold text-[#111111]">
                              {card.watchOut}
                            </div>
                          </div>
                        )}

                        {/* Kind 4: Quick Check with Here's Why */}
                        {card.kind === 'check' && card.options && (
                          <div className="space-y-2 pt-1">
                            <p className="text-sm font-semibold text-[#111111]">{card.question}</p>
                            <div className="grid grid-cols-3 gap-2">
                              {card.options.map((opt, oIdx) => {
                                const picked = selectedQuickOpt === oIdx;
                                const isRight = oIdx === card.correctIndex;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setSelectedQuickOpt(oIdx)}
                                    className={`py-2 px-2 rounded-xl border-2 border-[#111111] font-mono font-bold text-sm tabular-nums transition-colors ${
                                      picked
                                        ? isRight
                                          ? 'bg-[#9BF0C2] text-[#111111]'
                                          : 'bg-[#FFE3EC] text-[#111111]'
                                        : 'bg-white hover:bg-[#FFF8E1] text-[#111111]'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="bg-white border-2 border-[#111111] rounded-xl p-2 text-xs leading-snug text-[#111111]">
                              {selectedQuickOpt === null
                                ? 'Tap an answer to see “Here’s why”.'
                                : card.heresWhy}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer Action */}
                      <div className="flex items-center justify-between pt-2.5 border-t-2 border-[#111111]/15">
                        <span className="text-xs font-semibold text-[#111111]/70">
                          {activeCard.id === 'check' ? 'Deck complete' : 'Swipe next card'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleManualStep((activeIndex + 1) % SWIPE_CARDS.length)
                          }
                          className="inline-flex items-center gap-1 font-display font-bold text-xs bg-[#111111] text-white rounded-full px-3.5 py-1.5 hover:bg-[#5B4BFF] transition-colors"
                        >
                          <span>{activeIndex === SWIPE_CARDS.length - 1 ? 'Replay deck' : 'Next'}</span>
                          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
