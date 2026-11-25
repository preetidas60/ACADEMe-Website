import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveBoardClassSelection,
  getSyllabusForSelection,
  computeSwipeState,
  computeScanState,
  evaluateQuizAnswer,
  getProPricingSummary,
  addPlannerTask,
  togglePlannerTask,
  computeNavState,
  resolveSubjectWorldIndex,
  computeReflectionRay,
  fixBoardNote,
  isFixItBoardComplete,
  computeFooterStage,
  computeChapterRailSegments,
  getAdjacentChapterIndex,
  computeStickyTopOffset,
  computeHeroAction,
  resolveDemoStepperIndex,
  computeSubjectWorldsPinDistance,
  computeSwipePinDistance,
  computeChapterMinHeightPx,
  computeCardEdgeShadowOpacity,
  CURTAIN_FOOTER_HEIGHT,
} from './logic';
import {
  PEBBY_SCRIPTS,
  LANGUAGES,
  SUBJECT_WORLDS,
  FIX_IT_NOTES,
  CHAPTERS_META,
  DEMO_STEPS,
} from '../data/academeData';

test('board and class resolution handles CBSE 6-12, ICSE 6-10, and ISC 11-12 accurately', () => {
  const cbse10 = resolveBoardClassSelection('CBSE', 10, 'board');
  assert.equal(cbse10.board, 'CBSE');
  assert.equal(cbse10.classLevel, 10);
  assert.equal(cbse10.note, null);

  const toIsc = resolveBoardClassSelection('ISC', 10, 'board');
  assert.equal(toIsc.board, 'ISC');
  assert.equal(toIsc.classLevel, 11);
  assert.ok(toIsc.note);

  const icseTo12 = resolveBoardClassSelection('ICSE', 12, 'class');
  assert.equal(icseTo12.board, 'ISC');
  assert.equal(icseTo12.classLevel, 12);
  assert.ok(icseTo12.note);

  const iscTo9 = resolveBoardClassSelection('ISC', 9, 'class');
  assert.equal(iscTo9.board, 'ICSE');
  assert.equal(iscTo9.classLevel, 9);
  assert.ok(iscTo9.note);
});

test('Class 10 CBSE syllabus includes Real Numbers, Polynomials, Pair of Linear Equations, Quadratic Equations', () => {
  const syllabus = getSyllabusForSelection('CBSE', 10);
  const titles = syllabus.chapters.map((c) => c.title);
  assert.ok(titles.includes('Real Numbers'));
  assert.ok(titles.includes('Polynomials'));
  assert.ok(titles.includes('Pair of Linear Equations in Two Variables'));
  assert.ok(titles.includes('Quadratic Equations'));
});

test('computeSwipeState advances cards, progress bar, and XP counter monotonically', () => {
  const s0 = computeSwipeState(0);
  assert.equal(s0.activeIndex, 0);
  assert.equal(s0.progressPercent, 25);
  assert.equal(s0.xp, 25);

  const s1 = computeSwipeState(0.35);
  assert.equal(s1.activeIndex, 1);
  assert.equal(s1.progressPercent, 50);
  assert.equal(s1.xp, 55);

  const s3 = computeSwipeState(1);
  assert.equal(s3.activeIndex, 3);
  assert.equal(s3.progressPercent, 100);
  assert.equal(s3.xp, 105);
});

test('computeScanState reveals marks point by point up to 3/5 and shows model answer', () => {
  const start = computeScanState(0);
  assert.equal(start.revealedCount, 0);
  assert.equal(start.earnedMarks, 0);
  assert.equal(start.showHowToImprove, false);

  const mid = computeScanState(0.5);
  assert.equal(mid.revealedCount, 2);
  assert.equal(mid.earnedMarks, 2);

  const done = computeScanState(1);
  assert.equal(done.revealedCount, 4);
  assert.equal(done.earnedMarks, 3);
  assert.equal(done.totalMarks, 5);
  assert.equal(done.showHowToImprove, true);
  assert.equal(done.showModelAnswer, true);
});

test('Meet Pebby scripts cover all 5 required languages and quiz evaluates accurately', () => {
  assert.equal(LANGUAGES.length, 5);
  for (const lang of LANGUAGES) {
    assert.ok(PEBBY_SCRIPTS.explain.reply[lang.code].length > 20);
    assert.ok(PEBBY_SCRIPTS.solve.hint[lang.code].length > 15);
    assert.equal(PEBBY_SCRIPTS.solve.fullSteps[lang.code].length, 3);
    assert.ok(PEBBY_SCRIPTS.quiz.question[lang.code].length > 15);
  }

  const right = evaluateQuizAnswer(1, PEBBY_SCRIPTS.quiz.correctIndex);
  assert.equal(right.isCorrect, true);
  assert.equal(right.shouldCelebrate, true);

  const wrong = evaluateQuizAnswer(0, PEBBY_SCRIPTS.quiz.correctIndex);
  assert.equal(wrong.isCorrect, false);
  assert.equal(wrong.shouldCelebrate, false);
});

