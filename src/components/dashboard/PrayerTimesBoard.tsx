import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Compass, ChevronDown, Check, Sparkles, Filter } from 'lucide-react';
import {
  egyptTimeService,
  EGYPT_CITIES,
  EgyptPrayerCalculationResult
} from '../../services/egyptTimeService';
import { EgyptGovernoratePickerModal } from './EgyptGovernoratePickerModal';

interface PrayerTimesBoardProps {
  id?: string;
}

export const PrayerTimesBoard: React.FC<PrayerTimesBoardProps> = ({ id = 'prayer-times-section' }) => {
  const [data, setData] = useState<EgyptPrayerCalculationResult>(() =>
    egyptTimeService.getCalculation()
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsub = egyptTimeService.subscribe(() => {
      setData(egyptTimeService.getCalculation());
    });

    const intervalId = window.setInterval(() => {
      setData(egyptTimeService.getCalculation());
    }, 1000);

    return () => {
      unsub();
      clearInterval(intervalId);
    };
  }, []);

  const handleCityChange = (cityId: string) => {
    egyptTimeService.setSelectedCity(cityId);
  };

  const nextPrayer = data.nextPrayer;
  const isGiza = data.city.id === 'giza';

  // Popular Egyptian governorates for quick pills
  const quickGovernorates = [
    { id: 'giza', label: '⭐ الجيزة (الافتراضية)' },
    { id: 'cairo', label: 'القاهرة' },
    { id: 'alexandria', label: 'الإسكندرية' },
    { id: 'benha', label: 'القليوبية' },
    { id: 'tanta', label: 'طنطا' },
    { id: 'mansoura', label: 'المنصورة' },
    { id: 'port_said', label: 'بورسعيد' },
    { id: 'asyut', label: 'أسيوط' },
    { id: 'aswan', label: 'أسوان' }
  ];

  return (
    <section id={id} className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#07261e] via-[#051d16] to-[#041611] border border-[#c59b27]/35 shadow-2xl transition-all">
      {/* Background Architectural Lattice / Mashrabiya subtle overlay */}
      <div className="absolute inset-0 pointer-events-none mashrabiya-pattern opacity-25" />

      {/* Decorative Gold Border Corner Brackets */}
      <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#c59b27]/60 pointer-events-none z-10" />
      <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#c59b27]/60 pointer-events-none z-10" />
      <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#c59b27]/60 pointer-events-none z-10" />
      <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#c59b27]/60 pointer-events-none z-10" />

      <div className="relative z-10 p-6 sm:p-8 md:p-10 space-y-7">
        {/* Top Header: City, Hijri/Gregorian Date & Live Egypt Clock */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c59b27]/25 pb-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0c3c2f] to-[#052119] border border-[#c59b27]/50 flex items-center justify-center text-[#d4af37] shadow-md shadow-[#020e0a] shrink-0">
              {/* Eight-Point Islamic Star (Khatam) */}
              <svg className="w-7 h-7 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="5" y="5" width="14" height="14" rx="1.5" />
                <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" />
                <circle cx="12" cy="12" r="2.2" fill="currentColor" />
              </svg>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#fbf8f2] font-display">
                  مواقيت الصلاة في مصر
                </h3>
                <span className="text-[11px] text-[#041611] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-l from-[#d4af37] to-[#c59b27] shadow-sm flex items-center gap-1">
                  <span>جمهورية مصر العربية 🇪🇬</span>
                </span>
                <span className="text-[11px] text-[#d4af37] px-2.5 py-0.5 rounded-full bg-[#082a20] border border-[#c59b27]/35">
                  {data.hijriDateStr}
                </span>
              </div>
              <p className="text-xs text-[#ded3c0]/75 mt-1">
                مواقيت شرعية معتمدة وفق حسابات {data.sourceAuthority}
              </p>
            </div>
          </div>

          {/* Controls: Live Clock & City Picker */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Clock Badge */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#03150f] border border-[#c59b27]/45 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#ded3c0]/80 block font-medium">
                    الساعة الآن في {data.city.name}:
                  </span>
                  {isGiza ? (
                    <span className="text-[10px] text-[#041611] font-bold px-1.5 py-0.5 rounded bg-gradient-to-l from-[#d4af37] to-[#c59b27] shadow-sm">
                      الجيزة ★
                    </span>
                  ) : (
                    <button
                      onClick={() => egyptTimeService.resetToGiza()}
                      className="text-[10px] text-[#d4af37] hover:text-[#fbf8f2] underline cursor-pointer"
                      title="العودة لمحافظة الجيزة"
                    >
                      (العودة للجيزة ⭐)
                    </button>
                  )}
                </div>
                <span className="text-sm sm:text-base font-mono font-bold text-[#d4af37] tabular-nums tracking-wider">
                  {data.currentTimeInEgypt12h}
                </span>
              </div>
            </div>

            {/* City Selector Button (Opens Governorates Modal) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-[#082a20] to-[#0c382b] hover:from-[#0a3528] hover:to-[#0f4637] text-[#fbf8f2] text-xs font-semibold border border-[#c59b27]/45 transition-all shadow-sm cursor-pointer hover:border-[#d4af37]"
              title="تغيير المحافظة المصرية (٢٧ محافظة)"
            >
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-bold">{data.city.name}</span>
              <span className="text-[10px] text-[#d4af37] bg-[#03140e] px-1.5 py-0.5 rounded-md border border-[#c59b27]/30">
                ٢٧ محافظة
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#ded3c0]/70" />
            </button>
          </div>
        </div>

        {/* Quick Egyptian Governorates Selector Pills Bar */}
        <div className="p-3.5 rounded-2xl bg-[#03150f]/80 border border-[#c59b27]/25 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#ded3c0]/80">
            <span className="flex items-center gap-1.5 font-medium text-[#d4af37]">
              <MapPin className="w-3.5 h-3.5" />
              <span>اختيارات محافظات مصر السريعة:</span>
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[#d4af37] hover:text-[#fbf8f2] text-[11px] underline flex items-center gap-1 cursor-pointer"
            >
              <span>استعراض كافة المحافظات الـ ٢٧ بالبحث</span>
              <span>←</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickGovernorates.map(gov => {
              const isSelected = data.city.id === gov.id;
              return (
                <button
                  key={gov.id}
                  onClick={() => handleCityChange(gov.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-l from-[#d4af37] to-[#c59b27] text-[#041611] font-bold shadow-md scale-[1.02]'
                      : 'bg-[#06221a] hover:bg-[#0a3528] text-[#ded3c0] border border-[#c59b27]/30 hover:border-[#c59b27]/60'
                  }`}
                >
                  {gov.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Egypt Governorate Picker Modal */}
        <EgyptGovernoratePickerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentCityId={data.city.id}
          onSelectCity={handleCityChange}
          prayerData={data}
        />

        {/* Featured Next Prayer Spotlight (المميزة بإطار ذهبي مضيء) */}
        <div className="relative rounded-3xl p-6 sm:p-8 md:p-9 border-2 border-[#d4af37] overflow-hidden bg-gradient-to-b from-[#0a3a2d] via-[#06241b] to-[#041912] shadow-[0_0_35px_rgba(212,175,55,0.18)]">
          {/* Soft lantern halo in center */}
          <div className="absolute inset-0 lantern-glow-prayer pointer-events-none" />

          {/* Subtle Arch Outline inside card */}
          <div className="absolute inset-x-8 sm:inset-x-24 top-0 h-24 border-t border-x border-[#c59b27]/30 rounded-t-[4rem] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-right">
            {/* Prayer Identity */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c59b27]/20 border border-[#c59b27]/50 text-[#f2dc87] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                <span>الصلاة القادمة في محافظة {data.city.name}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#fbf8f2] font-display tracking-tight">
                صلاة {nextPrayer.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#ded3c0]/90 max-w-xl leading-relaxed">
                «حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ» — رتب أعمالك واستعد لإجابة النداء.
              </p>
            </div>

            {/* Prayer Time & Remaining Countdown */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="text-4xl sm:text-5xl md:text-6xl font-mono tabular-nums font-bold text-[#d4af37] tracking-wider drop-shadow-[0_0_24px_rgba(212,175,55,0.35)]">
                {nextPrayer.time12h}
              </div>

              {/* Lantern Glow Box around Remaining Time */}
              <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-2xl bg-[#03150f]/90 border border-[#c59b27]/50 shadow-inner">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs text-[#ded3c0]/85">المتبقي على الأذان:</span>
                <span className="text-base sm:text-lg font-mono tabular-nums font-bold text-[#fbf8f2] tracking-widest">
                  {data.timeRemainingStr}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* All Daily Prayers Architectural Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-[#ded3c0]/80">
            <span className="font-semibold text-[#d4af37]">مواقيت اليوم كاملة بتوقيت {data.city.name}:</span>
            <span className="font-mono text-[11px] text-[#ded3c0]/65">{data.gregorianDateStr}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {data.prayers.map((prayer, idx) => {
              const isNext = idx === data.nextPrayerIndex;
              return (
                <div
                  key={prayer.id}
                  className={`relative p-4 rounded-2xl border transition-all text-center ${
                    isNext
                      ? 'bg-gradient-to-b from-[#0e4838] to-[#07281f] border-2 border-[#d4af37] shadow-xl shadow-[#020e0b] ring-2 ring-[#c59b27]/30 scale-[1.03] z-10'
                      : prayer.passed
                      ? 'bg-[#041712]/50 border-[#c59b27]/15 text-[#ded3c0]/55 opacity-75'
                      : 'bg-[#062017]/80 border-[#c59b27]/25 hover:border-[#c59b27]/50 hover:bg-[#08291f]'
                  }`}
                >
                  {isNext && (
                    <span className="absolute -top-1.5 right-1/2 translate-x-1/2 w-12 h-1 bg-[#d4af37] rounded-full shadow-sm" />
                  )}

                  <div className="text-xs font-semibold mb-1 font-sans text-[#ded3c0]">
                    {prayer.name}
                  </div>

                  <div className={`text-lg sm:text-xl font-mono tabular-nums font-bold ${isNext ? 'text-[#d4af37]' : 'text-[#fbf8f2]'}`}>
                    {prayer.time12h}
                  </div>

                  <div className="mt-1 text-[11px]">
                    {isNext ? (
                      <span className="text-[#d4af37] font-bold">الصلاة القادمة</span>
                    ) : prayer.passed ? (
                      <span className="text-[#ded3c0]/50">مضى وقتها</span>
                    ) : (
                      <span className="text-[#ded3c0]/70">مرتقبة</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Qibla Direction & Authority Verification Note */}
        <div className="pt-3 border-t border-[#c59b27]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-[#ded3c0]/70">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>اتجاه القبلة في {data.city.name}: زاوية ١٣٦° تقريباً باتجاه مكة المكرمة</span>
          </div>
          <div className="text-left font-mono text-[#d4af37]/85 text-[11px]">
            توقيت جمهورية مصر العربية الرسمي (GMT+3 صيفًا / GMT+2 شتاءً) · حسابات فلكية معتمدة
          </div>
        </div>
      </div>
    </section>
  );
};
