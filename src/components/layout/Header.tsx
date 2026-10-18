import React, { useEffect, useState } from 'react';
import { Volume2, Flame, Award, BookOpen, Bell, Sun, Moon, Compass, Sparkles, MapPin } from 'lucide-react';
import { ambientAudioEngine } from '../../services/ambientAudio';
import { notificationService } from '../../services/notificationService';
import { egyptTimeService, EgyptPrayerCalculationResult } from '../../services/egyptTimeService';
import { EgyptGovernoratePickerModal } from '../dashboard/EgyptGovernoratePickerModal';
import { UserStats } from '../../types';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { NavTab } from './Navigation';

interface HeaderProps {
  stats: UserStats;
  theme: 'dark' | 'light';
  currentTab?: NavTab;
  onNavigate?: (tab: NavTab) => void;
  onToggleTheme: () => void;
  onOpenAmbient: () => void;
  onOpenNotifications: () => void;
  onOpenQuranBookmark?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  theme,
  currentTab,
  onNavigate,
  onToggleTheme,
  onOpenAmbient,
  onOpenNotifications,
  onOpenQuranBookmark
}) => {
  const [hasAmbientPlaying, setHasAmbientPlaying] = useState(false);
  const [egyptData, setEgyptData] = useState<EgyptPrayerCalculationResult>(() =>
    egyptTimeService.getCalculation()
  );
  const [isGovernoratesModalOpen, setIsGovernoratesModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      setEgyptData(egyptTimeService.getCalculation());
    };

    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    const unsubEgypt = egyptTimeService.subscribe(() => {
      setEgyptData(egyptTimeService.getCalculation());
    });

    const unsubscribeAmbient = ambientAudioEngine.subscribe(() => {
      setHasAmbientPlaying(ambientAudioEngine.hasAnyActive());
    });
    setHasAmbientPlaying(ambientAudioEngine.hasAnyActive());

    const updateNotifs = () => {
      setUnreadCount(notificationService.getUnreadCount());
    };
    updateNotifs();
    const unsubscribeNotifs = notificationService.subscribe(updateNotifs);

    return () => {
      clearInterval(clockInterval);
      unsubEgypt();
      unsubscribeAmbient();
      unsubscribeNotifs();
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#041611]/95 backdrop-blur-md border-b border-[#c59b27]/25 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Islamic Architectural Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="group cursor-pointer relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0b382b] via-[#06241b] to-[#03140e] flex items-center justify-center text-[#d4af37] border border-[#c59b27]/45 shadow-lg shadow-[#020e0a] hover:border-[#d4af37] transition-all"
            title="إتقان | الصفحة الرئيسية"
          >
            {/* Architectural Mehrab / Islamic Arch Icon */}
            <svg className="w-6 h-6 text-[#d4af37] group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 2.5C7.5 2.5 4 7 4 13.5V21.5H20V13.5C20 7 16.5 2.5 12 2.5Z" />
              <path d="M12 6.5C9.5 6.5 7 9.5 7 14V21.5H17V14C17 9.5 14.5 6.5 12 6.5Z" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="12" cy="11.5" r="2.2" fill="currentColor" />
            </svg>
            <span className="absolute -bottom-0.5 w-4 h-0.5 bg-[#d4af37] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#fbf8f2] font-display hover:text-[#f2dc87] transition-colors cursor-pointer"
              >
                إتـقـان
              </span>
              <span className="text-xs text-[#c59b27]/90 hidden sm:inline-block font-sans font-medium tracking-wide">
                · رفيق الإنتاجية والسكينة
              </span>

              {/* Mobile Quick Egypt / Giza City Pill */}
              <button
                onClick={() => setIsGovernoratesModalOpen(true)}
                className="sm:hidden flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#07241c] text-[#d4af37] text-[11px] font-semibold border border-[#c59b27]/40 cursor-pointer shadow-sm"
                title="توقيت جمهورية مصر العربية والمحافظة"
              >
                <MapPin className="w-2.5 h-2.5 text-[#d4af37]" />
                <span className="text-[#fbf8f2]">{egyptData.city.name}</span>
                <span className="font-mono text-[#d4af37] tabular-nums font-bold">
                  {egyptData.currentTimeInEgypt12h}
                </span>
              </button>
            </div>

            {/* Quiet Unboxed Metadata: Date, Governorate & Egypt Time */}
            <div className="flex items-center gap-2 text-[11px] text-[#ded3c0]/75 hidden sm:flex">
              <span>{egyptData.gregorianDateStr}</span>
              <span className="text-[#c59b27]/50" aria-hidden="true">·</span>
              <button
                onClick={() => setIsGovernoratesModalOpen(true)}
                className="group flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#07241c] hover:bg-[#0c382b] text-[#d4af37] border border-[#c59b27]/35 transition-all cursor-pointer shadow-sm"
                title="تغيير المحافظة المصرية (٢٧ محافظة)"
              >
                <MapPin className="w-3 h-3 text-[#d4af37]" />
                <span className="text-[#ded3c0]/80">الساعة الآن ({egyptData.city.name}):</span>
                {egyptData.city.id === 'giza' && (
                  <span className="text-[10px] text-[#d4af37] font-bold">★</span>
                )}
                <span className="font-mono tabular-nums font-bold text-[#d4af37] text-xs">
                  {egyptData.currentTimeInEgypt12h}
                </span>
                <span className="text-[10px] text-[#ded3c0]/50 group-hover:text-[#d4af37]">▼</span>
              </button>
            </div>
          </div>
        </div>

        {/* Governorates Modal */}
        <EgyptGovernoratePickerModal
          isOpen={isGovernoratesModalOpen}
          onClose={() => setIsGovernoratesModalOpen(false)}
          currentCityId={egyptData.city.id}
          onSelectCity={cityId => egyptTimeService.setSelectedCity(cityId)}
          prayerData={egyptData}
        />

        {/* Zone 2: Navigation Links for Fast Access on Tablet / Desktop */}
        {onNavigate && (
          <nav className="hidden xl:flex items-center gap-1 text-xs font-medium text-[#ded3c0]/80">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'dashboard' ? 'text-[#fbf8f2] bg-[#072a20] border border-[#c59b27]/40 font-semibold' : 'hover:text-[#fbf8f2] hover:bg-[#062018]'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => onNavigate('quran')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'quran' ? 'text-[#fbf8f2] bg-[#072a20] border border-[#c59b27]/40 font-semibold' : 'hover:text-[#fbf8f2] hover:bg-[#062018]'
              }`}
            >
              المصحف الشريف
            </button>
            <button
              onClick={() => onNavigate('hisn_muslim')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'hisn_muslim' ? 'text-[#fbf8f2] bg-[#072a20] border border-[#c59b27]/40 font-semibold' : 'hover:text-[#fbf8f2] hover:bg-[#062018]'
              }`}
            >
              الأذكار والتحصين
            </button>
            <button
              onClick={() => onNavigate('timer')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'timer' ? 'text-[#fbf8f2] bg-[#072a20] border border-[#c59b27]/40 font-semibold' : 'hover:text-[#fbf8f2] hover:bg-[#062018]'
              }`}
            >
              مؤقت التركيز
            </button>
            <button
              onClick={() => onNavigate('schedule')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'schedule' ? 'text-[#fbf8f2] bg-[#072a20] border border-[#c59b27]/40 font-semibold' : 'hover:text-[#fbf8f2] hover:bg-[#062018]'
              }`}
            >
              المهام والجدول
            </button>
          </nav>
        )}

        {/* Zone 3: Primary Actions and Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Bookmark Quick Jump */}
          {stats.bookmarks && onOpenQuranBookmark && (
            <button
              onClick={onOpenQuranBookmark}
              title="متابعة آخر قراءة في المصحف"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#07241c] hover:bg-[#0c382b] text-[#ded3c0] hover:text-[#d4af37] text-xs transition-colors border border-[#c59b27]/30 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="whitespace-nowrap">متابعة الورد</span>
            </button>
          )}

          {/* Ambient Sound Trigger */}
          <button
            onClick={onOpenAmbient}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              hasAmbientPlaying
                ? 'bg-[#0f4637] text-[#d4af37] border border-[#c59b27]/60 shadow-sm shadow-[#c59b27]/20'
                : 'bg-[#07241c] hover:bg-[#0c382b] text-[#ded3c0]/80 hover:text-[#fbf8f2] border border-[#c59b27]/25'
            }`}
            title="استوديو الأصوات الهادئة الطبيعية"
          >
            <Volume2 className={`w-3.5 h-3.5 ${hasAmbientPlaying ? 'text-[#d4af37] animate-pulse' : 'text-[#ded3c0]/70'}`} />
            <span className="hidden sm:inline whitespace-nowrap">الأصوات</span>
          </button>

          {/* Notifications Bell with Unread Badge */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-[#07241c] hover:bg-[#0c382b] text-[#ded3c0] hover:text-[#fbf8f2] border border-[#c59b27]/25 transition-colors cursor-pointer"
            title="مركز التنبيهات والتذكيرات الإسلامية"
          >
            <Bell className="w-4 h-4 text-[#d4af37]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c59b27] text-[#041611] text-[10px] font-bold flex items-center justify-center shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Theme Switcher: Dark / Light */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-[#07241c] hover:bg-[#0c382b] text-[#ded3c0] hover:text-[#fbf8f2] border border-[#c59b27]/25 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#d4af37]" />
            ) : (
              <Moon className="w-4 h-4 text-[#073628]" />
            )}
          </button>

          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#07241c] border border-[#c59b27]/25 text-[#d4af37] text-xs">
            <Flame className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]/20" />
            <span className="font-mono tabular-nums font-bold">{stats.streakDays}</span>
            <span className="hidden sm:inline text-[#ded3c0]/80">يوم</span>
          </div>

          {/* Points Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#07241c] border border-[#c59b27]/25 text-[#fbf8f2] text-xs">
            <Award className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-mono tabular-nums font-bold text-[#d4af37]">{stats.points}</span>
            <span className="text-[#ded3c0]/75">نقطة</span>
          </div>
        </div>
      </div>
    </header>
  );
};
