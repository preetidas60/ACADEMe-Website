import React, { useState } from 'react';
import { Check, ChevronDown, Smartphone } from 'lucide-react';
import { FAQ_ITEMS } from '../data/academeData';
import { getProPricingSummary } from '../utils/logic';
import type { FooterModalTopic } from './CurtainFooter';

export const INFO_MODAL_COPY: Record<FooterModalTopic, { title: string; body: string }> = {
  play: {
    title: 'Get ACADEMe on Google Play',
    body: 'ACADEMe is built for Android phones on Google Play first, with an iOS version planned for later. Core lessons, revision, folders, and reminders stay free at ₹0 with no paywall in onboarding.',
  },
  privacy: {
    title: 'Privacy & Student Data',
    body: 'ACADEMe collects no advertising IDs, shows zero ads, and never stores notebook photos sent through Scan or Check my answer. All student study data can be permanently deleted from inside the app.',
  },
  terms: {
    title: 'Terms of Use',
    body: 'Core lessons and daily AI allowances are free for students in Classes 6–12 (CBSE, ICSE, ISC). Pro subscriptions can be cancelled anytime without losing saved folders or lesson progress.',
  },
  support: {
    title: 'Student & Parent Support',
    body: 'Need help with your board syllabus, billing, or a reported AI answer? Use the in-app Help button or write to our support contact placeholder: [Add support email].',
  },
  delete: {
    title: 'Real Account Deletion',
    body: 'Open ACADEMe on Android → Settings → Delete account. Confirming permanently deletes your profile, progress records, and saved folders from our servers.',
  },
  contact: {
    title: 'Contact ACADEMe',
    body: '[Add contact email and address placeholder here before launch.]',
  },
};

interface BeforeYouStartChapterProps {
  onDownloadClick: () => void;
}

/**
 * CHAPTER 8: Before you start (Pricing + FAQ Accordion directly beneath it on #EEF0F8)
 */
