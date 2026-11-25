import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Smartphone, ExternalLink } from 'lucide-react';
import { FOOTER_GREETINGS } from '../data/academeData';
import { CURTAIN_FOOTER_HEIGHT, computeFooterStage } from '../utils/logic';
import { PebbyMascot, PebbyLogoMark } from './PebbyMascot';

export type FooterModalTopic = 'play' | 'privacy' | 'terms' | 'support' | 'delete' | 'contact';

interface CurtainFooterProps {
  onOpenModal: (topic: FooterModalTopic) => void;
  onBackToTopArrived: () => void;
}

const POP_CONFETTI = [
  { tx: '-80px', ty: '-74px', rot: '-40deg', color: '#FFA500' },
  { tx: '-34px', ty: '-95px', rot: '22deg', color: '#9BF0C2' },
  { tx: '22px', ty: '-90px', rot: '-25deg', color: '#FFE3EC' },
  { tx: '76px', ty: '-68px', rot: '45deg', color: '#DFF1FF' },
];

export const CurtainFooter: React.FC<CurtainFooterProps> = ({
  onOpenModal,
  onBackToTopArrived,
}) => {
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [hasPlayedFull, setHasPlayedFull] = useState(false);
  const [timedPhase, setTimedPhase] = useState<'idle' | 'pop' | 'wave' | 'revealed'>('idle');
  const [glanceX, setGlanceX] = useState<number | null>(null);

  // Post-reveal interactive states
  const [isHopping, setIsHopping] = useState(false);
  const [showHehe, setShowHehe] = useState(false);
  const [isPointingPlay, setIsPointingPlay] = useState(false);
  const [isLaunchingRocket, setIsLaunchingRocket] = useState(false);

  // Greeting typewriter state
  const [greetIdx, setGreetIdx] = useState(0);
  const [typedGreeting, setTypedGreeting] = useState(FOOTER_GREETINGS[0].text);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) {
      setTimedPhase('revealed');
      setRevealProgress(1);
    }
    const onChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) {
        setTimedPhase('revealed');
        setRevealProgress(1);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Measure how far the page curtain has lifted over the 720px footer spacer
  useEffect(() => {
    if (reducedMotion) return;
    let rafId = 0;

    const measure = () => {
      rafId = 0;
      const el = spacerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const visiblePx = Math.max(0, Math.min(rect.height, vh - rect.top));
      const progress = rect.height > 0 ? visiblePx / rect.height : 0;
      setRevealProgress(progress);

      if (progress < 0.12 && hasPlayedFull) {
        setTimedPhase('idle');
      }
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, hasPlayedFull]);

  // Peek glance choreography (eyes look left, then right, then unlock to cursor)
  const stage = computeFooterStage({
    revealProgress,
    hasPlayedFull,
    timedPhase,
    reducedMotion,
  });

  useEffect(() => {
    if (reducedMotion || stage !== 'peek') {
      setGlanceX(null);
      return;
    }
    setGlanceX(-5);
    const t1 = window.setTimeout(() => setGlanceX(5), 340);
    const t2 = window.setTimeout(() => setGlanceX(null), 680);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [stage, reducedMotion]);

  // Trigger timed Pop -> Wave -> Content Reveal sequence once >= 58% uncovered
  useEffect(() => {
    if (reducedMotion) return;

    if (!hasPlayedFull && revealProgress >= 0.58 && timedPhase === 'idle') {
      setTimedPhase('pop');
    } else if (hasPlayedFull && revealProgress >= 0.45 && timedPhase === 'idle') {
      // Short peek-and-wave replay on re-entry
      setTimedPhase('wave');
    }
  }, [revealProgress, hasPlayedFull, timedPhase, reducedMotion]);

  // Advance Pop -> Wave (+540ms) -> Revealed (+900ms) without cancelling timers when timedPhase updates
  useEffect(() => {
    if (reducedMotion) return;

    if (timedPhase === 'pop') {
      const tWave = window.setTimeout(() => setTimedPhase('wave'), 540);
      return () => window.clearTimeout(tWave);
    }

    if (timedPhase === 'wave') {
      const delay = hasPlayedFull ? 650 : 900;
      const tReveal = window.setTimeout(() => {
        setTimedPhase('revealed');
        setHasPlayedFull(true);
      }, delay);
      return () => window.clearTimeout(tReveal);
    }
  }, [timedPhase, hasPlayedFull, reducedMotion]);

  // Speech bubble typewriter once waving or revealed
  const showSpeech = stage === 'wave' || stage === 'revealed';
  useEffect(() => {
    if (!showSpeech) return;
    const line = FOOTER_GREETINGS[greetIdx].text;
    if (reducedMotion) {
      setTypedGreeting(line);
      return;
    }
    let idx = 0;
    setTypedGreeting('');
    const typeTimer = window.setInterval(() => {
      idx += 3;
      setTypedGreeting(line.slice(0, idx));
      if (idx >= line.length) {
        setTypedGreeting(line);
        window.clearInterval(typeTimer);
      }
    }, 24);

    const cycleTimer = window.setTimeout(() => {
      setGreetIdx((prev) => (prev + 1) % FOOTER_GREETINGS.length);
    }, 5200);

    return () => {
      window.clearInterval(typeTimer);
      window.clearTimeout(cycleTimer);
    };
  }, [showSpeech, greetIdx, reducedMotion]);

  // Clicking Pebby: hop + "hehe" bubble
  const handlePebbyClick = () => {
    setIsHopping(true);
    setShowHehe(true);
    window.setTimeout(() => setIsHopping(false), 540);
    window.setTimeout(() => setShowHehe(false), 1600);
  };

  // Back to top rocket launch!
  const handleBackToTop = () => {
    if (reducedMotion) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      onBackToTopArrived();
      return;
    }
    setIsLaunchingRocket(true);
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 260);
    window.setTimeout(() => {
      setIsLaunchingRocket(false);
      onBackToTopArrived();
    }, 1150);
  };

  const contentVisible = stage === 'revealed';
  const pebbyOut = stage === 'pop' || stage === 'wave' || stage === 'revealed';
  const pebbyPeeking = stage === 'peek';

  const footerContent = (
    <div className="relative w-full min-[900px]:min-h-[720px] bg-gradient-to-b from-[#13102B] via-[#1C1647] to-[#241B5E] text-[#FFF8E1] overflow-hidden flex flex-col justify-between pt-5 pb-5 min-[900px]:pt-14 min-[900px]:pb-8 px-4 sm:px-6">
      {/* Warm Amber Glow Along Bottom Edge + Scatter of Tiny Stars & Plus Signs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-60"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 50% 100%, rgba(255,165,0,0.34) 0%, rgba(255,165,0,0.08) 52%, transparent 80%)',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { left: '8%', top: '16%', kind: 'star' },
          { left: '22%', top: '28%', kind: 'plus' },
          { left: '78%', top: '14%', kind: 'star' },
          { left: '89%', top: '34%', kind: 'plus' },
          { left: '14%', top: '62%', kind: 'plus' },
          { left: '84%', top: '66%', kind: 'star' },
        ].map((dec, i) => (
          <span
            key={i}
            style={{ left: dec.left, top: dec.top }}
            className="absolute text-[#FFA500]/70 font-display font-extrabold text-lg select-none"
          >
            {dec.kind === 'star' ? '✦' : '+'}
          </span>
        ))}
      </div>

      {/* Giant Outlined ACADEMe Wordmark Rising from Behind */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 bottom-14 flex justify-center overflow-hidden"
        style={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 48px, 0)',
          transition: reducedMotion
            ? 'none'
            : 'transform 640ms cubic-bezier(0.16, 1, 0.3, 1), opacity 520ms ease',
        }}
      >
        <span
          className="font-display font-extrabold text-outlined-footer leading-none tracking-[-0.04em]"
          style={{ fontSize: 'clamp(5rem, 15vw, 13.5rem)' }}
        >
          ACADEMe
        </span>
      </div>

      {/* Top Row: Pebby Burrow Stage + Speech Bubble */}
      <div className="relative z-20 mx-auto max-w-[1240px] w-full flex flex-col items-center">
        {/* Speech Bubble (Greeting or "hehe" on click) */}
        <div
          className="min-h-[54px] min-[900px]:min-h-[60px] flex items-end justify-center mb-2"
          style={{
            opacity: showSpeech || showHehe ? 1 : 0,
            transform: showSpeech || showHehe ? 'translateY(0)' : 'translateY(10px)',
            transition: reducedMotion ? 'none' : 'opacity 260ms ease, transform 260ms ease',
          }}
        >
          <div className="relative bg-[#FFF8E1] text-[#111111] border-[3px] border-[#111111] rounded-[20px] shadow-[4px_4px_0_#111111] px-4 py-2.5 max-w-[460px] text-center">
            {showHehe ? (
              <p data-testid="footer-pebby-hehe" className="font-display font-extrabold text-sm text-[#5B4BFF]">
                hehe! Ready to study?
              </p>
            ) : (
              <p data-testid="footer-pebby-greeting" className="text-xs sm:text-sm font-bold leading-snug">
                {typedGreeting}
              </p>
            )}
            <span
              aria-hidden="true"
              className="w-3.5 h-3.5 bg-[#FFF8E1] border-r-[3px] border-b-[3px] border-[#111111] rotate-45 absolute -bottom-[9px] left-1/2 -translate-x-1/2"
            />
          </div>
        </div>

        {/* Pebby Pop-Out Burrow / Hatch */}
        <div className="relative w-[176px] h-[126px] min-[900px]:w-[220px] min-[900px]:h-[184px] flex items-end justify-center">
          {/* Dust Puff & Confetti on Pop */}
          {stage === 'pop' && !reducedMotion && (
            <div aria-hidden="true" className="pointer-events-none absolute bottom-12 left-1/2 z-30">
              {POP_CONFETTI.map((c, i) => (
                <span
                  key={i}
                  style={
                    {
                      '--tx': c.tx,
                      '--ty': c.ty,
                      '--rot': c.rot,
                      backgroundColor: c.color,
                    } as React.CSSProperties
                  }
                  className="animate-confetti absolute w-3.5 h-3.5 rounded-sm border-2 border-[#111111]"
                />
              ))}
              <span
                style={{ '--dx': '-48px', '--dy': '-18px' } as React.CSSProperties}
                className="animate-dust-puff absolute w-7 h-7 rounded-full bg-[#FFF8E1]/70 border-2 border-[#111111]"
              />
              <span
                style={{ '--dx': '34px', '--dy': '-22px' } as React.CSSProperties}
                className="animate-dust-puff absolute w-6 h-6 rounded-full bg-[#FFF8E1]/70 border-2 border-[#111111]"
              />
            </div>
          )}

          {/* Pebby Character Rising Out of Hatch */}
          <button
            type="button"
            onClick={handlePebbyClick}
            aria-label="Pebby in footer. Click to make Pebby hop and giggle."
            data-testid="footer-pebby-button"
            className={`relative z-20 focus-visible:rounded-full ${
              isLaunchingRocket
                ? 'animate-rocket-launch'
                : isHopping
                ? 'animate-pebby-hop'
                : stage === 'pop'
                ? 'animate-pebby-pop'
                : ''
            }`}
            style={{
              transform: isLaunchingRocket || isHopping || stage === 'pop'
                ? undefined
                : pebbyOut
                ? 'translate3d(0, 0px, 0)'
                : pebbyPeeking
                ? 'translate3d(0, 88px, 0)'
                : 'translate3d(0, 152px, 0)',
              transition: reducedMotion
                ? 'none'
                : 'transform 460ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <PebbyMascot
              pose={
                isLaunchingRocket
                  ? 'cheering'
                  : isPointingPlay
                  ? 'pointing'
                  : pebbyOut
                  ? 'waving'
                  : 'waking'
              }
              prop={isLaunchingRocket ? 'rocket' : 'none'}
              glanceX={glanceX}
              trackCursor={pebbyOut && !isLaunchingRocket}
              showShadow={false}
              className="w-[120px] h-[120px] min-[900px]:w-[178px] min-[900px]:h-[178px]"
              ariaLabel="Pebby popping out of the footer burrow"
            />
          </button>

          {/* Half-Circle Burrow / Hatch Foreground Rim */}
          <div
            aria-hidden="true"
            className={`absolute bottom-0 inset-x-4 h-10 min-[900px]:h-11 rounded-t-full bg-[#0C091F] border-[3px] border-b-0 border-[#111111] shadow-[0_-3px_0_#FFA500] z-30 flex items-center justify-center ${
              stage === 'anticipation' && !reducedMotion ? 'animate-burrow-shake' : ''
            }`}
          >
            <span className="w-16 h-1.5 rounded-full bg-[#FFA500]/55" />
          </div>
        </div>
      </div>

      {/* Main Staggered Footer Content (Reveals ONLY after Pebby waves, 80ms stagger) */}
      <div className="relative z-20 mx-auto max-w-[1240px] w-full pt-4 min-[900px]:pt-8 space-y-4 min-[900px]:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-start">
          {/* Brand + Google Play CTA + QR Placeholder */}
          <div
            className="md:col-span-5 space-y-4"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 26px, 0)',
              transition: reducedMotion ? 'none' : 'opacity 420ms ease, transform 460ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="inline-flex items-center gap-2.5">
              <PebbyLogoMark size="sm" />
              <span className="font-display font-extrabold text-2xl text-white">
                ACADEM<span className="text-[#FFA500]">e</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onOpenModal('play')}
                onMouseEnter={() => setIsPointingPlay(true)}
                onMouseLeave={() => setIsPointingPlay(false)}
                onFocus={() => setIsPointingPlay(true)}
                onBlur={() => setIsPointingPlay(false)}
                className="neo-btn inline-flex items-center gap-2.5 px-5 py-3 bg-[#FFA500] hover:bg-[#ff9500] text-[#111111] font-display font-extrabold text-sm whitespace-nowrap"
              >
                <Smartphone className="w-4 h-4" aria-hidden="true" />
                <span>Get it on Google Play</span>
              </button>

              {/* Compact QR Placeholder */}
              <div className="bg-white text-[#111111] border-[2.5px] border-[#111111] rounded-2xl shadow-[4px_4px_0_#111111] p-2 flex items-center gap-2.5">
                <svg viewBox="0 0 60 60" className="w-11 h-11 shrink-0" role="img" aria-label="QR code placeholder">
                  <rect width="60" height="60" rx="4" fill="#FFF8E1" />
                  <rect x="5" y="5" width="16" height="16" fill="none" stroke="#111111" strokeWidth="3" />
                  <rect x="10" y="10" width="6" height="6" fill="#111111" />
                  <rect x="39" y="5" width="16" height="16" fill="none" stroke="#111111" strokeWidth="3" />
                  <rect x="44" y="10" width="6" height="6" fill="#111111" />
                  <rect x="5" y="39" width="16" height="16" fill="none" stroke="#111111" strokeWidth="3" />
                  <rect x="10" y="44" width="6" height="6" fill="#111111" />
                  <rect x="26" y="26" width="8" height="8" fill="#5B4BFF" />
                  <rect x="38" y="38" width="14" height="6" fill="#111111" />
                  <rect x="26" y="44" width="8" height="10" fill="#111111" />
                </svg>
                <span className="font-display font-bold text-[11px] leading-tight pr-1.5">
                  QR code
                  <br />
                  placeholder
                </span>
              </div>
            </div>
          </div>

          {/* 3 Link Columns with 80ms Stagger */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {/* Column 1: Product */}
            <div
              style={{
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
                transition: reducedMotion ? 'none' : 'opacity 420ms ease 80ms, transform 460ms cubic-bezier(0.16, 1, 0.3, 1) 80ms',
              }}
              className="space-y-3"
            >
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#FFA500]">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-[#FFF8E1]/90 font-medium">
                <li><a href="#syllabus" className="hover:text-[#FFA500] transition-colors">Syllabus</a></li>
                <li><a href="#swipe" className="hover:text-[#FFA500] transition-colors">Lessons</a></li>
                <li><a href="#pebby" className="hover:text-[#FFA500] transition-colors">Pebby</a></li>
                <li><a href="#pricing" className="hover:text-[#FFA500] transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-[#FFA500] transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Column 2: Trust */}
            <div
              style={{
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
                transition: reducedMotion ? 'none' : 'opacity 420ms ease 160ms, transform 460ms cubic-bezier(0.16, 1, 0.3, 1) 160ms',
              }}
              className="space-y-3"
            >
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#FFA500]">
                Trust
              </h3>
              <ul className="space-y-2 text-sm text-[#FFF8E1]/90 font-medium">
                <li><button type="button" onClick={() => onOpenModal('privacy')} className="hover:text-[#FFA500] transition-colors">Privacy</button></li>
                <li><button type="button" onClick={() => onOpenModal('terms')} className="hover:text-[#FFA500] transition-colors">Terms</button></li>
                <li><button type="button" onClick={() => onOpenModal('support')} className="hover:text-[#FFA500] transition-colors">Support</button></li>
                <li><button type="button" onClick={() => onOpenModal('delete')} className="hover:text-[#FFA500] transition-colors">Delete account</button></li>
              </ul>
            </div>

            {/* Column 3: Company + Back to Top */}
            <div
              style={{
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
                transition: reducedMotion ? 'none' : 'opacity 420ms ease 240ms, transform 460ms cubic-bezier(0.16, 1, 0.3, 1) 240ms',
              }}
              className="space-y-3 col-span-2 sm:col-span-1"
            >
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#FFA500]">
                Company
              </h3>
              <ul className="space-y-2 text-sm text-[#FFF8E1]/90 font-medium">
                <li>
                  <button type="button" onClick={() => onOpenModal('contact')} className="hover:text-[#FFA500] transition-colors">
                    Contact placeholder
                  </button>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=Q-lFkc7tIN0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#FFA500] transition-colors"
                  >
                    <span>Demo video</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBackToTop}
                  data-testid="back-to-top-button"
                  className="neo-btn-sm inline-flex items-center gap-1.5 bg-[#FFF8E1] hover:bg-[#FFA500] text-[#111111] font-display font-bold text-xs px-4 py-2 whitespace-nowrap"
                >
                  <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Back to top</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline + Copyright Row */}
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 16px, 0)',
            transition: reducedMotion ? 'none' : 'opacity 420ms ease 320ms, transform 460ms ease 320ms',
          }}
          className="pt-6 min-[900px]:pt-7 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#FFF8E1]/80"
        >
          <p className="font-semibold text-[#FFF8E1]">
            Made for Indian school students. Free at the core. No ads, ever.
          </p>
          <p>© {new Date().getFullYear()} ACADEMe. All rights reserved.</p>
        </div>
      </div>
    </div>
  );

  return (
    <footer
      data-testid="curtain-footer"
      data-footer-stage={stage}
      data-footer-height={CURTAIN_FOOTER_HEIGHT}
      className="relative"
    >
      {/* Desktop Curtain-Reveal Architecture: fixed footer behind the page + matching 720px scroll spacer */}
      <div
        ref={spacerRef}
        className={
          reducedMotion
            ? 'relative z-20'
            : 'relative min-[900px]:min-h-[720px] min-[900px]:pointer-events-none'
        }
      >
        {/* Mobile (< 900px) & Reduced-Motion Normal Flow Footer */}
        <div className={reducedMotion ? 'block' : 'min-[900px]:hidden'}>
          {footerContent}
        </div>
      </div>

      {/* Desktop (>= 900px) Fixed Curtain Footer Sitting Behind the Page Curtain */}
      {!reducedMotion && (
        <div
          className="hidden min-[900px]:block fixed bottom-0 inset-x-0 z-10"
          style={{
            pointerEvents: revealProgress > 0.15 ? 'auto' : 'none',
            visibility: revealProgress > 0.01 ? 'visible' : 'hidden',
          }}
        >
          {footerContent}
        </div>
      )}
    </footer>
  );
};
