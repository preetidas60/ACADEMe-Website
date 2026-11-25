import {
  BOARD_CLASSES,
  SYLLABUS_DATA,
  SWIPE_CARDS,
  CHECK_ANSWER_DATA,
  type BoardId,
  type ClassLevel,
  type BoardSyllabusEntry,
} from '../data/academeData';

export interface BoardClassResolution {
  board: BoardId;
  classLevel: ClassLevel;
  note: string | null;
}

/**
 * Resolves valid Indian school board + class pairs:
 * - CBSE spans Classes 6–12
 * - ICSE spans Classes 6–10 (choosing 11–12 switches seamlessly to ISC)
 * - ISC spans Classes 11–12 (choosing 6–10 switches seamlessly to ICSE)
 */
export function resolveBoardClassSelection(
  targetBoard: BoardId,
  targetClass: ClassLevel,
  changedField: 'board' | 'class'
): BoardClassResolution {
  const allowedForTarget = BOARD_CLASSES[targetBoard];
  if (allowedForTarget.includes(targetClass)) {
    return { board: targetBoard, classLevel: targetClass, note: null };
  }

  if (changedField === 'board') {
    if (targetBoard === 'ISC') {
      return {
        board: 'ISC',
        classLevel: 11,
        note: 'ISC covers Classes 11–12 (CISCE senior secondary). Switched to Class 11.',
      };
    }
    if (targetBoard === 'ICSE') {
      return {
        board: 'ICSE',
        classLevel: 10,
        note: 'ICSE covers Classes 6–10. Switched to Class 10.',
      };
    }
  } else {
    if (targetBoard === 'ICSE' && targetClass >= 11) {
      return {
        board: 'ISC',
        classLevel: targetClass,
        note: 'ICSE continues as ISC in Classes 11–12. Switched board to ISC.',
      };
    }
    if (targetBoard === 'ISC' && targetClass <= 10) {
      return {
        board: 'ICSE',
        classLevel: targetClass,
        note: 'CISCE Classes 6–10 follow the ICSE syllabus. Switched board to ICSE.',
      };
    }
  }

  return {
    board: targetBoard,
    classLevel: allowedForTarget[0],
    note: null,
  };
}

export function getSyllabusForSelection(
  board: BoardId,
  classLevel: ClassLevel
): BoardSyllabusEntry {
  const key = `${board}-${classLevel}`;
  return SYLLABUS_DATA[key] ?? SYLLABUS_DATA['CBSE-10'];
}

export interface SwipeDeckState {
  activeIndex: number;
  progressPercent: number;
  xp: number;
  cardId: string;
}

/**
 * Maps normalized scroll progress [0, 1] to the active swipe lesson card,
 * progress bar percentage, and XP counter.
 */
export function computeSwipeState(normalizedProgress: number): SwipeDeckState {
  const clamped = Math.max(0, Math.min(1, normalizedProgress));
  const total = SWIPE_CARDS.length;
  const activeIndex = Math.min(total - 1, Math.floor(clamped * total));
  const card = SWIPE_CARDS[activeIndex];
  const progressPercent = Math.round(((activeIndex + 1) / total) * 100);
  return {
    activeIndex,
    progressPercent,
    xp: card.xpValue,
    cardId: card.id,
  };
}

export interface CheckScanState {
  revealedCount: number;
  earnedMarks: number;
  totalMarks: number;
  showHowToImprove: boolean;
  showModelAnswer: boolean;
}

/**
 * Maps scan progress [0, 1] in Section 5 ("Check my answer") to revealed rubric points
 * and running score (0/5 -> 3/5).
 */
export function computeScanState(normalizedProgress: number): CheckScanState {
  const clamped = Math.max(0, Math.min(1, normalizedProgress));
  const points = CHECK_ANSWER_DATA.points;
  const revealedCount =
    clamped <= 0.05
      ? 0
      : Math.min(points.length, Math.ceil(clamped * points.length));
  const earnedMarks = points
    .slice(0, revealedCount)
    .reduce((sum, pt) => sum + pt.awarded, 0);

  return {
    revealedCount,
    earnedMarks,
    totalMarks: CHECK_ANSWER_DATA.totalMarks,
    showHowToImprove: clamped >= 0.72,
    showModelAnswer: clamped >= 0.86,
  };
}

export interface QuizEvalResult {
  isCorrect: boolean;
  shouldCelebrate: boolean;
}

export function evaluateQuizAnswer(
  selectedIndex: number,
  correctIndex: number
): QuizEvalResult {
  const isCorrect = selectedIndex === correctIndex;
  return {
    isCorrect,
    shouldCelebrate: isCorrect,
  };
}

export interface PricingDisplay {
  headlinePrice: string;
  subline: string;
  badge: string;
}

export function getProPricingSummary(billing: 'monthly' | 'annual'): PricingDisplay {
  if (billing === 'annual') {
    return {
      headlinePrice: '₹1,999',
      subline: 'per year (about ₹167/month)',
      badge: 'About 3x the AI limits',
    };
  }
  return {
    headlinePrice: '₹100',
    subline: 'for the first month, then ₹200/month',
    badge: 'About 3x the AI limits',
  };
}

