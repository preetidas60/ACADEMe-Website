import React, { useEffect, useRef, useState } from 'react';

/**
 * Lightweight desktop-only custom cursor:
 * Small near-black dot that smoothly expands into a Pebby-colored ring over interactive elements.
 * Automatically disabled on touch devices and when prefers-reduced-motion is active.
 */
export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldEnable = finePointer.matches && !reduced.matches;
    setEnabled(shouldEnable);

    if (shouldEnable) {
      document.documentElement.classList.add('custom-cursor-active');
    } else {
      document.documentElement.classList.remove('custom-cursor-active');
    }

    const onChange = () => {
      const next = finePointer.matches && !reduced.matches;
      setEnabled(next);
      document.documentElement.classList.toggle('custom-cursor-active', next);
    };

    finePointer.addEventListener('change', onChange);
    reduced.addEventListener('change', onChange);
    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      finePointer.removeEventListener('change', onChange);
      reduced.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.25;
      currentY += (targetY - currentY) * 0.25;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = window.requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);
      const target = e.target as HTMLElement | null;
      const interactive = Boolean(
        target?.closest('a, button, [role="button"], input, summary, label')
      );
      setIsInteractive(interactive);
    };

    const onLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[100] pointer-events-none hidden md:block"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 160ms ease',
      }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ease-out"
        style={{
          width: isInteractive ? 36 : 10,
          height: isInteractive ? 36 : 10,
          backgroundColor: isInteractive ? 'rgba(140, 125, 255, 0.22)' : '#111111',
          border: isInteractive ? '2.5px solid #5B4BFF' : '0px solid transparent',
        }}
      />
    </div>
  );
};
