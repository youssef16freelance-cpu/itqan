import React from 'react';
import { BookOpen, Compass, ArrowLeft, Play, Sparkles, Clock, MapPin } from 'lucide-react';
import { ISLAMIC_IMAGES } from '../../assets/images';
import { EgyptPrayerCalculationResult } from '../../services/egyptTimeService';

interface HeroBannerProps {
  prayerData: EgyptPrayerCalculationResult;
  onStartJourney: () => void;
  onOpenQuran: () => void;
  onOpenPrayerTimes?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  prayerData,
  onStartJourney,
  onOpenQuran,
  onOpenPrayerTimes
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#c59b27]/35 shadow-2xl bg-[#041611] transition-all">
      {/* Background Cinematic Realistic Photo of Islamic Grand Mosque at Sunrise */}
      <div className="absolute inset-0 z-0">
        <img
          src={ISLAMIC_IMAGES.heroSunrise}
          alt="مسجد إسلامي عند الشروق مع مصحف مفتوح على حامل خشبي وفانوس دافئ"
          className="w-full h-full object-cover object-center scale-[1.01] transform transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic Scrims: Multi-layer gradient overlays ensuring 100% WCAG AA text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041611] via-[#041611]/85 to-[#041611]/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041611]/95 via-[#041611]/70 to-transparent" />
        <div className="absolute inset-0 bg-[#020e0a]/35 mix-blend-multiply" />
      </div>

      {/* Delicate Gilded Corner Arabesque Brackets */}
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#c59b27]/60 z-10 pointer-events-none" />
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#c59b27]/60 z-10 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#c59b27]/60 z-10 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#c59b27]/60 z-10 pointer-events-none" />

      {/* Decorative Traditional Arch Accent Outline */}
      <div className="absolute inset-x-8 sm:inset-x-16 top-0 bottom-4 border-t border-x border-[#c59b27]/15 rounded-t-[5rem] sm:rounded-t-[8rem] pointer-events-none z-10" />

      {/* Main Content Area */}
      <div className="relative z-10 p-6 sm:p-10 md:p-14 lg:p-16 max-w-4xl">
        <div className="space-y-6">
          {/* Subtle Islamic Editorial Kicker & Live Time Now in Egypt (Giza) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#03150f]/90 border border-[#c59b27]/40 text-[#d4af37] text-xs font-medium tracking-wide shadow-md backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="font-display">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
              <span className="text-[#ded3c0]/40" aria-hidden="true">·</span>
              <span className="text-[#ded3c0]/90">منظومة إتقان</span>
            </div>

            {/* Time Now in Egypt / Giza with live pulse */}
            {prayerData && (
              <div
                onClick={onOpenPrayerTimes}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07261d]/95 hover:bg-[#0c382b] border border-[#c59b27]/45 text-xs text-[#fbf8f2] backdrop-blur-md shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                title="اضغط لاختيار أو تعديل المحافظة المصرية (٢٧ محافظة معتمدة)"
              >
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-[#ded3c0]/90">الوقت الآن في</span>
                <span className="font-bold text-[#f2dc87] flex items-center gap-1">
                  <span>{prayerData.city.name}</span>
                  {prayerData.city.id === 'giza' && <span className="text-[10px] text-[#d4af37]">★</span>}
                </span>
                <span className="font-mono tabular-nums font-bold text-[#d4af37] tracking-wider">
                  {prayerData.currentTimeInEgypt12h}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
            )}
          </div>

          {/* Main Headline Requested: «اجعل يومك أقرب إلى الله… وأكثر اتزانًا» */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#fbf8f2] font-display leading-[1.25] text-balance">
            اجعل يومك أقرب إلى الله…{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#f5d77f] via-[#d4af37] to-[#c59b27] drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]">
              وأكثر اتزانًا
            </span>
          </h1>

          {/* Descriptive Text Requested:
              «مصحفك، أذكارك، مواقيت صلاتك، وخطتك اليومية في مكان واحد، لتعيش حياة أكثر توازنًا وطمأنينة.» */}
          <p className="text-sm sm:text-base md:text-lg text-[#ded3c0]/90 leading-relaxed max-w-2xl text-pretty font-normal">
            مصحفك، أذكارك، مواقيت صلاتك، وخطتك اليومية في مكان واحد، لتعيش حياة أكثر توازنًا وطمأنينة، تجمع بين بركة الوحي والإنتاجية العالية.
          </p>

          {/* Action Buttons Requested: «ابدأ رحلتك الآن» و «اقرأ القرآن الكريم» */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onStartJourney}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-l from-[#d4af37] via-[#c59b27] to-[#aa831b] hover:from-[#e3c152] hover:to-[#b89022] text-[#041611] font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl shadow-[#041611]/80 transition-all hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
            >
              <span>ابدأ رحلتك الآن</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.4]" />
            </button>

            <button
              onClick={onOpenQuran}
              className="px-6 py-3.5 rounded-xl bg-[#062118]/85 hover:bg-[#0a3327] text-[#fbf8f2] font-medium text-xs sm:text-sm flex items-center gap-2.5 border border-[#c59b27]/40 shadow-lg backdrop-blur-sm transition-all hover:border-[#d4af37] cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span>اقرأ القرآن الكريم</span>
            </button>

            {/* Next Prayer Live Snapshot Pill with Egyptian City */}
            {prayerData && prayerData.nextPrayer && (
              <div
                onClick={onOpenPrayerTimes}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#03150f]/85 border border-[#c59b27]/35 text-xs text-[#ded3c0]/90 backdrop-blur-sm cursor-pointer hover:border-[#d4af37] transition-all hover:scale-[1.01]"
                title="عرض وتعديل جدول مواقيت الصلاة والمحافظات"
              >
                <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="font-bold text-[#f2dc87] px-2 py-0.5 rounded-lg bg-[#07251d] border border-[#c59b27]/35 text-[11px] flex items-center gap-1">
                  <span>🇪🇬</span>
                  <span>{prayerData.city.name}</span>
                </span>
                <span>الصلاة القادمة:</span>
                <span className="font-bold text-[#fbf8f2]">صلاة {prayerData.nextPrayer.name}</span>
                <span className="font-mono text-[#d4af37] tabular-nums font-bold">({prayerData.nextPrayer.time12h})</span>
                <span className="hidden md:inline text-[11px] text-[#ded3c0]/60">· متبقي {prayerData.timeRemainingStr}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
