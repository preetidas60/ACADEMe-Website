export type BoardId = 'CBSE' | 'ICSE' | 'ISC';
export type ClassLevel = 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'bn';
export type PebbyTabId = 'explain' | 'solve' | 'quiz' | 'check';

export interface ChapterMeta {
  number: number;
  id: string;
  shortTitle: string;
  chipLabel: string;
  bg: string;
  isPinned?: boolean;
}

export const CHAPTERS_META: ChapterMeta[] = [
  { number: 1, id: 'hero', shortTitle: 'Welcome', chipLabel: 'Chapter 1 · Welcome', bg: '#FFF8E1', isPinned: false },
  { number: 2, id: 'demo', shortTitle: 'Watch the demo', chipLabel: 'Chapter 2 · Watch the demo', bg: '#EAE5FF', isPinned: false },
  { number: 3, id: 'pebby', shortTitle: 'Meet Pebby', chipLabel: 'Chapter 3 · Meet Pebby', bg: '#FFE3EC', isPinned: false },
  { number: 4, id: 'syllabus', shortTitle: 'Subject worlds', chipLabel: 'Chapter 4 · Subject worlds', bg: '#DDF7E8', isPinned: true },
  { number: 5, id: 'swipe', shortTitle: 'Learn by swiping', chipLabel: 'Chapter 5 · Learn by swiping', bg: '#FFF1B8', isPinned: true },
  { number: 6, id: 'tools', shortTitle: 'Study tools', chipLabel: 'Chapter 6 · Study tools', bg: '#DFF1FF', isPinned: false },
  { number: 7, id: 'why-academe', shortTitle: 'Fix-it & Trust', chipLabel: 'Chapter 7 · Fix-it & Trust', bg: '#FFFFFF', isPinned: false },
  { number: 8, id: 'pricing', shortTitle: 'Before you start', chipLabel: 'Chapter 8 · Before you start', bg: '#EEF0F8', isPinned: false },
];

export const DEMO_STEPS = [
  {
    step: 1,
    title: 'Pick your class, board and language.',
    description: 'Class 6–12, CBSE / ICSE / ISC, five languages for Pebby.',
  },
  {
    step: 2,
    title: 'Swipe your first lesson.',
    description: '5–8 minute decks with quick checks.',
  },
  {
    step: 3,
    title: 'Ask Pebby anything.',
    description: 'Explain, Solve, Quiz me.',
  },
];

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'syllabus', label: 'Syllabus', href: '#syllabus' },
  { id: 'swipe', label: 'Lessons', href: '#swipe' },
  { id: 'pebby', label: 'Pebby', href: '#pebby' },
  { id: 'pricing', label: 'Pricing', href: '#pricing' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
];

export type SubjectWorldId =
  | 'maths'
  | 'science'
  | 'social'
  | 'english'
  | 'hindi'
  | 'sanskrit';

export interface SubjectWorldItem {
  id: SubjectWorldId;
  name: string;
  pastel: string;
  accent: string;
  status: 'live' | 'soon';
  statusLabel: string;
  tagline: string;
  pebbyCaption: string;
}

export const SUBJECT_WORLDS: SubjectWorldItem[] = [
  {
    id: 'maths',
    name: 'Maths',
    pastel: '#EAE5FF',
    accent: '#5B4BFF',
    status: 'live',
    statusLabel: 'Lessons live',
    tagline: 'Prime factor trees, HCF & LCM, polynomials, and step-by-step proofs.',
    pebbyCaption: 'Pebby with pencil & compass',
  },
  {
    id: 'science',
    name: 'Science',
    pastel: '#DDF7E8',
    accent: '#15803D',
    status: 'live',
    statusLabel: 'Lessons live',
    tagline: 'Interactive ray diagrams, reflection of light, and clear lab concepts.',
    pebbyCaption: 'Pebby with goggles & flask',
  },
  {
    id: 'social',
    name: 'Social Science',
    pastel: '#FFF1B8',
    accent: '#B45309',
    status: 'soon',
    statusLabel: 'Coming soon',
    tagline: 'Timelines, maps, civics, and geography built for crisp board answers.',
    pebbyCaption: 'Pebby in an explorer hat',
  },
  {
    id: 'english',
    name: 'English',
    pastel: '#DFF1FF',
    accent: '#1D4ED8',
    status: 'soon',
    statusLabel: 'Coming soon',
    tagline: 'Grammar rules, writing formats, and literature chapters in bite-sized decks.',
    pebbyCaption: 'Pebby with a fountain quill',
  },
  {
    id: 'hindi',
    name: 'Hindi',
    pastel: '#FFE3EC',
    accent: '#BE185D',
    status: 'soon',
    statusLabel: 'Coming soon',
    tagline: 'Vyakaran, sahitya summaries, and clear framing for exam answers.',
    pebbyCaption: 'Pebby with a chapter flag',
  },
  {
    id: 'sanskrit',
    name: 'Sanskrit',
    pastel: '#FFF4D2',
    accent: '#9A3412',
    status: 'soon',
    statusLabel: 'Coming soon',
    tagline: 'Shloka meanings, sandhi rules, and dhatu roop made approachable.',
    pebbyCaption: 'Pebby with a palm-leaf scroll',
  },
];

