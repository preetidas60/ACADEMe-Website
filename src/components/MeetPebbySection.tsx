import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Trophy,
  FileCheck2,
  Globe,
  CheckCircle2,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  CHECK_ANSWER_DATA,
  LANGUAGES,
  PEBBY_SCRIPTS,
  type LanguageCode,
  type PebbyTabId,
} from '../data/academeData';
import { computeScanState, evaluateQuizAnswer } from '../utils/logic';
import { PebbyMascot, type PebbyPose } from './PebbyMascot';

const CONFETTI_PIECES = [
  { tx: '-72px', ty: '-68px', rot: '-42deg', color: '#FFA500' },
  { tx: '-34px', ty: '-88px', rot: '25deg', color: '#5B4BFF' },
  { tx: '12px', ty: '-94px', rot: '-20deg', color: '#9BF0C2' },
  { tx: '58px', ty: '-74px', rot: '50deg', color: '#FFE3EC' },
  { tx: '84px', ty: '-36px', rot: '70deg', color: '#FFA500' },
  { tx: '-88px', ty: '-22px', rot: '-65deg', color: '#DFF1FF' },
  { tx: '40px', ty: '-48px', rot: '35deg', color: '#5B4BFF' },
  { tx: '-46px', ty: '-44px', rot: '-30deg', color: '#9BF0C2' },
];

/**
 * CHAPTER 3: Meet Pebby (Unpinned — click/tap tabs, Explain typewriter auto-plays on entry)
 */
