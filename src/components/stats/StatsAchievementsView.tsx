import React from 'react';
import {
  Award,
  Flame,
  Clock,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Trophy,
  TrendingUp,
  ShieldCheck,
  Star
} from 'lucide-react';
import { AchievementBadge, UserStats } from '../../types';

interface StatsAchievementsViewProps {
  stats: UserStats;
  badges: AchievementBadge[];
}

export const StatsAchievementsView: React.FC<StatsAchievementsViewProps> = ({ stats, badges }) => {
  const pointsForNextLevel = 200;
  const currentLevelBase = (stats.level - 1) * pointsForNextLevel;
  const progressInLevel = Math.max(0, stats.points - currentLevelBase);
  const levelPercent = Math.min(100, Math.round((progressInLevel / pointsForNextLevel) * 100));

  // Weekly focus simulator data
  const weekDays = [
    { label: 'السبت', minutes: 45 },
    { label: 'الأحد', minutes: 60 },
    { label: 'الاثنين', minutes: 75 },
    { label: 'الثلاثاء', minutes: 50 },
    { label: 'الأربعاء', minutes: 90 },
    { label: 'الخميس', minutes: 65 },
    { label: 'الجمعة', minutes: Math.min(120, stats.totalFocusMinutes > 0 ? stats.totalFocusMinutes : 80) }
  ];

  const maxMinutes = Math.max(...weekDays.map(d => d.minutes), 100);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto">
      {/* Level Card: Illuminated Plaque */}
      <div className="relative overflow-hidden rounded-3xl manuscript-border bg-gradient-to-b from-[#07261e] via-[#051e17] to-[#041611] p-6 sm:p-8 shadow-2xl">
        <div className="absolute inset-0 islamic-pattern-bg opacity-35 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0e4838] to-[#07251c] border-2 border-[#c59b27]/60 flex items-center justify-center text-[#d4af37] shadow-xl shadow-[#020e0a]">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#fbf8f2] font-display">المستوى {stats.level}</h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#0a3528] text-[#d4af37] border border-[#c59b27]/40">
                  {stats.level >= 5 ? 'متقن متقدم ✦' : stats.level >= 3 ? 'منضبط مجتهد ✦' : 'مبتدئ همام ✦'}
                </span>
              </div>
              <p className="text-xs text-[#ded3c0]/80 mt-1">
                رصيد إجمالي: <span className="font-mono tabular-nums font-bold text-[#d4af37]">{stats.points}</span> نقطة إتقان وبركة
              </p>
            </div>
          </div>

          <div className="w-full md:w-80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#ded3c0]/80">التقدم للمستوى {stats.level + 1}</span>
              <span className="font-mono tabular-nums font-bold text-[#d4af37]">
                {progressInLevel} / {pointsForNextLevel} ({levelPercent}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#03150f] overflow-hidden border border-[#c59b27]/30">
              <div
                className="h-full bg-gradient-to-r from-[#c59b27] via-[#e5c158] to-[#c59b27] rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/25 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#ded3c0]/70 mb-2">
            <span>ساعات التركيز الإجمالية</span>
            <Clock className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#fbf8f2]">
              {(stats.totalFocusMinutes / 60).toFixed(1)}
            </span>
            <span className="text-xs text-[#ded3c0]/70">ساعة</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/25 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#ded3c0]/70 mb-2">
            <span>سلسلة الانضباط</span>
            <Flame className="w-4 h-4 text-[#e5c158]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#fbf8f2]">
              {stats.streakDays}
            </span>
            <span className="text-xs text-[#ded3c0]/70">أيام متتالية</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/25 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#ded3c0]/70 mb-2">
            <span>المهام المكتملة</span>
            <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#fbf8f2]">
              {stats.completedTasksCount}
            </span>
            <span className="text-xs text-[#ded3c0]/70">مهمة</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/25 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#ded3c0]/70 mb-2">
            <span>آيات تمت قراءتها</span>
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#fbf8f2]">
              {stats.quranVersesRead}
            </span>
            <span className="text-xs text-[#ded3c0]/70">آية</span>
          </div>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="rounded-3xl bg-[#062017]/85 border border-[#c59b27]/25 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-[#c59b27]/20 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#fbf8f2] font-display">نشاط التركيز الأسبوعي (بالدقائق)</h3>
            <p className="text-xs text-[#ded3c0]/70 mt-0.5">سجل توزيع دقائق بومودورو خلال الأسبوع</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-mono">
            <TrendingUp className="w-4 h-4" />
            <span>متوسط {Math.round(weekDays.reduce((a, b) => a + b.minutes, 0) / 7)} د/يوم</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 h-44 pt-6 px-2">
          {weekDays.map((day, idx) => {
            const heightPercent = Math.max(12, Math.round((day.minutes / maxMinutes) * 100));
            const isToday = idx === weekDays.length - 1;

            return (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono tabular-nums text-[#ded3c0]/70">
                  {day.minutes}د
                </span>
                <div className="w-full max-w-[42px] bg-[#03150f] rounded-xl overflow-hidden h-full flex items-end p-1 border border-[#c59b27]/15">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-[#c59b27] to-[#e5c158] shadow-md shadow-[#c59b27]/40'
                        : 'bg-[#093527] hover:bg-[#0d4735]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`text-[11px] ${isToday ? 'text-[#d4af37] font-bold' : 'text-[#ded3c0]/70'}`}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges / Achievements Collection */}
      <div className="rounded-3xl bg-[#062017]/85 border border-[#c59b27]/25 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-[#c59b27]/20 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <h3 className="text-sm font-bold text-[#fbf8f2] font-display">أوسمة الإنجاز والهمة</h3>
          </div>
          <span className="text-xs text-[#ded3c0]/70 font-mono">
            {badges.filter(b => b.unlocked).length} من {badges.length} مفتوحة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all ${
                badge.unlocked
                  ? 'bg-[#07271e]/90 border-[#c59b27]/50 shadow-md ring-1 ring-[#c59b27]/20'
                  : 'bg-[#041611]/60 border-[#c59b27]/15 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${
                    badge.unlocked
                      ? 'bg-[#0a382c] text-[#d4af37] border border-[#c59b27]/60 shadow-sm'
                      : 'bg-[#03150f] text-[#ded3c0]/40 border border-[#c59b27]/10'
                  }`}
                >
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#fbf8f2]">{badge.title}</h4>
                    {badge.unlocked && (
                      <span className="text-[10px] text-[#d4af37] font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-[#d4af37]" />
                        <span>مكتمل</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#ded3c0]/75 mt-0.5 leading-snug">
                    {badge.description}
                  </p>

                  {!badge.unlocked && (
                    <div className="mt-2.5">
                      <div className="w-full h-1.5 rounded-full bg-[#03150f] overflow-hidden border border-[#c59b27]/15">
                        <div
                          className="h-full bg-gradient-to-r from-[#c59b27] to-[#e5c158] rounded-full"
                          style={{
                            width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[#ded3c0]/50 mt-1 block text-left">
                        {badge.progress} / {badge.maxProgress}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