export interface PlannerTask {
  id: string;
  title: string;
  dueLabel: string;
  done: boolean;
}

export function addPlannerTask(
  tasks: PlannerTask[],
  rawTitle: string,
  rawDue: string
): PlannerTask[] {
  const title = rawTitle.trim();
  if (!title) return tasks;
  const dueLabel = rawDue.trim() || 'Today';
  const nextId = `task-${tasks.length + 1}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return [...tasks, { id: nextId, title, dueLabel, done: false }];
}

export function togglePlannerTask(tasks: PlannerTask[], id: string): PlannerTask[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

export interface NavMorphState {
  isFloating: boolean;
  isHidden: boolean;
}

/**
 * Computes two-state nav morphing:
 * - scrollY < 80: integrated into hero (not floating)
 * - scrollY >= 80: centered floating neo-brutalist pill
 * - last ~10% of page (scrollProgress >= 0.90): gently fades out so it never clashes with the footer scene
 */
export function computeNavState(params: {
  scrollY: number;
  lastScrollY: number;
  reducedMotion: boolean;
  menuOpen: boolean;
  scrollProgress?: number;
  heroThreshold?: number;
}): NavMorphState {
  const { scrollY, menuOpen, scrollProgress = 0 } = params;
  const isFloating = scrollY >= 80;
  const isNearFooter = !menuOpen && scrollProgress >= 0.9;
  return { isFloating, isHidden: isNearFooter };
}

/**
 * Maps normalized scroll progress [0, 1] across the 6 Subject Worlds.
 */
export function resolveSubjectWorldIndex(normalizedProgress: number, total = 6): number {
  const clamped = Math.max(0, Math.min(1, normalizedProgress));
  return Math.min(total - 1, Math.floor(clamped * total));
}

export interface ReflectionRayGeometry {
  incidentDeg: number;
  reflectedDeg: number;
  incidentStartX: number;
  incidentStartY: number;
  reflectedEndX: number;
  reflectedEndY: number;
}

/**
 * Computes exact law-of-reflection ray geometry (angle of incidence === angle of reflection)
 * on a horizontal mirror centered at (160, 170) with normal pointing vertically upward.
 */
export function computeReflectionRay(rawIncidentDeg: number): ReflectionRayGeometry {
  const incidentDeg = Math.round(Math.max(15, Math.min(70, rawIncidentDeg)));
  const reflectedDeg = incidentDeg;
  const rad = (incidentDeg * Math.PI) / 180;
  const originX = 160;
  const originY = 170;
  const rayLength = 126;

  const dx = Math.sin(rad) * rayLength;
  const dy = Math.cos(rad) * rayLength;

  return {
    incidentDeg,
    reflectedDeg,
    incidentStartX: Math.round((originX - dx) * 10) / 10,
    incidentStartY: Math.round((originY - dy) * 10) / 10,
    reflectedEndX: Math.round((originX + dx) * 10) / 10,
    reflectedEndY: Math.round((originY - dy) * 10) / 10,
  };
}

/**
 * Pure Fix-it board state transitions.
 */
export function fixBoardNote(fixedIds: string[], noteId: string): string[] {
  if (fixedIds.includes(noteId)) return fixedIds;
  return [...fixedIds, noteId];
}

export function isFixItBoardComplete(fixedIds: string[], totalNotes = 5): boolean {
  return fixedIds.length >= totalNotes;
}

export type FooterSequenceStage =
  | 'anticipation'
  | 'peek'
  | 'pop'
  | 'wave'
  | 'revealed';

/**
 * Computes the Curtain Footer choreography stage based on visibility progress,
 * replay memory, timed sequence completion, and prefers-reduced-motion.
 */
export const CURTAIN_FOOTER_HEIGHT = 720;

export function computeFooterStage(params: {
  revealProgress: number;
  hasPlayedFull: boolean;
  timedPhase: 'idle' | 'pop' | 'wave' | 'revealed';
  reducedMotion: boolean;
}): FooterSequenceStage {
  const { revealProgress, hasPlayedFull, timedPhase, reducedMotion } = params;
  if (reducedMotion) return 'revealed';

  if (timedPhase === 'revealed') return 'revealed';
  if (timedPhase === 'wave') return 'wave';
  if (timedPhase === 'pop') return 'pop';

  if (hasPlayedFull) {
    return revealProgress >= 0.45 ? 'wave' : 'anticipation';
  }

  if (revealProgress < 0.28) return 'anticipation';
  if (revealProgress < 0.58) return 'peek';
  return 'pop';
}

export type RailSegmentStatus = 'completed' | 'current' | 'upcoming';

export interface ChapterRailSegmentState {
  index: number;
  status: RailSegmentStatus;
  fillRatio: number;
}

/**
 * Computes the visual status and proportional fill ratio for each of the 8 chapter rail segments.
 * Inside pinned chapters, the current segment fills smoothly with pinnedProgress [0, 1].
 * When inFinale is true, all 8 segments mark as completed (indigo).
 */
export function computeChapterRailSegments(params: {
  activeIndex: number;
  totalChapters?: number;
  inFinale: boolean;
  pinnedProgress?: number;
}): ChapterRailSegmentState[] {
  const { activeIndex, totalChapters = 8, inFinale, pinnedProgress = 1 } = params;
  const clampedProgress = Math.max(0.18, Math.min(1, pinnedProgress));

  return Array.from({ length: totalChapters }, (_, index) => {
    if (inFinale) {
      return { index, status: 'completed', fillRatio: 1 };
    }
    if (index < activeIndex) {
      return { index, status: 'completed', fillRatio: 1 };
    }
    if (index === activeIndex) {
      return { index, status: 'current', fillRatio: clampedProgress };
    }
    return { index, status: 'upcoming', fillRatio: 0 };
  });
}

/**
 * Computes next chapter index for PageUp (-1) / PageDown (+1) keyboard navigation.
 */
export function getAdjacentChapterIndex(
  currentIndex: number,
  delta: -1 | 1,
  totalChapters = 8
): number {
  return Math.max(0, Math.min(totalChapters - 1, currentIndex + delta));
}

/**
 * Computes CSS sticky `top` offset in pixels so a chapter taller than the viewport
 * scrolls naturally until its bottom reaches the bottom of the screen before sticking.
 */
export function computeStickyTopOffset(
  sectionHeight: number,
  viewportHeight: number
): number {
  if (sectionHeight <= viewportHeight) return 0;
  return Math.round(viewportHeight - sectionHeight);
}

/**
 * Computes pixel min-height for full-screen desktop chapters from window.innerHeight
 * (no vh/svh CSS units). Returns undefined on mobile (< 900px) or reduced motion so
 * normal vertical flow has zero forced min-height.
 */
export function computeChapterMinHeightPx(
  viewportHeight: number,
  isDesktop: boolean,
  reducedMotion: boolean
): number | undefined {
  if (!isDesktop || reducedMotion) return undefined;
  return Math.max(480, Math.round(viewportHeight));
}

/**
 * Computes [0, 1] opacity for a stacked chapter card's upward hard shadow (0 -8px 0 #111111).
 * Strictly returns 0 whenever the card's top edge is at or below the bottom of the viewport
 * so the shadow can never peek into the previous chapter.
 */
export function computeCardEdgeShadowOpacity(
  cardTop: number,
  viewportHeight: number,
  fadeWindowPx = 72
): number {
  if (cardTop >= viewportHeight) return 0;
  const enteredPx = viewportHeight - cardTop;
  if (enteredPx <= 0) return 0;
  const safeWindow = Math.max(1, fadeWindowPx);
  return Math.min(1, Math.round((enteredPx / safeWindow) * 1000) / 1000);
}

export interface HeroActionResult {
  targetId: 'demo';
  highlightStep: number | null;
  autoPlayMuted: boolean;
}

/**
 * Pure intent mapping for Hero secondary actions:
 * - "Get started" scrolls to Chapter 2 and highlights Step 1 without starting the video.
 * - "Watch the 2-minute demo" scrolls to Chapter 2 and starts the video muted.
 */
export function computeHeroAction(trigger: 'get-started' | 'watch-demo'): HeroActionResult {
  if (trigger === 'get-started') {
    return {
      targetId: 'demo',
      highlightStep: 1,
      autoPlayMuted: false,
    };
  }
  return {
    targetId: 'demo',
    highlightStep: null,
    autoPlayMuted: true,
  };
}

/**
 * Computes the active step index [0..total-1] for the interactive 3-step Get started stepper
 * across click/tap and keyboard arrow navigation.
 */
export function resolveDemoStepperIndex(
  currentIndex: number,
  action: 'next' | 'prev' | number,
  total = 3
): number {
  if (typeof action === 'number') {
    return Math.max(0, Math.min(total - 1, action));
  }
  if (action === 'next') {
    return (currentIndex + 1) % total;
  }
  return (currentIndex - 1 + total) % total;
}

/**
 * Computes pixel pin scroll distance for Subject Worlds from window.innerHeight (no vh CSS units).
 * Keeps the 6-world sequence brisk (~2 screens total including the pinned stage) without feeling endless.
 */
export function computeSubjectWorldsPinDistance(
  viewportHeight: number,
  totalWorlds = 6
): number {
  const safeVh = Math.max(560, viewportHeight);
  const perWorldFactor = 0.19;
  return Math.round(safeVh * Math.max(1.0, totalWorlds * perWorldFactor));
}

/**
 * Computes shortened pixel pin scroll distance for Learn by swiping (~170px per card, ~680px total).
 */
export function computeSwipePinDistance(viewportHeight: number, cardCount = 4): number {
  const target = cardCount * 170;
  const maxByViewport = Math.round(Math.max(560, viewportHeight) * 0.85);
  return Math.min(target, maxByViewport);
}


