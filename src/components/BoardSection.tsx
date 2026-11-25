import React, { useState } from 'react';
import { BookOpen, ArrowRight, ChevronDown } from 'lucide-react';
import { type BoardId, type ClassLevel } from '../data/academeData';
import { getSyllabusForSelection } from '../utils/logic';

const BOARDS: BoardId[] = ['CBSE', 'ICSE', 'ISC'];
const CLASSES: ClassLevel[] = [6, 7, 8, 9, 10, 11, 12];

interface BoardSectionProps {
  board: BoardId;
  classLevel: ClassLevel;
  switchNote: string | null;
  onBoardChange: (board: BoardId) => void;
  onClassChange: (cls: ClassLevel) => void;
}

export const BoardSection: React.FC<BoardSectionProps> = ({
  board,
  classLevel,
  switchNote,
  onBoardChange,
  onClassChange,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<'All' | 'Maths' | 'Science'>('All');
  const [showAllChapters, setShowAllChapters] = useState(false);

  const syllabus = getSyllabusForSelection(board, classLevel);
  const filteredChapters =
    subjectFilter === 'All'
      ? syllabus.chapters
      : syllabus.chapters.filter((ch) => ch.subject === subjectFilter);

  const visibleChapters = showAllChapters
    ? filteredChapters
    : filteredChapters.slice(0, 4);
  const hasMoreChapters = filteredChapters.length > 4;

  return (
    <section className="py-4 min-[900px]:pt-[84px] min-[900px]:pb-6 bg-[#DDF7E8] border-b-[3px] border-[#111111]">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 space-y-3 min-[900px]:space-y-4">
        {/* Compact One-Row Board & Class Selector Bar */}
        <div
          className="neo-card-sm bg-[#FFF8E1] px-4 py-3.5 sm:px-5 sm:py-4 space-y-3"
          data-reveal
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Title + Chapter Chip */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-white border-2 border-[#111111] shadow-[2px_2px_0_#111111] font-display font-bold text-[11px] text-[#15803D]">
                Chapter 4 · Subject worlds
              </span>
              <h2
                data-testid="syllabus-heading"
                className="font-display font-extrabold text-lg sm:text-xl text-[#111111] tracking-[-0.02em]"
              >
                Class {classLevel} {board} syllabus
              </h2>
            </div>

            {/* Inline Controls: Board + Class + Subject Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Board Buttons */}
              <div
                className="inline-flex items-center gap-1"
                role="group"
                aria-label="Select school board"
              >
                {BOARDS.map((b) => {
                  const active = board === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => onBoardChange(b)}
                      aria-pressed={active}
                      className={`px-3 py-1 rounded-full border-2 border-[#111111] font-display font-bold text-xs whitespace-nowrap transition-colors ${
                        active
                          ? 'bg-[#5B4BFF] text-white shadow-[2px_2px_0_#111111]'
                          : 'bg-white text-[#111111] hover:bg-[#EAE5FF]'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>

              <span className="hidden sm:inline-block w-px h-5 bg-[#111111]/25" aria-hidden="true" />

              {/* Class Buttons */}
              <div
                className="inline-flex flex-wrap items-center gap-1"
                role="group"
                aria-label="Select class"
              >
                {CLASSES.map((cls) => {
                  const active = classLevel === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => onClassChange(cls)}
                      aria-pressed={active}
                      className={`min-w-[34px] px-2 py-1 rounded-full border-2 border-[#111111] font-display font-bold text-xs tabular-nums whitespace-nowrap transition-colors ${
                        active
                          ? 'bg-[#FFA500] text-[#111111] shadow-[2px_2px_0_#111111]'
                          : 'bg-white text-[#111111] hover:bg-[#FFF1B8]'
                      }`}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>

              <span className="hidden sm:inline-block w-px h-5 bg-[#111111]/25" aria-hidden="true" />

              {/* Subject Filter */}
              <div
                className="inline-flex items-center gap-1 p-0.5 bg-white border-2 border-[#111111] rounded-full"
                role="group"
                aria-label="Filter chapters by subject"
              >
                {(['All', 'Maths', 'Science'] as const).map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => setSubjectFilter(subj)}
                    aria-pressed={subjectFilter === subj}
                    className={`px-2.5 py-0.5 rounded-full font-display font-bold text-[11px] whitespace-nowrap transition-colors ${
                      subjectFilter === subj
                        ? 'bg-[#111111] text-white'
                        : 'text-[#111111] hover:bg-[#EEF0F8]'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {switchNote && (
            <p
              role="status"
              className="text-xs font-semibold text-[#111111] bg-[#FFF1B8] border-2 border-[#111111] rounded-xl px-3 py-1.5"
            >
              {switchNote}
            </p>
          )}
        </div>

        {/* Compact 4-Chapter Sample Row + "See all" Toggle */}
        <div
          key={`${board}-${classLevel}-${subjectFilter}`}
          data-testid="syllabus-chapter-list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 min-[900px]:gap-3"
        >
          {visibleChapters.map((ch) => (
            <div
              key={`${ch.subject}-${ch.number}-${ch.title}`}
              className="bg-white border-[2.5px] border-[#111111] rounded-[16px] shadow-[3px_3px_0_#111111] p-2.5 min-[900px]:p-3.5 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between gap-2 text-[11px] text-[#111111]/70 font-semibold">
                <span className="font-mono font-bold text-[#111111]">{ch.number}</span>
                <span>
                  {ch.subject} · {ch.deckMinutes}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-bold text-sm leading-snug text-[#111111] line-clamp-2">
                  {ch.title}
                </h3>
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: ch.pastel }}
                  className="w-7 h-7 rounded-lg border-2 border-[#111111] flex items-center justify-center shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#111111]" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Compact Footer Strip with "See all" Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#111111]/80">
          <span className="font-medium">
            {syllabus.focusLabel} · New lessons added regularly.
          </span>

          <div className="flex items-center gap-3">
            {hasMoreChapters && (
              <button
                type="button"
                data-testid="syllabus-see-all-btn"
                aria-expanded={showAllChapters}
                onClick={() => setShowAllChapters((prev) => !prev)}
                className="inline-flex items-center gap-1 font-display font-bold text-xs text-[#111111] bg-white hover:bg-[#FFF8E1] border-2 border-[#111111] rounded-full px-3 py-1 shadow-[2px_2px_0_#111111]"
              >
                <span>
                  {showAllChapters
                    ? 'Show fewer chapters'
                    : `See all ${filteredChapters.length} chapters`}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showAllChapters ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            )}
            <a
              href="#swipe"
              className="inline-flex items-center gap-1 font-display font-bold text-xs text-[#5B4BFF] hover:underline whitespace-nowrap"
            >
              Try a swipe deck <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
