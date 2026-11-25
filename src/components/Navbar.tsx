import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../data/academeData';
import { computeNavState } from '../utils/logic';
import { PebbyLogoMark } from './PebbyMascot';

interface NavbarProps {
  onDownloadClick: () => void;
  onNavigateSection?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onDownloadClick, onNavigateSection }) => {
  const [isFloating, setIsFloating] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const lastScrollY = useRef(0);
  const prevFloating = useRef(false);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ x: number; width: number; visible: boolean }>({
    x: 0,
    width: 0,
    visible: false,
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Scroll listener for two-state morph + hide/reveal + fade-out near footer
  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const currentY = window.scrollY;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollProgress = Math.min(1, Math.max(0, currentY / maxScroll));

        const next = computeNavState({
          scrollY: currentY,
          lastScrollY: lastScrollY.current,
          reducedMotion,
          menuOpen: mobileMenuOpen,
          scrollProgress,
        });
        setIsFloating(next.isFloating);
        setIsHidden(next.isHidden);
        lastScrollY.current = currentY;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, mobileMenuOpen]);

  // Trigger tiny Pebby blink whenever nav morphs between integrated <-> floating
  useEffect(() => {
    if (prevFloating.current !== isFloating) {
      prevFloating.current = isFloating;
      setIsBlinking(true);
      const timer = window.setTimeout(() => setIsBlinking(false), 260);
      return () => window.clearTimeout(timer);
    }
  }, [isFloating]);

  // Scroll-spy for active section indicator (evaluated in DOM vertical order)
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-28% 0px -48% 0px',
        threshold: [0.1, 0.35, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));

    const handleScrollSpyFallback = () => {
      if (window.scrollY < 260) {
        setActiveSection('');
        return;
      }
      const triggerY = window.innerHeight * 0.36;
      for (let i = elements.length - 1; i >= 0; i--) {
        const rect = elements[i].getBoundingClientRect();
        if (rect.top <= triggerY && rect.bottom >= 100) {
          setActiveSection(elements[i].id);
          return;
        }
      }
    };
    window.addEventListener('scroll', handleScrollSpyFallback, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollSpyFallback);
    };
  }, []);

  // Measure sliding amber pill behind active nav link
  const updatePillPosition = () => {
    const container = navContainerRef.current;
    const activeEl = activeSection ? linkRefs.current[activeSection] : null;
    if (!container || !activeEl) {
      setPillStyle((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }
    const cRect = container.getBoundingClientRect();
    const lRect = activeEl.getBoundingClientRect();
    setPillStyle({
      x: lRect.left - cRect.left,
      width: lRect.width,
      visible: true,
    });
  };

  useLayoutEffect(() => {
    updatePillPosition();
    window.addEventListener('resize', updatePillPosition);
    return () => window.removeEventListener('resize', updatePillPosition);
  }, [activeSection, isFloating]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        data-testid="site-navbar"
        data-nav-state={isFloating ? 'floating' : 'integrated'}
        data-nav-hidden={isHidden ? 'true' : 'false'}
        className="fixed inset-x-0 top-0 z-50 pointer-events-none"
        style={{
          transform: isHidden ? 'translate3d(0, -120%, 0)' : 'translate3d(0, 0, 0)',
          opacity: isHidden ? 0 : 1,
          transition: reducedMotion
            ? 'none'
            : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease',
        }}
      >
        <div
          className={`mx-auto px-4 sm:px-6 transition-[padding] duration-500 ${
            isFloating ? 'pt-4' : 'pt-5 sm:pt-6'
          }`}
        >
          <div
            className={`pointer-events-auto mx-auto flex items-center justify-between gap-4 sm:gap-8 ${
              isFloating
                ? 'max-w-[920px] rounded-full bg-white border-[3px] border-[#111111] shadow-[5px_5px_0_#111111] px-4 sm:px-5 py-2'
                : 'max-w-[1240px] rounded-none bg-transparent border-[3px] border-transparent shadow-none px-0 py-1.5'
            }`}
            style={{
              transition: reducedMotion
                ? 'none'
                : 'max-width 500ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 320ms ease, border-color 320ms ease, box-shadow 380ms cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 420ms ease, padding 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Zone 1: Brand wordmark + tiny blinking Pebby face */}
            <a
              href="#hero"
              aria-label="ACADEMe home"
              onClick={(e) => {
                if (onNavigateSection) {
                  e.preventDefault();
                  onNavigateSection('hero');
                }
              }}
              className="flex items-center gap-2 whitespace-nowrap shrink-0 group focus-visible:rounded-full"
              style={{
                transform: isFloating ? 'scale(0.94)' : 'scale(1)',
                transformOrigin: 'left center',
                transition: reducedMotion ? 'none' : 'transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <PebbyLogoMark isBlinking={isBlinking} size={isFloating ? 'sm' : 'md'} />
              <span className="font-display font-extrabold text-[1.35rem] sm:text-[1.5rem] tracking-tight text-[#111111]">
                ACADEM<span className="text-[#5B4BFF]">e</span>
              </span>
            </a>

            {/* Zone 2: Desktop Navigation Links + sliding amber scroll-spy pill */}
            <nav
              aria-label="Primary navigation"
              ref={navContainerRef}
              className="hidden md:flex items-center gap-1 lg:gap-2 relative"
            >
              {/* Sliding amber active pill */}
              <span
                aria-hidden="true"
                className="absolute top-1 bottom-1 left-0 rounded-full bg-[#FFA500]/90 border-2 border-[#111111] pointer-events-none"
                style={{
                  transform: `translate3d(${pillStyle.x}px, 0, 0)`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.visible ? 1 : 0,
                  transition: reducedMotion
                    ? 'none'
                    : 'transform 360ms cubic-bezier(0.34, 1.56, 0.64, 1), width 320ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 180ms ease',
                }}
              />

              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    ref={(el) => {
                      linkRefs.current[item.id] = el;
                    }}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      if (onNavigateSection) {
                        e.preventDefault();
                        onNavigateSection(item.id);
                      }
                    }}
                    className={`nav-link-item relative z-10 px-3.5 py-2 text-sm font-semibold whitespace-nowrap shrink-0 rounded-full ${
                      isActive ? 'text-[#111111]' : 'text-[#111111]/80 hover:text-[#111111]'
                    }`}
                  >
                    {item.label}
                    {!isActive && (
                      <svg
                        viewBox="0 0 60 8"
                        fill="none"
                        aria-hidden="true"
                        className="nav-link-squiggle w-[calc(100%-14px)]"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M2 5 Q10 1 18 5 T34 5 T50 5 T58 4"
                          stroke="#5B4BFF"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Zone 3: Single Primary Action + Mobile Hamburger */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onDownloadClick}
                className={`hidden md:inline-flex items-center justify-center gap-2 font-display font-bold whitespace-nowrap shrink-0 text-white bg-[#5B4BFF] hover:bg-[#4435E6] ${
                  isFloating
                    ? 'neo-btn-sm px-4 py-2 text-xs'
                    : 'neo-btn px-5 py-2.5 text-sm'
                }`}
              >
                <span>Get the app</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-overlay"
                className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FFF8E1] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#111111]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Overlay Menu with staggered reveals */}
      <div
        id="mobile-nav-overlay"
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-40 md:hidden bg-[#FFF8E1] flex flex-col justify-between px-6 pt-28 pb-10 transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col gap-3">
          {NAV_ITEMS.map((item, idx) => (
            <a
              key={item.id}
              href={item.href}
              tabIndex={mobileMenuOpen ? 0 : -1}
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (onNavigateSection) {
                  e.preventDefault();
                  onNavigateSection(item.id);
                }
              }}
              style={{
                transitionDelay: mobileMenuOpen && !reducedMotion ? `${idx * 55}ms` : '0ms',
              }}
              className={`font-display font-extrabold text-3xl text-[#111111] py-3 border-b-2 border-[#111111]/15 flex items-center justify-between transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-sm font-mono text-[#5B4BFF]">0{idx + 1}</span>
            </a>
          ))}
        </nav>

        <div className="space-y-4">
          <button
            type="button"
            tabIndex={mobileMenuOpen ? 0 : -1}
            onClick={() => {
              setMobileMenuOpen(false);
              onDownloadClick();
            }}
            className="neo-btn w-full py-4 px-6 bg-[#5B4BFF] text-white font-display font-bold text-base"
          >
            Get the app
          </button>
          <p className="text-center text-sm text-[#111111]/70">
            Class 6–12 · CBSE, ICSE &amp; ISC · Free at the core
          </p>
        </div>
      </div>
    </>
  );
};