export interface FixItNoteItem {
  id: string;
  problem: string;
  solution: string;
  rotation: number;
  stickyBg: string;
  flippedBg: string;
}

export const FIX_IT_NOTES: FixItNoteItem[] = [
  {
    id: 'videos',
    problem: 'Hour-long videos',
    solution: '5–8 minute swipe decks',
    rotation: -3,
    stickyBg: '#FFF1B8',
    flippedBg: '#DDF7E8',
  },
  {
    id: 'answer-dump',
    problem: 'Just gives me the answer',
    solution: 'Hint first, then steps',
    rotation: 2.5,
    stickyBg: '#FFE3EC',
    flippedBg: '#EAE5FF',
  },
  {
    id: 'english-only',
    problem: 'Only in English',
    solution: 'Pebby answers in your language',
    rotation: -2,
    stickyBg: '#DFF1FF',
    flippedBg: '#FFF8E1',
  },
  {
    id: 'paywall',
    problem: 'Pay before I even try',
    solution: 'Free core, no paywall in onboarding',
    rotation: 3,
    stickyBg: '#EAE5FF',
    flippedBg: '#DDF7E8',
  },
  {
    id: 'social-feeds',
    problem: 'Strangers’ notes and social feeds',
    solution: 'Curated lessons, no social feed',
    rotation: -1.8,
    stickyBg: '#FFE9C7',
    flippedBg: '#DFF1FF',
  },
];

export const SAME_QUESTION_DEMO = {
  chapter: 'Class 10 CBSE · Maths · Quadratic Equations',
  question: 'Find the roots of x² − 7x + 12 = 0.',
  typicalDump:
    'x² − 7x + 12 = 0 ⇒ (x − 3)(x − 4) = 0 ⇒ x = 3, 4. Final answer: 3 and 4.',
  academeHint:
    'Hint first: Find two numbers that add up to −7 and multiply to +12. Try listing factor pairs of 12.',
  academeSteps: [
    'Step 1: −3 and −4 add to −7 and multiply to +12.',
    'Step 2: Split the middle term: x² − 3x − 4x + 12 = 0.',
    'Step 3: Factor pairs: x(x − 3) − 4(x − 3) = 0 → (x − 3)(x − 4) = 0, so x = 3 or x = 4.',
  ],
};

export const FOOTER_GREETINGS: Array<{ lang: string; text: string }> = [
  { lang: 'English', text: 'Hi! You made it to the bottom. Ready for your next chapter?' },
  { lang: 'हिन्दी', text: 'नमस्ते! नीचे तक आ गए। अगला अध्याय साथ में शुरू करें?' },
  { lang: 'తెలుగు', text: 'హాయ్! చివరి వరకు వచ్చేశావు. తర్వాతి అధ్యాయం మొదలుపెడదామా?' },
  { lang: 'தமிழ்', text: 'வணக்கம்! கடைசி வரை வந்துவிட்டாய். அடுத்த பாடத்தைப் படிக்கலாமா?' },
  { lang: 'বাংলা', text: 'হাই! একদম নীচে চলে এসেছ। পরের অধ্যায়টা শুরু করবে?' },
];

export const HERO_SPEECH_LINES: Array<{ lang: string; code: LanguageCode; text: string }> = [
  { lang: 'English', code: 'en', text: 'Need help with Real Numbers? Let us do it step by step.' },
  { lang: 'हिन्दी', code: 'hi', text: 'HCF और LCM आसान है — चलो एक उदाहरण से समझते हैं।' },
  { lang: 'తెలుగు', code: 'te', text: 'Polynomials గందరగోళంగా ఉన్నాయా? చిన్న హింట్‌తో మొదలుపెడదాం.' },
  { lang: 'தமிழ்', code: 'ta', text: 'ஒளியின் எதிரொளிப்பு விதிகளை 5 நிமிடத்தில் படிக்கலாம்.' },
  { lang: 'বাংলা', code: 'bn', text: 'অঙ্কের ধাপগুলো ভুলে গেছ? আগে একটা ছোট্ট হিন্ট দিই।' },
];

