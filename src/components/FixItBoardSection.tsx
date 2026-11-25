import React, { useState } from 'react';
import { RotateCcw, Sparkles, Check, Lightbulb, ChevronDown } from 'lucide-react';
import { FIX_IT_NOTES, SAME_QUESTION_DEMO } from '../data/academeData';
import { fixBoardNote, isFixItBoardComplete } from '../utils/logic';
import { PebbyMascot } from './PebbyMascot';

const BOARD_CONFETTI = [
  { tx: '-110px', ty: '-75px', rot: '-35deg', color: '#FFA500' },
  { tx: '-55px', ty: '-100px', rot: '25deg', color: '#5B4BFF' },
  { tx: '15px', ty: '-105px', rot: '-20deg', color: '#9BF0C2' },
  { tx: '72px', ty: '-85px', rot: '42deg', color: '#FFE3EC' },
  { tx: '115px', ty: '-45px', rot: '68deg', color: '#DFF1FF' },
  { tx: '-95px', ty: '-25px', rot: '-55deg', color: '#FFF1B8' },
];

export const FixItBoardSection: React.FC = () => {
  const [fixedIds, setFixedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isDropHover, setIsDropHover] = useState(false);
  const [stampingNow, setStampingNow] = useState(false);
  const [sparkleId, setSparkleId] = useState<string | null>(null);

  // "Same question, two ways" collapsed by default inside the Fix-it board panel
  const [showCompare, setShowCompare] = useState(false);
  const [compareMode, setCompareMode] = useState<'typical' | 'academe'>('academe');
  const [showSteps, setShowSteps] = useState(false);

  const allFixed = isFixItBoardComplete(fixedIds, FIX_IT_NOTES.length);

  const handleFixNote = (noteId: string) => {
    if (fixedIds.includes(noteId)) return;
    setStampingNow(true);
    setSparkleId(noteId);
    setFixedIds((prev) => fixBoardNote(prev, noteId));

    window.setTimeout(() => setStampingNow(false), 380);
    window.setTimeout(() => {
      setSparkleId((cur) => (cur === noteId ? null : cur));
    }, 650);
  };

  const handleReset = () => {
    setFixedIds([]);
    setSparkleId(null);
  };

  return (
    <section className="pt-7 min-[900px]:pt-[84px] pb-3 bg-white">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 space-y-4">
        {/* Heading + Progress Counter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-reveal>
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF0F8] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] font-display font-bold text-xs text-[#5B4BFF]">
              Chapter 7 · Fix-it &amp; Trust
            </span>
            <h2
              className="font-display font-extrabold text-[#111111] leading-[1.08] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(1.85rem, 3.4vw, 2.9rem)', textWrap: 'balance' }}
            >
              Fix the way you study.
            </h2>
            <p className="text-sm sm:text-base text-[#111111]/80 leading-relaxed">
              Drag any messy study-app habit onto Pebby’s rubber stamp — or tap a note (or press Enter) to stamp it fixed.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span
              data-testid="fix-it-counter"
              className={`font-mono font-bold text-xs sm:text-sm tabular-nums px-4 py-1.5 rounded-full border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] ${
                allFixed ? 'bg-[#9BF0C2] text-[#111111]' : 'bg-[#FFA500] text-[#111111]'
              }`}
            >
              {fixedIds.length} of {FIX_IT_NOTES.length} fixed
            </span>
            {fixedIds.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="neo-btn-sm inline-flex items-center gap-1.5 bg-white hover:bg-[#FFF8E1] px-3.5 py-1.5 text-xs font-display font-bold text-[#111111]"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Interactive Corkboard Surface */}
        <div
          data-testid="fix-it-board"
          className="neo-card bg-corkboard p-4 sm:p-5 relative overflow-hidden"
          data-reveal
        >
          {/* All-5-Fixed Confetti Moment */}
          {allFixed && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 z-30"
            >
              {BOARD_CONFETTI.map((c, idx) => (
                <span
                  key={idx}
                  style={
                    {
                      '--tx': c.tx,
                      '--ty': c.ty,
                      '--rot': c.rot,
                      backgroundColor: c.color,
                    } as React.CSSProperties
                  }
                  className="animate-confetti absolute w-4 h-4 rounded-sm border-2 border-[#111111]"
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-[900px]:gap-6 items-center">
            {/* Scattered Rotated Sticky Notes (5 Cards) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-[900px]:gap-4">
              {FIX_IT_NOTES.map((note, idx) => {
                const isFixed = fixedIds.includes(note.id);
                const isSparkling = sparkleId === note.id;

                return (
                  <div
                    key={note.id}
                    className={`flip-perspective ${idx === 3 ? 'sm:col-span-1 lg:col-span-1' : ''} ${
                      idx === 4 ? 'sm:col-span-2 lg:col-span-2' : ''
                    }`}
                  >
                    <button
                      type="button"
                      draggable={!isFixed}
                      onDragStart={(e) => {
                        setDraggingId(note.id);
                        e.dataTransfer.setData('text/plain', note.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setIsDropHover(false);
                      }}
                      onClick={() => handleFixNote(note.id)}
                      aria-pressed={isFixed}
                      aria-label={
                        isFixed
                          ? `Fixed: ${note.problem} replaced by ${note.solution}`
                          : `Fix study problem: ${note.problem}. Press Enter or drag onto Pebby.`
                      }
                      style={{
                        transform: isFixed
                          ? 'rotate(0deg)'
                          : `rotate(${note.rotation}deg)`,
                      }}
                      className="group relative w-full min-h-[112px] min-[900px]:min-h-[132px] text-left transition-transform duration-300 hover:-translate-y-1 focus-visible:rounded-[20px]"
                    >
                      {/* Push-pin dot on corkboard */}
                      <span
                        aria-hidden="true"
                        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 w-4 h-4 rounded-full border-2 border-[#111111] shadow-[2px_2px_0_#111111] ${
                          isFixed ? 'bg-[#9BF0C2]' : 'bg-[#FF6B9D]'
                        }`}
                      />

                      {/* Micro-celebration sparkle burst */}
                      {isSparkling && (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-3 -right-2 z-30 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFA500] border-2 border-[#111111] animate-bounce"
                        >
                          <Sparkles className="w-4 h-4 text-[#111111]" />
                        </span>
                      )}

                      <div className={`flip-card-inner relative w-full h-full min-h-[112px] min-[900px]:min-h-[132px] ${isFixed ? 'is-flipped' : ''}`}>
                        {/* FRONT FACE: Common Study-App Problem */}
                        <div
                          style={{ backgroundColor: note.stickyBg }}
                          className="flip-face absolute inset-0 border-[3px] border-[#111111] rounded-[18px] shadow-[5px_5px_0_#111111] p-4 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <span className="font-mono text-[10px] font-bold text-[#111111]/60">
                              Problem 0{idx + 1}
                            </span>
                            <p className="font-display font-extrabold text-base leading-snug text-[#111111]">
                              “{note.problem}”
                            </p>
                          </div>
                          <span className="text-xs font-bold text-[#5B4BFF] group-hover:underline">
                            Tap or drag to Pebby →
                          </span>
                        </div>

                        {/* BACK FACE: Stamped FIXED + ACADEMe Solution */}
                        <div
                          style={{ backgroundColor: note.flippedBg }}
                          className="flip-face flip-face-back absolute inset-0 border-[3px] border-[#111111] rounded-[18px] shadow-[5px_5px_0_#111111] p-4 flex flex-col justify-between"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="inline-flex items-center gap-1 bg-[#FFA500] border-2 border-[#111111] shadow-[2.5px_2.5px_0_#111111] px-2.5 py-0.5 rounded-md font-mono font-extrabold text-[11px] tracking-wider text-[#111111] animate-stamp-slam">
                              <Check className="w-3 h-3" aria-hidden="true" />
                              FIXED
                            </span>
                            <span className="font-display font-bold text-[11px] text-[#5B4BFF]">
                              ACADEMe
                            </span>
                          </div>
                          <p className="font-display font-extrabold text-lg leading-snug text-[#111111]">
                            {note.solution}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pebby Stamp Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDropHover(true);
              }}
              onDragLeave={() => setIsDropHover(false)}
              onDrop={(e) => {
                e.preventDefault();
                const dropped = e.dataTransfer.getData('text/plain') || draggingId;
                setIsDropHover(false);
                setDraggingId(null);
                if (dropped) handleFixNote(dropped);
              }}
              className={`lg:col-span-4 rounded-[22px] border-[3px] border-dashed border-[#111111] p-4 flex flex-col items-center text-center gap-2 transition-all ${
                isDropHover
                  ? 'bg-[#FFA500]/35 scale-[1.02]'
                  : 'bg-[#FFF8E1]/90'
              }`}
            >
              <PebbyMascot
                pose={allFixed ? 'cheering' : stampingNow ? 'stamping' : 'waving'}
                prop={allFixed ? 'none' : 'stamp'}
                className="w-28 h-28 min-[900px]:w-36 min-[900px]:h-36"
                trackCursor={true}
                ariaLabel="Pebby holding a big FIXED rubber stamp"
              />
              <p className="font-display font-extrabold text-base text-[#111111]">
                {allFixed
                  ? 'All five habits stamped fixed.'
                  : isDropHover
                  ? 'Drop here to stamp FIXED'
                  : 'Drop a sticky note here (or tap any note)'}
              </p>
              <p className="text-xs text-[#111111]/75 max-w-[26ch]">
                Pebby stamps away the parts of study apps that waste your evening.
              </p>
            </div>
          </div>

          {/* Closing Banner When All 5 Notes Are Fixed */}
          {allFixed && (
            <div
              data-testid="fix-it-closing-line"
              role="status"
              className="mt-5 bg-[#5B4BFF] text-white border-[3px] border-[#111111] rounded-[18px] shadow-[4px_4px_0_#111111] px-5 py-3 text-center"
            >
              <p className="font-display font-extrabold text-base sm:text-lg">
                The syllabus is the product. Pebby is the tutor inside it.
              </p>
            </div>
          )}

          {/* Collapsed Toggle Inside the Fix-it Board Panel: "Same question, two ways" */}
          <div className="mt-5 pt-4 border-t-2 border-[#111111]/20">
            <button
              type="button"
              data-testid="same-question-toggle"
              aria-expanded={showCompare}
              aria-controls="same-question-panel"
              onClick={() => setShowCompare((prev) => !prev)}
              className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2.5 bg-white hover:bg-[#FFF8E1] border-[2.5px] border-[#111111] rounded-full shadow-[3px_3px_0_#111111] px-4 py-2 font-display font-bold text-xs sm:text-sm text-[#111111]"
            >
              <span className="text-[#5B4BFF]">Same question, two ways</span>
              <span className="text-[#111111]/70 hidden sm:inline">
                — Compare Typical app vs ACADEMe
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#111111] transition-transform ${
                  showCompare ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {showCompare && (
              <div
                id="same-question-panel"
                className="mt-4 bg-white border-[2.5px] border-[#111111] rounded-[20px] shadow-[4px_4px_0_#111111] p-4 sm:p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#111111]/12">
                  <div>
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-[#111111]">
                      {SAME_QUESTION_DEMO.question}
                    </h3>
                    <p className="text-xs text-[#111111]/65">{SAME_QUESTION_DEMO.chapter}</p>
                  </div>

                  <div
                    role="group"
                    aria-label="Compare Typical app vs ACADEMe answer"
                    className="inline-flex items-center p-1 bg-[#EEF0F8] border-[2.5px] border-[#111111] rounded-full self-start sm:self-auto shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => setCompareMode('typical')}
                      aria-pressed={compareMode === 'typical'}
                      className={`px-3.5 py-1 rounded-full font-display font-bold text-xs whitespace-nowrap transition-colors ${
                        compareMode === 'typical'
                          ? 'bg-[#111111] text-white'
                          : 'text-[#111111] hover:bg-white'
                      }`}
                    >
                      Typical app
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCompareMode('academe');
                        setShowSteps(false);
                      }}
                      aria-pressed={compareMode === 'academe'}
                      className={`px-3.5 py-1 rounded-full font-display font-bold text-xs whitespace-nowrap transition-colors ${
                        compareMode === 'academe'
                          ? 'bg-[#5B4BFF] text-white'
                          : 'text-[#111111] hover:bg-white'
                      }`}
                    >
                      ACADEMe
                    </button>
                  </div>
                </div>

                {compareMode === 'typical' ? (
                  <div
                    data-testid="same-question-typical"
                    className="bg-[#EEF0F8] border-2 border-[#111111] rounded-2xl p-3.5 space-y-1.5"
                  >
                    <p className="font-mono text-xs font-bold text-[#111111]/60">
                      Instant answer dump (nothing explained):
                    </p>
                    <p className="font-mono text-sm text-[#111111]">
                      {SAME_QUESTION_DEMO.typicalDump}
                    </p>
                  </div>
                ) : (
                  <div
                    data-testid="same-question-academe"
                    className="bg-[#FFF8E1] border-2 border-[#111111] rounded-2xl p-3.5 space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-6 h-6 rounded-full bg-[#FFA500] border-2 border-[#111111] flex items-center justify-center shrink-0">
                        <Lightbulb className="w-3.5 h-3.5 text-[#111111]" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-semibold text-[#111111] leading-snug">
                        {SAME_QUESTION_DEMO.academeHint}
                      </p>
                    </div>

                    {!showSteps ? (
                      <button
                        type="button"
                        onClick={() => setShowSteps(true)}
                        className="neo-btn-sm bg-[#5B4BFF] hover:bg-[#4435E6] text-white font-display font-bold text-xs px-4 py-1.5"
                      >
                        Reveal step-by-step
                      </button>
                    ) : (
                      <ol
                        data-testid="same-question-steps"
                        className="bg-white border-2 border-[#111111] rounded-xl p-3 space-y-1 text-sm text-[#111111]"
                      >
                        {SAME_QUESTION_DEMO.academeSteps.map((step) => (
                          <li key={step} className="leading-snug">
                            {step}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
