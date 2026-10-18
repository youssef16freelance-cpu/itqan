import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CloudRain,
  X,
  Maximize2,
  Minimize2,
  BookOpen,
  Volume2,
  Sparkles,
  Info
} from 'lucide-react';
import { Ayah, Reciter, SurahMeta } from '../../types';

interface QuranCalmModeProps {
  surah: SurahMeta;
  ayahs: Ayah[];
  currentAyahIndex: number;
  isPlaying: boolean;
  reciter: Reciter;
  playbackSpeed: number;
  repeatCount: number;
  rainEnabled: boolean;
  rainVolume: number;
  onTogglePlay: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  onSelectAyah: (idx: number) => void;
  onChangeSpeed: (spd: number) => void;
  onToggleRepeat: () => void;
  onToggleRain: () => void;
  onChangeRainVolume: (vol: number) => void;
  onExit: () => void;
}

export const QuranCalmMode: React.FC<QuranCalmModeProps> = ({
  surah,
  ayahs,
  currentAyahIndex,
  isPlaying,
  reciter,
  playbackSpeed,
  repeatCount,
  rainEnabled,
  rainVolume,
  onTogglePlay,
  onNextAyah,
  onPrevAyah,
  onSelectAyah,
  onChangeSpeed,
  onToggleRepeat,
  onToggleRain,
  onChangeRainVolume,
  onExit
}) => {
  const [showTafseer, setShowTafseer] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const activeAyahRef = useRef<HTMLDivElement | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const activeAyah = ayahs[currentAyahIndex] || ayahs[0];

  // Auto-scroll active ayah into center view
  useEffect(() => {
    if (activeAyahRef.current) {
      activeAyahRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentAyahIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      } else if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.key === 'ArrowLeft') {
        onNextAyah();
      } else if (e.key === 'ArrowRight') {
        onPrevAyah();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit, onTogglePlay, onNextAyah, onPrevAyah]);

  // Fullscreen toggler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Idle dimming of UI controls
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 4500);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-stone-950 text-stone-100 flex flex-col justify-between overflow-hidden select-none"
      style={{
        backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(6, 78, 59, 0.22) 0%, rgba(12, 10, 9, 0.98) 75%)'
      }}
    >
      {/* Subtle Ambient Floating Aura */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0,transparent_70%)] animate-pulse" />

      {/* Top Header Bar */}
      <header
        className={`relative z-20 flex items-center justify-between p-4 md:p-6 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none md:opacity-20 md:hover:opacity-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors cursor-pointer text-xs font-semibold backdrop-blur-md"
            title="الخروج من الوضع الهادئ (Esc)"
          >
            <X className="w-4 h-4 text-emerald-400" />
            <span>الخروج من الوضع الهادئ</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400 bg-stone-900/60 px-3 py-1.5 rounded-xl border border-stone-800 backdrop-blur-md">
            <span className="font-bold text-white">سورة {surah.name}</span>
            <span>·</span>
            <span>القارئ: <strong className="text-emerald-300">{reciter.name}</strong></span>
          </div>
        </div>

        {/* Center Surah title & Ayah position */}
        <div className="text-center">
          <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>الوضع الهادئ وسكينة التلاوة</span>
          </div>
          <div className="text-[11px] text-stone-400 font-mono mt-0.5">
            الآية {currentAyahIndex + 1} من {ayahs.length}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Tafseer Toggle */}
          <button
            onClick={() => setShowTafseer(prev => !prev)}
            className={`p-2 rounded-xl text-xs transition-colors cursor-pointer border backdrop-blur-md ${
              showTafseer
                ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                : 'bg-stone-900/80 text-stone-400 hover:text-white border-stone-800'
            }`}
            title="إظهار/إخفاء التفسير الميسر"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors cursor-pointer backdrop-blur-md"
            title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Peaceful Verse Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-12 max-w-4xl mx-auto w-full text-center overflow-y-auto scrollbar-none py-6">
        {activeAyah && (
          <div ref={activeAyahRef} className="space-y-6 my-auto transition-all duration-300 animate-fadeIn">
            {/* Basmalah if Ayah 1 and not Tawbah/Fatihah */}
            {currentAyahIndex === 0 && surah.id !== 9 && surah.id !== 1 && (
              <p className="text-xl md:text-2xl font-serif text-emerald-400/90 tracking-wide pb-2">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            )}

            {/* The Holy Ayah Text */}
            <div className="relative p-6 md:p-10 rounded-3xl bg-stone-900/40 border border-stone-800/80 shadow-2xl backdrop-blur-md">
              <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-emerald-50 leading-loose tracking-wide text-balance">
                {activeAyah.text}
                <span className="inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 font-mono text-sm md:text-base mr-3 align-middle">
                  {activeAyah.numberInSurah}
                </span>
              </p>
            </div>

            {/* Tafseer Display (if toggled on) */}
            {showTafseer && activeAyah.tafseer && (
              <div className="p-4 md:p-6 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-stone-300 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto shadow-lg backdrop-blur-md">
                <div className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center justify-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>التفسير الميسر</span>
                </div>
                <p>{activeAyah.tafseer}</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Island Bottom Player */}
      <footer
        className={`relative z-20 p-4 md:pb-8 flex flex-col items-center justify-center transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none md:opacity-20 md:hover:opacity-100'
        }`}
      >
        <div className="bg-stone-900/85 border border-stone-800/90 rounded-2xl md:rounded-full px-5 py-3 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-center gap-4 md:gap-6 max-w-2xl w-full">
          {/* Previous Ayah */}
          <button
            onClick={onPrevAyah}
            disabled={currentAyahIndex === 0}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
            title="الآية السابقة"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Primary Radiant Play / Pause Button */}
          <button
            onClick={onTogglePlay}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white flex items-center justify-center shadow-lg shadow-emerald-950 transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-500/20"
            title={isPlaying ? 'إيقاف مؤقت (Space)' : 'تشغيل التلاوة (Space)'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>

          {/* Next Ayah */}
          <button
            onClick={onNextAyah}
            disabled={currentAyahIndex === ayahs.length - 1}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
            title="الآية التالية"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-stone-800 hidden sm:block" />

          {/* Quran Rain Atmosphere Toggle & Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleRain}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border ${
                rainEnabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-stone-800/80 text-stone-500 border-stone-800'
              }`}
              title={rainEnabled ? 'مؤثرات المطر: مفعلة' : 'تفعيل صوت رذاذ المطر الهادئ'}
            >
              <CloudRain className="w-4 h-4" />
              <span className="text-[11px] font-semibold hidden md:inline">
                {rainEnabled ? 'مطر وسكينة' : 'بدون مطر'}
              </span>
            </button>

            {rainEnabled && (
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={rainVolume}
                onChange={e => onChangeRainVolume(Number(e.target.value))}
                className="w-16 accent-amber-500 cursor-pointer"
                title="شدة صوت المطر"
              />
            )}
          </div>

          <div className="h-6 w-px bg-stone-800 hidden sm:block" />

          {/* Playback Speed */}
          <button
            onClick={() => {
              const next = playbackSpeed === 1.0 ? 1.25 : playbackSpeed === 1.25 ? 0.8 : 1.0;
              onChangeSpeed(next);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 font-mono text-xs cursor-pointer"
            title="سرعة التلاوة"
          >
            {playbackSpeed}x
          </button>

          {/* Repeat Button */}
          {reciter.supportsAyahAudio && (
            <button
              onClick={onToggleRepeat}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer border ${
                repeatCount > 1
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
              title="تكرار الآية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{repeatCount}x</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