export const MeetPebbySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  const [activeTab, setActiveTab] = useState<PebbyTabId>('explain');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [showFullSteps, setShowFullSteps] = useState(false);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [typedReply, setTypedReply] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Lazy-initialized Check my answer scan state (Tab 4)
  const [scanProgress, setScanProgress] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [showModel, setShowModel] = useState(true);
  const scanRafRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Lazy-activate typewriter and scan animations only when Chapter 3 enters near the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsNearViewport(true);
        }
      },
      { rootMargin: '120px 0px', threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const runScanSequence = (instant = false) => {
    if (scanRafRef.current) {
      window.cancelAnimationFrame(scanRafRef.current);
      scanRafRef.current = 0;
    }
    if (instant || reducedMotion) {
      setScanProgress(1);
      return;
    }
    setScanProgress(0.04);
    const start = performance.now();
    const duration = 1650;

    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setScanProgress(p);
      if (p < 1) {
        scanRafRef.current = window.requestAnimationFrame(step);
      } else {
        scanRafRef.current = 0;
      }
    };
    scanRafRef.current = window.requestAnimationFrame(step);
  };

  // Lazy-init scan animation only when Check my answer tab is open & section is near viewport
  useEffect(() => {
    if (activeTab === 'check' && isNearViewport) {
      runScanSequence(false);
    }
    return () => {
      if (scanRafRef.current) {
        window.cancelAnimationFrame(scanRafRef.current);
        scanRafRef.current = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isNearViewport, reducedMotion]);

  const currentReplyText =
    activeTab === 'explain'
      ? PEBBY_SCRIPTS.explain.reply[lang]
      : activeTab === 'solve'
      ? PEBBY_SCRIPTS.solve.hint[lang]
      : activeTab === 'quiz'
      ? PEBBY_SCRIPTS.quiz.question[lang]
      : '';

  // Auto-play Explain typewriter reply on entry (and whenever tab/language changes)
  useEffect(() => {
    if (activeTab === 'check') return;
    if (reducedMotion || !isNearViewport) {
      setTypedReply(reducedMotion ? currentReplyText : '');
      return;
    }

    let idx = 0;
    setTypedReply('');
    const timer = window.setInterval(() => {
      idx += 4;
      setTypedReply(currentReplyText.slice(0, idx));
      if (idx >= currentReplyText.length) {
        setTypedReply(currentReplyText);
        window.clearInterval(timer);
      }
    }, 15);

    return () => window.clearInterval(timer);
  }, [activeTab, currentReplyText, isNearViewport, reducedMotion]);

  const handleTabChange = (tab: PebbyTabId) => {
    setActiveTab(tab);
    setShowFullSteps(false);
    setQuizChoice(null);
  };

  const handleQuizSelect = (optionIdx: number) => {
    setQuizChoice(optionIdx);
    const result = evaluateQuizAnswer(optionIdx, PEBBY_SCRIPTS.quiz.correctIndex);
    if (result.shouldCelebrate) {
      setConfettiKey((k) => k + 1);
    }
  };

  const isQuizCorrect =
    quizChoice !== null &&
    evaluateQuizAnswer(quizChoice, PEBBY_SCRIPTS.quiz.correctIndex).isCorrect;

  const pebbyPose: PebbyPose =
    activeTab === 'explain'
      ? 'reading'
      : activeTab === 'solve'
      ? 'thinking'
      : activeTab === 'check'
      ? 'magnifying'
      : isQuizCorrect
      ? 'cheering'
      : 'waving';

  const scanState = computeScanState(scanProgress);
  const isScanning = scanProgress > 0.01 && scanProgress < 0.99;

  const tabs: Array<{
    id: PebbyTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'explain', label: 'Explain', icon: BookOpen },
    { id: 'solve', label: 'Solve', icon: HelpCircle },
    { id: 'quiz', label: 'Quiz me', icon: Trophy },
    { id: 'check', label: 'Check my answer', icon: FileCheck2 },
  ];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="meet-pebby-heading"
      className="py-5 min-[900px]:pt-[84px] min-[900px]:pb-5 bg-[#FFE3EC] flex items-center"
    >
      <div className="mx-auto max-w-[1200px] w-full px-4 sm:px-6 space-y-3.5 min-[900px]:space-y-4">
        {/* Section Heading + Chapter Label Chip */}
        <div className="max-w-3xl mx-auto text-center space-y-1.5" data-reveal>
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] font-display font-bold text-xs text-[#5B4BFF]">
            Chapter 3 · Meet Pebby
          </span>
          <h2
            id="meet-pebby-heading"
            className="font-display font-extrabold text-[#111111] leading-[1.08] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(1.8rem, 3.1vw, 2.6rem)', textWrap: 'balance' }}
          >
            Not a chat box. A tutor that knows your chapter.
          </h2>
          <p className="text-xs sm:text-sm text-[#111111]/80 max-w-[58ch] mx-auto">
            Tap Explain, Solve, Quiz me, or Check my answer — and switch languages anytime to see Pebby explain in English, Hindi, Telugu, Tamil, or Bengali.
          </p>
        </div>

        {/* Main Showcase Stage */}
        <div className="neo-card bg-[#FFF8E1] p-4 sm:p-5 space-y-4">
          {/* Top Controls Row: 4 Tabs + Language Switcher (or Replay Scan on Check tab) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b-[2.5px] border-[#111111]">
            <div
              role="tablist"
              aria-label="Pebby tutoring modes"
              className="flex flex-wrap items-center gap-2"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    data-testid={`pebby-tab-${tab.id}`}
                    aria-selected={active}
                    onClick={() => handleTabChange(tab.id)}
                    className={`neo-btn-sm inline-flex items-center gap-1.5 px-4 py-2 font-display font-bold text-xs sm:text-sm whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#5B4BFF] text-white'
                        : 'bg-white text-[#111111] hover:bg-[#EAE5FF]'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'check' ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#111111]/75 hidden sm:inline">
                  Board-style 5-mark rubric
                </span>
                <button
                  type="button"
                  onClick={() => runScanSequence(false)}
                  className="neo-btn-sm inline-flex items-center gap-2 bg-white hover:bg-[#EAE5FF] text-[#111111] font-display font-bold text-xs px-4 py-2 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Replay scan</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111]/75 mr-0.5">
                  <Globe className="w-4 h-4" aria-hidden="true" />
                  Language:
                </span>
                <div
                  role="group"
                  aria-label="Select Pebby language"
                  className="flex flex-wrap gap-1.5"
                >
                  {LANGUAGES.map((l) => {
                    const active = lang === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setLang(l.code)}
                        aria-pressed={active}
                        className={`px-3 py-1.5 rounded-full border-2 border-[#111111] text-xs font-bold whitespace-nowrap transition-all ${
                          active
                            ? 'bg-[#FFA500] text-[#111111] shadow-[2px_2px_0_#111111]'
                            : 'bg-white text-[#111111] hover:bg-[#EAE5FF]'
                        }`}
                      >
                        {l.nativeLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* STAGE BODY */}
          {activeTab !== 'check' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Pebby Character Showcase Column */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-2">
                {confettiKey > 0 && isQuizCorrect && !reducedMotion && (
                  <div
                    key={confettiKey}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-1/2 z-30"
                  >
                    {CONFETTI_PIECES.map((piece, idx) => (
                      <span
                        key={idx}
                        style={
                          {
                            '--tx': piece.tx,
                            '--ty': piece.ty,
                            '--rot': piece.rot,
                            backgroundColor: piece.color,
                          } as React.CSSProperties
                        }
                        className="animate-confetti absolute w-3.5 h-3.5 rounded-sm border-2 border-[#111111]"
                      />
                    ))}
                  </div>
                )}

                <div className="w-[156px] h-[156px] min-[900px]:w-[216px] min-[900px]:h-[216px] rounded-full bg-white border-[3px] border-[#111111] shadow-[6px_6px_0_#111111] flex items-center justify-center">
                  <PebbyMascot
                    pose={pebbyPose}
                    className="w-[136px] h-[136px] min-[900px]:w-[190px] min-[900px]:h-[190px]"
                    trackCursor={isNearViewport}
                    ariaLabel={`Pebby in ${pebbyPose} pose`}
                  />
                </div>

                <p className="mt-2.5 text-xs font-semibold text-[#111111]/75 text-center">
                  {activeTab === 'explain' && 'Mode: Step-by-step concept explanation'}
                  {activeTab === 'solve' && 'Mode: Hint first, full steps when you ask'}
                  {activeTab === 'quiz' &&
                    (isQuizCorrect
                      ? 'Pebby is cheering — right answer'
                      : 'Mode: Live chapter quiz with instant feedback')}
                </p>
              </div>

              {/* Interactive Chat Demo Column */}
              <div
                data-testid="pebby-chat-panel"
                className="lg:col-span-7 bg-white border-[3px] border-[#111111] rounded-[24px] shadow-[6px_6px_0_#111111] p-4 sm:p-5 space-y-3.5 min-h-[210px] min-[900px]:min-h-[268px] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-3 pb-2.5 border-b-2 border-[#111111]/12 text-xs">
                  <span className="font-display font-bold text-[#5B4BFF]">
                    {activeTab === 'explain' && PEBBY_SCRIPTS.explain.chapterContext}
                    {activeTab === 'solve' && PEBBY_SCRIPTS.solve.chapterContext}
                    {activeTab === 'quiz' && PEBBY_SCRIPTS.quiz.chapterContext}
                  </span>
                  <span className="font-semibold text-[#111111]/65">
                    {LANGUAGES.find((l) => l.code === lang)?.label}
                  </span>
                </div>

                {activeTab === 'explain' && (
                  <div className="space-y-3.5 flex-1">
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-[#EAE5FF] border-2 border-[#111111] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm font-medium text-[#111111]">
                        {PEBBY_SCRIPTS.explain.studentPrompt}
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-[92%] bg-[#FFF8E1] border-2 border-[#111111] rounded-2xl rounded-tl-sm px-4 py-3 space-y-1.5 shadow-[3px_3px_0_#111111]">
                        <p className="font-display font-bold text-xs text-[#5B4BFF]">Pebby</p>
                        <p
                          data-testid="pebby-typed-reply"
                          className="text-sm leading-relaxed text-[#111111]"
                        >
                          {typedReply}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'solve' && (
                  <div className="space-y-3.5 flex-1">
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-[#EAE5FF] border-2 border-[#111111] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm font-medium text-[#111111]">
                        {PEBBY_SCRIPTS.solve.studentPrompt}
                      </div>
                    </div>

                    <div className="bg-[#FFF8E1] border-2 border-[#111111] rounded-2xl rounded-tl-sm px-4 py-3 space-y-2.5 shadow-[3px_3px_0_#111111]">
                      <p className="font-display font-bold text-xs text-[#B45309]">
                        Pebby · Hint first
                      </p>
                      <p
                        data-testid="pebby-typed-reply"
                        className="text-sm leading-relaxed text-[#111111]"
                      >
                        {typedReply}
                      </p>

                      {!showFullSteps ? (
                        <button
                          type="button"
                          onClick={() => setShowFullSteps(true)}
                          className="neo-btn-sm bg-[#FFA500] hover:bg-[#ff9500] text-[#111111] font-display font-bold text-xs px-4 py-1.5"
                        >
                          Show full steps
                        </button>
                      ) : (
                        <div
                          data-testid="solve-full-steps"
                          className="bg-white border-2 border-[#111111] rounded-xl p-3 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold text-xs text-[#5B4BFF]">
                              Worked solution
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowFullSteps(false)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111]/70 hover:text-[#111111]"
                            >
                              <RotateCcw className="w-3 h-3" aria-hidden="true" />
                              Hide steps
                            </button>
                          </div>
                          <ol className="space-y-1 text-xs sm:text-sm text-[#111111]">
                            {PEBBY_SCRIPTS.solve.fullSteps[lang].map((step) => (
                              <li key={step} className="leading-snug">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div className="space-y-3.5 flex-1">
                    <div className="bg-[#FFF8E1] border-2 border-[#111111] rounded-2xl px-4 py-3 space-y-1">
                      <p className="font-display font-bold text-xs text-[#5B4BFF]">
                        Pebby · Quick chapter quiz
                      </p>
                      <p
                        data-testid="pebby-typed-reply"
                        className="text-sm font-semibold leading-snug text-[#111111]"
                      >
                        {typedReply}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PEBBY_SCRIPTS.quiz.options.map((option, idx) => {
                        const picked = quizChoice === idx;
                        const isRight = idx === PEBBY_SCRIPTS.quiz.correctIndex;
                        let stateStyle = 'bg-white hover:bg-[#EEF0F8]';
                        if (picked && isRight) {
                          stateStyle = 'bg-[#DDF7E8] shadow-[3px_3px_0_#111111]';
                        } else if (picked && !isRight) {
                          stateStyle = 'bg-[#FFE3EC]';
                        }
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleQuizSelect(idx)}
                            className={`text-left p-2.5 rounded-2xl border-2 border-[#111111] text-xs font-semibold text-[#111111] transition-all flex items-start gap-2 ${stateStyle}`}
                          >
                            <span className="font-mono font-bold w-6 h-6 rounded-full border-2 border-[#111111] bg-[#FFF8E1] flex items-center justify-center shrink-0 text-xs">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="leading-snug">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizChoice !== null && (
                      <div
                        data-testid="quiz-feedback"
                        role="status"
                        className={`p-3 rounded-2xl border-2 border-[#111111] text-xs sm:text-sm flex items-start gap-2 ${
                          isQuizCorrect ? 'bg-[#DDF7E8]' : 'bg-[#FFF1B8]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#111111]" aria-hidden="true" />
                        <p className="leading-snug text-[#111111]">
                          {isQuizCorrect
                            ? PEBBY_SCRIPTS.quiz.correctFeedback[lang]
                            : PEBBY_SCRIPTS.quiz.wrongFeedback[lang]}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2.5 border-t-2 border-[#111111]/10 flex items-center justify-between text-xs text-[#111111]/65">
                  <span>Grounded in your board chapter</span>
                  <span>Report button on every AI answer</span>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 4: CHECK MY ANSWER */
            <div
              data-testid="pebby-check-panel"
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
            >
              <div className="lg:col-span-5 bg-white border-[3px] border-[#111111] rounded-[22px] shadow-[5px_5px_0_#111111] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#111111]/75">
                  <span className="truncate">{CHECK_ANSWER_DATA.questionTitle}</span>
                  <span className="font-mono text-[#5B4BFF] shrink-0 ml-2">
                    {isScanning ? 'Scanning sheet...' : 'Scan complete'}
                  </span>
                </div>

                <div className="relative rounded-[16px] overflow-hidden border-[2.5px] border-[#111111] bg-[#EEF0F8] aspect-[4/4] max-h-[340px] w-full">
                  {!imgError ? (
                    <img
                      src={CHECK_ANSWER_DATA.photoSrc}
                      alt="Handwritten Class 10 CBSE Physics answer on ruled notebook paper showing a concave mirror ray diagram and mirror formula"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full p-5 flex flex-col justify-center items-center text-center gap-2 bg-[#FFF8E1]">
                      <FileCheck2 className="w-9 h-9 text-[#5B4BFF]" aria-hidden="true" />
                      <p className="font-display font-bold text-sm text-[#111111]">
                        Class 10 Physics · Reflection of Light
                      </p>
                    </div>
                  )}

                  <div aria-hidden="true" className="pointer-events-none absolute inset-2.5">
                    <span className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-[#5B4BFF] rounded-tl-md" />
                    <span className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-[#5B4BFF] rounded-tr-md" />
                    <span className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-[#5B4BFF] rounded-bl-md" />
                    <span className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-[#5B4BFF] rounded-br-md" />
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 h-1.5 bg-[#5B4BFF] shadow-[0_0_16px_4px_rgba(91,75,255,0.65)]"
                    style={{
                      top: `${Math.min(96, Math.max(4, scanProgress * 92))}%`,
                      opacity: isScanning ? 1 : 0,
                      transition: 'opacity 220ms ease',
                    }}
                  />

                  {scanState.revealedCount >= 2 && (
                    <div className="absolute top-[30%] right-2.5 bg-[#DDF7E8] border-2 border-[#111111] shadow-[2px_2px_0_#111111] rounded-full px-2.5 py-0.5 font-mono font-bold text-[11px] text-[#111111] tabular-nums">
                      +1 Ray diagram
                    </div>
                  )}
                  {scanState.revealedCount >= 3 && (
                    <div className="absolute bottom-[16%] right-2.5 bg-[#DDF7E8] border-2 border-[#111111] shadow-[2px_2px_0_#111111] rounded-full px-2.5 py-0.5 font-mono font-bold text-[11px] text-[#111111] tabular-nums">
                      +1 Mirror formula
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-[#111111]/70">
                  Scan photos are processed for marking and never stored on our servers.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="bg-white border-[2.5px] border-[#111111] rounded-[20px] shadow-[4px_4px_0_#111111] px-4 py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <PebbyMascot
                      pose="magnifying"
                      className="w-16 h-16 shrink-0"
                      trackCursor={false}
                      ariaLabel="Pebby inspecting an answer sheet with a magnifying glass"
                    />
                    <div>
                      <p className="text-[11px] font-semibold text-[#111111]/65">
                        Point-by-point board marking
                      </p>
                      <h3 className="font-display font-extrabold text-base text-[#111111]">
                        Reflection of Light — 5-mark answer
                      </h3>
                    </div>
                  </div>

                  <div
                    data-testid="check-answer-score"
                    className="bg-[#FFA500] border-[2.5px] border-[#111111] rounded-2xl shadow-[3px_3px_0_#111111] px-3.5 py-1.5 text-center shrink-0"
                  >
                    <p className="font-mono font-extrabold text-2xl leading-none text-[#111111] tabular-nums">
                      {scanState.earnedMarks}/{scanState.totalMarks}
                    </p>
                    <p className="text-[10px] font-bold text-[#111111]/80 mt-0.5">Marks earned</p>
                  </div>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CHECK_ANSWER_DATA.points.map((pt, idx) => {
                    const revealed = idx < scanState.revealedCount;
                    const isFull = pt.status === 'full';
                    return (
                      <li
                        key={pt.id}
                        style={{
                          opacity: revealed ? 1 : 0.25,
                          transform: revealed ? 'translateY(0)' : 'translateY(6px)',
                          transition: 'opacity 260ms ease, transform 260ms ease',
                        }}
                        className={`p-2.5 rounded-2xl border-2 border-[#111111] flex items-start justify-between gap-2 ${
                          isFull ? 'bg-[#DDF7E8]' : 'bg-[#FFE3EC]'
                        }`}
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="mt-0.5 w-5 h-5 rounded-full border-2 border-[#111111] bg-white flex items-center justify-center shrink-0">
                            {isFull ? (
                              <Check className="w-3 h-3 text-[#111111]" aria-hidden="true" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-[#111111]" aria-hidden="true" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="font-display font-bold text-xs text-[#111111] leading-snug">
                              {pt.label}
                            </p>
                            <p className="text-[11px] text-[#111111]/80 mt-0.5 leading-snug">
                              {pt.note}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-[11px] tabular-nums shrink-0 bg-white border-2 border-[#111111] rounded-full px-2 py-0.5">
                          {pt.awarded}/{pt.max}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    style={{ opacity: scanState.showHowToImprove ? 1 : 0.4, transition: 'opacity 280ms ease' }}
                    className="bg-[#EAE5FF] border-[2.5px] border-[#111111] rounded-2xl shadow-[3px_3px_0_#111111] p-3 space-y-1.5"
                  >
                    <h4 className="font-display font-extrabold text-xs sm:text-sm text-[#111111]">
                      How to get full marks (5/5)
                    </h4>
                    <ul className="space-y-1 text-[11px] sm:text-xs text-[#111111]/90 leading-snug list-disc pl-4">
                      {CHECK_ANSWER_DATA.howToGetFullMarks.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{ opacity: scanState.showModelAnswer ? 1 : 0.4, transition: 'opacity 280ms ease' }}
                    className="bg-white border-[2.5px] border-[#111111] rounded-2xl shadow-[3px_3px_0_#111111] p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display font-extrabold text-xs sm:text-sm text-[#111111]">
                        Model answer card
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowModel((prev) => !prev)}
                        className="text-xs font-bold text-[#5B4BFF] hover:underline"
                      >
                        {showModel ? 'Compact' : 'Expand'}
                      </button>
                    </div>
                    <p
                      className={`text-[11px] sm:text-xs text-[#111111]/85 leading-relaxed ${
                        showModel ? '' : 'line-clamp-3'
                      }`}
                    >
                      {CHECK_ANSWER_DATA.modelAnswer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
