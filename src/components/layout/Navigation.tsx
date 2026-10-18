import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  Timer,
  CheckSquare,
  Volume2,
  Sparkles,
  BarChart3
} from 'lucide-react';

export type NavTab = 'dashboard' | 'quran' | 'hisn_muslim' | 'timer' | 'schedule' | 'ambient' | 'motivation' | 'stats';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

interface NavItemDef {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemDef[] = [
  { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'schedule', label: 'المهام', icon: CheckSquare },
  { id: 'quran', label: 'القرآن', icon: BookOpen },
  { id: 'hisn_muslim', label: 'حصن المسلم', icon: ShieldCheck },
  { id: 'timer', label: 'التركيز', icon: Timer },
  { id: 'ambient', label: 'الأصوات', icon: Volume2 },
  { id: 'motivation', label: 'التحفيز', icon: Sparkles },
  { id: 'stats', label: 'الإحصائيات', icon: BarChart3 }
];

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav className="hidden md:block bg-[#041611]/80 border-b border-[#c59b27]/20 sticky top-[57px] z-30 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-l from-[#0e4435] to-[#0a3328] text-[#fbf8f2] border border-[#c59b27]/50 shadow-sm shadow-[#020e0b]'
                      : 'text-[#ded3c0]/75 hover:text-[#fbf8f2] hover:bg-[#07241c]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#d4af37]' : 'text-[#c59b27]/60 group-hover:text-[#d4af37]'}`} />
                  <span className="font-sans">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#041611]/95 backdrop-blur-xl border-t border-[#c59b27]/25 shadow-2xl">
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
          {[
            NAV_ITEMS[0], // الرئيسية
            NAV_ITEMS[1], // المهام
            NAV_ITEMS[2], // القرآن
            NAV_ITEMS[3], // حصن المسلم
            NAV_ITEMS[4]  // التركيز
          ].map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors cursor-pointer ${
                  isActive ? 'text-[#d4af37]' : 'text-[#ded3c0]/60 hover:text-[#ded3c0]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px] text-[#d4af37]' : 'stroke-1.5'}`} />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                  )}
                </div>
                <span className="text-[10px] font-medium mt-1 leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
