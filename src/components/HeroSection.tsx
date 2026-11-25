import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, Smartphone, CheckCircle2, Sparkles } from 'lucide-react';
import { HERO_SPEECH_LINES } from '../data/academeData';
import { PebbyMascot } from './PebbyMascot';

interface HeroSectionProps {
  onDownloadClick: () => void;
  onGetStartedClick: () => void;
  onWatchDemoClick: () => void;
  waveBackKey?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onDownloadClick,
  onGetStartedClick,
  onWatchDemoClick,
  waveBackKey = 0,
}) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [typedText, setTypedText] = useState(HERO_SPEECH_LINES[0].text);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isWavingBack, setIsWavingBack] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 36) setHasScrolled(true);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (waveBackKey <= 0) return;
    setIsWavingBack(true);
    const t = window.setTimeout(() => setIsWavingBack(false), 2000);
    return () => window.clearTimeout(t);
  }, [waveBackKey]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Typewriter speech bubble cycling through English, Hindi, Telugu, Tamil, Bengali
  useEffect(() => {
    const currentLine = HERO_SPEECH_LINES[lineIndex].text;
    if (reducedMotion) {
      setTypedText(currentLine);
      return;
    }

    let charIdx = 0;
    setTypedText('');
    const typeInterval = window.setInterval(() => {
      charIdx += 1;
      setTypedText(currentLine.slice(0, charIdx));
      if (charIdx >= currentLine.length) {
        window.clearInterval(typeInterval);
      }
    }, 34);

    const nextTimer = window.setTimeout(() => {
      setLineIndex((prev) => (prev + 1) % HERO_SPEECH_LINES.length);
    }, 4600);

    return () => {
      window.clearInterval(typeInterval);
      window.clearTimeout(nextTimer);
    };
  }, [lineIndex, reducedMotion]);

  const currentSpeech = HERO_SPEECH_LINES[lineIndex];

  return (
    <section
      className="relative flex-1 bg-[#FFF8E1] pt-18 pb-4 min-[900px]:pt-24 min-[900px]:pb-5 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle geometric background shapes with parallax data hooks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Brand star top-left */}
        <svg
          data-parallax="0.18"
          className="absolute top-28 left-[4%] w-10 h-10 text-[#FFA500] opacity-85 hidden lg:block"
          viewBox="0 0 40 40"
          fill="currentColor"
        >
          <path
            d="M20 2 L24.5 14.5 L38 19 L24.5 23.5 L20 38 L15.5 23.5 L2 19 L15.5 14.5 Z"
            stroke="#111111"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* Plus sign */}
        <svg
          data-parallax="-0.15"
          className="absolute bottom-36 left-[7%] w-8 h-8 text-[#5B4BFF] opacity-70 hidden lg:block"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path d="M16 4 V28 M4 16 H28" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>

        {/* Atom motif right background */}
        <svg
          data-parallax="0.22"
          className="absolute top-24 right-[5%] w-14 h-14 text-[#5B4BFF] opacity-25 hidden xl:block"
          viewBox="0 0 64 64"
          fill="none"
        >
          <ellipse cx="32" cy="32" rx="26" ry="10" stroke="currentColor" strokeWidth="2.5" transform="rotate(30 32 32)" />
          <ellipse cx="32" cy="32" rx="26" ry="10" stroke="currentColor" strokeWidth="2.5" transform="rotate(-30 32 32)" />
          <circle cx="32" cy="32" r="4" fill="#FFA500" stroke="#111111" strokeWidth="2" />
        </svg>

        {/* Small pencil illustration bottom-right */}
        <svg
          data-parallax="-0.18"
          className="absolute bottom-32 right-[6%] w-11 h-11 opacity-80 hidden xl:block"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path d="M10 38 L14 26 L34 6 L42 14 L22 34 Z" fill="#FFF1B8" stroke="#111111" strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M31 9 L39 17" stroke="#111111" strokeWidth="2.8" />
          <path d="M10 38 L15 36 L12 33 Z" fill="#111111" />
        </svg>
      </div>

      {/* Main 1240px Hero Grid — vertically centered in full viewport on desktop */}
      <div className="relative z-10 my-auto mx-auto max-w-[1240px] w-full px-4 sm:px-6 pb-2 min-[900px]:pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline, Subhead & CTAs */}
          <div className="lg:col-span-6 space-y-4 min-[900px]:space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] font-display font-bold text-xs text-[#5B4BFF]">
                Chapter 1 · Welcome
              </span>
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#111111]/75">
                Class 6–12 · CBSE, ICSE &amp; ISC · Android on Google Play
              </p>
            </div>

            <h1
              className="font-display font-extrabold text-[#111111] leading-[1.18] sm:leading-[1.12] tracking-[-0.03em]"
              style={{
                fontSize: 'clamp(2.45rem, 4.4vw, 4.1rem)',
                textWrap: 'balance',
              }}
            >
              Your syllabus.{' '}
              <span className="inline-block my-1.5 py-0.5 bg-[#EAE5FF] px-3 rounded-2xl border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] -rotate-1">
                Your language.
              </span>{' '}
              Your tutor.
            </h1>

            <p className="text-lg sm:text-[1.18rem] leading-relaxed text-[#111111]/85 max-w-[54ch]">
              Short swipe lessons for Class 6–12 CBSE, ICSE and ISC, with Pebby to explain, solve, quiz and mark.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onDownloadClick}
                  className="neo-btn inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#5B4BFF] hover:bg-[#4435E6] text-white font-display font-bold text-base whitespace-nowrap shrink-0"
                >
                  <Smartphone className="w-5 h-5" aria-hidden="true" />
                  <span>Get it on Google Play</span>
                </button>

                <button
                  type="button"
                  data-testid="hero-get-started-btn"
                  onClick={onGetStartedClick}
                  className="neo-btn inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white hover:bg-[#FFF1B8] text-[#111111] font-display font-bold text-base whitespace-nowrap shrink-0"
                >
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4 text-[#5B4BFF]" aria-hidden="true" />
                </button>
              </div>

              <div>
                <button
                  type="button"
                  data-testid="hero-watch-demo-link"
                  onClick={onWatchDemoClick}
                  className="inline-flex items-center gap-2 text-sm font-display font-bold text-[#5B4BFF] hover:text-[#111111] underline underline-offset-4 decoration-2 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FFA500] border-2 border-[#111111]">
                    <Play className="w-2.5 h-2.5 fill-[#111111] text-[#111111] ml-0.5" aria-hidden="true" />
                  </span>
                  <span>Watch the 2-minute demo</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-[#111111]/70">
              Free at the core · No ads, ever · Safe for minors · iOS coming later
            </p>
          </div>

          {/* Right Column: Large Pebby in front of Tilted Phone Mockup + Orbiting Chips */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center pt-6 lg:pt-2">
            {/* Live multilingual speech bubble above Pebby */}
            <div
              className="relative z-30 mb-3 sm:mb-4 w-full max-w-[420px] bg-white border-[3px] border-[#111111] rounded-[22px] shadow-[5px_5px_0_#111111] px-4 py-3.5"
              aria-live="polite"
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="font-display font-bold text-xs text-[#5B4BFF]">
                  Pebby · {currentSpeech.lang}
                </span>
                <div className="flex items-center gap-1.5" role="group" aria-label="Switch Pebby hero greeting language">
                  {HERO_SPEECH_LINES.map((l, idx) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLineIndex(idx)}
                      aria-label={`Preview Pebby speaking ${l.lang}`}
                      aria-pressed={idx === lineIndex}
                      className={`h-2.5 rounded-full border border-[#111111] transition-all ${
                        idx === lineIndex ? 'w-5 bg-[#FFA500]' : 'w-2.5 bg-[#EEF0F8]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm sm:text-[0.94rem] font-medium text-[#111111] min-h-[2.6rem] leading-snug">
                {isWavingBack ? 'Welcome back! Ready to jump into a chapter?' : typedText}
                {!reducedMotion && !isWavingBack && (
                  <span className="inline-block w-[2px] h-4 bg-[#5B4BFF] ml-0.5 align-middle animate-pulse" />
                )}
              </p>
              {/* Speech bubble pointer */}
              <div
                aria-hidden="true"
                className="w-4 h-4 bg-white border-r-[3px] border-b-[3px] border-[#111111] rotate-45 absolute -bottom-[10px] left-14"
              />
            </div>

            {/* Composition Stage: Tilted Phone + Pebby Standing in Front */}
            <div className="relative w-full max-w-[530px] h-[320px] sm:h-[385px] flex items-center justify-center">
              {/* Tilted Android Phone Mockup (behind right side) */}
              <div
                data-parallax="0.08"
                className="relative translate-x-12 sm:translate-x-24 rotate-[5deg] w-[228px] sm:w-[258px] bg-white border-[3.5px] border-[#111111] rounded-[34px] shadow-[8px_8px_0_#111111] p-3.5 select-none"
              >
                {/* Phone Speaker Notch */}
                <div className="w-16 h-1.5 bg-[#111111] rounded-full mx-auto mb-3" />

                {/* App Lesson Screen Preview */}
                <div className="bg-[#EEF0F8] border-2 border-[#111111] rounded-[22px] p-3.5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#111111]/75">
                    <span>CBSE · Class 10</span>
                    <span className="font-mono text-[#5B4BFF]">2 / 4</span>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="w-full h-2.5 bg-white border-2 border-[#111111] rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-[#FFA500]" />
                  </div>

                  {/* Lesson Card inside phone */}
                  <div className="bg-[#FFF8E1] border-2 border-[#111111] rounded-[16px] p-3 shadow-[3px_3px_0_#111111] space-y-2">
                    <p className="text-[11px] font-bold text-[#5B4BFF]">Real Numbers</p>
                    <p className="font-display font-bold text-sm leading-tight text-[#111111]">
                      HCF &amp; LCM by prime factors
                    </p>
                    <div className="bg-white border-2 border-[#111111] rounded-xl p-2 font-mono text-[11px] text-[#111111] space-y-0.5 tabular-nums">
                      <div>24 = 2³ × 3¹</div>
                      <div>36 = 2² × 3²</div>
                      <div className="font-bold text-[#5B4BFF]">HCF = 12 · LCM = 72</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-semibold text-[#111111]/75">5 min deck</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#111111] bg-[#DDF7E8] border-2 border-[#111111] rounded-full px-2.5 py-0.5">
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      Swipe
                    </span>
                  </div>
                </div>
              </div>

              {/* Large Interactive Pebby Mascot standing in front on the left */}
              <div className="absolute -left-2 sm:left-0 bottom-2 z-20">
                <PebbyMascot
                  pose={isWavingBack ? 'cheering' : 'waving'}
                  className="w-[205px] h-[205px] sm:w-[244px] sm:h-[244px]"
                  trackCursor={true}
                  ariaLabel="Pebby waving in front of the ACADEMe app preview"
                />
              </div>

              {/* 4 Floating Orbiting Parallax Chips (explicitly requested in hero) */}
              <div
                data-parallax="-0.14"
                className="absolute top-3 left-0 sm:left-2 z-30 bg-[#EAE5FF] border-[2.5px] border-[#111111] shadow-[4px_4px_0_#111111] rounded-full px-3.5 py-1.5 font-display font-bold text-xs sm:text-sm text-[#111111] whitespace-nowrap -rotate-3"
              >
                Class 10 – CBSE
              </div>

              <div
                data-parallax="0.16"
                className="absolute top-2 right-0 sm:right-2 z-30 bg-[#FFE3EC] border-[2.5px] border-[#111111] shadow-[4px_4px_0_#111111] rounded-full px-3.5 py-1.5 font-display font-bold text-xs sm:text-sm text-[#111111] whitespace-nowrap rotate-3"
              >
                Hindi · हिन्दी
              </div>

              <div
                data-parallax="-0.12"
                className="absolute bottom-14 right-0 sm:right-1 z-30 bg-[#FFA500] border-[2.5px] border-[#111111] shadow-[4px_4px_0_#111111] rounded-full px-3.5 py-1.5 font-mono font-bold text-xs sm:text-sm text-[#111111] whitespace-nowrap rotate-2 tabular-nums"
              >
                +105 XP
              </div>

              <div
                data-parallax="0.12"
                className="absolute bottom-0 left-[38%] sm:left-[44%] z-30 bg-[#DDF7E8] border-[2.5px] border-[#111111] shadow-[4px_4px_0_#111111] rounded-full px-3.5 py-1.5 font-display font-bold text-xs sm:text-sm text-[#111111] whitespace-nowrap -rotate-2 inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#111111]" aria-hidden="true" />
                <span>Check my answer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouncing "Scroll for next chapter" hint with Pebby's hand — fades out after first scroll */}
      <div
        data-testid="hero-scroll-hint"
        aria-hidden={hasScrolled}
        className="relative z-20 mx-auto pt-2 flex justify-center pointer-events-none"
        style={{
          opacity: hasScrolled ? 0 : 1,
          transform: hasScrolled ? 'translate3d(0, 12px, 0)' : 'translate3d(0, 0, 0)',
          transition: reducedMotion ? 'none' : 'opacity 360ms ease, transform 360ms ease',
        }}
      >
        <div className="animate-scroll-hint inline-flex items-center gap-2.5 bg-white border-[2.5px] border-[#111111] rounded-full shadow-[3px_3px_0_#111111] px-4 py-1.5">
          {/* Tiny Pebby hand pointing down */}
          <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" aria-hidden="true">
            <ellipse cx="14" cy="11" rx="8" ry="7" fill="#8C7DFF" stroke="#111111" strokeWidth="2.4" />
            <path d="M14 16 V24 M10 21 L14 25 L18 21" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display font-bold text-xs text-[#111111]">
            Scroll for next chapter
          </span>
        </div>
      </div>
    </section>
  );
};