test('Pricing displays exact Free/Pro Rs values and Planner tasks add & toggle cleanly', () => {
  const monthly = getProPricingSummary('monthly');
  assert.equal(monthly.headlinePrice, '₹100');
  assert.ok(monthly.subline.includes('₹200/month'));

  const annual = getProPricingSummary('annual');
  assert.equal(annual.headlinePrice, '₹1,999');

  const initial = [{ id: 't1', title: 'Revise Real Numbers', dueLabel: 'Today', done: false }];
  const withNew = addPlannerTask(initial, 'Light Ray Diagrams', 'Fri');
  assert.equal(withNew.length, 2);
  assert.equal(withNew[1].title, 'Light Ray Diagrams');

  assert.equal(addPlannerTask(withNew, '   ', 'Sat').length, 2);

  const toggled = togglePlannerTask(withNew, 't1');
  assert.equal(toggled[0].done, true);
});

test('Navbar morphs cleanly at 80px and fades out in the last ~10% near footer', () => {
  assert.deepEqual(
    computeNavState({ scrollY: 40, lastScrollY: 0, reducedMotion: false, menuOpen: false, scrollProgress: 0.01 }),
    { isFloating: false, isHidden: false }
  );
  assert.deepEqual(
    computeNavState({ scrollY: 120, lastScrollY: 80, reducedMotion: false, menuOpen: false, scrollProgress: 0.1 }),
    { isFloating: true, isHidden: false }
  );
  assert.deepEqual(
    computeNavState({ scrollY: 4200, lastScrollY: 4100, reducedMotion: false, menuOpen: false, scrollProgress: 0.92 }),
    { isFloating: true, isHidden: true }
  );
  assert.deepEqual(
    computeNavState({ scrollY: 4200, lastScrollY: 4100, reducedMotion: false, menuOpen: true, scrollProgress: 0.95 }),
    { isFloating: true, isHidden: false }
  );
});

test('Subject Worlds cover 6 subjects with accurate live vs coming soon statuses and reflection ray obeys angle i = angle r', () => {
  assert.equal(SUBJECT_WORLDS.length, 6);
  const liveIds = SUBJECT_WORLDS.filter((s) => s.status === 'live').map((s) => s.id);
  assert.deepEqual(liveIds, ['maths', 'science']);

  assert.equal(resolveSubjectWorldIndex(0), 0);
  assert.equal(resolveSubjectWorldIndex(0.5), 3);
  assert.equal(resolveSubjectWorldIndex(1), 5);

  const ray45 = computeReflectionRay(45);
  assert.equal(ray45.incidentDeg, 45);
  assert.equal(ray45.reflectedDeg, 45);
  assert.equal(Math.round(160 - ray45.incidentStartX), Math.round(ray45.reflectedEndX - 160));
  assert.equal(ray45.incidentStartY, ray45.reflectedEndY);

  const clampedLow = computeReflectionRay(2);
  assert.equal(clampedLow.incidentDeg, 15);
  const clampedHigh = computeReflectionRay(88);
  assert.equal(clampedHigh.incidentDeg, 70);
});

test('Fix-it board tracks 5 sticky notes without duplicates and detects completion', () => {
  assert.equal(FIX_IT_NOTES.length, 5);
  let fixed: string[] = [];
  fixed = fixBoardNote(fixed, 'videos');
  fixed = fixBoardNote(fixed, 'videos'); // duplicate ignored
  assert.equal(fixed.length, 1);
  assert.equal(isFixItBoardComplete(fixed), false);

  for (const n of FIX_IT_NOTES) {
    fixed = fixBoardNote(fixed, n.id);
  }
  assert.equal(fixed.length, 5);
  assert.equal(isFixItBoardComplete(fixed), true);
});

test('Curtain footer sequence advances anticipation -> peek -> pop -> wave -> revealed and respects reducedMotion', () => {
  assert.equal(
    computeFooterStage({ revealProgress: 0.1, hasPlayedFull: false, timedPhase: 'idle', reducedMotion: false }),
    'anticipation'
  );
  assert.equal(
    computeFooterStage({ revealProgress: 0.4, hasPlayedFull: false, timedPhase: 'idle', reducedMotion: false }),
    'peek'
  );
  assert.equal(
    computeFooterStage({ revealProgress: 0.65, hasPlayedFull: false, timedPhase: 'idle', reducedMotion: false }),
    'pop'
  );
  assert.equal(
    computeFooterStage({ revealProgress: 0.65, hasPlayedFull: false, timedPhase: 'wave', reducedMotion: false }),
    'wave'
  );
  assert.equal(
    computeFooterStage({ revealProgress: 0.1, hasPlayedFull: false, timedPhase: 'idle', reducedMotion: true }),
    'revealed'
  );
});

