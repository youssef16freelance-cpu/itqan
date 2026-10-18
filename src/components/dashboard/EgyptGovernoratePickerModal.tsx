import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Check,
  X,
  Sparkles,
  Compass,
  Clock,
  Building2,
  Navigation
} from 'lucide-react';
import {
  EGYPT_CITIES,
  EgyptCity,
  egyptTimeService,
  EgyptPrayerCalculationResult
} from '../../services/egyptTimeService';

interface EgyptGovernoratePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCityId: string;
  onSelectCity: (cityId: string) => void;
  prayerData?: EgyptPrayerCalculationResult;
}

type RegionFilter =
  | 'all'
  | 'popular'
  | 'القاهرة الكبرى'
  | 'الوجه البحري والدلتا'
  | 'مدن القناة وسيناء'
  | 'صعيد مصر'
  | 'المحافظات الحدودية';

export const EgyptGovernoratePickerModal: React.FC<EgyptGovernoratePickerModalProps> = ({
  isOpen,
  onClose,
  currentCityId,
  onSelectCity,
  prayerData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('all');

  // Filtered cities list
  const filteredCities = useMemo(() => {
    let list = EGYPT_CITIES;

    // Filter by region
    if (selectedRegion === 'popular') {
      list = list.filter(c => c.popular);
    } else if (selectedRegion !== 'all') {
      list = list.filter(c => c.region === selectedRegion);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      // Normalize arabic for search
      const normalizeArabic = (text: string) =>
        text
          .replace(/[أإآ]/g, 'ا')
          .replace(/ة/g, 'ه')
          .replace(/ى/g, 'ي')
          .toLowerCase();

      const qNorm = normalizeArabic(q);

      list = list.filter(
        c =>
          normalizeArabic(c.name).includes(qNorm) ||
          c.nameEn.toLowerCase().includes(q) ||
          normalizeArabic(c.region).includes(qNorm)
      );
    }

    return list;
  }, [searchQuery, selectedRegion]);

  if (!isOpen) return null;

  const isCurrentGiza = currentCityId === 'giza';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-b from-[#07261e] via-[#051c15] to-[#03130e] border border-[#c59b27]/45 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden manuscript-border my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Mashrabiya geometric lattice background accent */}
        <div className="absolute inset-0 mashrabiya-pattern opacity-20 pointer-events-none" />

        {/* Delicate Gold Corner Brackets */}
        <div className="absolute top-3.5 right-3.5 w-5 h-5 border-t-2 border-r-2 border-[#c59b27]/60 z-20 pointer-events-none" />
        <div className="absolute top-3.5 left-3.5 w-5 h-5 border-t-2 border-l-2 border-[#c59b27]/60 z-20 pointer-events-none" />
        <div className="absolute bottom-3.5 right-3.5 w-5 h-5 border-b-2 border-r-2 border-[#c59b27]/60 z-20 pointer-events-none" />
        <div className="absolute bottom-3.5 left-3.5 w-5 h-5 border-b-2 border-l-2 border-[#c59b27]/60 z-20 pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 p-5 sm:p-6 border-b border-[#c59b27]/25 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0c3f31] to-[#052119] border border-[#c59b27]/50 flex items-center justify-center text-[#d4af37] shadow-lg shrink-0">
              <MapPin className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-[#fbf8f2] font-display">
                  اختيار المحافظة المصرية
                </h3>
                <span className="text-[11px] font-bold text-[#041611] px-2 py-0.5 rounded-full bg-gradient-to-l from-[#d4af37] to-[#c59b27]">
                  🇪🇬 مصر
                </span>
              </div>
              <p className="text-xs text-[#ded3c0]/75 mt-0.5">
                مواقيت الصلاة والتوقيت الدقيق لجميع محافظات جمهورية مصر العربية (٢٧ محافظة)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#062018] hover:bg-[#0a3528] text-[#ded3c0] hover:text-[#fbf8f2] border border-[#c59b27]/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="relative z-10 p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Spotlight Card: Giza (الجيزة) Focus */}
          <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border transition-all ${
            isCurrentGiza
              ? 'bg-gradient-to-r from-[#0a3a2d] to-[#082d23] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
              : 'bg-[#06221a]/90 border-[#c59b27]/35 hover:border-[#c59b27]/60'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#d4af37] px-2.5 py-0.5 rounded-full bg-[#03150f] border border-[#c59b27]/40">
                    ⭐ المحافظة الموصى بها
                  </span>
                  <span className="text-xs text-[#ded3c0]/70">توقيت مصر القياسي</span>
                </div>
                <h4 className="text-lg font-bold text-[#fbf8f2] font-display flex items-center gap-2">
                  <span>محافظة الجيزة</span>
                  <span className="text-xs text-[#ded3c0]/60 font-sans font-normal">(Giza Governorate)</span>
                </h4>
                <p className="text-xs text-[#ded3c0]/80">
                  تضم الأهرامات التاريخية، ومحيط العاصمة ومساجد الجيزة العامرة. حسابات فلكية دقيقة لمواقيت الصلاة الخمس.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {isCurrentGiza ? (
                  <div className="px-4 py-2 rounded-xl bg-[#082e22] border border-[#d4af37] text-xs font-bold text-[#f2dc87] flex items-center gap-2 shadow-inner">
                    <Check className="w-4 h-4 text-[#d4af37]" />
                    <span>مُختارة حالياً</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onSelectCity('giza');
                      onClose();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-l from-[#d4af37] to-[#c59b27] hover:from-[#e2bf4b] hover:to-[#b88e1e] text-[#041611] font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>اختيار الجيزة الآن</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search Box & Quick Controls */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c59b27]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم: الجيزة، القاهرة، الإسكندرية، أسوان، طنطا..."
                className="w-full pr-10 pl-4 py-3 rounded-2xl bg-[#03150f] border border-[#c59b27]/40 text-[#fbf8f2] placeholder-[#ded3c0]/50 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#ded3c0]/60 hover:text-[#fbf8f2]"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Region Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === 'all'
                    ? 'bg-[#c59b27] text-[#041611] font-bold shadow-sm'
                    : 'bg-[#07241c] hover:bg-[#0a3528] text-[#ded3c0] border border-[#c59b27]/25'
                }`}
              >
                الكل (٢٧)
              </button>

              <button
                onClick={() => setSelectedRegion('popular')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === 'popular'
                    ? 'bg-[#c59b27] text-[#041611] font-bold shadow-sm'
                    : 'bg-[#07241c] hover:bg-[#0a3528] text-[#ded3c0] border border-[#c59b27]/25'
                }`}
              >
                ⭐ الأكثر طلباً
              </button>

              <button
                onClick={() => setSelectedRegion('القاهرة الكبرى')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === 'القاهرة الكبرى'
                    ? 'bg-[#c59b27] text-[#041611] font-bold shadow-sm'
                    : 'bg-[#07241c] hover:bg-[#0a3528] text-[#ded3c0] border border-[#c59b27]/25'
                }`}
              >
                القاهرة الكبرى (الجيزة والعاصمة)
              </button>

              <button
                onClick={() => setSelectedRegion('الوجه البحري والدلتا')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === 'الوجه البحري والدلتا'
                    ? 'bg-[#c59b27] text-[#041611] font-bold shadow-sm'
                    : 'bg-[#07241c] hover:bg-[#0a3528] text-[#ded3c0] border border-[#c59b27]/25'
                }`}
              >
                الوجه البحري والدلتا
              </button>

              <button
                onClick={() => setSelectedRegion('مدن القناة وسيناء')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === 'مدن القناة وسيناء'
                    ? 'bg-[#c59b27] text-[#041611] font-bold shadow-sm'
                    : 'bg-[#07241c] hover:bg-[#0a3528] text-[#ded3c0] border border-[#c59b27]/25'
                }`}
              >
                القناة وسيناء
              </button>

              <button
                onClick={() => setSelectedRegion('صعيد مصر')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === 'صعيد مصر'
                    ? 'bg-[#c59b27] text-[#041611] font-bold shadow-sm'
                    : 'bg-[#07241c] hover:bg-[#0a3528] text-[#ded3c0] border border-[#c59b27]/25'
                }`}
              >
                صعيد مصر
              </button>

              <button
                onClick={() => setSelectedRegion('المحافظات الحدودية')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === 'المحافظات الحدودية'
                    ? 'bg-[#c59b27] text-[#041611] font-bold shadow-sm'
                    : 'bg-[#07241c] hover:bg-[#0a3528] text-[#ded3c0] border border-[#c59b27]/25'
                }`}
              >
                المحافظات الحدودية
              </button>
            </div>
          </div>

          {/* Cities Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredCities.map(city => {
              const isSelected = city.id === currentCityId;
              const isGizaCity = city.id === 'giza';

              return (
                <div
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city.id);
                    onClose();
                  }}
                  className={`group relative p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#0b3c2f] to-[#06241b] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                      : 'bg-[#051c15]/90 border-[#c59b27]/25 hover:bg-[#082c21] hover:border-[#c59b27]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-bold font-display ${isSelected ? 'text-[#f2dc87]' : 'text-[#fbf8f2] group-hover:text-[#f2dc87]'}`}>
                          {city.name}
                        </span>
                        {isGizaCity && (
                          <span className="text-[10px] text-[#041611] font-bold px-1.5 py-0.2 rounded-full bg-[#d4af37]">
                            الافتراضية
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#ded3c0]/65 block mt-0.5">
                        {city.nameEn} · {city.region}
                      </span>
                    </div>

                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#d4af37] text-[#041611]'
                        : 'bg-[#03150f] text-[#c59b27]/60 group-hover:text-[#d4af37]'
                    }`}>
                      {isSelected ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <Compass className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#c59b27]/20 flex items-center justify-between text-[11px] text-[#ded3c0]/75">
                    <span>خط العرض: {city.lat.toFixed(2)}°</span>
                    <span className="text-[#d4af37] group-hover:underline">اختيار</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCities.length === 0 && (
            <div className="text-center py-10 space-y-2">
              <MapPin className="w-10 h-10 text-[#c59b27]/40 mx-auto" />
              <p className="text-sm text-[#ded3c0]/80">لم نجد محافظة تطابق بحثك: &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('all');
                }}
                className="text-xs text-[#d4af37] underline"
              >
                إظهار جميع المحافظات الـ ٢٧
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 p-4 sm:p-5 border-t border-[#c59b27]/25 bg-[#03140e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#ded3c0]/75">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>الحسابات معتمدة وفق توقيت الهيئة المصرية العامة للمساحة</span>
          </div>

          <div className="flex items-center gap-2">
            {!isCurrentGiza && (
              <button
                onClick={() => {
                  onSelectCity('giza');
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#d4af37] border border-[#c59b27]/40 text-xs font-semibold transition-colors cursor-pointer"
              >
                العودة للجيزة افتراضياً
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#c59b27] hover:bg-[#d4af37] text-[#041611] font-bold text-xs transition-colors cursor-pointer"
            >
              تم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
