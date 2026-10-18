import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Clock,
  BookOpen,
  Flame,
  Award,
  Sparkles,
  Volume2,
  Calendar,
  ArrowLeft,
  Quote,
  Bell,
  Timer,
  ShieldCheck,
  TrendingUp,
  Compass,
  Heart,
  ChevronLeft
} from 'lucide-react';
import { DAILY_FEATURED_VERSES, TAFSEER_SOURCE_NAME } from '../../data/curatedQuranData';
import { getAyahAudioUrl, getSurahAudioUrl } from '../../services/quranApi';
import { AMBIENT_TRACKS, ambientAudioEngine } from '../../services/ambientAudio';
import { MOTIVATIONAL_TRACKS } from '../../data/motivationalData';
import { notificationService, NotificationSettings } from '../../services/notificationService';
import { egyptTimeService, EgyptPrayerCalculationResult } from '../../services/egyptTimeService';
import { ScheduleItem, TaskItem, UserStats } from '../../types';
import { NavTab } from '../layout/Navigation';
import { HeroBanner } from './HeroBanner';
import { ServiceCardsGrid } from './ServiceCardsGrid';
import { PrayerTimesBoard } from './PrayerTimesBoard';

interface DashboardProps {
  stats: UserStats;
  schedule: ScheduleItem[];
  tasks: TaskItem[];
  onToggleSchedule: (id: string) => void;
  onToggleTask: (id: string) => void;
  onNavigate: (tab: NavTab) => void;
  onStartCustomTimer: (minutes: number) => void;
  onOpenQuranSurah: (surahId: number) => void;
  onOpenNotifications?: () => void;
}

