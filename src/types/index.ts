export interface SurahMeta {
  id: number;
  name: string;
  nameEnglish: string;
  revelationType: 'مكية' | 'مدنية';
  versesCount: number;
  juz: number;
  page: number;
}

export interface Ayah {
  number: number; // overall number in Quran
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
  tafseer?: string; // التفسير الميسر
  audioUrl?: string;
}

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
  serverUrl: string;
  description: string;
  supportsAyahAudio?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'عبادات' | 'عمل' | 'دراسة' | 'تطوير' | 'صحة';
  priority: 'عالي' | 'متوسط' | 'عادي';
  completed: boolean;
  dueDate?: string;
  estimatedMinutes?: number;
  completedAt?: string;
}

export interface ScheduleItem {
  id: string;
  time: string; // e.g. "05:00"
  period: 'الفجر والصباح' | 'الظهر' | 'العصر' | 'المغرب والعشاء' | 'الليل';
  title: string;
  description?: string;
  completed: boolean;
  icon?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline?: string;
  completed: boolean;
}

export interface FocusSessionLog {
  id: string;
  timestamp: string;
  durationMinutes: number;
  mode: string;
  taskTitle?: string;
  pointsEarned: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserStats {
  points: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  totalFocusMinutes: number;
  completedTasksCount: number;
  quranVersesRead: number;
  quranSurahsCompleted: number[];
  dhikrCountToday?: number;
  totalDhikrCount?: number;
  bookmarks: {
    surahId: number;
    ayahNumber: number;
    savedAt: string;
  } | null;
}

export type DhikrCategoryId = 'morning' | 'evening' | 'sleep' | 'after_prayer' | 'focus_work' | 'tasbeeh';

export interface DhikrItem {
  id: string;
  categoryId: DhikrCategoryId;
  text: string;
  count: number;
  reward?: string;
  source?: string;
}

export interface DhikrCategory {
  id: DhikrCategoryId;
  name: string;
  description: string;
  icon: string;
  timeHint?: string;
  color: string;
}

export type MotivationCategory = 'khutbah' | 'verse' | 'wisdom';

export interface MotivationalTrack {
  id: string;
  title: string;
  duration: string;
  speaker: string;
  theme: string;
  quote: string;
  script: string;
  audioUrl: string;
  fallbackUrls?: string[];
  recommendedForTimerStart?: boolean;
  category: MotivationCategory;
  copyrightNotice: string;
  sourceAttribution: string;
}

export type ReminderType = 'quran_portion' | 'focus_session' | 'custom';

export interface ReminderConfig {
  id: string;
  type: ReminderType;
  title: string;
  message: string;
  time: string; // "HH:MM" 24h format, e.g. "06:30"
  enabled: boolean;
  repeatDaily: boolean;
  daysOfWeek: number[]; // 0=Sunday, 1=Monday ... 6=Saturday. Empty or all 7 = every day
  actionTab: 'quran' | 'timer' | 'schedule';
  targetSurahId?: number;
  lastTriggeredDate?: string; // YYYY-MM-DD
}

export interface InAppAlert {
  id: string;
  reminderId?: string;
  type: ReminderType;
  title: string;
  message: string;
  timestamp: string;
  actionTab: 'quran' | 'timer' | 'schedule';
  actionLabel: string;
  targetSurahId?: number;
}

export interface NotificationLogItem {
  id: string;
  title: string;
  message: string;
  type: ReminderType;
  timestamp: string;
  read: boolean;
}

