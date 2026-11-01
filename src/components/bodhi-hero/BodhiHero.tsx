/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BodhiBirds } from './BodhiBirds';
import { BodhiLeaves } from './BodhiLeaves';
import { BodhiParticles } from './BodhiParticles';
import { DeviceCapabilities, BodhiHeroProps } from './types';
import {
  Sparkles,
  BookOpen,
  Mic,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  ArrowRight,
  Hand,
  Volume2,
  ChevronDown
} from 'lucide-react';
import { GurukulLogo } from '../GurukulLogo';

export const BodhiHero: React.FC<BodhiHeroProps> = ({
  onSelectRole,
  uiLang,
  onToggleLang,
  darkMode = false,
  onToggleDarkMode,
  onOpenTests,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(darkMode);
  const [burstTrigger, setBurstTrigger] = useState<number>(0);
  const [burstOrigin, setBurstOrigin] = useState<{ x: number; y: number } | null>(null);
  const [cardRevealed, setCardRevealed] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showInteractionTip, setShowInteractionTip] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Device capability detection (Low-end Android / CPU constraints & reduced motion)
  const [device, setDevice] = useState<DeviceCapabilities>({
    isLowEnd: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    if (darkMode !== undefined) {
      setIsDarkMode(darkMode);
    }
  }, [darkMode]);

  useEffect(() => {
    const isLowConcurrency =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 4;

    const isLowMemory =
      typeof navigator !== 'undefined' &&
      (navigator as any).deviceMemory !== undefined &&
      (navigator as any).deviceMemory <= 2;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setDevice({
      isLowEnd: isLowConcurrency || isLowMemory,
      prefersReducedMotion,
    });

    // Staggered reveal for Hero Glass Card: smoothly rises after initial birds launch
    const timer = setTimeout(() => {
      setCardRevealed(true);
    }, prefersReducedMotion ? 100 : 1200);

    return () => clearTimeout(timer);
  }, []);

  // Parallax on mouse move for desktop
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (device.prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    setMousePos({ x: relX, y: relY });

    if (!device.isLowEnd) {
      // Subtle shift: max 12px horizontal, 8px vertical
      const shiftX = (relX - 0.5) * 12;
      const shiftY = (relY - 0.5) * 8;
      setParallaxOffset({ x: shiftX, y: shiftY });
    }
  }, [device]);

  // Touch drag subtle parallax on mobile
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (device.prefersReducedMotion || !containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (touch.clientX - rect.left) / rect.width;
    const relY = (touch.clientY - rect.top) / rect.height;

    setMousePos({ x: relX, y: relY });
    const shiftX = (relX - 0.5) * 6;
    const shiftY = (relY - 0.5) * 4;
    setParallaxOffset({ x: shiftX, y: shiftY });
  }, [device]);

  // Interactive Tree Tap / Click: Release burst of birds and falling peepal leaves
  const triggerTreeBurst = (e?: React.MouseEvent | React.KeyboardEvent) => {
    let origin = { x: 50, y: 52 };
    if (e && 'clientX' in e && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      origin = { x, y: Math.max(38, Math.min(65, y)) };
    }
    setBurstOrigin(origin);
    setBurstTrigger(prev => prev + 1);
    setShowInteractionTip(false);
  };

  const toggleLanguage = () => {
    if (onToggleLang) onToggleLang();
  };

  const toggleDark = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (onToggleDarkMode) onToggleDarkMode();
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full overflow-hidden select-none transition-colors duration-700 min-h-[660px] sm:min-h-[760px] lg:min-h-[860px] flex flex-col justify-end bg-slate-950/25"
      aria-label="Gurukul AI Bodhi Vriksh Hero Section"
    >
      <style>{`
        @keyframes breathingZoom {
          0%, 100% {
            transform: scale(1.00) translate(0px, 0px);
          }
          50% {
            transform: scale(1.035) translate(0px, -4px);
          }
        }
        @keyframes pulseSunRays {
          0%, 100% {
            opacity: 0.55;
            transform: rotate(-3deg) scale(0.96);
          }
          50% {
            opacity: 0.92;
            transform: rotate(3deg) scale(1.04);
          }
        }
        @keyframes trunkHeartbeat {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.95);
          }
          14% {
            opacity: 0.8;
            transform: scale(1.06);
          }
          28% {
            opacity: 0.45;
            transform: scale(0.98);
          }
          42% {
            opacity: 0.9;
            transform: scale(1.09);
          }
          70% {
            opacity: 0.35;
            transform: scale(0.95);
          }
        }
        @keyframes pulseGlowRing {
          0%, 100% {
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.25);
          }
          50% {
            box-shadow: 0 0 35px rgba(245, 158, 11, 0.6);
          }
        }
      `}</style>

      {/* ------------------------------------------------------------- */}
      {/* LAYER 1: BASE IMAGE (object-cover, 20s breathing zoom & parallax) */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
        }}
      >
        <picture>
          {/* Compressed WebP (287KB) with original PNG fallback */}
          <source srcSet="/bodhi_vriksh.webp" type="image/webp" />
          <img
            src="/bodhi_vriksh.png"
            alt="A glowing bodhi tree with golden light and birds, with the tagline Roots of knowledge, wings of tomorrow"
            className="w-full h-full object-cover object-center transform origin-center transition-opacity duration-700"
            style={{
              animation: device.prefersReducedMotion
                ? 'none'
                : 'breathingZoom 20s ease-in-out infinite',
              filter: isDarkMode
                ? 'brightness(0.82) contrast(1.12) saturate(1.1)'
                : 'brightness(1.0) contrast(1.0)',
            }}
          />
        </picture>
      </div>

      {/* Dark Mode Background Tone Overlay */}
      {isDarkMode && (
        <div
          className="absolute inset-0 bg-slate-950/40 mix-blend-multiply pointer-events-none z-1"
          aria-hidden="true"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* LAYER 2: LIGHT RAYS (Near sun gap at x:53%, y:55%, screen blend) */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute pointer-events-none z-5 overflow-hidden"
        style={{
          left: '53%',
          top: '55%',
          width: '520px',
          height: '520px',
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden="true"
      >
        <div
          className="w-full h-full rounded-full transition-opacity duration-1000"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(251,191,36,0.65) 0%, rgba(245,158,11,0.35) 35%, rgba(217,119,6,0.1) 65%, rgba(0,0,0,0) 80%)'
              : 'radial-gradient(circle, rgba(255,243,205,0.7) 0%, rgba(254,215,170,0.4) 38%, rgba(251,191,36,0.15) 65%, rgba(255,255,255,0) 80%)',
            mixBlendMode: 'screen',
            animation: device.prefersReducedMotion
              ? 'none'
              : 'pulseSunRays 6s ease-in-out infinite',
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LAYER 3: BIRDS (SVG Flapping Silhouettes with Bezier takeoff) */}
      {/* ------------------------------------------------------------- */}
      <BodhiBirds
        device={device}
        burstTrigger={burstTrigger}
        burstOrigin={burstOrigin}
        darkMode={isDarkMode}
      />

      {/* ------------------------------------------------------------- */}
      {/* LAYER 4: FALLING PEEPAL LEAVES (Green & Gold 3D swaying leaves) */}
      {/* ------------------------------------------------------------- */}
      <BodhiLeaves
        device={device}
        burstTrigger={burstTrigger}
        burstOrigin={burstOrigin}
      />

      {/* ------------------------------------------------------------- */}
      {/* LAYER 5: CANVAS FIREFLIES & GOLDEN PARTICLES (Trunk & Roots) */}
      {/* ------------------------------------------------------------- */}
      <BodhiParticles
        device={device}
        darkMode={isDarkMode}
        mousePos={mousePos}
      />

      {/* ------------------------------------------------------------- */}
      {/* LAYER 6: TRUNK GLOW (4s Heartbeat-like pulsating golden aura) */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute pointer-events-none z-10"
        style={{
          left: '49.8%',
          top: '78%',
          width: '240px',
          height: '240px',
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden="true"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(251,191,36,0.7) 0%, rgba(245,158,11,0.3) 45%, rgba(217,119,6,0) 75%)'
              : 'radial-gradient(circle, rgba(254,240,138,0.6) 0%, rgba(245,158,11,0.25) 45%, rgba(255,255,255,0) 75%)',
            mixBlendMode: 'screen',
            animation: device.prefersReducedMotion
              ? 'none'
              : 'trunkHeartbeat 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE TREE HOTSPOT BUTTON (Tap/Click to Release Birds)  */}
      {/* ------------------------------------------------------------- */}
      <button
        type="button"
        onClick={triggerTreeBurst}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && triggerTreeBurst(e)}
        className="absolute z-25 cursor-pointer rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-amber-400/80 group"
        style={{
          left: '32%',
          top: '40%',
          width: '36%',
          height: '42%',
        }}
        aria-label={
          uiLang === 'hi'
            ? 'बोधिवृक्ष को स्पर्श करें (पक्षी और पत्ते उड़ाने के लिए टैप करें या एंटर दबाएं)'
            : 'Awaken the Bodhi Tree (tap or press Enter to release birds and leaves)'
        }
      >
        {/* Subtle interactive hover indicator ring */}
        <span className="sr-only">Interactive Bodhi Tree</span>
        <div className="w-full h-full rounded-full border border-transparent group-hover:border-amber-400/40 group-hover:bg-amber-400/5 transition duration-300" />
      </button>

      {/* Floating Interaction Hint Tooltip */}
      {showInteractionTip && !device.prefersReducedMotion && (
        <div
          className="absolute z-30 left-1/2 top-[58%] transform -translate-x-1/2 pointer-events-none animate-bounce hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/60 dark:bg-slate-900/80 text-white backdrop-blur-md text-[11px] font-semibold border border-amber-300/40 shadow-lg"
          aria-hidden="true"
        >
          <Hand className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>
            {uiLang === 'hi'
              ? 'वृक्ष को स्पर्श करें (Tap the Bodhi tree)'
              : 'Touch the Bodhi Tree to release birds & leaves'}
          </span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. GURUKUL AI BRAND BADGE / TAG (ON THE FIRST PAGE)           */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-4 left-4 sm:left-6 z-35 flex items-center space-x-2">
        <div className="p-2 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-amber-400/40 shadow-2xl">
          <GurukulLogo uiLang={uiLang} size="md" showTagline={true} />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP CONTROLS BAR: Language Switcher, Dark Mode, Quick Badge */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-4 right-4 sm:right-6 z-35 flex items-center space-x-2">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-amber-300/60 dark:border-amber-800 text-slate-800 dark:text-slate-100 shadow-md hover:bg-white transition"
          title="Toggle English / हिंदी"
        >
          <Globe className="w-3.5 h-3.5 text-amber-600" />
          <span>{uiLang === 'en' ? 'हिन्दी' : 'EN'}</span>
        </button>

        {/* Light/Dark Mode Toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-xl text-xs bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-amber-300/60 dark:border-amber-800 text-slate-800 dark:text-slate-100 shadow-md hover:bg-white transition"
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LAYER 7: MINIMAL FLOATING ACTION DOCK & SCROLL PROMPT          */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-30 max-w-4xl mx-auto w-full px-4 pb-8 sm:pb-12 flex flex-col items-center space-y-4">
        
        {/* Sleek Floating Action Pill - Background Animation 100% Visible */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border border-amber-300/60 dark:border-amber-700/60 shadow-2xl">
          {/* Awaken Tree */}
          <button
            onClick={() => triggerTreeBurst()}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold hover:bg-amber-100/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition transform hover:scale-105"
            title="Release birds and falling leaves"
          >
            <Hand className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>{uiLang === 'hi' ? 'वृक्ष को जगाएं' : 'Awaken Tree'}</span>
          </button>

          {/* Try as a teacher button */}
          <button
            onClick={() => onSelectRole('teacher')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white shadow-md shadow-amber-500/25 transition transform hover:scale-105"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{uiLang === 'hi' ? 'शिक्षक पोर्टल खोलें' : 'Try as a teacher'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Ask a doubt button */}
          <button
            onClick={() => onSelectRole('student')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold hover:bg-amber-100/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition transform hover:scale-105"
          >
            <Mic className="w-3.5 h-3.5 text-amber-600" />
            <span>{uiLang === 'hi' ? 'सवाल पूछें' : 'Ask a doubt'}</span>
          </button>

          {/* Self-Test Badge */}
          {onOpenTests && (
            <button
              onClick={onOpenTests}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>5/5 PASS</span>
            </button>
          )}
        </div>

        {/* Scroll indicator down to Gurukul AI Intro Card */}
        <button
          onClick={() => {
            const el = document.getElementById('gurukul-intro');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-amber-200/60 dark:border-amber-800/50 hover:bg-white/90 dark:hover:bg-slate-900/90 shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {uiLang === 'hi'
              ? 'गुरुकुल AI का पूरा परिचय नीचे देखें'
              : 'Explore Gurukul AI Below'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-amber-600 animate-bounce group-hover:translate-y-0.5 transition-transform" />
        </button>

      </div>
    </section>
  );
};
