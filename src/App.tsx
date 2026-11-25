import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';
import { CHAPTERS_META, type BoardId, type ClassLevel } from './data/academeData';
import { computeHeroAction, resolveBoardClassSelection } from './utils/logic';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { ChapterCard } from './components/ChapterCard';
import { ChapterProgressRail } from './components/ChapterProgressRail';
import { HeroSection } from './components/HeroSection';
import { DemoChapterSection } from './components/DemoChapterSection';
import { MeetPebbySection } from './components/MeetPebbySection';
import { BoardSection } from './components/BoardSection';
import { SubjectWorldsSection } from './components/SubjectWorldsSection';
import { SwipeSection } from './components/SwipeSection';
import { StudyToolsChapter, FixItAndTrustChapter } from './components/BentoAndTrustSections';
import {
  INFO_MODAL_COPY,
  BeforeYouStartChapter,
  FinaleCtaSection,
} from './components/PricingParentsFaqFooter';
import { CurtainFooter, type FooterModalTopic } from './components/CurtainFooter';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);

  const [modalTopic, setModalTopic] = useState<FooterModalTopic | null>(null);
  const [waveBackKey, setWaveBackKey] = useState(0);
  const [demoAutoPlaySignal, setDemoAutoPlaySignal] = useState(0);
  const [demoFocusStepSignal, setDemoFocusStepSignal] = useState(0);

  // Shared Chapter 4 board & class state (atomic updater prevents stale closure on rapid clicks)
  const [syllabusSelection, setSyllabusSelection] = useState<{
    board: BoardId;
    classLevel: ClassLevel;
    switchNote: string | null;
  }>({
    board: 'CBSE',
    classLevel: 10,
    switchNote: null,
  });
  const { board, classLevel, switchNote } = syllabusSelection;

  // Chapter rail & progress state — proportional fill ONLY during pinned Chapters 4 (idx 3) and 5 (idx 4)
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [inFinale, setInFinale] = useState(false);
  const [pageProgress, setPageProgress] = useState(0);
  const [pinnedProgressByChapter, setPinnedProgressByChapter] = useState<Record<number, number>>({
    3: 0,
    4: 0,
  });

  const handleBoardChange = useCallback((nextBoard: BoardId) => {
    setSyllabusSelection((prev) => {
      const resolved = resolveBoardClassSelection(nextBoard, prev.classLevel, 'board');
      return {
        board: resolved.board,
        classLevel: resolved.classLevel,
        switchNote: resolved.note,
      };
    });
  }, []);

  const handleClassChange = useCallback((nextClass: ClassLevel) => {
    setSyllabusSelection((prev) => {
      const resolved = resolveBoardClassSelection(prev.board, nextClass, 'class');
      return {
        board: resolved.board,
        classLevel: resolved.classLevel,
        switchNote: resolved.note,
      };
    });
  }, []);

  const handleSubjectProgress = useCallback((p: number) => {
    setPinnedProgressByChapter((prev) =>
      Math.abs((prev[3] ?? 0) - p) > 0.01 ? { ...prev, 3: p } : prev
    );
  }, []);

  const handleSwipeProgress = useCallback((p: number) => {
    setPinnedProgressByChapter((prev) =>
      Math.abs((prev[4] ?? 0) - p) > 0.01 ? { ...prev, 4: p } : prev
    );
  }, []);

  // Scroll cleanly to any section or chapter using non-sticky flow sentinels
  const scrollToTarget = useCallback((id: string) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = lenisRef.current;

    if (id === 'hero') {
      if (lenis && !reduced) {
        lenis.scrollTo(0, { duration: 1.05 });
      } else {
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      }
      return;
    }

    const sentinel = document.getElementById(`anchor-${id}`);
    const targetEl = sentinel ?? document.getElementById(id);
    if (!targetEl) return;

    const offset = id === 'faq' ? -84 : 0;
    if (lenis && !reduced) {
      lenis.scrollTo(targetEl, { offset, duration: 1.05 });
    } else {
      const top = targetEl.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
    }
  }, []);

  const scrollToDownload = useCallback(() => {
    scrollToTarget('download');
  }, [scrollToTarget]);

  const handleGetStarted = useCallback(() => {
    const action = computeHeroAction('get-started');
    if (action.highlightStep !== null) {
      setDemoFocusStepSignal((n) => n + 1);
    }
    scrollToTarget(action.targetId);
  }, [scrollToTarget]);

  const handleWatchDemo = useCallback(() => {
    const action = computeHeroAction('watch-demo');
    if (action.autoPlayMuted) {
      setDemoAutoPlaySignal((n) => n + 1);
    }
    scrollToTarget(action.targetId);
  }, [scrollToTarget]);

  const handleSelectChapter = useCallback(
    (index: number) => {
      const chapter = CHAPTERS_META[index];
      if (!chapter) return;
      scrollToTarget(chapter.id);
    },
    [scrollToTarget]
  );

  // Restore exact Lenis settings (duration 1.05, smoothWheel true, touchMultiplier 1.4, default wheelMultiplier 1)
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const revealEls = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      revealEls.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              once: true,
            },
          }
        );
      });

      const parallaxEls = gsap.utils.toArray<HTMLElement>('[data-parallax]');
      parallaxEls.forEach((el) => {
        const speed = Number(el.dataset.parallax ?? '0.15');
        gsap.to(el, {
          y: speed * 90,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    });

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 220);

    // Recompute pixel pin distances on resize without rebuilding scenes
    let resizeTimer = 0;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      ctx.revert();
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Track active chapter, Finale state, and overall page progress on scroll
  useEffect(() => {
    let rafId = 0;

    const measureActiveChapter = () => {
      rafId = 0;
      const vh = window.innerHeight;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      setPageProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)));

      const finaleEl = document.getElementById('download');
      if (finaleEl) {
        const fRect = finaleEl.getBoundingClientRect();
        if (fRect.top <= vh * 0.55) {
          setInFinale(true);
          setActiveChapterIdx(CHAPTERS_META.length - 1);
          return;
        }
      }
      setInFinale(false);

      const threshold = vh * 0.46;
      for (let i = CHAPTERS_META.length - 1; i >= 0; i--) {
        const card = document.getElementById(CHAPTERS_META[i].id);
        if (!card) continue;
        const rect = card.getBoundingClientRect();
        if (rect.top <= threshold) {
          setActiveChapterIdx(i);
          return;
        }
      }
      setActiveChapterIdx(0);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(measureActiveChapter);
    };

    measureActiveChapter();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Close info modal on Escape
  useEffect(() => {
    if (!modalTopic) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalTopic(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalTopic]);

  const activeChapterMeta = CHAPTERS_META[activeChapterIdx];
  const currentPinnedProgress = activeChapterMeta?.isPinned
    ? pinnedProgressByChapter[activeChapterIdx] ?? 0
    : 1;

  return (
    <div className="min-h-screen bg-[#151238] text-[#111111]">
      <CustomCursor />
      <Navbar onDownloadClick={scrollToDownload} onNavigateSection={scrollToTarget} />

      {/* Desktop Right-Edge 8-Segment Chapter Progress Rail + Mobile Top Progress Bar */}
      <ChapterProgressRail
        activeIndex={activeChapterIdx}
        inFinale={inFinale}
        pinnedProgress={currentPinnedProgress}
        pageProgress={pageProgress}
        onSelectChapter={handleSelectChapter}
      />

      {/* Main stacked 8-chapter book + Finale at z-20 lifting like a curtain over the fixed z-10 CurtainFooter */}
      <main className="relative z-20 bg-[#151238]">
        {/* CHAPTER 1: WELCOME / HERO (Warm Cream #FFF8E1) */}
        <div id="anchor-hero" className="h-0 w-full pointer-events-none" aria-hidden="true" />
        <ChapterCard id="hero" zIndex={11} bg="#FFF8E1" isFirst nextTriggerId="demo">
          <HeroSection
            onDownloadClick={scrollToDownload}
            onGetStartedClick={handleGetStarted}
            onWatchDemoClick={handleWatchDemo}
            waveBackKey={waveBackKey}
          />
        </ChapterCard>

        {/* CHAPTER 2: WATCH THE DEMO + GET STARTED (Soft Lavender #EAE5FF) */}
        <div id="anchor-demo" className="h-0 w-full pointer-events-none" aria-hidden="true" />
        <ChapterCard
          id="demo"
          zIndex={12}
          bg="#EAE5FF"
          nextTriggerId="pebby"
          nextChapterLabel="Meet Pebby"
          onJumpNext={scrollToTarget}
        >
          <DemoChapterSection
            onOpenAppClick={scrollToDownload}
            autoPlaySignal={demoAutoPlaySignal}
            focusStepSignal={demoFocusStepSignal}
          />
        </ChapterCard>

        {/* CHAPTER 3: MEET PEBBY — MOVED UP, UNPINNED, 4 TABS (Blush Pink #FFE3EC) */}
        <div id="anchor-pebby" className="h-0 w-full pointer-events-none" aria-hidden="true" />
        <ChapterCard
          id="pebby"
          zIndex={13}
          bg="#FFE3EC"
          nextTriggerId="syllabus"
          nextChapterLabel="Subject worlds"
          onJumpNext={scrollToTarget}
        >
          <MeetPebbySection />
        </ChapterCard>

        {/* CHAPTER 4: SUBJECT WORLDS + COMPACT BOARD PICKER (Mint #DDF7E8 -> morphing subject pastels, PINNED) */}
        <div id="anchor-syllabus" className="h-0 w-full pointer-events-none" aria-hidden="true" />
        <ChapterCard
          id="syllabus"
          zIndex={14}
          bg="#DDF7E8"
          hasInnerPin
          nextTriggerId="swipe"
          nextChapterLabel="Learn by swiping"
          onJumpNext={scrollToTarget}
        >
          <BoardSection
            board={board}
            classLevel={classLevel}
            switchNote={switchNote}
            onBoardChange={handleBoardChange}
            onClassChange={handleClassChange}
          />
          <SubjectWorldsSection
            board={board}
            classLevel={classLevel}
            onPinnedProgress={handleSubjectProgress}
          />
        </ChapterCard>

        {/* CHAPTER 5: LEARN BY SWIPING (Butter Yellow #FFF1B8, PINNED & SHORTENED) */}
        <div id="anchor-swipe" className="h-0 w-full pointer-events-none" aria-hidden="true" />
        <ChapterCard
          id="swipe"
          zIndex={15}
          bg="#FFF1B8"
          hasInnerPin
          nextTriggerId="tools"
          nextChapterLabel="Study tools"
          onJumpNext={scrollToTarget}
        >
          <SwipeSection onPinnedProgress={handleSwipeProgress} />
        </ChapterCard>

        {/* CHAPTER 6: STUDY TOOLS BENTO (Sky Blue #DFF1FF) */}
        <div id="anchor-tools" className="h-0 w-full pointer-events-none" aria-hidden="true" />
        <ChapterCard
          id="tools"
          zIndex={16}
          bg="#DFF1FF"
          nextTriggerId="why-academe"
          nextChapterLabel="Fix-it & Trust"
          onJumpNext={scrollToTarget}
        >
          <StudyToolsChapter />
        </ChapterCard>

        {/* CHAPTER 7: FIX-IT BOARD + SINGLE-ROW TRUST BAND (Crisp White #FFFFFF) */}
        <div id="anchor-why-academe" className="h-0 w-full pointer-events-none" aria-hidden="true" />
        <ChapterCard
          id="why-academe"
          zIndex={17}
          bg="#FFFFFF"
          nextTriggerId="pricing"
          nextChapterLabel="Before you start"
          onJumpNext={scrollToTarget}
        >
          <FixItAndTrustChapter />
        </ChapterCard>

        {/* CHAPTER 8: BEFORE YOU START — PRICING + FAQ (Soft Lavender-Grey #EEF0F8) */}
        <div id="anchor-pricing" className="h-0 w-full pointer-events-none" aria-hidden="true" />
        <ChapterCard
          id="pricing"
          zIndex={18}
          bg="#EEF0F8"
          nextTriggerId="download"
          nextChapterLabel="Get the app"
          onJumpNext={scrollToTarget}
        >
          <BeforeYouStartChapter onDownloadClick={scrollToDownload} />
        </ChapterCard>

        {/* FINALE (NOT A CHAPTER): INDIGO CTA SLIDING OVER CHAPTER 8 & LIFTING OVER CURTAIN FOOTER */}
        <div id="anchor-download" className="h-0 w-full pointer-events-none" aria-hidden="true" />
        <ChapterCard id="download" zIndex={19} bg="#5B4BFF" isFinale>
          <FinaleCtaSection onOpenModal={(topic) => setModalTopic(topic)} />
        </ChapterCard>
      </main>

      {/* Restored 720px Curtain-Reveal Footer behind z-20 main */}
      <CurtainFooter
        onOpenModal={(topic) => setModalTopic(topic)}
        onBackToTopArrived={() => setWaveBackKey((k) => k + 1)}
      />

      {/* Accessible Info Modal shared by Play Store CTAs and Footer Links */}
      {modalTopic && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-modal-title"
          className="fixed inset-0 z-[70] bg-[#111111]/60 flex items-center justify-center p-4"
          onClick={() => setModalTopic(null)}
        >
          <div
            className="neo-card bg-white max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3
                id="info-modal-title"
                className="font-display font-extrabold text-xl text-[#111111]"
              >
                {INFO_MODAL_COPY[modalTopic].title}
              </h3>
              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => setModalTopic(null)}
                className="w-9 h-9 rounded-full border-2 border-[#111111] bg-[#EEF0F8] hover:bg-[#FFA500] flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4 text-[#111111]" aria-hidden="true" />
              </button>
            </div>
            <p className="text-sm text-[#111111]/85 leading-relaxed">
              {INFO_MODAL_COPY[modalTopic].body}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setModalTopic(null)}
                className="neo-btn-sm bg-[#5B4BFF] text-white font-display font-bold text-xs px-5 py-2.5"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