test('New 8-chapter order front-loads Meet Pebby at Ch 3 (unpinned) and pins only Ch 4 & Ch 5 with proportional rail fill', () => {
  assert.equal(CHAPTERS_META.length, 8);
  assert.equal(DEMO_STEPS.length, 3);
  assert.deepEqual(
    CHAPTERS_META.map((c) => c.id),
    ['hero', 'demo', 'pebby', 'syllabus', 'swipe', 'tools', 'why-academe', 'pricing']
  );

  const pinnedChapterNumbers = CHAPTERS_META.filter((c) => c.isPinned).map((c) => c.number);
  assert.deepEqual(pinnedChapterNumbers, [4, 5]);

  // Chapter 4 (index 3, Subject Worlds) fills proportionally
  const segsCh4 = computeChapterRailSegments({
    activeIndex: 3,
    inFinale: false,
    pinnedProgress: 0.5,
  });
  assert.equal(segsCh4.length, 8);
  assert.equal(segsCh4[0].status, 'completed');
  assert.equal(segsCh4[1].status, 'completed');
  assert.equal(segsCh4[2].status, 'completed');
  assert.equal(segsCh4[3].status, 'current');
  assert.equal(segsCh4[3].fillRatio, 0.5);
  assert.equal(segsCh4[4].status, 'upcoming');

  const segsFinale = computeChapterRailSegments({
    activeIndex: 7,
    inFinale: true,
    pinnedProgress: 1,
  });
  assert.equal(segsFinale.every((s) => s.status === 'completed' && s.fillRatio === 1), true);
});

test('PageUp/PageDown navigation, sticky offset, and pixel pin distances compute cleanly without vh units', () => {
  assert.equal(getAdjacentChapterIndex(0, -1, 8), 0);
  assert.equal(getAdjacentChapterIndex(0, 1, 8), 1);
  assert.equal(getAdjacentChapterIndex(7, 1, 8), 7);
  assert.equal(getAdjacentChapterIndex(4, -1, 8), 3);

  assert.equal(computeStickyTopOffset(780, 900), 0);
  assert.equal(computeStickyTopOffset(900, 900), 0);
  assert.equal(computeStickyTopOffset(1450, 900), -550);

  // Shortened desktop pin distances from window.innerHeight
  assert.equal(computeSubjectWorldsPinDistance(900, 6), 1026);
  assert.equal(computeSwipePinDistance(900, 4), 680);
});

test('Hero secondary actions separate Get started (step 1 highlight, no autoplay) from Watch demo (muted autoplay)', () => {
  const getStarted = computeHeroAction('get-started');
  assert.equal(getStarted.targetId, 'demo');
  assert.equal(getStarted.highlightStep, 1);
  assert.equal(getStarted.autoPlayMuted, false);

  const watchDemo = computeHeroAction('watch-demo');
  assert.equal(watchDemo.targetId, 'demo');
  assert.equal(watchDemo.highlightStep, null);
  assert.equal(watchDemo.autoPlayMuted, true);
});

test('Get started interactive 3-step stepper responds cleanly to clicks and arrow keys', () => {
  assert.equal(resolveDemoStepperIndex(0, 'next', 3), 1);
  assert.equal(resolveDemoStepperIndex(2, 'next', 3), 0);
  assert.equal(resolveDemoStepperIndex(0, 'prev', 3), 2);
  assert.equal(resolveDemoStepperIndex(1, 2, 3), 2);
  assert.equal(resolveDemoStepperIndex(1, 9, 3), 2);
  assert.equal(resolveDemoStepperIndex(1, -2, 3), 0);
});

test('Full-screen desktop chapters compute exact pixel min-height and disable forcing on mobile or reduced motion', () => {
  assert.equal(computeChapterMinHeightPx(900, true, false), 900);
  assert.equal(computeChapterMinHeightPx(768, true, false), 768);
  assert.equal(computeChapterMinHeightPx(1080, true, false), 1080);
  assert.equal(computeChapterMinHeightPx(844, false, false), undefined);
  assert.equal(computeChapterMinHeightPx(900, true, true), undefined);
});

test('Card top shadow stays strictly invisible (opacity 0) at or below viewport bottom and fades in on entry', () => {
  assert.equal(computeCardEdgeShadowOpacity(950, 900), 0);
  assert.equal(computeCardEdgeShadowOpacity(900, 900), 0);
  assert.equal(computeCardEdgeShadowOpacity(864, 900, 72), 0.5);
  assert.equal(computeCardEdgeShadowOpacity(828, 900, 72), 1);
  assert.equal(computeCardEdgeShadowOpacity(200, 900, 72), 1);
});

test('Curtain footer restores exact 720px height and 0.58 pop threshold', () => {
  assert.equal(CURTAIN_FOOTER_HEIGHT, 720);
  assert.equal(
    computeFooterStage({ revealProgress: 0.57, hasPlayedFull: false, timedPhase: 'idle', reducedMotion: false }),
    'peek'
  );
  assert.equal(
    computeFooterStage({ revealProgress: 0.58, hasPlayedFull: false, timedPhase: 'idle', reducedMotion: false }),
    'pop'
  );
});


