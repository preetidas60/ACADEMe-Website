import React, { useEffect, useRef, useState } from 'react';
import { Play, CheckCircle2, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { DEMO_STEPS, type BoardId, type ClassLevel, type LanguageCode } from '../data/academeData';
import { resolveDemoStepperIndex } from '../utils/logic';

interface DemoChapterSectionProps {
  onOpenAppClick: () => void;
  autoPlaySignal: number;
  focusStepSignal: number;
}

const YOUTUBE_EMBED_ID = 'Q-lFkc7tIN0';

const MINI_PEBBY_REPLIES: Record<LanguageCode, string> = {
  en: 'Hint first: find two numbers that add to −5 and multiply to +6. Try −2 and −3!',
  hi: 'पहले छोटा संकेत: ऐसी दो संख्याएँ सोचो जिनका जोड़ −5 और गुणनफल +6 हो (−2 और −3)!',
  te: 'ముందు చిన్న హింట్: కూడితే −5, గుణిస్తే +6 వచ్చే సంఖ్యలు −2 మరియు −3!',
  ta: 'முதலில் குறிப்பு: கூட்டினால் −5, பெருக்கினால் +6 வரும் எண்கள் −2, −3!',
  bn: 'আগে ছোট হিন্ট: যোগফল −5 এবং গুণফল +6 এমন দুটি সংখ্যা হলো −2 আর −3!',
};

const MINI_LANGS: Array<{ code: LanguageCode; short: string }> = [
  { code: 'en', short: 'EN' },
  { code: 'hi', short: 'हिं' },
  { code: 'te', short: 'తె' },
  { code: 'ta', short: 'த' },
  { code: 'bn', short: 'বা' },
];

export const DemoChapterSection: React.FC<DemoChapterSectionProps> = ({
  onOpenAppClick,
  autoPlaySignal,
  focusStepSignal,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startMuted, setStartMuted] = useState(false);
  const [litStep, setLitStep] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [step1Pulse, setStep1Pulse] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pendingHeroPlayRef = useRef(false);

  // Mini live preview state for each interactive step
  const [miniBoard, setMiniBoard] = useState<BoardId>('CBSE');
  const [miniClass, setMiniClass] = useState<ClassLevel>(10);
  const [miniLang, setMiniLang] = useState<LanguageCode>('en');
  const [miniQuizChoice, setMiniQuizChoice] = useState<number | null>(null);
  const [typedMiniReply, setTypedMiniReply] = useState(MINI_PEBBY_REPLIES.en);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) setLitStep(3);
    const onChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) setLitStep(3);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Triggered by Hero "Get started": highlight step 1 without starting the video
  useEffect(() => {
    if (focusStepSignal <= 0) return;
    setActiveStepIdx(0);
    setLitStep((prev) => Math.max(prev, 1));
    setStep1Pulse(true);
    const t = window.setTimeout(() => setStep1Pulse(false), 1400);
    return () => window.clearTimeout(t);
  }, [focusStepSignal]);

  // Triggered by Hero "Watch the 2-minute demo": start video muted once in view
  useEffect(() => {
    if (autoPlaySignal <= 0) return;
    pendingHeroPlayRef.current = true;
    const el = sectionRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8 && rect.bottom > 100) {
        pendingHeroPlayRef.current = false;
        setStartMuted(true);
        setIsPlaying(true);
      }
    }
  }, [autoPlaySignal]);

  // Light up 3 numbered steps in sequence on entry (140ms, 440ms, 760ms)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        if (pendingHeroPlayRef.current) {
          pendingHeroPlayRef.current = false;
          setStartMuted(true);
          setIsPlaying(true);
        }

        if (reducedMotion) {
          setLitStep(3);
          return;
        }

        timers.push(window.setTimeout(() => setLitStep((prev) => Math.max(prev, 1)), 140));
        timers.push(window.setTimeout(() => setLitStep((prev) => Math.max(prev, 2)), 440));
        timers.push(window.setTimeout(() => setLitStep((prev) => Math.max(prev, 3)), 760));
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reducedMotion]);

  // Typewriter effect for Step 3 mini Pebby chat preview
  useEffect(() => {
    if (activeStepIdx !== 2) return;
    const full = MINI_PEBBY_REPLIES[miniLang];
    if (reducedMotion) {
      setTypedMiniReply(full);
      return;
    }
    let idx = 0;
    setTypedMiniReply('');
    const timer = window.setInterval(() => {
      idx += 3;
      setTypedMiniReply(full.slice(0, idx));
      if (idx >= full.length) {
        setTypedMiniReply(full);
        window.clearInterval(timer);
      }
    }, 18);
    return () => window.clearInterval(timer);
  }, [activeStepIdx, miniLang, reducedMotion]);

  const handleManualPlay = () => {
    setStartMuted(false);
    setIsPlaying(true);
  };

  const handleStepperKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveStepIdx((prev) => resolveDemoStepperIndex(prev, 'next', DEMO_STEPS.length));
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveStepIdx((prev) => resolveDemoStepperIndex(prev, 'prev', DEMO_STEPS.length));
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="demo-chapter-heading"
      className="bg-[#EAE5FF] py-5 min-[900px]:pt-[84px] min-[900px]:pb-5 flex items-center"
    >
      <div className="mx-auto max-w-[1220px] w-full px-4 sm:px-6 space-y-3.5 min-[900px]:space-y-5">
        {/* Chapter Label Chip + Header */}
        <div className="max-w-3xl space-y-2" data-reveal>
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] font-display font-bold text-xs text-[#5B4BFF]">
            Chapter 2 · Watch the demo
          </span>
          <h2
            id="demo-chapter-heading"
            className="font-display font-extrabold text-[#111111] leading-[1.08] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.85rem)', textWrap: 'balance' }}
          >
            See ACADEMe in two minutes.
          </h2>
          <p className="text-sm sm:text-base text-[#111111]/80 leading-relaxed max-w-[54ch]">
            Watch how a student goes from picking a class to checking a board-style answer.
          </p>
        </div>

        {/* Desktop Split: Left (~55%) TV Facade | Right (~45%) Interactive 3-Step Stepper + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
          {/* Left: Neo-Brutalist Retro TV Frame with Click-to-Play YouTube Facade */}
          <div className="lg:col-span-6 relative">
            {/* Neo-Brutalist Retro TV Frame */}
            <div className="relative z-10 bg-[#111111] border-[3.5px] border-[#111111] rounded-[26px] shadow-[7px_7px_0_#111111] p-3 space-y-2.5">
              <div className="flex items-center justify-between px-2 text-[11px] font-mono font-bold text-[#FFF8E1]/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFA500]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9BF0C2]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5B4BFF]" />
                </div>
                <span>ACADEMe · 2 min walkthrough</span>
              </div>

              <div
                data-testid="demo-video-stage"
                className="relative w-full aspect-video rounded-[18px] overflow-hidden border-[3px] border-[#111111] bg-[#181340]"
              >
                {isPlaying ? (
                  <iframe
                    data-testid="demo-youtube-iframe"
                    className="w-full h-full block"
                    src={`https://www.youtube.com/embed/${YOUTUBE_EMBED_ID}?autoplay=1&rel=0${
                      startMuted ? '&mute=1' : ''
                    }`}
                    title="ACADEMe two-minute product walkthrough video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    data-testid="demo-play-button"
                    onClick={handleManualPlay}
                    aria-label="Play ACADEMe two-minute demo video"
                    className="group relative w-full h-full text-left flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-[#231B66] via-[#342899] to-[#5B4BFF] focus-visible:ring-4 focus-visible:ring-[#FFA500]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-[#FFF8E1] text-[#111111] border-2 border-[#111111] rounded-full px-3 py-0.5 font-display font-bold text-xs shadow-[2px_2px_0_#111111]">
                        <Sparkles className="w-3.5 h-3.5 text-[#5B4BFF]" aria-hidden="true" />
                        Class 10 CBSE Walkthrough
                      </span>
                      <span className="font-mono text-xs font-bold text-[#FFF8E1] bg-[#111111]/60 border border-white/25 rounded-full px-2.5 py-0.5">
                        02:00
                      </span>
                    </div>

                    <div className="my-auto flex flex-col items-center justify-center gap-2.5">
                      <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFA500] border-[3px] border-[#111111] shadow-[5px_5px_0_#111111] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105">
                        <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-[#111111] text-[#111111] ml-1" aria-hidden="true" />
                      </span>
                      <span className="font-display font-extrabold text-xs sm:text-sm text-white bg-[#111111]/75 border-2 border-white/25 rounded-full px-3.5 py-1">
                        Watch the 2-minute demo
                      </span>
                    </div>

                    <div className="hidden sm:grid grid-cols-3 gap-2 text-[11px] font-display font-bold text-[#111111]">
                      <div className="bg-[#FFF8E1] border-2 border-[#111111] rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
                        <span className="font-mono text-[#5B4BFF]">0:10</span>
                        <span className="truncate">Pick board</span>
                      </div>
                      <div className="bg-[#DDF7E8] border-2 border-[#111111] rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
                        <span className="font-mono text-[#15803D]">0:55</span>
                        <span className="truncate">Swipe + Pebby</span>
                      </div>
                      <div className="bg-[#FFF1B8] border-2 border-[#111111] rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
                        <span className="font-mono text-[#B45309]">1:35</span>
                        <span className="truncate">3/5 marking</span>
                      </div>
                    </div>
                  </button>
                )}
              </div>

              <p className="sr-only">
                Video summary: A two-minute walkthrough of ACADEMe showing a Class 10 CBSE student selecting their board and language, swiping through a short Real Numbers lesson deck with quick checks, asking Pebby to explain and hint-solve a question, and scanning a handwritten notebook page to receive a point-by-point board marking breakdown and model answer.
              </p>
            </div>
          </div>

          {/* Right: Interactive "Get started in 3 steps" Stepper + Live Preview Card */}
          <div className="lg:col-span-6 neo-card bg-white p-4 min-[900px]:p-6 space-y-3 min-[900px]:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-display font-bold text-xs text-[#5B4BFF] uppercase tracking-wider">
                  Get started in 3 steps
                </p>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#111111]">
                  Try each step — click, tap, or use arrow keys.
                </h3>
              </div>
              <span className="font-mono font-bold text-xs bg-[#EEF0F8] border-2 border-[#111111] rounded-full px-2.5 py-0.5 shrink-0">
                0{activeStepIdx + 1} / 03
              </span>
            </div>

            {/* Interactive Step List + Side-by-Side Live Preview on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
              {/* 3 Interactive Step Buttons */}
              <div
                role="tablist"
                aria-label="Get started steps"
                onKeyDown={handleStepperKeyDown}
                className="sm:col-span-6 grid grid-cols-3 sm:grid-cols-1 gap-2"
              >
                {DEMO_STEPS.map((item, idx) => {
                  const isLit = litStep >= item.step;
                  const isActive = activeStepIdx === idx;
                  const pulseHighlight = idx === 0 && step1Pulse;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      role="tab"
                      data-testid={`demo-step-${item.step}`}
                      aria-selected={isActive}
                      onClick={() => setActiveStepIdx(idx)}
                      className={`text-left rounded-2xl border-[2.5px] border-[#111111] p-2.5 sm:p-3 flex flex-col sm:flex-row items-start gap-2 sm:gap-3 transition-all ${
                        isActive
                          ? 'bg-[#FFF8E1] shadow-[4px_4px_0_#111111] -translate-x-0.5 -translate-y-0.5'
                          : isLit
                          ? 'bg-[#EEF0F8]/80 hover:bg-[#FFF8E1]/60'
                          : 'bg-[#EEF0F8]/40 opacity-75'
                      } ${pulseHighlight ? 'ring-4 ring-[#5B4BFF]' : ''}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full border-2 border-[#111111] flex items-center justify-center font-mono font-extrabold text-xs shrink-0 ${
                          isActive
                            ? 'bg-[#5B4BFF] text-white'
                            : isLit
                            ? 'bg-[#FFA500] text-[#111111]'
                            : 'bg-white text-[#111111]/60'
                        }`}
                      >
                        {item.step}
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-display font-extrabold text-xs sm:text-[0.82rem] text-[#111111] leading-snug">
                          {item.title}
                        </p>
                        <p className="hidden sm:block text-[11px] text-[#111111]/75 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Neo-Brutalist Live Preview Card for Active Step */}
              <div
                role="tabpanel"
                data-testid="demo-step-preview"
                data-active-step={activeStepIdx + 1}
                className="sm:col-span-6 bg-[#FFF8E1] border-[2.5px] border-[#111111] rounded-[20px] shadow-[4px_4px_0_#111111] p-4 flex flex-col justify-between gap-3 min-h-[210px]"
              >
                {/* STEP 1 LIVE PREVIEW: Mini Board / Class / Language Picker */}
                {activeStepIdx === 0 && (
                  <div className="space-y-2.5">
                    <p className="font-mono font-bold text-[11px] text-[#5B4BFF]">
                      LIVE PREVIEW · STEP 1
                    </p>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {(['CBSE', 'ICSE', 'ISC'] as BoardId[]).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => {
                              setMiniBoard(b);
                              if (b === 'ISC' && miniClass < 11) setMiniClass(11);
                              if (b === 'ICSE' && miniClass > 10) setMiniClass(10);
                            }}
                            className={`px-2.5 py-1 rounded-full border-2 border-[#111111] font-display font-bold text-[11px] ${
                              miniBoard === b ? 'bg-[#5B4BFF] text-white' : 'bg-white text-[#111111]'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {([8, 9, 10, 12] as ClassLevel[]).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setMiniClass(c);
                              if (c >= 11 && miniBoard === 'ICSE') setMiniBoard('ISC');
                              if (c <= 10 && miniBoard === 'ISC') setMiniBoard('ICSE');
                            }}
                            className={`px-2.5 py-1 rounded-full border-2 border-[#111111] font-mono font-bold text-[11px] ${
                              miniClass === c ? 'bg-[#FFA500] text-[#111111]' : 'bg-white text-[#111111]'
                            }`}
                          >
                            Cl {c}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {MINI_LANGS.map((l) => (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => setMiniLang(l.code)}
                            className={`px-2 py-0.5 rounded-full border-2 border-[#111111] font-bold text-[11px] ${
                              miniLang === l.code ? 'bg-[#9BF0C2] text-[#111111]' : 'bg-white text-[#111111]'
                            }`}
                          >
                            {l.short}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-[#111111] bg-white border-2 border-[#111111] rounded-xl px-2.5 py-1.5">
                      Ready: Class {miniClass} {miniBoard} · {MINI_LANGS.find((l) => l.code === miniLang)?.short}
                    </p>
                  </div>
                )}

                {/* STEP 2 LIVE PREVIEW: Mini Swipe Lesson Card + Quick Check */}
                {activeStepIdx === 1 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                      <span className="text-[#15803D]">QUICK CHECK · STEP 2</span>
                      <span className="bg-[#FFA500] border border-[#111111] rounded-full px-2 py-0.5">
                        +25 XP
                      </span>
                    </div>
                    <p className="font-display font-bold text-xs sm:text-sm text-[#111111] leading-snug">
                      If HCF(12, 18) = 6, what is LCM(12, 18)?
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['24', '36', '72'].map((opt, oIdx) => {
                        const picked = miniQuizChoice === oIdx;
                        const right = oIdx === 1;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setMiniQuizChoice(oIdx)}
                            className={`py-1.5 rounded-xl border-2 border-[#111111] font-mono font-bold text-xs ${
                              picked
                                ? right
                                  ? 'bg-[#9BF0C2]'
                                  : 'bg-[#FFE3EC]'
                                : 'bg-white hover:bg-[#EAE5FF]'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-[#111111]/85 bg-white border-2 border-[#111111] rounded-xl px-2.5 py-1.5 leading-snug">
                      {miniQuizChoice === null
                        ? 'Tap an option to see “Here’s why”.'
                        : miniQuizChoice === 1
                        ? 'Correct! (12 × 18) ÷ 6 = 36.'
                        : 'Try again: multiply 12 × 18, then divide by HCF 6.'}
                    </p>
                  </div>
                )}

                {/* STEP 3 LIVE PREVIEW: Short Typing Pebby Chat Reply */}
                {activeStepIdx === 2 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[11px] text-[#5B4BFF]">
                        PEBBY · STEP 3
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const order: LanguageCode[] = ['en', 'hi', 'te', 'ta', 'bn'];
                          const next = order[(order.indexOf(miniLang) + 1) % order.length];
                          setMiniLang(next);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#111111] bg-white border-2 border-[#111111] rounded-full px-2 py-0.5"
                      >
                        <RotateCcw className="w-3 h-3" aria-hidden="true" />
                        {MINI_LANGS.find((l) => l.code === miniLang)?.short}
                      </button>
                    </div>
                    <div className="bg-[#EAE5FF] border-2 border-[#111111] rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-[#111111]">
                      “How do I factor x² − 5x + 6?”
                    </div>
                    <div className="bg-white border-2 border-[#111111] rounded-xl px-2.5 py-2 text-xs text-[#111111] leading-snug min-h-[68px]">
                      <span className="font-display font-bold text-[#5B4BFF] mr-1">Pebby:</span>
                      <span data-testid="demo-mini-pebby-reply">{typedMiniReply}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Reassurance + "Open the app" text link (No Google Play button in Ch 2) */}
            <div className="pt-2.5 border-t-2 border-[#111111]/12 flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#15803D]">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>No paywall in onboarding.</span>
              </p>

              <button
                type="button"
                data-testid="demo-open-app-link"
                onClick={onOpenAppClick}
                className="inline-flex items-center gap-1.5 font-display font-extrabold text-sm text-[#5B4BFF] hover:text-[#111111] underline underline-offset-4 decoration-2 transition-colors"
              >
                <span>Open the app</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
