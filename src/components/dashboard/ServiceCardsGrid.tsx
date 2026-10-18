import React from 'react';
import { Compass, BookOpen, ShieldCheck, Timer, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { ISLAMIC_IMAGES } from '../../assets/images';
import { NavTab } from '../layout/Navigation';
import { EgyptPrayerCalculationResult } from '../../services/egyptTimeService';

interface ServiceCardsGridProps {
  prayerData: EgyptPrayerCalculationResult;
  onNavigate: (tab: NavTab) => void;
  onStartCustomTimer: (minutes: number) => void;
  onScrollToPrayerBoard?: () => void;
}

export const ServiceCardsGrid: React.FC<ServiceCardsGridProps> = ({
  prayerData,
  onNavigate,
  onStartCustomTimer,
  onScrollToPrayerBoard
}) => {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#c59b27]/20 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>أركان المنظومة الإسلامية المتكاملة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#fbf8f2] font-display mt-0.5">
            خدمات إتقان اليومية
          </h2>
        </div>
        <p className="text-xs text-[#ded3c0]/70 max-w-md">
          أربعة مسارات مصممة بعناية فائقة لتنظيم عباداتك وأوقاتك وتعميق حضورك الذهني والإيماني طوال اليوم.
        </p>
      </div>

      {/* The 4 Distinct Luxury Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: مواقيت الصلاة */}
        <div
          onClick={() => {
            if (onScrollToPrayerBoard) {
              onScrollToPrayerBoard();
            } else {
              onNavigate('dashboard');
            }
          }}
          className="group relative overflow-hidden rounded-3xl border border-[#c59b27]/30 bg-[#041611] p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#d4af37] hover:scale-[1.02] hover:shadow-2xl cursor-pointer min-h-[360px]"
        >
          {/* Card Realistic Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={ISLAMIC_IMAGES.prayerTimes}
              alt="مواقيت الصلاة في المسجد بأشعة الفجر"
              className="w-full h-full object-cover object-center scale-[1.05] group-hover:scale-[1.12] transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#041611] via-[#041611]/80 to-[#041611]/45" />
            <div className="absolute inset-0 bg-[#020e0a]/40" />
          </div>

          {/* Delicate Top Gold Corner Brackets */}
          <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 border-[#c59b27]/60 z-10 pointer-events-none" />
          <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-[#c59b27]/60 z-10 pointer-events-none" />

          {/* Top Badge & Icon */}
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#06241b]/90 border border-[#c59b27]/50 flex items-center justify-center text-[#d4af37] shadow-lg backdrop-blur-sm group-hover:border-[#d4af37] transition-colors">
              <Compass className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[11px] font-bold text-[#d4af37] px-2.5 py-1 rounded-full bg-[#03150f]/80 border border-[#c59b27]/30 backdrop-blur-sm">
              {prayerData?.city?.name || 'مصر'}
            </span>
          </div>

          {/* Card Content */}
          <div className="relative z-10 space-y-2 mt-auto pt-6">
            <span className="text-xs text-[#c59b27] font-semibold tracking-wide block">
              ركن الصلاة والنداء
            </span>
            <h3 className="text-xl font-bold text-[#fbf8f2] font-display">
              مواقيت الصلاة
            </h3>
            <p className="text-xs text-[#ded3c0]/85 leading-relaxed line-clamp-2">
              جدول أوقات الصلاة الدقيقة الخمس مع الشروق في مصر وتنبيهات الأذان وحساب اتجاه القبلة.
            </p>

            {prayerData && (
              <div className="pt-2 text-[11px] text-[#f2dc87] space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>الساعة الآن ({prayerData.city.name}): <span className="font-mono tabular-nums text-[#d4af37] font-bold">{prayerData.currentTimeInEgypt12h}</span></span>
                </div>
                {prayerData.nextPrayer && (
                  <div className="text-[11px] text-[#ded3c0]/85">
                    القادمة: صلاة {prayerData.nextPrayer.name} ({prayerData.nextPrayer.time12h})
                  </div>
                )}
              </div>
            )}

            {/* Action Row */}
            <div className="pt-3 border-t border-[#c59b27]/25 flex items-center justify-between text-xs font-semibold text-[#d4af37] group-hover:text-[#fbf8f2]">
              <span>متابعة المواقيت</span>
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 2: المصحف الشريف */}
        <div
          onClick={() => onNavigate('quran')}
          className="group relative overflow-hidden rounded-3xl border border-[#c59b27]/30 bg-[#041611] p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#d4af37] hover:scale-[1.02] hover:shadow-2xl cursor-pointer min-h-[360px]"
        >
          {/* Card Realistic Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={ISLAMIC_IMAGES.quranMushaf}
              alt="المصحف الشريف المذهب المفتوح على حامل مزخرف"
              className="w-full h-full object-cover object-center scale-[1.05] group-hover:scale-[1.12] transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#041611] via-[#041611]/80 to-[#041611]/45" />
            <div className="absolute inset-0 bg-[#020e0a]/40" />
          </div>

          {/* Delicate Top Gold Corner Brackets */}
          <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 border-[#c59b27]/60 z-10 pointer-events-none" />
          <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-[#c59b27]/60 z-10 pointer-events-none" />

          {/* Top Badge & Icon */}
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#06241b]/90 border border-[#c59b27]/50 flex items-center justify-center text-[#d4af37] shadow-lg backdrop-blur-sm group-hover:border-[#d4af37] transition-colors">
              <BookOpen className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[11px] font-bold text-[#d4af37] px-2.5 py-1 rounded-full bg-[#03150f]/80 border border-[#c59b27]/30 backdrop-blur-sm">
              ١١٤ سورة
            </span>
          </div>

          {/* Card Content */}
          <div className="relative z-10 space-y-2 mt-auto pt-6">
            <span className="text-xs text-[#c59b27] font-semibold tracking-wide block">
              كلام الله الحكيم
            </span>
            <h3 className="text-xl font-bold text-[#fbf8f2] font-display">
              المصحف الشريف
            </h3>
            <p className="text-xs text-[#ded3c0]/85 leading-relaxed line-clamp-2">
              قراءة ميسرة بالخط العثماني، استماع لتلاوات خمسة من كبار القرّاء، وتفاسير الآيات المعتمدة.
            </p>

            <div className="pt-2 text-[11px] text-[#f2dc87] flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>يشمل التفسير الميسر وحفظ الإشارات</span>
            </div>

            {/* Action Row */}
            <div className="pt-3 border-t border-[#c59b27]/25 flex items-center justify-between text-xs font-semibold text-[#d4af37] group-hover:text-[#fbf8f2]">
              <span>فتح المصحف</span>
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 3: الأذكار اليومية */}
        <div
          onClick={() => onNavigate('hisn_muslim')}
          className="group relative overflow-hidden rounded-3xl border border-[#c59b27]/30 bg-[#041611] p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#d4af37] hover:scale-[1.02] hover:shadow-2xl cursor-pointer min-h-[360px]"
        >
          {/* Card Realistic Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={ISLAMIC_IMAGES.athkarHisn}
              alt="سبحة خشبية وكتاب أذكار حصن المسلم مع فانوس دافئ"
              className="w-full h-full object-cover object-center scale-[1.05] group-hover:scale-[1.12] transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#041611] via-[#041611]/80 to-[#041611]/45" />
            <div className="absolute inset-0 bg-[#020e0a]/40" />
          </div>

          {/* Delicate Top Gold Corner Brackets */}
          <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 border-[#c59b27]/60 z-10 pointer-events-none" />
          <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-[#c59b27]/60 z-10 pointer-events-none" />

          {/* Top Badge & Icon */}
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#06241b]/90 border border-[#c59b27]/50 flex items-center justify-center text-[#d4af37] shadow-lg backdrop-blur-sm group-hover:border-[#d4af37] transition-colors">
              <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[11px] font-bold text-[#d4af37] px-2.5 py-1 rounded-full bg-[#03150f]/80 border border-[#c59b27]/30 backdrop-blur-sm">
              حصن المسلم
            </span>
          </div>

          {/* Card Content */}
          <div className="relative z-10 space-y-2 mt-auto pt-6">
            <span className="text-xs text-[#c59b27] font-semibold tracking-wide block">
              ألا بذكر الله تطمئن القلوب
            </span>
            <h3 className="text-xl font-bold text-[#fbf8f2] font-display">
              الأذكار اليومية
            </h3>
            <p className="text-xs text-[#ded3c0]/85 leading-relaxed line-clamp-2">
              أذكار الصباح والمساء والتحصين الكامل، مع مسبحة رقمية تفاعلية واستحضار الأجور النبوية.
            </p>

            <div className="pt-2 text-[11px] text-[#f2dc87] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>عداد رقمي ذكي مع حفظ الإنجاز</span>
            </div>

            {/* Action Row */}
            <div className="pt-3 border-t border-[#c59b27]/25 flex items-center justify-between text-xs font-semibold text-[#d4af37] group-hover:text-[#fbf8f2]">
              <span>بدء التحصين والذكر</span>
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 4: التركيز والإنتاجية */}
        <div
          onClick={() => onStartCustomTimer(25)}
          className="group relative overflow-hidden rounded-3xl border border-[#c59b27]/30 bg-[#041611] p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#d4af37] hover:scale-[1.02] hover:shadow-2xl cursor-pointer min-h-[360px]"
        >
          {/* Card Realistic Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={ISLAMIC_IMAGES.focusProductivity}
              alt="مكتب دراسة إسلامي أندلسي هادئ مع ساعة رملية ودفتر أنيق"
              className="w-full h-full object-cover object-center scale-[1.05] group-hover:scale-[1.12] transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#041611] via-[#041611]/80 to-[#041611]/45" />
            <div className="absolute inset-0 bg-[#020e0a]/40" />
          </div>

          {/* Delicate Top Gold Corner Brackets */}
          <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 border-[#c59b27]/60 z-10 pointer-events-none" />
          <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-[#c59b27]/60 z-10 pointer-events-none" />

          {/* Top Badge & Icon */}
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#06241b]/90 border border-[#c59b27]/50 flex items-center justify-center text-[#d4af37] shadow-lg backdrop-blur-sm group-hover:border-[#d4af37] transition-colors">
              <Timer className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[11px] font-bold text-[#d4af37] px-2.5 py-1 rounded-full bg-[#03150f]/80 border border-[#c59b27]/30 backdrop-blur-sm">
              بومودورو ٢٥د
            </span>
          </div>

          {/* Card Content */}
          <div className="relative z-10 space-y-2 mt-auto pt-6">
            <span className="text-xs text-[#c59b27] font-semibold tracking-wide block">
              بركة الوقت والإتقان
            </span>
            <h3 className="text-xl font-bold text-[#fbf8f2] font-display">
              التركيز والإنتاجية
            </h3>
            <p className="text-xs text-[#ded3c0]/85 leading-relaxed line-clamp-2">
              مؤقت عمل ودراسة متناغم مع أوقات الصلاة، وأصوات الطبيعة الهادئة لرفع إنتاجيتك في سبيل الله.
            </p>

            <div className="pt-2 text-[11px] text-[#f2dc87] flex items-center gap-1.5 font-medium">
              <Timer className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>جلسات تركيز عميقة مع استراحات مهدئة</span>
            </div>

            {/* Action Row */}
            <div className="pt-3 border-t border-[#c59b27]/25 flex items-center justify-between text-xs font-semibold text-[#d4af37] group-hover:text-[#fbf8f2]">
              <span>بدء جلسة بومودورو</span>
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