// Curated authentic spiritual quotes with verified attribution
const SPIRITUAL_QUOTES = [
  {
    quote: "يَا ابْنَ آدَمَ، إِنَّمَا أَنْتَ أَيَّامٌ مَعْدُودَةٌ، كُلَّمَا ذَهَبَ يَوْمٌ ذَهَبَ بَعْضُكَ، وَيُوشِكُ إِذَا ذَهَبَ الْبَعْضُ أَنْ يَذْهَبَ الْكُلُّ.",
    source: "الإمام الحسن البصري رحمه الله",
    theme: "قيمة الوقت والمحاسبة"
  },
  {
    quote: "الْقَلْبُ يَصْدَأُ كَمَا يَصْدَأُ الْحَدِيدُ، وَجَلَاؤُهُ الذِّكْرُ، وَيَجُوعُ كَمَا يَجُوعُ الْبَدَنُ، وَشِبَعُهُ مَعْرِفَةُ اللَّهِ وَمَحَبَّتُهُ وَالْإِنَابَةُ إِلَيْهِ.",
    source: "الإمام ابن القيّم رحمه الله (الوابل الصيّب)",
    theme: "حياة القلوب بالذكر"
  },
  {
    quote: "مَنْ جَعَلَ الْهُمُومَ هَمًّا وَاحِدًا هَمَّ آخِرَتِهِ، كَفَاهُ اللَّهُ هَمَّ دُنْيَاهُ، وَمَنْ تَشَعَّبَتْ بِهِ الْهُمُومُ فِي أَحْوَالِ الدُّنْيَا لَمْ يُبَالِ اللَّهُ فِي أَيِّ أَوْدِيَتِهَا هَلَكَ.",
    source: "حديث نبوي شريف (رواه ابن ماجه وحسنه الألباني)",
    theme: "جمع الشتات والتوكل"
  },
  {
    quote: "لَا تَقْلَقْ مِنْ تَدَابِيرِ الْبَشَرِ، فَأَقْصَى مَا يَسْتَطِيعُونَ فِعْلَهُ مَعَكَ هُوَ تَنْفِيذُ إِرَادَةِ اللَّهِ فِيكَ.",
    source: "الإمام الشعراوي رحمه الله",
    theme: "السكينة والرضا بالقدر"
  }
];

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  schedule,
  tasks,
  onToggleSchedule,
  onToggleTask,
  onNavigate,
  onStartCustomTimer,
  onOpenQuranSurah,
  onOpenNotifications
}) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [spiritualQuoteIndex, setSpiritualQuoteIndex] = useState(0);
  const [isPlayingMotivation, setIsPlayingMotivation] = useState(false);
  const [isPlayingVerseAudio, setIsPlayingVerseAudio] = useState(false);
  const motivationAudioRef = useRef<HTMLAudioElement | null>(null);
  const verseAudioRef = useRef<HTMLAudioElement | null>(null);

  // Egypt prayer data state for live updates
  const [prayerData, setPrayerData] = useState<EgyptPrayerCalculationResult>(() =>
    egyptTimeService.getCalculation()
  );

  useEffect(() => {
    const unsub = egyptTimeService.subscribe(() => {
      setPrayerData(egyptTimeService.getCalculation());
    });
    return () => unsub();
  }, []);

  const featuredVerse = DAILY_FEATURED_VERSES[featuredIndex % DAILY_FEATURED_VERSES.length];
  const activeSpiritualQuote = SPIRITUAL_QUOTES[spiritualQuoteIndex % SPIRITUAL_QUOTES.length];

  const upcomingSchedule = schedule.filter(s => !s.completed).slice(0, 3);
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 3);

  // Daily Completion Rate calculation
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalScheduleCount = schedule.length;
  const completedScheduleCount = schedule.filter(s => s.completed).length;

  const totalActionItems = totalTasksCount + totalScheduleCount;
  const totalCompletedActionItems = completedTasksCount + completedScheduleCount;
  const dailyProgressPercent = totalActionItems > 0
    ? Math.round((totalCompletedActionItems / totalActionItems) * 100)
    : (stats.totalFocusMinutes > 0 ? Math.min(100, Math.round((stats.totalFocusMinutes / 50) * 100)) : 0);

  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(() => notificationService.getSettings());

  useEffect(() => {
    const unsub = notificationService.subscribe(() => {
      setNotifSettings(notificationService.getSettings());
    });
    return () => unsub();
  }, []);

  const handlePlayDailyMotivation = () => {
    const track = MOTIVATIONAL_TRACKS[0];
    if (!motivationAudioRef.current) return;

    if (isPlayingMotivation) {
      motivationAudioRef.current.pause();
      setIsPlayingMotivation(false);
    } else {
      if (motivationAudioRef.current.src !== track.audioUrl) {
        motivationAudioRef.current.src = track.audioUrl;
      }
      motivationAudioRef.current.play()
        .then(() => setIsPlayingMotivation(true))
        .catch(e => {
          console.warn('Audio play error, trying fallback...', e);
          if (track.fallbackUrls && track.fallbackUrls[0]) {
            motivationAudioRef.current!.src = track.fallbackUrls[0];
            motivationAudioRef.current!.play()
              .then(() => setIsPlayingMotivation(true))
              .catch(err => console.warn('Fallback play error', err));
          }
        });
    }
  };

  const handleToggleVerseAudio = () => {
    if (!verseAudioRef.current) return;
    if (isPlayingVerseAudio) {
      verseAudioRef.current.pause();
      setIsPlayingVerseAudio(false);
    } else {
      const ayahAudioUrl = getAyahAudioUrl('mishary_alafasy', featuredVerse.surahId, featuredVerse.ayahNumber) ||
                           getSurahAudioUrl('mishary_alafasy', featuredVerse.surahId);
      verseAudioRef.current.src = ayahAudioUrl;
      verseAudioRef.current.play()
        .then(() => setIsPlayingVerseAudio(true))
        .catch(err => console.warn('Verse audio play error', err));
    }
  };

  const handleScrollToPrayerTimes = () => {
    const el = document.getElementById('prayer-times-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. High-Impact Realistic Hero Section */}
      <HeroBanner
        prayerData={prayerData}
        onStartJourney={() => onStartCustomTimer(25)}
        onOpenQuran={() => onNavigate('quran')}
        onOpenPrayerTimes={handleScrollToPrayerTimes}
      />

      {/* 2. Four Luxury Service Cards with Realistic Photos */}
      <ServiceCardsGrid
        prayerData={prayerData}
        onNavigate={onNavigate}
        onStartCustomTimer={onStartCustomTimer}
        onScrollToPrayerBoard={handleScrollToPrayerTimes}
      />

      {/* 3. Verified Egyptian Prayer Times Board */}
      <PrayerTimesBoard id="prayer-times-section" />

      {/* 4. Quick Metrics & Daily Achievements Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Metric 1 */}
        <div className="gold-corner-bracket p-4 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/30 hover:border-[#c59b27]/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs text-[#d4af37] mb-2 font-medium">
            <span>نسبة الإنجاز</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#fbf8f2]">
              {dailyProgressPercent}%
            </span>
          </div>
          <div className="w-full bg-[#03150f] h-1.5 rounded-full overflow-hidden border border-[#c59b27]/20">
            <div
              className="bg-gradient-to-r from-[#c59b27] to-[#e5c158] h-full rounded-full transition-all duration-500"
              style={{ width: `${dailyProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="gold-corner-bracket p-4 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/30 hover:border-[#c59b27]/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs text-[#ded3c0]/75 mb-2">
            <span>التركيز اليوم</span>
            <Clock className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#fbf8f2]">
              {stats.totalFocusMinutes}
            </span>
            <span className="text-xs text-[#ded3c0]/65">دقيقة</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="gold-corner-bracket p-4 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/30 hover:border-[#c59b27]/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs text-[#ded3c0]/75 mb-2">
            <span>المهام المنجزة</span>
            <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#fbf8f2]">
              {completedTasksCount}/{totalTasksCount}
            </span>
            <span className="text-xs text-[#ded3c0]/65">مهمة</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="gold-corner-bracket p-4 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/30 hover:border-[#c59b27]/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs text-[#ded3c0]/75 mb-2">
            <span>تسبيحات اليوم</span>
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#fbf8f2]">
              {stats.dhikrCountToday || 0}
            </span>
            <span className="text-xs text-[#ded3c0]/65">ذكر</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="gold-corner-bracket p-4 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/30 hover:border-[#c59b27]/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs text-[#ded3c0]/75 mb-2">
            <span>سلسلة الالتزام</span>
            <Flame className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#fbf8f2]">
              {stats.streakDays}
            </span>
            <span className="text-xs text-[#ded3c0]/65">أيام</span>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="gold-corner-bracket p-4 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/30 hover:border-[#c59b27]/50 transition-all shadow-md col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#ded3c0]/75 mb-2">
            <span>نقاط الإتقان</span>
            <Award className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#d4af37]">
              {stats.points}
            </span>
            <span className="text-xs text-[#ded3c0]/65">مستوى {stats.level}</span>
          </div>
        </div>
      </div>

      {/* 5. Daily Spiritual Contemplation Quote ("مساحة لعبارة إيمانية يومية بتصميم هادئ وفخم") */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07271e] via-[#051f18] to-[#041611] border border-[#c59b27]/35 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#c59b27]/50 pointer-events-none" />
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#c59b27]/50 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#c59b27]/50 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#c59b27]/50 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
              <Quote className="w-4 h-4 text-[#d4af37]" />
              <span>قبس إيماني وتأمل لليوم</span>
              <span className="text-[#ded3c0]/40" aria-hidden="true">·</span>
              <span className="text-[11px] text-[#ded3c0]/70 font-normal">{activeSpiritualQuote.theme}</span>
            </div>

            <p className="font-display text-base sm:text-lg md:text-xl text-[#fbf8f2] leading-relaxed tracking-wide">
              «{activeSpiritualQuote.quote}»
            </p>

            <div className="text-xs text-[#ded3c0]/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              <span className="font-semibold text-[#d4af37]">{activeSpiritualQuote.source}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => setSpiritualQuoteIndex(prev => prev + 1)}
              className="px-4 py-2 rounded-xl bg-[#08291f] hover:bg-[#0c382b] text-[#ded3c0] hover:text-[#fbf8f2] text-xs font-medium border border-[#c59b27]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>تأمل آخر</span>
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Quran Verse of the Day + Audio Lecture Reminder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quran Verse & Tafseer Card: Luxury Illuminated Manuscript Page */}
        <div className="lg:col-span-2 rounded-3xl manuscript-border bg-gradient-to-b from-[#07261e] via-[#051d16] to-[#041611] p-6 sm:p-7 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[#c59b27]/25">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                <h3 className="text-base sm:text-lg font-bold text-[#fbf8f2] font-display">
                  آية وتدبّر اليوم
                </h3>
                <span className="text-xs text-[#ded3c0]/75">
                  · سورة {featuredVerse.surahName} (الآية {featuredVerse.ayahNumber})
                </span>
              </div>
              <button
                onClick={() => setFeaturedIndex(prev => prev + 1)}
                className="text-xs text-[#d4af37] hover:text-[#f2dc87] font-medium transition-colors cursor-pointer"
              >
                تغيير الآية ↻
              </button>
            </div>

            {/* Verse Typography: Warm Ivory text with generous leading */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-[#041913]/90 border border-[#c59b27]/35 text-center mb-4 shadow-inner">
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#c59b27]/50 pointer-events-none" />
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c59b27]/50 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c59b27]/50 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#c59b27]/50 pointer-events-none" />

              <p className="font-quran text-xl sm:text-2xl md:text-3xl text-[#fbf8f2] leading-loose">
                « {featuredVerse.text} »
              </p>
            </div>

            {/* Tafseer Content */}
            <div className="space-y-1.5 text-right">
              <div className="text-xs font-semibold text-[#d4af37] flex items-center gap-1.5">
                <span>المعنى والبيان:</span>
              </div>
              <p className="text-xs md:text-sm text-[#ded3c0]/90 leading-relaxed bg-[#051c16]/70 p-4 rounded-xl border border-[#c59b27]/25">
                {featuredVerse.tafseer}
              </p>
              <div className="pt-1 text-[11px] text-[#ded3c0]/65 flex items-center justify-start gap-1">
                <span>المصدر الشرعي:</span>
                <span className="font-medium text-[#ded3c0]">{TAFSEER_SOURCE_NAME}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 mt-4 border-t border-[#c59b27]/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <audio
                ref={verseAudioRef}
                onEnded={() => setIsPlayingVerseAudio(false)}
                onPause={() => setIsPlayingVerseAudio(false)}
                onPlay={() => setIsPlayingVerseAudio(true)}
              />
              <button
                onClick={handleToggleVerseAudio}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] hover:to-[#0e4838] text-[#fbf8f2] font-semibold text-xs flex items-center gap-2 border border-[#c59b27]/45 shadow-md shadow-[#020e0a] transition-all cursor-pointer"
                title="تشغيل سريع للتلاوة بصوت الشيخ مشاري راشد العفاسي"
              >
                {isPlayingVerseAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current text-[#d4af37]" />
                    <span>إيقاف التلاوة</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-[#d4af37]" />
                    <span>استمع للآية (الشيخ مشاري العفاسي)</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => onOpenQuranSurah(featuredVerse.surahId)}
              className="text-xs text-[#d4af37] hover:text-[#f2dc87] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>قراءة سورة {featuredVerse.surahName} كاملة مع الاستماع</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Motivational Lecture & Nature Quick Mix */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Daily Motivational Lecture Card */}
          <div className="rounded-3xl bg-gradient-to-b from-[#07261e] to-[#041611] border border-[#c59b27]/30 p-5 space-y-3.5 shadow-lg">
            <audio ref={motivationAudioRef} onEnded={() => setIsPlayingMotivation(false)} />
            <div className="flex items-center justify-between border-b border-[#c59b27]/20 pb-2">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-sm font-bold text-[#fbf8f2]">تذكير اليوم والهمّة</h3>
              </div>
              <span className="text-[10px] text-[#d4af37] font-semibold px-2 py-0.5 rounded-md bg-[#0a3528] border border-[#c59b27]/30">
                {MOTIVATIONAL_TRACKS[0].speaker.split('(')[0].trim()}
              </span>
            </div>

            <p className="text-xs text-[#ded3c0] font-medium leading-relaxed bg-[#041712]/70 p-3.5 rounded-xl border border-[#c59b27]/20">
              «{MOTIVATIONAL_TRACKS[0].quote}»
            </p>

            <div>
              <button
                onClick={handlePlayDailyMotivation}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isPlayingMotivation
                    ? 'bg-[#c59b27] text-[#041611] shadow-md shadow-[#c59b27]/40 animate-pulse'
                    : 'bg-[#093527] hover:bg-[#0c4433] text-[#ded3c0] hover:text-[#fbf8f2] border border-[#c59b27]/35'
                }`}
              >
                {isPlayingMotivation ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingMotivation ? 'إيقاف الموعظة' : 'استمع للموعظة الصوتية الآن'}</span>
              </button>
            </div>

            <div className="text-[10px] text-[#ded3c0]/65 border-t border-[#c59b27]/15 pt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span className="truncate">{MOTIVATIONAL_TRACKS[0].copyrightNotice}</span>
            </div>
          </div>

          {/* Quick Ambient Studio Toggle */}
          <div className="rounded-3xl bg-gradient-to-b from-[#07261e] to-[#041611] border border-[#c59b27]/30 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-[#c59b27]/20 pb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-sm font-bold text-[#fbf8f2]">أصوات طبيعية للسكينة</h3>
              </div>
              <button
                onClick={() => onNavigate('ambient')}
                className="text-[11px] text-[#d4af37] hover:underline cursor-pointer"
              >
                الاستوديو الكامل ←
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {AMBIENT_TRACKS.slice(0, 4).map(track => {
                const isPlaying = ambientAudioEngine.isTrackPlaying(track.id);
                return (
                  <button
                    key={track.id}
                    onClick={() => ambientAudioEngine.toggleTrack(track.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-right flex items-center justify-between transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-[#0e4838] text-[#fbf8f2] border border-[#c59b27]/60 shadow-sm'
                        : 'bg-[#051c15] text-[#ded3c0]/80 hover:bg-[#082a20] hover:text-[#fbf8f2] border border-[#c59b27]/20'
                    }`}
                  >
                    <span className="truncate">{track.name.replace('صوت ', '')}</span>
                    <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#d4af37]' : 'bg-[#ded3c0]/30'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 7. Daily Schedule Ahead + Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule Overview */}
        <div className="rounded-3xl bg-[#062017]/85 border border-[#c59b27]/25 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4 border-b border-[#c59b27]/20 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <h3 className="text-base font-bold text-[#fbf8f2] font-display">
                محطات اليوم المتبقية
              </h3>
            </div>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-xs text-[#d4af37] hover:text-[#f2dc87] font-medium transition-colors cursor-pointer"
            >
              عرض الجدول كاملًا ←
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingSchedule.length === 0 ? (
              <p className="text-xs text-[#ded3c0]/70 py-6 text-center">
                رائع! لقد أتممت جميع محطات الجدول اليومي لهذا اليوم.
              </p>
            ) : (
              upcomingSchedule.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#041913]/70 border border-[#c59b27]/20 hover:border-[#c59b27]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleSchedule(item.id)}
                      className="w-5 h-5 rounded-md border border-[#c59b27]/40 flex items-center justify-center text-transparent hover:border-[#d4af37] transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                    </button>
                    <div>
                      <p className="text-xs font-semibold text-[#fbf8f2]">{item.title}</p>
                      <span className="text-[11px] text-[#ded3c0]/70">{item.period}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-[#d4af37] px-2.5 py-1 bg-[#07261e] border border-[#c59b27]/20 rounded-lg">
                    {item.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Priority Tasks */}
        <div className="rounded-3xl bg-[#062017]/85 border border-[#c59b27]/25 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4 border-b border-[#c59b27]/20 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <h3 className="text-base font-bold text-[#fbf8f2] font-display">
                المهام ذات الأولوية
              </h3>
            </div>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-xs text-[#d4af37] hover:text-[#f2dc87] font-medium transition-colors cursor-pointer"
            >
              إدارة المهام والأهداف ←
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.length === 0 ? (
              <p className="text-xs text-[#ded3c0]/70 py-6 text-center">
                لا توجد مهام معلقة. أضف مهامًا جديدة لتنظيم يومك!
              </p>
            ) : (
              pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#041913]/70 border border-[#c59b27]/20 hover:border-[#c59b27]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="w-5 h-5 rounded-md border border-[#c59b27]/40 flex items-center justify-center text-transparent hover:border-[#d4af37] transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                    </button>
                    <div>
                      <p className="text-xs font-semibold text-[#fbf8f2]">{task.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[#ded3c0]/70 mt-0.5">
                        <span>{task.category}</span>
                        <span>·</span>
                        <span className={task.priority === 'عالي' ? 'text-[#d4af37] font-medium' : 'text-[#ded3c0]/60'}>
                          أولوية {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  {task.estimatedMinutes && (
                    <span className="text-[11px] font-mono tabular-nums text-[#d4af37] px-2 py-0.5 bg-[#07261e] rounded-md border border-[#c59b27]/20">
                      {task.estimatedMinutes} د
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
