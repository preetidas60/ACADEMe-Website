import React, { useState } from 'react';
import {
  Camera,
  FolderKanban,
  Layers,
  Check,
  ShieldCheck,
  EyeOff,
  CameraOff,
  Flag,
  Trash2,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { SAFETY_PILLARS, WEEKLY_PROGRESS_BOARD } from '../data/academeData';
import { addPlannerTask, togglePlannerTask, type PlannerTask } from '../utils/logic';
import { FixItBoardSection } from './FixItBoardSection';

type ScanAction = 'Solve' | 'Check' | 'Notes' | 'Ask';

const SCAN_PREVIEW_COPY: Record<ScanAction, { title: string; output: string }> = {
  Solve: {
    title: 'Hint-first step guide',
    output: 'Starts with a nudge on grouping terms in x² − 5x + 6 before revealing the full steps.',
  },
  Check: {
    title: 'Point-by-point marking',
    output: 'Checks your handwritten working against board marking steps and flags missing units or laws.',
  },
  Notes: {
    title: 'Turn pages into short decks',
    output: 'Summarises neat classroom notebook pages into swipeable revision cards (Pro).',
  },
  Ask: {
    title: 'Ask Pebby in your language',
    output: 'Explains a confusing textbook paragraph in English, Hindi, Telugu, Tamil, or Bengali.',
  },
};

const INITIAL_PLANNER_TASKS: PlannerTask[] = [
  { id: 't-1', title: 'Real Numbers · 6 min deck', dueLabel: 'Today', done: true },
  { id: 't-2', title: 'Reflection of Light · ray diagrams', dueLabel: 'Today', done: false },
];

const INITIAL_QUEUE = [
  { id: 'q1', title: 'HCF × LCM = a × b', interval: 'Day 1', pastel: '#EAE5FF' },
  { id: 'q2', title: '1/v + 1/u = 1/f (Sign rule)', interval: 'Day 3', pastel: '#DDF7E8' },
  { id: 'q3', title: 'Zeroes of ax² + bx + c', interval: 'Day 7', pastel: '#FFF1B8' },
];

const EXTRA_CARDS = [
  { id: 'q4', title: 'Discriminant D = b² − 4ac', interval: 'Queued · Day 1', pastel: '#DFF1FF' },
  { id: 'q5', title: 'Magnification m = −v/u', interval: 'Queued · Day 1', pastel: '#FFE3EC' },
];

/**
 * CHAPTER 6: Scan, Folders & Planner, Revision Bento (Sky Blue #DFF1FF)
 */
export const StudyToolsChapter: React.FC = () => {
  const [scanAction, setScanAction] = useState<ScanAction>('Solve');
  const [tasks, setTasks] = useState<PlannerTask[]>(INITIAL_PLANNER_TASKS);
  const [topicInput, setTopicInput] = useState('');
  const [dateInput, setDateInput] = useState('Fri, Unit Test');
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [extraIdx, setExtraIdx] = useState(0);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    setTasks((prev) => addPlannerTask(prev, topicInput, dateInput));
    setTopicInput('');
  };

  const handleKeepCard = () => {
    const nextCard = EXTRA_CARDS[extraIdx % EXTRA_CARDS.length];
    const stamped = { ...nextCard, id: `${nextCard.id}-${extraIdx}` };
    setQueue((prev) => [stamped, ...prev.slice(0, 2)]);
    setExtraIdx((i) => i + 1);
  };

  return (
    <section
      aria-labelledby="study-tools-heading"
      className="pt-7 pb-6 min-[900px]:pt-[84px] min-[900px]:pb-5 bg-[#DFF1FF] flex items-center"
    >
      <div className="mx-auto max-w-[1240px] w-full px-4 sm:px-6 space-y-4 min-[900px]:space-y-5">
        <div className="max-w-2xl space-y-2" data-reveal>
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] font-display font-bold text-xs text-[#5B4BFF]">
            Chapter 6 · Study tools
          </span>
          <h2
            id="study-tools-heading"
            className="font-display font-extrabold text-[#111111] leading-[1.08] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(1.85rem, 3.3vw, 2.8rem)', textWrap: 'balance' }}
          >
            Scan, plan, and keep what matters.
          </h2>
          <p className="text-sm sm:text-base text-[#111111]/80 leading-relaxed">
            Three practical study tools that fit cleanly around school homework, class tests, and board exams.
          </p>
        </div>

        {/* 3-Card Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-[900px]:gap-5">
          {/* Card 1: SCAN */}
          <div
            data-reveal
            className="lg:col-span-5 neo-card neo-card-lift bg-[#EAE5FF] p-4 min-[900px]:p-5 flex flex-col justify-between gap-3 min-[900px]:gap-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#5B4BFF]" aria-hidden="true" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[#111111]">Scan</h3>
              <p className="text-sm text-[#111111]/85 leading-relaxed">
                Point your phone at a textbook question or handwritten page, then choose what you need next.
              </p>
            </div>

            <div className="bg-white border-[2.5px] border-[#111111] rounded-[20px] p-4 shadow-[4px_4px_0_#111111] space-y-3.5">
              <div
                className="grid grid-cols-4 gap-1.5"
                role="group"
                aria-label="Choose scan action"
              >
                {(['Solve', 'Check', 'Notes', 'Ask'] as ScanAction[]).map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setScanAction(action)}
                    aria-pressed={scanAction === action}
                    className={`py-2 rounded-xl border-2 border-[#111111] font-display font-bold text-xs transition-colors ${
                      scanAction === action
                        ? 'bg-[#5B4BFF] text-white'
                        : 'bg-[#EEF0F8] text-[#111111] hover:bg-[#FFF8E1]'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
              <div className="bg-[#FFF8E1] border-2 border-[#111111] rounded-xl p-3 space-y-1">
                <p className="font-display font-bold text-xs text-[#5B4BFF]">
                  {scanAction} · {SCAN_PREVIEW_COPY[scanAction].title}
                </p>
                <p className="text-xs text-[#111111]/85 leading-snug">
                  {SCAN_PREVIEW_COPY[scanAction].output}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: FOLDERS & PLANNER */}
          <div
            data-reveal
            className="lg:col-span-4 neo-card neo-card-lift bg-[#FFF8E1] p-4 min-[900px]:p-5 flex flex-col justify-between gap-3 min-[900px]:gap-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-[#D97706]" aria-hidden="true" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[#111111]">
                Folders &amp; planner
              </h3>
              <p className="text-sm text-[#111111]/85 leading-relaxed">
                Give a test a name and a date — ACADEMe turns it into a calm Today checklist.
              </p>
            </div>

            <div className="bg-white border-[2.5px] border-[#111111] rounded-[20px] p-4 shadow-[4px_4px_0_#111111] space-y-3">
              <form onSubmit={handleAddTask} className="flex gap-2">
                <label htmlFor="planner-topic-input" className="sr-only">
                  Add exam topic
                </label>
                <input
                  id="planner-topic-input"
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g. Quadratic Equations"
                  className="flex-1 min-w-0 px-3 py-2 text-xs font-medium bg-[#EEF0F8] border-2 border-[#111111] rounded-xl text-[#111111] placeholder:text-[#111111]/50"
                />
                <button
                  type="submit"
                  aria-label="Add topic to Today checklist"
                  className="px-3 py-2 bg-[#FFA500] hover:bg-[#ff9500] border-2 border-[#111111] rounded-xl text-[#111111] shrink-0"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] font-bold text-[#111111]/65">
                <span>Today checklist</span>
                <button
                  type="button"
                  onClick={() =>
                    setDateInput((d) =>
                      d === 'Fri, Unit Test' ? 'Mon, Pre-Board' : 'Fri, Unit Test'
                    )
                  }
                  className="text-[#5B4BFF] hover:underline"
                >
                  Target: {dateInput}
                </button>
              </div>

              <ul className="space-y-2 max-h-[130px] overflow-y-auto pr-0.5">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => setTasks((prev) => togglePlannerTask(prev, task.id))}
                      className="w-full text-left flex items-center justify-between gap-2 p-2 rounded-xl border-2 border-[#111111] bg-[#FFF8E1]/60 hover:bg-[#FFF8E1] text-xs"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-4 h-4 rounded-md border-2 border-[#111111] flex items-center justify-center shrink-0 ${
                            task.done ? 'bg-[#9BF0C2]' : 'bg-white'
                          }`}
                        >
                          {task.done && <Check className="w-3 h-3 text-[#111111]" aria-hidden="true" />}
                        </span>
                        <span
                          className={`font-semibold truncate ${
                            task.done ? 'line-through text-[#111111]/55' : 'text-[#111111]'
                          }`}
                        >
                          {task.title}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#111111]/65 shrink-0">
                        {task.dueLabel}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 3: REVISION */}
          <div
            data-reveal
            className="lg:col-span-3 neo-card neo-card-lift bg-[#DDF7E8] p-4 min-[900px]:p-5 flex flex-col justify-between gap-3 min-[900px]:gap-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center">
                <Layers className="w-6 h-6 text-[#15803D]" aria-hidden="true" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[#111111]">Revision</h3>
              <p className="text-sm text-[#111111]/85 leading-relaxed">
                Any formula or rule you keep drops automatically into a spaced revision queue.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="space-y-2">
                {queue.map((card, i) => (
                  <div
                    key={card.id}
                    style={{
                      backgroundColor: card.pastel,
                      transform: `translateY(${i * 1}px)`,
                    }}
                    className="border-2 border-[#111111] rounded-2xl p-3 shadow-[3px_3px_0_#111111] flex items-center justify-between gap-2 transition-all"
                  >
                    <span className="font-display font-bold text-xs text-[#111111] truncate">
                      {card.title}
                    </span>
                    <span className="font-mono text-[10px] font-bold bg-white border border-[#111111] rounded-full px-2 py-0.5 shrink-0">
                      {card.interval}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleKeepCard}
                className="neo-btn-sm w-full py-2.5 bg-white hover:bg-[#FFF8E1] font-display font-bold text-xs text-[#111111]"
              >
                Keep another card
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * CHAPTER 7: Fix-it Board + Compact Trust Band (Crisp White #FFFFFF)
 * Combines the Fix-it board with ONE compact Trust band containing all 5 Safe for minors points,
 * a small My Progress weekly board preview (in-app, never promising a parent dashboard/report),
 * and the line "No ads. Fair price. Visible progress."
 */
export const FixItAndTrustChapter: React.FC = () => {
  const safetyIcons = [ShieldCheck, EyeOff, CameraOff, Flag, Trash2];
  const [activePillarId, setActivePillarId] = useState<string | null>(null);
  const [progressExpanded, setProgressExpanded] = useState(false);

  const selectedPillar = SAFETY_PILLARS.find((p) => p.id === activePillarId) ?? null;

  return (
    <div className="bg-white">
      <FixItBoardSection />

      {/* Single Compact Trust Row directly beneath Fix-it Board inside Chapter 7 */}
      <section
        aria-labelledby="trust-band-heading"
        data-testid="compact-trust-band"
        className="pt-2 pb-6 min-[900px]:pb-5 bg-white"
      >
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="neo-card-sm bg-[#FFF8E1] p-4 sm:p-5 space-y-3.5" data-reveal>
            {/* Compact Single Row: Headline + 5 Safety Chips + Expandable My Progress Preview */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              {/* Left: Title + 5 clickable safety chips */}
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3
                    id="trust-band-heading"
                    className="font-display font-extrabold text-lg sm:text-xl text-[#111111] leading-tight"
                  >
                    No ads. Fair price. Visible progress.
                  </h3>
                  <span className="font-display font-bold text-[11px] uppercase tracking-wider text-[#15803D]">
                    Safe for minors
                  </span>
                </div>

                <div className="flex flex-wrap gap-2" role="group" aria-label="Safety guarantees">
                  {SAFETY_PILLARS.map((pillar, idx) => {
                    const Icon = safetyIcons[idx];
                    const isSelected = activePillarId === pillar.id;
                    return (
                      <button
                        key={pillar.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          setActivePillarId((cur) => (cur === pillar.id ? null : pillar.id))
                        }
                        style={{ backgroundColor: isSelected ? pillar.bg : '#FFFFFF' }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#111111] font-display font-bold text-xs text-[#111111] transition-all ${
                          isSelected
                            ? 'shadow-[2px_2px_0_#111111]'
                            : 'hover:bg-[#EEF0F8]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{pillar.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Compact My Progress Preview Button (expands on click) */}
              <button
                type="button"
                data-testid="my-progress-expand-btn"
                aria-expanded={progressExpanded}
                aria-controls="my-progress-expanded-panel"
                onClick={() => setProgressExpanded((prev) => !prev)}
                className="shrink-0 bg-white hover:bg-[#EAE5FF]/40 border-[2.5px] border-[#111111] rounded-[18px] shadow-[3px_3px_0_#111111] px-4 py-2.5 flex items-center justify-between gap-3 text-left transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="font-display font-extrabold text-xs text-[#111111]">
                    My Progress · Weekly board
                  </p>
                  <p className="font-mono text-[11px] font-bold text-[#5B4BFF] tabular-nums">
                    {WEEKLY_PROGRESS_BOARD.summary.daysStudied} · {WEEKLY_PROGRESS_BOARD.summary.totalTime} · {WEEKLY_PROGRESS_BOARD.summary.decksFinished}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-[#111111] bg-[#DDF7E8] border-2 border-[#111111] rounded-full px-2.5 py-0.5 shrink-0">
                  <span>{progressExpanded ? 'Hide' : 'Preview'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      progressExpanded ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </div>

            {/* Selected Safety Chip Detail */}
            {selectedPillar && (
              <p
                role="status"
                className="text-xs font-medium text-[#111111] bg-white border-2 border-[#111111] rounded-xl px-3.5 py-2"
              >
                <strong className="font-display font-bold">{selectedPillar.title}:</strong>{' '}
                {selectedPillar.description}
              </p>
            )}

            {/* Expanded In-App My Progress Weekly Board */}
            {progressExpanded && (
              <div
                id="my-progress-expanded-panel"
                data-testid="my-progress-expanded-panel"
                className="pt-3 border-t-2 border-[#111111]/15 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                {/* 7 Study Days Strip + Summary */}
                <div className="md:col-span-7 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-display font-bold text-[#111111]">
                      In-app weekly view ({WEEKLY_PROGRESS_BOARD.weekLabel})
                    </span>
                    <span className="text-[11px] text-[#111111]/70">
                      Open together on the student’s phone — no tracking bloat.
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {WEEKLY_PROGRESS_BOARD.studyDays.map((d) => (
                      <div
                        key={d.day}
                        className={`rounded-xl border-2 border-[#111111] py-1.5 px-1 text-center space-y-1 ${
                          d.done ? 'bg-[#EAE5FF]' : 'bg-white'
                        }`}
                      >
                        <p className="font-display font-bold text-[10px] text-[#111111]">{d.day}</p>
                        <div
                          className={`mx-auto w-5 h-5 rounded-full border-2 border-[#111111] flex items-center justify-center ${
                            d.done ? 'bg-[#9BF0C2]' : 'bg-[#EEF0F8]'
                          }`}
                        >
                          {d.done && <Check className="w-3 h-3 text-[#111111]" aria-hidden="true" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject Progress Bars + Compact Stats */}
                <div className="md:col-span-5 bg-white border-2 border-[#111111] rounded-2xl p-3.5 space-y-2.5">
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                    <span className="bg-[#FFF8E1] border border-[#111111] rounded-lg py-1 inline-flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      {WEEKLY_PROGRESS_BOARD.summary.daysStudied}
                    </span>
                    <span className="bg-[#DFF1FF] border border-[#111111] rounded-lg py-1 inline-flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {WEEKLY_PROGRESS_BOARD.summary.totalTime}
                    </span>
                    <span className="bg-[#DDF7E8] border border-[#111111] rounded-lg py-1 inline-flex items-center justify-center gap-1">
                      <BookOpen className="w-3 h-3" aria-hidden="true" />
                      {WEEKLY_PROGRESS_BOARD.summary.decksFinished}
                    </span>
                  </div>
                  {WEEKLY_PROGRESS_BOARD.subjects.map((subj) => (
                    <div key={subj.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-display font-bold text-[#111111] truncate">
                          {subj.name}{' '}
                          <span className="font-normal text-[#111111]/65">· {subj.chapter}</span>
                        </span>
                        <span className="font-mono font-bold text-[#111111] tabular-nums ml-2">
                          {subj.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#EEF0F8] border border-[#111111] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${subj.progress}%`, backgroundColor: subj.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