export interface ChapterItem {
  number: string;
  title: string;
  subject: string;
  deckMinutes: string;
  pastel: string;
}

export interface BoardSyllabusEntry {
  board: BoardId;
  classLevel: ClassLevel;
  focusLabel: string;
  chapters: ChapterItem[];
}

export const BOARD_CLASSES: Record<BoardId, ClassLevel[]> = {
  CBSE: [6, 7, 8, 9, 10, 11, 12],
  ICSE: [6, 7, 8, 9, 10],
  ISC: [11, 12],
};

export const SYLLABUS_DATA: Record<string, BoardSyllabusEntry> = {
  'CBSE-6': {
    board: 'CBSE',
    classLevel: 6,
    focusLabel: 'NCERT Class 6 · Maths & Science',
    chapters: [
      { number: 'Ch 01', title: 'Knowing Our Numbers', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Whole Numbers & Number Line', subject: 'Maths', deckMinutes: '5 min', pastel: '#EAE5FF' },
      { number: 'Ch 03', title: 'Playing with Numbers', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 01', title: 'Components of Food', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
      { number: 'Ch 09', title: 'Electricity and Circuits', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 11', title: 'Light, Shadows and Reflections', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
    ],
  },
  'CBSE-7': {
    board: 'CBSE',
    classLevel: 7,
    focusLabel: 'NCERT Class 7 · Maths & Science',
    chapters: [
      { number: 'Ch 01', title: 'Integers', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Fractions and Decimals', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 04', title: 'Simple Equations', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 04', title: 'Heat and Temperature', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
      { number: 'Ch 05', title: 'Acids, Bases and Salts', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 15', title: 'Light and Spherical Mirrors', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
    ],
  },
  'CBSE-8': {
    board: 'CBSE',
    classLevel: 8,
    focusLabel: 'NCERT Class 8 · Maths & Science',
    chapters: [
      { number: 'Ch 01', title: 'Rational Numbers', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Linear Equations in One Variable', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 06', title: 'Squares and Square Roots', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 08', title: 'Force and Pressure', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
      { number: 'Ch 10', title: 'Sound and Vibrations', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 13', title: 'Light and Laws of Reflection', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
    ],
  },
  'CBSE-9': {
    board: 'CBSE',
    classLevel: 9,
    focusLabel: 'NCERT Class 9 · Maths & Science',
    chapters: [
      { number: 'Ch 01', title: 'Number Systems', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Polynomials', subject: 'Maths', deckMinutes: '8 min', pastel: '#EAE5FF' },
      { number: 'Ch 04', title: 'Linear Equations in Two Variables', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 07', title: 'Motion and Equations of Motion', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 08', title: 'Force and Laws of Motion', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 09', title: 'Gravitation', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
    ],
  },
  'CBSE-10': {
    board: 'CBSE',
    classLevel: 10,
    focusLabel: 'CBSE Class 10 · Maths & Science',
    chapters: [
      { number: 'Ch 01', title: 'Real Numbers', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Polynomials', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 03', title: 'Pair of Linear Equations in Two Variables', subject: 'Maths', deckMinutes: '8 min', pastel: '#EAE5FF' },
      { number: 'Ch 04', title: 'Quadratic Equations', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 05', title: 'Arithmetic Progressions', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 09', title: 'Light — Reflection and Refraction', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
    ],
  },
  'CBSE-11': {
    board: 'CBSE',
    classLevel: 11,
    focusLabel: 'CBSE Class 11 · Maths & Physics',
    chapters: [
      { number: 'Ch 01', title: 'Sets', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Relations and Functions', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 03', title: 'Trigonometric Functions', subject: 'Maths', deckMinutes: '8 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Motion in a Straight Line', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 04', title: 'Laws of Motion', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
      { number: 'Ch 05', title: 'Work, Energy and Power', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
    ],
  },
  'CBSE-12': {
    board: 'CBSE',
    classLevel: 12,
    focusLabel: 'CBSE Class 12 · Maths & Physics',
    chapters: [
      { number: 'Ch 01', title: 'Relations and Functions', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 03', title: 'Matrices and Determinants', subject: 'Maths', deckMinutes: '8 min', pastel: '#EAE5FF' },
      { number: 'Ch 05', title: 'Continuity and Differentiability', subject: 'Maths', deckMinutes: '8 min', pastel: '#EAE5FF' },
      { number: 'Ch 01', title: 'Electric Charges and Fields', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
      { number: 'Ch 03', title: 'Current Electricity', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 09', title: 'Ray Optics and Optical Instruments', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
    ],
  },
  'ICSE-6': {
    board: 'ICSE',
    classLevel: 6,
    focusLabel: 'CISCE Class 6 · Maths & Science',
    chapters: [
      { number: 'Ch 01', title: 'Number System & Estimation', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 03', title: 'Factors, Multiples, HCF & LCM', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 05', title: 'Introduction to Algebra', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Physical Quantities & Measurement', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
      { number: 'Ch 04', title: 'Simple Machines', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
      { number: 'Ch 05', title: 'Light and Shadows', subject: 'Science', deckMinutes: '5 min', pastel: '#DDF7E8' },
    ],
  },
  'ICSE-7': {
    board: 'ICSE',
    classLevel: 7,
    focusLabel: 'CISCE Class 7 · Maths & Science',
    chapters: [
      { number: 'Ch 01', title: 'Integers and Rational Numbers', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 04', title: 'Exponents and Powers', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 07', title: 'Ratio, Proportion and Unitary Method', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Motion and Speed', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
      { number: 'Ch 04', title: 'Light Energy and Plane Mirrors', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 06', title: 'Sound Propagation', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
    ],
  },
  'ICSE-8': {
    board: 'ICSE',
    classLevel: 8,
    focusLabel: 'CISCE Class 8 · Maths & Science',
    chapters: [
      { number: 'Ch 01', title: 'Rational Numbers & Properties', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 05', title: 'Algebraic Identities & Factorisation', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 08', title: 'Linear Equations & Inequalities', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 03', title: 'Force, Thrust and Pressure', subject: 'Science', deckMinutes: '6 min', pastel: '#DDF7E8' },
      { number: 'Ch 05', title: 'Refraction of Light', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 08', title: 'Electricity and Household Circuits', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
    ],
  },
  'ICSE-9': {
    board: 'ICSE',
    classLevel: 9,
    focusLabel: 'ICSE Class 9 · Maths & Physics',
    chapters: [
      { number: 'Ch 01', title: 'Rational and Irrational Numbers', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Compound Interest', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 04', title: 'Expansions and Factorisation', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Motion in One Dimension', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 03', title: 'Laws of Motion', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 07', title: 'Reflection of Light', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
    ],
  },
  'ICSE-10': {
    board: 'ICSE',
    classLevel: 10,
    focusLabel: 'ICSE Class 10 · Maths & Physics',
    chapters: [
      { number: 'Ch 01', title: 'Goods and Services Tax (GST)', subject: 'Maths', deckMinutes: '6 min', pastel: '#EAE5FF' },
      { number: 'Ch 05', title: 'Quadratic Equations in One Variable', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 08', title: 'Remainder and Factor Theorems', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 01', title: 'Force, Work, Energy and Power', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
      { number: 'Ch 04', title: 'Refraction of Light at Plane Surfaces', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
      { number: 'Ch 08', title: 'Current Electricity & Ohm’s Law', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
    ],
  },
  'ISC-11': {
    board: 'ISC',
    classLevel: 11,
    focusLabel: 'ISC Class 11 · Maths & Physics',
    chapters: [
      { number: 'Ch 01', title: 'Sets, Relations and Functions', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 03', title: 'Trigonometry & Compound Angles', subject: 'Maths', deckMinutes: '8 min', pastel: '#EAE5FF' },
      { number: 'Ch 07', title: 'Complex Numbers', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 02', title: 'Kinematics and Vectors', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
      { number: 'Ch 04', title: 'Newton’s Laws & Friction', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 07', title: 'Gravitation & Orbital Velocity', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
    ],
  },
  'ISC-12': {
    board: 'ISC',
    classLevel: 12,
    focusLabel: 'ISC Class 12 · Maths & Physics',
    chapters: [
      { number: 'Ch 01', title: 'Relations, Functions & Inverse Trig', subject: 'Maths', deckMinutes: '8 min', pastel: '#EAE5FF' },
      { number: 'Ch 03', title: 'Matrices and Determinants', subject: 'Maths', deckMinutes: '7 min', pastel: '#EAE5FF' },
      { number: 'Ch 05', title: 'Differential Calculus', subject: 'Maths', deckMinutes: '8 min', pastel: '#EAE5FF' },
      { number: 'Ch 01', title: 'Electrostatics & Gauss Theorem', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
      { number: 'Ch 03', title: 'Kirchhoff’s Laws & Potentiometer', subject: 'Science', deckMinutes: '7 min', pastel: '#DDF7E8' },
      { number: 'Ch 09', title: 'Ray Optics & Wave Optics', subject: 'Science', deckMinutes: '8 min', pastel: '#DDF7E8' },
    ],
  },
};

export interface SwipeCardData {
  id: string;
  kind: 'concept' | 'table' | 'remember' | 'check';
  kicker: string;
  title: string;
  accentBg: string;
  xpValue: number;
  body?: string;
  formula?: string;
  tableRows?: Array<{ label: string; hcf: string; lcm: string }>;
  rememberNote?: string;
  watchOut?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  heresWhy?: string;
}

export const SWIPE_CARDS: SwipeCardData[] = [
  {
    id: 'concept',
    kind: 'concept',
    kicker: 'Card 1 of 4 · Concept',
    title: 'Prime Factorisation',
    accentBg: '#EAE5FF',
    xpValue: 25,
    body: 'Every composite number can be written as a unique product of prime numbers. Think of primes as the smallest building blocks.',
    formula: '24 = 2³ × 3¹   |   36 = 2² × 3²',
  },
  {
    id: 'table',
    kind: 'table',
    kicker: 'Card 2 of 4 · In one look',
    title: 'HCF vs LCM for 24 and 36',
    accentBg: '#FFF1B8',
    xpValue: 55,
    tableRows: [
      { label: 'Rule', hcf: 'Smallest power of common primes', lcm: 'Greatest power of every prime' },
      { label: 'Powers', hcf: '2² × 3¹', lcm: '2³ × 3²' },
      { label: 'Answer', hcf: '12', lcm: '72' },
    ],
  },
  {
    id: 'remember',
    kind: 'remember',
    kicker: 'Card 3 of 4 · Remember',
    title: 'The product rule',
    accentBg: '#DDF7E8',
    xpValue: 80,
    formula: 'HCF(a, b) × LCM(a, b) = a × b',
    rememberNote: 'Check with 24 and 36: 12 × 72 = 864, and 24 × 36 = 864.',
    watchOut: 'Exam tip: This identity holds for two positive integers, not three.',
  },
  {
    id: 'check',
    kind: 'check',
    kicker: 'Card 4 of 4 · Quick check',
    title: 'Try one yourself',
    accentBg: '#DFF1FF',
    xpValue: 105,
    question: 'If HCF(12, 18) = 6, what is LCM(12, 18)?',
    options: ['24', '36', '72'],
    correctIndex: 1,
    heresWhy: 'Here’s why: (12 × 18) ÷ 6 = 216 ÷ 6 = 36. Always divide the product by the HCF.',
  },
];

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
];

export interface PebbyExplainScript {
  studentPrompt: string;
  chapterContext: string;
  reply: Record<LanguageCode, string>;
}

export interface PebbySolveScript {
  studentPrompt: string;
  chapterContext: string;
  hint: Record<LanguageCode, string>;
  fullSteps: Record<LanguageCode, string[]>;
}

export interface PebbyQuizScript {
  chapterContext: string;
  question: Record<LanguageCode, string>;
  options: string[];
  correctIndex: number;
  correctFeedback: Record<LanguageCode, string>;
  wrongFeedback: Record<LanguageCode, string>;
}

export const PEBBY_SCRIPTS: {
  explain: PebbyExplainScript;
  solve: PebbySolveScript;
  quiz: PebbyQuizScript;
} = {
  explain: {
    studentPrompt: 'Why do zeroes of a polynomial show up on the x-axis?',
    chapterContext: 'Class 10 CBSE · Maths · Ch 2 Polynomials',
    reply: {
      en: 'A zero is an x-value that makes y = p(x) equal to 0. On a graph, every point with y = 0 sits right on the x-axis. So counting how many times the curve touches or crosses the x-axis tells you the number of real zeroes.',
      hi: 'शून्यक (zero) वह x का मान है जिस पर y = p(x) बराबर 0 हो जाता है। ग्राफ पर जहाँ भी y = 0 होता है, वह बिंदु सीधे x-अक्ष पर आता है। इसलिए वक्र x-अक्ष को जितनी बार काटता है, उतने ही वास्तविक शून्यक होते हैं।',
      te: 'బహుపది శూన్యం అంటే y = p(x) విలువ 0 అయ్యే x విలువ. గ్రాఫ్‌లో y = 0 ఉన్న ప్రతి బిందువు x-అక్షం మీదే ఉంటుంది. కాబట్టి వక్రం x-అక్షాన్ని ఎన్ని సార్లు తాకితే అన్ని శూన్యాలు ఉంటాయి.',
      ta: 'ஒரு பல்லுறுப்புக்கோவையின் பூஜ்ஜியம் என்பது y = p(x) = 0 ஆகும் x மதிப்பு. வரைபடத்தில் y = 0 உள்ள புள்ளிகள் அனைத்தும் x-அச்சில் அமையும். அதனால் வளைவு x-அச்சை வெட்டும் இடங்களே மெய் பூஜ்ஜியங்கள்.',
      bn: 'বহুপদী সংখ্যামালার শূন্য হলো x-এর সেই মান যার জন্য y = p(x) = 0 হয়। লেখচিত্রে y = 0 থাকা প্রতিটি বিন্দু x-অক্ষের ওপর থাকে। তাই বক্ররেখাটি x-অক্ষকে যতবার ছেদ করে, ততগুলো বাস্তব শূন্য থাকে।',
    },
  },
  solve: {
    studentPrompt: 'Find the zeroes of x² − 5x + 6.',
    chapterContext: 'Class 10 CBSE · Maths · Ch 2 Polynomials',
    hint: {
      en: 'Hint first: look for two numbers whose sum is −5 and whose product is +6. Can you split −5x using those two numbers?',
      hi: 'पहले एक छोटा संकेत: ऐसी दो संख्याएँ सोचो जिनका जोड़ −5 और गुणनफल +6 हो। क्या तुम −5x को उनसे बाँट सकते हो?',
      te: 'ముందు చిన్న హింట్: కూడితే −5, గుణిస్తే +6 వచ్చే రెండు సంఖ్యలు ఏవి? వాటితో −5x ని విడదీసి చూడు.',
      ta: 'முதலில் ஒரு குறிப்பு: கூட்டினால் −5, பெருக்கினால் +6 வரும் இரண்டு எண்களைக் கண்டுபிடி. அதை வைத்து −5x ஐ பிரித்துப் பார்.',
      bn: 'আগে একটি ছোট হিন্ট: এমন দুটি সংখ্যা ভাবো যাদের যোগফল −5 এবং গুণফল +6। সেগুলো দিয়ে −5x ভাঙতে পারবে?',
    },
    fullSteps: {
      en: [
        '1. Split the middle term: x² − 2x − 3x + 6 = 0',
        '2. Group and factor: x(x − 2) − 3(x − 2) = 0',
        '3. Write factors: (x − 2)(x − 3) = 0 → zeroes are x = 2 and x = 3.',
      ],
      hi: [
        '1. मध्य पद तोड़ें: x² − 2x − 3x + 6 = 0',
        '2. उभयनिष्ठ निकालें: x(x − 2) − 3(x − 2) = 0',
        '3. गुणनखंड: (x − 2)(x − 3) = 0 → शून्यक x = 2 और x = 3 हैं।',
      ],
      te: [
        '1. మధ్య పదాన్ని విడదీయండి: x² − 2x − 3x + 6 = 0',
        '2. సామాన్య పదం తీయండి: x(x − 2) − 3(x − 2) = 0',
        '3. కారణాంకాలు: (x − 2)(x − 3) = 0 → శూన్యాలు x = 2, x = 3.',
      ],
      ta: [
        '1. நடு உறுப்பைப் பிரிக்கவும்: x² − 2x − 3x + 6 = 0',
        '2. பொதுக்காரணி எடுக்கவும்: x(x − 2) − 3(x − 2) = 0',
        '3. காரணிகள்: (x − 2)(x − 3) = 0 → பூஜ்ஜியங்கள் x = 2 மற்றும் x = 3.',
      ],
      bn: [
        '1. মধ্যপদ ভাঙো: x² − 2x − 3x + 6 = 0',
        '2. কমন নাও: x(x − 2) − 3(x − 2) = 0',
        '3. উৎপাদক: (x − 2)(x − 3) = 0 → শূন্য দুটি হলো x = 2 এবং x = 3।',
      ],
    },
  },
  quiz: {
    chapterContext: 'Class 10 CBSE · Science · Reflection of Light',
    question: {
      en: 'An object is placed at the centre of curvature (C) of a concave mirror. Where is the image formed?',
      hi: 'अवतल दर्पण के वक्रता केंद्र (C) पर वस्तु रखी है। प्रतिबिंब कहाँ बनेगा?',
      te: 'పుటాకార దర్పణం యొక్క వక్రతా కేంద్రం (C) వద్ద వస్తువు ఉంచితే ప్రతిబింబం ఎక్కడ ఏర్పడుతుంది?',
      ta: 'குழி ஆடியின் வளைவு மையத்தில் (C) பொருள் வைக்கப்பட்டால், பிம்பம் எங்கே உருவாகும்?',
      bn: 'অবতল দর্পণের বক্রতা কেন্দ্রে (C) বস্তু রাখলে প্রতিবিম্ব কোথায় গঠিত হবে?',
    },
    options: [
      'At the Focus (F)',
      'At the Centre of Curvature (C), same size & inverted',
      'Behind the mirror, virtual & erect',
      'At infinity',
    ],
    correctIndex: 1,
    correctFeedback: {
      en: 'Spot on. At C, rays return cleanly to form a real, inverted image of the exact same size right at C.',
      hi: 'बिलकुल सही। C पर रखी वस्तु का प्रतिबिंब C पर ही, वास्तविक, उल्टा और बराबर आकार का बनता है।',
      te: 'సరైన సమాధానం. C వద్ద ఉంచిన వస్తువుకు అదే పరిమాణంలో తలకిందులైన నిజ ప్రతిబింబం C వద్దే ఏర్పడుతుంది.',
      ta: 'மிகச் சரி. C-இல் வைக்கப்பட்ட பொருளின் பிம்பம் C-இலேயே அதே அளவில் தலைகீழாக உருவாகும்.',
      bn: 'একদম ঠিক। C-তে বস্তু রাখলে C-তেই সমান আকারের বাস্তব ও উল্টো প্রতিবিম্ব তৈরি হয়।',
    },
    wrongFeedback: {
      en: 'Close — check the ray parallel to the principal axis. At C, the object distance u equals −2f, so v also equals −2f.',
      hi: 'करीब हैं — मुख्य अक्ष के समानांतर किरण देखें। C पर u = −2f होता है, इसलिए v भी −2f (यानी C) पर ही बनता है।',
      te: 'దగ్గరలో ఉన్నావు — C వద్ద u = −2f కాబట్టి, దర్పణ సూత్రం ప్రకారం v కూడా −2f అంటే C వద్దే వస్తుంది.',
      ta: 'அருகில் வந்துவிட்டாய் — C-இல் u = −2f என்பதால், ஆடிச் சமன்பாட்டின்படி v-உம் −2f (C) ஆகும்.',
      bn: 'কাছাকাছি — C-তে u = −2f হয়, তাই দর্পণ সূত্র অনুযায়ী v-ও −2f অর্থাৎ C-তেই হবে।',
    },
  },
};

export interface MarkPoint {
  id: string;
  label: string;
  awarded: number;
  max: number;
  note: string;
  status: 'full' | 'missing';
}

export const CHECK_ANSWER_DATA = {
  questionTitle: 'Class 10 CBSE · Science (5 Marks)',
  questionPrompt: 'Define reflection of light, draw a ray diagram for parallel rays on a concave mirror, and state the mirror formula with sign convention.',
  photoSrc: '/src/assets/images/handwritten_answer_sheet_1795315731247.jpg',
  totalMarks: 5,
  earnedMarks: 3,
  points: [
    {
      id: 'p1',
      label: 'Definition of reflection & concave mirror',
      awarded: 1,
      max: 1,
      note: 'Clearly defined bouncing back of light and inward reflecting surface.',
      status: 'full' as const,
    },
    {
      id: 'p2',
      label: 'Neat ray diagram with C, F and P',
      awarded: 1,
      max: 1,
      note: 'Parallel rays correctly converge at Focus (F) with arrows shown.',
      status: 'full' as const,
    },
    {
      id: 'p3',
      label: 'Mirror formula & variable definitions',
      awarded: 1,
      max: 1,
      note: '1/v + 1/u = 1/f stated accurately with u, v, and f named.',
      status: 'full' as const,
    },
    {
      id: 'p4',
      label: 'Laws of reflection & sign convention',
      awarded: 0,
      max: 2,
      note: 'Missing ∠i = ∠r, coplanar rays rule, and Cartesian sign convention (u < 0, f < 0).',
      status: 'missing' as const,
    },
  ] as MarkPoint[],
  howToGetFullMarks: [
    'Add both Laws of Reflection: ∠i = ∠r, and incident ray, normal, and reflected ray lie in the same plane.',
    'Write one line on Cartesian sign convention: for a concave mirror, object distance u is negative and focal length f is negative.',
  ],
  modelAnswer:
    'Reflection is the bouncing back of light into the same medium from a polished surface, obeying (i) ∠i = ∠r and (ii) the incident ray, normal, and reflected ray lie in the same plane. In a concave mirror, rays parallel to the principal axis meet at Focus (F). The mirror formula is 1/v + 1/u = 1/f, where distances measured against incident light (u and f for concave mirror) are taken as negative.',
};

export const COMPARISON_ROWS = [
  {
    aspect: 'Curriculum structure',
    typical: 'Long generic videos disconnected from your school chapters.',
    academe: 'Syllabus-first decks mapped to CBSE, ICSE and ISC chapters.',
  },
  {
    aspect: 'Doubt solving',
    typical: 'Dumps the final answer immediately without teaching the method.',
    academe: 'Hint-first solving so you understand each step before seeing the solution.',
  },
  {
    aspect: 'Lesson length',
    typical: '45-minute lectures that are hard to finish after school.',
    academe: 'Short 5–8 minute swipe decks built for a bus ride or quick revision.',
  },
  {
    aspect: 'Getting started',
    typical: 'Paywalls, trial traps, or sales calls during onboarding.',
    academe: 'No paywall in onboarding. Open your board, pick a chapter, start learning.',
  },
  {
    aspect: 'Student safety',
    typical: 'Distracting feeds, leaderboards with strangers, or ad trackers.',
    academe: 'No ads and no social feeds for minors. Calm, focused study space.',
  },
];

export const SAFETY_PILLARS = [
  {
    id: 'no-ads',
    title: 'No ads, ever',
    description: 'Zero ad banners, zero sponsored pop-ups, and zero distractions between lessons.',
    bg: '#DDF7E8',
  },
  {
    id: 'no-ad-id',
    title: 'No advertising ID',
    description: 'We do not collect device advertising IDs or build ad profiles on students.',
    bg: '#DFF1FF',
  },
  {
    id: 'no-photo-storage',
    title: 'Scan photos never stored',
    description: 'Notebook photos sent to Scan or Check my answer are processed and discarded, not kept on servers.',
    bg: '#FFF1B8',
  },
  {
    id: 'report-ai',
    title: 'Report button on every AI answer',
    description: 'If Pebby ever makes a mistake or gives an unclear step, students can flag it in one tap.',
    bg: '#FFE3EC',
  },
  {
    id: 'account-delete',
    title: 'Real account deletion',
    description: 'Delete your account directly inside the app — data is permanently removed, not merely hidden.',
    bg: '#EAE5FF',
  },
];

export const WEEKLY_PROGRESS_BOARD = {
  weekLabel: 'This week · Mon to Sun',
  studyDays: [
    { day: 'Mon', done: true, mins: 14 },
    { day: 'Tue', done: true, mins: 18 },
    { day: 'Wed', done: true, mins: 10 },
    { day: 'Thu', done: false, mins: 0 },
    { day: 'Fri', done: true, mins: 22 },
    { day: 'Sat', done: true, mins: 16 },
    { day: 'Sun', done: false, mins: 0 },
  ],
  summary: {
    daysStudied: '5 of 7 days',
    totalTime: '80 mins',
    decksFinished: '6 short decks',
  },
  subjects: [
    { name: 'Maths', chapter: 'Real Numbers & Polynomials', progress: 78, color: '#5B4BFF', pastel: '#EAE5FF' },
    { name: 'Science', chapter: 'Reflection of Light', progress: 62, color: '#16A34A', pastel: '#DDF7E8' },
    { name: 'Social Science', chapter: 'Resources and Development', progress: 40, color: '#D97706', pastel: '#FFF1B8' },
  ],
};

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'free',
    question: 'Is it really free?',
    answer:
      'Yes. All swipe lessons, spaced revision, folders and study reminders are free at Rs 0. You also get daily free AI limits (10 Pebby messages, 3 scan reads, and 1 Check my answer every day). Pro is only for students who want about 3x the AI limits, lessons from notes, and the full My Progress weekly board.',
  },
  {
    id: 'boards',
    question: 'Which boards and classes are supported?',
    answer:
      'ACADEMe is built for Class 6 to 12 across CBSE, ICSE (Classes 6–10), and ISC (Classes 11–12). Lessons are rolling out subject by subject, with new lessons added regularly.',
  },
  {
    id: 'languages',
    question: 'Which languages does Pebby speak?',
    answer:
      'Pebby explains, hints, and quizzes in English, Hindi, Telugu, Tamil, and Bengali — so students can ask doubts in the language they think in while keeping board exam terms clear.',
  },
  {
    id: 'safety',
    question: 'Is my child’s data safe?',
    answer:
      'Yes. ACADEMe is built to be safe for minors: there are no ads, no social feeds, no advertising ID collection, notebook scan photos are never stored, and every AI response includes a one-tap report button.',
  },
  {
    id: 'delete',
    question: 'How do I delete my account?',
    answer:
      'Open Settings inside the ACADEMe app and tap Delete account. Confirmation permanently removes your account and study records. You can also reach out via our Support contact if you need help.',
  },
  {
    id: 'ios',
    question: 'Is there an iOS app?',
    answer:
      'ACADEMe launches on Android via Google Play first. An iOS version is planned for later.',
  },
];