export const BeforeYouStartChapter: React.FC<BeforeYouStartChapterProps> = ({
  onDownloadClick,
}) => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaqId, setOpenFaqId] = useState<string>('');
  const [showAllFaq, setShowAllFaq] = useState(false);

  const proSummary = getProPricingSummary(billing);
  const visibleFaqs = showAllFaq ? FAQ_ITEMS : FAQ_ITEMS.slice(0, 3);

  return (
    <div className="bg-[#EEF0F8] py-5 min-[900px]:pt-24 min-[900px]:pb-5 space-y-4 min-[900px]:space-y-6">
      {/* PRICING BLOCK */}
      <section aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-reveal>
            <div className="space-y-1.5 max-w-xl">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] font-display font-bold text-xs text-[#5B4BFF]">
                Chapter 8 · Before you start
              </span>
              <h2
                id="pricing-heading"
                className="font-display font-extrabold text-[#111111] leading-[1.08] tracking-[-0.025em]"
                style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)', textWrap: 'balance' }}
              >
                Free at the core. Simple when you need more AI.
              </h2>
            </div>

            {/* Billing Cycle Switch */}
            <div
              role="group"
              aria-label="Pro billing interval"
              className="self-start md:self-auto inline-flex items-center p-1 bg-white border-[3px] border-[#111111] rounded-full shadow-[4px_4px_0_#111111]"
            >
              <button
                type="button"
                onClick={() => setBilling('monthly')}
                aria-pressed={billing === 'monthly'}
                className={`px-4 py-2 rounded-full font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  billing === 'monthly'
                    ? 'bg-[#111111] text-white'
                    : 'text-[#111111] hover:bg-[#FFF8E1]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling('annual')}
                aria-pressed={billing === 'annual'}
                className={`px-4 py-2 rounded-full font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  billing === 'annual'
                    ? 'bg-[#FFA500] text-[#111111]'
                    : 'text-[#111111] hover:bg-[#FFF8E1]'
                }`}
              >
                Yearly (₹1,999/yr)
              </button>
            </div>
          </div>

          {/* Two Neo-Brutalist Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch" data-reveal>
            {/* FREE PLAN */}
            <div className="neo-card bg-white p-4 min-[900px]:p-5 flex flex-col justify-between gap-3.5 min-[900px]:gap-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="font-display font-bold text-sm text-[#111111]/70">Free</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#111111] tabular-nums">
                      ₹0
                    </span>
                    <span className="text-sm font-medium text-[#111111]/70">forever</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#111111]/75">
                    Everything you need for daily chapter lessons and steady revision.
                  </p>
                </div>

                <ul className="space-y-1.5 pt-2.5 border-t-2 border-[#111111]/12 text-xs sm:text-sm text-[#111111]">
                  {[
                    'All swipe lessons (new lessons added regularly)',
                    'Spaced revision queue, folders and reminders',
                    '10 Pebby messages / day',
                    '3 scan reads / day',
                    '1 Check my answer / day',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-[#EEF0F8] border-2 border-[#111111] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#111111]" aria-hidden="true" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={onDownloadClick}
                className="neo-btn w-full py-2.5 px-5 bg-white hover:bg-[#FFF8E1] text-[#111111] font-display font-bold text-sm"
              >
                Start free in the app
              </button>
            </div>

            {/* PRO PLAN (Amber Highlight) */}
            <div className="neo-card bg-[#FFF8E1] p-4 min-[900px]:p-5 flex flex-col justify-between gap-3.5 min-[900px]:gap-4 relative">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display font-extrabold text-sm text-[#111111]">Pro</p>
                  <span className="bg-[#FFA500] border-2 border-[#111111] rounded-full px-3 py-0.5 font-display font-bold text-xs text-[#111111]">
                    {proSummary.badge}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-2.5">
                    <span
                      data-testid="pro-price-value"
                      className="font-display font-extrabold text-3xl sm:text-4xl text-[#111111] tabular-nums"
                    >
                      {proSummary.headlinePrice}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#111111]/80">
                      {proSummary.subline}
                    </span>
                  </div>
                  <p className="text-xs text-[#111111]/70">
                    Or ₹1,999/year. Cancel anytime in Google Play.
                  </p>
                </div>

                <ul className="space-y-1.5 pt-2.5 border-t-2 border-[#111111]/15 text-xs sm:text-sm font-medium text-[#111111]">
                  {[
                    'Everything in Free, plus:',
                    '30 Pebby messages / day',
                    '9 scan reads / day',
                    '3 Check my answer / day',
                    'Lessons from your own notes',
                    'Full My Progress weekly board',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-[#FFA500] border-2 border-[#111111] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#111111]" aria-hidden="true" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={onDownloadClick}
                className="neo-btn w-full py-2.5 px-5 bg-[#5B4BFF] hover:bg-[#4435E6] text-white font-display font-bold text-sm"
              >
                Upgrade to Pro in the app
              </button>
            </div>
          </div>

          <p className="text-center text-xs sm:text-sm font-display font-bold text-[#111111]">
            Core learning stays free. Only the costly AI is metered.
          </p>
        </div>
      </section>

      {/* FAQ ACCORDION directly beneath Pricing inside Chapter 8 */}
      <section id="faq" className="scroll-mt-24 pt-5 border-t-[3px] border-[#111111]/15">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6 space-y-3.5">
          <div className="text-center space-y-1" data-reveal>
            <p className="font-display font-bold text-xs text-[#5B4BFF]">Questions &amp; answers</p>
            <h2
              className="font-display font-extrabold text-[#111111] leading-[1.08] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(1.5rem, 2.7vw, 2.1rem)', textWrap: 'balance' }}
            >
              Clear answers before you download.
            </h2>
          </div>

          <div className="space-y-2" data-reveal>
            {visibleFaqs.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className={`neo-card-sm overflow-hidden transition-colors ${
                    isOpen ? 'bg-[#FFF8E1]' : 'bg-white'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${item.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                      className="w-full text-left px-5 py-3 flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-[#111111]"
                    >
                      <span>{item.question}</span>
                      <span
                        className={`w-7 h-7 rounded-full border-2 border-[#111111] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen ? 'bg-[#FFA500] rotate-180' : 'bg-[#EEF0F8]'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 text-[#111111]" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${item.id}`}
                    className="grid transition-[grid-template-rows,opacity] duration-250 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 pt-1 text-sm text-[#111111]/85 leading-relaxed border-t-2 border-[#111111]/10">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {FAQ_ITEMS.length > 3 && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                data-testid="faq-see-all-btn"
                aria-expanded={showAllFaq}
                onClick={() => setShowAllFaq((prev) => !prev)}
                className="neo-btn-sm inline-flex items-center gap-1.5 bg-white hover:bg-[#FFF8E1] px-5 py-2 font-display font-bold text-xs text-[#111111]"
              >
                <span>
                  {showAllFaq
                    ? 'Show fewer questions'
                    : `See all ${FAQ_ITEMS.length} questions`}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showAllFaq ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

interface FinaleCtaSectionProps {
  onOpenModal: (topic: FooterModalTopic) => void;
}

/**
 * FINALE (Not a chapter): Indigo CTA sliding over Chapter 8, then lifting like a scalloped curtain
 * to uncover the Pebby pop-out CurtainFooter unchanged.
 */
export const FinaleCtaSection: React.FC<FinaleCtaSectionProps> = ({ onOpenModal }) => {
  return (
    <section
      aria-labelledby="finale-cta-heading"
      className="flex-1 flex flex-col justify-center pt-6 pb-10 min-[900px]:pt-20 min-[900px]:pb-20 bg-[#5B4BFF] text-white relative overflow-visible rounded-t-[inherit]"
    >
      {/* Subtle decorative stars */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-12 left-[7%] w-9 h-9 text-[#FFA500] opacity-75 hidden md:block"
          viewBox="0 0 36 36"
          fill="currentColor"
        >
          <path
            d="M18 2 L21.8 14.2 L34 18 L21.8 21.8 L18 34 L14.2 21.8 L2 18 L14.2 14.2 Z"
            stroke="#111111"
            strokeWidth="2.2"
          />
        </svg>
        <svg
          className="absolute bottom-20 right-[8%] w-7 h-7 text-[#FFF8E1] opacity-55 hidden md:block"
          viewBox="0 0 28 28"
          fill="none"
        >
          <path d="M14 4 V24 M4 14 H24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Download Copy + Primary Google Play CTA */}
          <div className="space-y-4 max-w-2xl">
            <p className="font-display font-bold text-sm text-[#FFA500]">Even better in the app</p>
            <h2
              id="finale-cta-heading"
              className="font-display font-extrabold text-white leading-[1.08] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 3.1rem)', textWrap: 'balance' }}
            >
              Start your next chapter with Pebby today.
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-[52ch]">
              Download ACADEMe on Android via Google Play. Free swipe lessons for Class 6–12 CBSE, ICSE and ISC — iOS coming later.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => onOpenModal('play')}
                className="neo-btn inline-flex items-center justify-center gap-3 px-7 py-4 bg-[#FFA500] hover:bg-[#ff9500] text-[#111111] font-display font-extrabold text-base whitespace-nowrap"
              >
                <Smartphone className="w-5 h-5" aria-hidden="true" />
                <span>Get it on Google Play</span>
              </button>
              <p className="text-xs sm:text-sm text-white/80 font-medium">
                Android app · No ads · Core learning stays free
              </p>
            </div>
          </div>

          {/* Crisp Neo-Brutalist QR Code Placeholder */}
          <div className="bg-white text-[#111111] border-[3px] border-[#111111] rounded-[24px] shadow-[6px_6px_0_#111111] p-4 flex items-center gap-4 shrink-0">
            <svg
              viewBox="0 0 80 80"
              className="w-20 h-20 shrink-0"
              role="img"
              aria-label="QR code placeholder to download ACADEMe on Android"
            >
              <rect width="80" height="80" rx="6" fill="#FFF8E1" />
              <rect x="6" y="6" width="22" height="22" rx="3" fill="none" stroke="#111111" strokeWidth="4" />
              <rect x="13" y="13" width="8" height="8" fill="#111111" />
              <rect x="52" y="6" width="22" height="22" rx="3" fill="none" stroke="#111111" strokeWidth="4" />
              <rect x="59" y="13" width="8" height="8" fill="#111111" />
              <rect x="6" y="52" width="22" height="22" rx="3" fill="none" stroke="#111111" strokeWidth="4" />
              <rect x="13" y="59" width="8" height="8" fill="#111111" />
              <rect x="34" y="8" width="6" height="6" fill="#5B4BFF" />
              <rect x="34" y="20" width="6" height="12" fill="#111111" />
              <rect x="8" y="36" width="12" height="6" fill="#111111" />
              <rect x="26" y="36" width="14" height="8" fill="#5B4BFF" />
              <rect x="46" y="36" width="8" height="8" fill="#111111" />
              <rect x="60" y="36" width="12" height="6" fill="#111111" />
              <rect x="36" y="52" width="8" height="8" fill="#111111" />
              <rect x="50" y="50" width="8" height="12" fill="#5B4BFF" />
              <rect x="64" y="52" width="8" height="8" fill="#111111" />
              <rect x="36" y="66" width="14" height="6" fill="#111111" />
              <rect x="56" y="66" width="16" height="6" fill="#111111" />
            </svg>
            <div className="space-y-1 pr-1">
              <p className="font-display font-extrabold text-sm text-[#111111]">
                QR code placeholder
              </p>
              <p className="text-xs text-[#111111]/70 max-w-[16ch] leading-snug">
                Scan with your Android phone to get ACADEMe
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Small wiggling Pebby leaf tuft peeking at the very bottom edge */}
      <div
        data-testid="cta-tuft-hint"
        className="absolute left-1/2 -translate-x-1/2 bottom-0 z-20 flex flex-col items-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="font-display font-bold text-[11px] text-[#FFF8E1]/75 mb-1 tracking-wide">
          keep scrolling...
        </span>
        <svg viewBox="0 0 80 42" className="w-16 h-9 overflow-visible">
          <g className="pebby-tuft">
            <ellipse
              cx="27"
              cy="28"
              rx="10"
              ry="13"
              transform="rotate(-16 27 28)"
              fill="#7C7FFF"
              stroke="#111111"
              strokeWidth="3"
            />
            <ellipse
              cx="42"
              cy="22"
              rx="11"
              ry="16"
              transform="rotate(8 42 22)"
              fill="#8F92FF"
              stroke="#111111"
              strokeWidth="3"
            />
            <ellipse
              cx="56"
              cy="31"
              rx="9"
              ry="11"
              transform="rotate(28 56 31)"
              fill="#7C7FFF"
              stroke="#111111"
              strokeWidth="3"
            />
          </g>
        </svg>
      </div>

      {/* Hand-drawn scalloped bottom edge lifting cleanly like a curtain over the fixed dark footer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 -bottom-[22px] z-30 h-[24px] w-full overflow-hidden"
      >
        <svg viewBox="0 0 1440 24" preserveAspectRatio="none" className="w-full h-full block">
          <path
            d={`M0 0 H1440 V4 ${Array.from({ length: 24 }, (_, idx) => {
              const x1 = 1440 - idx * 60;
              const cx = x1 - 30;
              const x2 = x1 - 60;
              return `Q ${cx} 22 ${x2} 4`;
            }).join(' ')} Z`}
            fill="#5B4BFF"
          />
          <path
            d={`M0 4 ${Array.from({ length: 24 }, (_, idx) => {
              const x1 = idx * 60;
              const cx = x1 + 30;
              const x2 = x1 + 60;
              return `Q ${cx} 22 ${x2} 4`;
            }).join(' ')}`}
            fill="none"
            stroke="#111111"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
};
