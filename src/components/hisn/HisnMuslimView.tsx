import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Sun,
  Moon,
  Compass,
  BedDouble,
  Brain,
  CircleDot,
  Check,
  Share2,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Vibrate,
  Award,
  BookOpen,
  Info
} from 'lucide-react';
import { DHIKR_CATEGORIES, HISN_MUSLIM_ITEMS } from '../../data/hisnMuslimData';
import { ambientAudioEngine } from '../../services/ambientAudio';
import { storageService } from '../../services/storage';
import { DhikrCategoryId, DhikrItem } from '../../types';

interface HisnMuslimViewProps {
  onDhikrCounted?: (count: number) => void;
}

export const HisnMuslimView: React.FC<HisnMuslimViewProps> = ({ onDhikrCounted }) => {
  const [activeCategory, setActiveCategory] = useState<DhikrCategoryId>('morning');
  const [activeDhikrIndex, setActiveDhikrIndex] = useState<number>(0);
  
  // Track counts per Dhikr item: { [dhikrId]: currentCount }
  const [counts, setCounts] = useState<{ [id: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('itqan_dhikr_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sound & Haptic settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('itqan_dhikr_sound') !== 'false';
  });
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(() => {
    return localStorage.getItem('itqan_dhikr_vibrate') !== 'false';
  });
  const [autoAdvance, setAutoAdvance] = useState<boolean>(() => {
    return localStorage.getItem('itqan_dhikr_auto_advance') !== 'false';
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [completedCategoryAnimation, setCompletedCategoryAnimation] = useState<boolean>(false);
  const [dailyDhikrTotal, setDailyDhikrTotal] = useState<number>(() => {
    const stats = storageService.getStats();
    return stats.dhikrCountToday || 0;
  });

  // Free Tasbeeh custom target
  const [freeTasbeehTarget, setFreeTasbeehTarget] = useState<number>(33);

  // Filter items by category
  const categoryItems = HISN_MUSLIM_ITEMS.filter(item => item.categoryId === activeCategory);
  const currentDhikr: DhikrItem | undefined = categoryItems[activeDhikrIndex] || categoryItems[0];
  const currentCount = currentDhikr ? (counts[currentDhikr.id] || 0) : 0;
  const targetCount = currentDhikr?.categoryId === 'tasbeeh' ? freeTasbeehTarget : (currentDhikr?.count || 1);
  const isCurrentCompleted = currentCount >= targetCount;

  // Save counts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('itqan_dhikr_counts', JSON.stringify(counts));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [counts]);

  // Handle category change
  const handleSelectCategory = (catId: DhikrCategoryId) => {
    setActiveCategory(catId);
    setActiveDhikrIndex(0);
  };

  // Perform single Dhikr tap
  const handleIncrement = () => {
    if (!currentDhikr) return;

    const nextCount = currentCount + 1;
    const isNowTargetReached = nextCount === targetCount;

    // Haptic feedback
    if (vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (isNowTargetReached) {
          navigator.vibrate([30, 40, 60]);
        } else {
          navigator.vibrate(15);
        }
      } catch (e) {}
    }

    // Sound feedback
    if (soundEnabled) {
      if (isNowTargetReached) {
        ambientAudioEngine.playTasbeehComplete();
      } else {
        ambientAudioEngine.playTasbeehClick();
      }
    }

    // Update state
    setCounts(prev => ({
      ...prev,
      [currentDhikr.id]: nextCount
    }));

    // Increment daily total stats
    const stats = storageService.getStats();
    const newTotal = (stats.dhikrCountToday || 0) + 1;
    stats.dhikrCountToday = newTotal;
    stats.points += 1;
    storageService.saveStats(stats);
    setDailyDhikrTotal(newTotal);

    if (onDhikrCounted) {
      onDhikrCounted(newTotal);
    }

    // Auto advance if completed
    if (isNowTargetReached && autoAdvance) {
      setTimeout(() => {
        if (activeDhikrIndex < categoryItems.length - 1) {
          setActiveDhikrIndex(prev => prev + 1);
        } else {
          setCompletedCategoryAnimation(true);
          setTimeout(() => setCompletedCategoryAnimation(false), 3000);
        }
      }, 350);
    }
  };

  // Reset single current Dhikr
  const handleResetCurrent = () => {
    if (!currentDhikr) return;
    setCounts(prev => ({
      ...prev,
      [currentDhikr.id]: 0
    }));
  };

  // Reset all in active category
  const handleResetCategory = () => {
    setCounts(prev => {
      const next = { ...prev };
      categoryItems.forEach(item => {
        next[item.id] = 0;
      });
      return next;
    });
  };

  // Copy Dhikr text
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate category progress
  const completedInCategory = categoryItems.filter(item => {
    const c = counts[item.id] || 0;
    const t = item.categoryId === 'tasbeeh' ? freeTasbeehTarget : item.count;
    return c >= t;
  }).length;

  const categoryProgressPercent = categoryItems.length > 0
    ? Math.round((completedInCategory / categoryItems.length) * 100)
    : 0;

  // SVG circular progress calculation
  const progressRatio = Math.min(1, currentCount / Math.max(1, targetCount));
  const circleRadius = 58;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const currentCategoryDef = DHIKR_CATEGORIES.find(c => c.id === activeCategory) || DHIKR_CATEGORIES[0];

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto">
      {/* Header Banner: Illuminated Book Header */}
      <div className="relative overflow-hidden rounded-3xl manuscript-border bg-gradient-to-b from-[#07261e] via-[#051e17] to-[#041611] p-6 sm:p-7 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xl">
        <div className="absolute inset-0 islamic-pattern-bg opacity-35 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] mb-1.5">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>حصن المسلم والذكر اليومي المأثور</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#fbf8f2] font-display">
            أذكار اليوم والليلة وعداد التسبيح المستمر
          </h2>
          <p className="text-xs text-[#ded3c0]/85 mt-1 max-w-xl leading-relaxed">
            «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» — أذكار منسقة وصحيحة مع عداد تفاعلي للتكرار، وفضل كل ذكر وسنده لتعمير الأوقات بذكر الله.
          </p>
        </div>

        {/* Daily Stats Pill */}
        <div className="relative z-10 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#093527]/90 border border-[#c59b27]/35 shadow-sm shrink-0">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <div>
            <div className="text-[10px] text-[#ded3c0]/70">مجموع أذكارك اليوم</div>
            <div className="text-base font-bold font-mono text-[#d4af37]">
              {dailyDhikrTotal.toLocaleString('ar-EG')} <span className="text-xs font-sans text-[#ded3c0]/80">تسبيحة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DHIKR_CATEGORIES.map(cat => {
          const isSelected = activeCategory === cat.id;
          const itemsInCat = HISN_MUSLIM_ITEMS.filter(i => i.categoryId === cat.id);
          const doneCount = itemsInCat.filter(i => (counts[i.id] || 0) >= (cat.id === 'tasbeeh' ? freeTasbeehTarget : i.count)).length;
          const isFullyDone = itemsInCat.length > 0 && doneCount === itemsInCat.length;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] border-[#c59b27]/60 font-bold shadow-md shadow-[#020e0a]'
                  : 'bg-[#062017]/70 text-[#ded3c0]/75 hover:bg-[#08291f] hover:text-[#fbf8f2] border-[#c59b27]/20'
              }`}
            >
              <span>{cat.name}</span>
              {isFullyDone ? (
                <span className="w-4 h-4 rounded-full bg-[#d4af37] text-[#041611] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              ) : doneCount > 0 ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#03150f] text-[#d4af37] font-mono border border-[#c59b27]/20">
                  {doneCount}/{itemsInCat.length}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Category Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#062017]/85 p-4 rounded-2xl border border-[#c59b27]/25 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#fbf8f2] font-display">{currentCategoryDef.name}</h3>
            {currentCategoryDef.timeHint && (
              <span className="text-[11px] text-[#d4af37] bg-[#093527] px-2.5 py-0.5 rounded-lg border border-[#c59b27]/30">
                {currentCategoryDef.timeHint}
              </span>
            )}
          </div>
          <p className="text-xs text-[#ded3c0]/70 mt-0.5">{currentCategoryDef.description}</p>
        </div>

        {/* Category Completion Bar & Reset Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-left">
            <div className="text-[11px] text-[#ded3c0]/70">
              الإنجاز: <span className="font-mono font-bold text-[#d4af37]">{completedInCategory}/{categoryItems.length}</span>
            </div>
            <div className="w-24 h-1.5 bg-[#03150f] rounded-full overflow-hidden mt-1 border border-[#c59b27]/20">
              <div
                className="h-full bg-gradient-to-r from-[#c59b27] to-[#e5c158] transition-all duration-300 rounded-full"
                style={{ width: `${categoryProgressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleResetCategory}
            className="p-2 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] hover:text-[#fbf8f2] transition-colors border border-[#c59b27]/25 cursor-pointer"
            title="إعادة تصفير عداد هذه المجموعة"
          >
            <RotateCcw className="w-4 h-4 text-[#d4af37]" />
          </button>
        </div>
      </div>

      {/* Main Interactive Dhikr Card: Styled like a Luxury Islamic Book Page */}
      {currentDhikr && (
        <div className="manuscript-border rounded-3xl bg-gradient-to-b from-[#07261e] via-[#051e17] to-[#041611] p-6 sm:p-8 md:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle corner brackets */}
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#c59b27]/40 pointer-events-none" />
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#c59b27]/40 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#c59b27]/40 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#c59b27]/40 pointer-events-none" />

          {/* Top Delicate Islamic Geometric Ornament */}
          <div className="flex items-center justify-center gap-3 text-xs text-[#d4af37] opacity-80 pt-1">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#c59b27]/50" />
            <span>❖ &nbsp; ✦ &nbsp; ❖</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#c59b27]/50" />
          </div>

          {/* Top Bar: Progress Index & Controls */}
          <div className="flex items-center justify-between gap-4 text-xs border-b border-[#c59b27]/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#ded3c0]/70 font-sans">الذكر:</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#041712] font-mono font-bold text-[#d4af37] border border-[#c59b27]/30">
                {activeDhikrIndex + 1} / {categoryItems.length}
              </span>
              {isCurrentCompleted && (
                <span className="flex items-center gap-1 text-[11px] text-[#f2dc87] bg-[#0c382b] px-2 py-0.5 rounded-lg border border-[#c59b27]/40 font-semibold">
                  <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>اكتمل التكرار المطلوب</span>
                </span>
              )}
            </div>

            {/* Quick Settings: Sound & Vibration & Auto-Advance */}
            <div className="flex items-center gap-1.5">
              {/* Sound Toggle */}
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  localStorage.setItem('itqan_dhikr_sound', next ? 'true' : 'false');
                }}
                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                  soundEnabled
                    ? 'bg-[#093527] border-[#c59b27]/45 text-[#d4af37]'
                    : 'bg-[#041913] border-[#c59b27]/20 text-[#ded3c0]/40'
                }`}
                title={soundEnabled ? 'صوت النقر: مفعل' : 'صوت النقر: معطل'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Vibration Toggle */}
              <button
                onClick={() => {
                  const next = !vibrationEnabled;
                  setVibrationEnabled(next);
                  localStorage.setItem('itqan_dhikr_vibrate', next ? 'true' : 'false');
                }}
                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                  vibrationEnabled
                    ? 'bg-[#093527] border-[#c59b27]/45 text-[#d4af37]'
                    : 'bg-[#041913] border-[#c59b27]/20 text-[#ded3c0]/40'
                }`}
                title={vibrationEnabled ? 'الاهتزاز: مفعل' : 'الاهتزاز: معطل'}
              >
                <Vibrate className="w-4 h-4" />
              </button>

              {/* Auto Advance Toggle */}
              <button
                onClick={() => {
                  const next = !autoAdvance;
                  setAutoAdvance(next);
                  localStorage.setItem('itqan_dhikr_auto_advance', next ? 'true' : 'false');
                }}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-colors cursor-pointer border ${
                  autoAdvance
                    ? 'bg-[#093527] border-[#c59b27]/45 text-[#d4af37]'
                    : 'bg-[#041913] border-[#c59b27]/20 text-[#ded3c0]/60'
                }`}
                title="الانتقال التلقائي للذكر التالي عند إتمام العدد"
              >
                <span>انتقال تلقائي {autoAdvance ? '✓' : ''}</span>
              </button>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(currentDhikr.text, currentDhikr.id)}
                className="p-2 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] border border-[#c59b27]/25 cursor-pointer transition-colors"
                title="نسخ نص الذكر"
              >
                {copiedId === currentDhikr.id ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Tasbeeh Free Target Picker */}
          {activeCategory === 'tasbeeh' && (
            <div className="flex items-center gap-2 text-xs bg-[#03150f] p-2.5 rounded-2xl border border-[#c59b27]/25">
              <span className="text-[#ded3c0]/70 font-medium">الهدف المطلوب للتسبيح:</span>
              {[33, 100, 1000].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => setFreeTasbeehTarget(cnt)}
                  className={`px-3 py-1 rounded-xl font-mono cursor-pointer transition-colors ${
                    freeTasbeehTarget === cnt
                      ? 'bg-[#c59b27] text-[#041611] font-bold'
                      : 'bg-[#082a20] text-[#ded3c0] hover:bg-[#0c382b]'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          )}

          {/* Dhikr Arabic Text: Rendered like a luxury book */}
          <div className="space-y-5 py-3 text-center">
            <p className="font-quran text-2xl sm:text-3xl text-[#fbf8f2] leading-[2.4] select-none tracking-wide text-balance">
              {currentDhikr.text}
            </p>

            {/* Reward & Source Card */}
            {(currentDhikr.reward || currentDhikr.source) && (
              <div className="p-4 rounded-2xl bg-[#041913]/90 border border-[#c59b27]/30 text-right space-y-1.5 max-w-2xl mx-auto shadow-inner">
                {currentDhikr.reward && (
                  <div className="flex items-start gap-2 text-xs text-[#d4af37]">
                    <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">فضل الذكر: {currentDhikr.reward}</span>
                  </div>
                )}
                {currentDhikr.source && (
                  <div className="flex items-center gap-2 text-[11px] text-[#ded3c0]/70 pr-6">
                    <BookOpen className="w-3.5 h-3.5 text-[#ded3c0]/50" />
                    <span>المصدر: {currentDhikr.source}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* The Circular Gilded Astrolabe-inspired Counter Dial */}
          <div className="flex flex-col items-center justify-center pt-2 pb-4">
            <div className="relative flex items-center justify-center">
              {/* Circular SVG Ring */}
              <svg className="w-48 h-48 -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r={circleRadius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-[#03150f]"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r={circleRadius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className={`transition-all duration-150 ${
                    isCurrentCompleted ? 'text-[#d4af37]' : 'text-[#c59b27]'
                  }`}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              {/* Tap Button Inside Ring */}
              <button
                onClick={handleIncrement}
                className={`absolute w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-100 active:scale-95 cursor-pointer shadow-2xl ${
                  isCurrentCompleted
                    ? 'bg-gradient-to-br from-[#0e4838] to-[#082d23] text-[#fbf8f2] shadow-[#020e0a] ring-4 ring-[#c59b27]/50'
                    : 'bg-gradient-to-br from-[#082a20] to-[#041712] hover:from-[#0a3528] text-[#fbf8f2] border-2 border-[#c59b27]/40 shadow-[#020e0a] hover:border-[#d4af37]'
                }`}
                title="اضغط للتسبيح وزيادة العداد"
              >
                <span className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-[#d4af37]">
                  {currentCount}
                </span>
                <span className="text-xs text-[#ded3c0]/70 mt-1 font-mono">
                  من {targetCount}
                </span>
                <span className="text-[10px] text-[#ded3c0]/90 font-sans mt-0.5">
                  {isCurrentCompleted ? 'تم بحمد الله' : 'اضغط للذكر'}
                </span>
              </button>
            </div>

            {/* Quick Reset & Navigation Row */}
            <div className="flex items-center justify-between w-full max-w-sm mt-6">
              <button
                onClick={() => setActiveDhikrIndex(prev => Math.max(0, prev - 1))}
                disabled={activeDhikrIndex === 0}
                className="p-2.5 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] disabled:opacity-30 disabled:pointer-events-none transition-colors border border-[#c59b27]/25 flex items-center gap-1 text-xs cursor-pointer"
                title="الذكر السابق"
              >
                <ChevronRight className="w-4 h-4 text-[#d4af37]" />
                <span>السابق</span>
              </button>

              <button
                onClick={handleResetCurrent}
                className="px-3.5 py-1.5 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0]/70 hover:text-[#fbf8f2] transition-colors text-xs flex items-center gap-1.5 border border-[#c59b27]/25 cursor-pointer"
                title="إعادة تصفير هذا الذكر"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>تصفير</span>
              </button>

              <button
                onClick={() => setActiveDhikrIndex(prev => Math.min(categoryItems.length - 1, prev + 1))}
                disabled={activeDhikrIndex === categoryItems.length - 1}
                className="p-2.5 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] disabled:opacity-30 disabled:pointer-events-none transition-colors border border-[#c59b27]/25 flex items-center gap-1 text-xs cursor-pointer"
                title="الذكر التالي"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4 text-[#d4af37]" />
              </button>
            </div>
          </div>

          {/* Bottom Delicate Islamic Geometric Ornament */}
          <div className="flex items-center justify-center gap-3 text-xs text-[#d4af37] opacity-80 pt-2">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#c59b27]/50" />
            <span>❖ &nbsp; ✦ &nbsp; ❖</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#c59b27]/50" />
          </div>
        </div>
      )}

      {/* List of all Adhkar in this category */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#fbf8f2] font-display">قائمة أذكار {currentCategoryDef.name}</h4>
          <span className="text-xs text-[#ded3c0]/70">انقر على أي ذكر للانتقال إليه مباشرة</span>
        </div>

        <div className="space-y-2">
          {categoryItems.map((item, idx) => {
            const isSelected = activeDhikrIndex === idx;
            const c = counts[item.id] || 0;
            const t = item.categoryId === 'tasbeeh' ? freeTasbeehTarget : item.count;
            const isDone = c >= t;

            return (
              <div
                key={item.id}
                onClick={() => setActiveDhikrIndex(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-[#0d4536] border-[#c59b27] shadow-md ring-1 ring-[#c59b27]/40'
                    : isDone
                    ? 'bg-[#051c15]/60 border-[#c59b27]/20 text-[#ded3c0]/60'
                    : 'bg-[#062017]/80 border-[#c59b27]/20 hover:bg-[#082a20] text-[#ded3c0]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs ${
                      isDone
                        ? 'bg-[#c59b27] text-[#041611] font-bold'
                        : isSelected
                        ? 'bg-[#041913] text-[#d4af37] border border-[#c59b27]/40'
                        : 'bg-[#041913] text-[#ded3c0]/70'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <p className="text-xs font-serif text-[#fbf8f2] truncate max-w-md">
                    {item.text}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                  <span className={isDone ? 'text-[#d4af37] font-bold' : 'text-[#ded3c0]/70'}>
                    {c} / {t}
                  </span>
                  <span className="text-[10px] text-[#ded3c0]/50 font-sans">
                    ({item.count} {item.count === 1 ? 'مرة' : 'مرات'})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
