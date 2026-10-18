import { AchievementBadge, GoalItem, ScheduleItem, TaskItem, UserStats } from '../types';

const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch_1',
    time: '05:00',
    period: 'الفجر والصباح',
    title: 'صلاة الفجر وقراءة أذكار الصباح',
    description: 'بداية مباركة مع ركعتي الفجر والاستغفار وسكينة الصباح',
    completed: true,
    icon: 'Sun'
  },
  {
    id: 'sch_2',
    time: '06:00',
    period: 'الفجر والصباح',
    title: 'وِرد القرآن الكريم (تلاوة وتدبر)',
    description: 'قراءة جزء أو حزب يومي مع الوقوف على معاني الآيات',
    completed: true,
    icon: 'BookOpen'
  },
  {
    id: 'sch_3',
    time: '08:00',
    period: 'الفجر والصباح',
    title: 'جلسة العمل / الدراسة العميقة الأولى (بومودورو)',
    description: 'إنجاز المهمة الأكبر ذات الأولوية القصوى بدون مقاطعات',
    completed: false,
    icon: 'Focus'
  },
  {
    id: 'sch_4',
    time: '12:30',
    period: 'الظهر',
    title: 'صلاة الظهر واستراحة غداء',
    description: 'تجديد النشاط والراحة الذهنية',
    completed: false,
    icon: 'Coffee'
  },
  {
    id: 'sch_5',
    time: '16:00',
    period: 'العصر',
    title: 'صلاة العصر وجلسة تطوير المهارات أو القراءة',
    description: 'ساعة للتعلم والارتقاء المهني والمعرفي',
    completed: false,
    icon: 'GraduationCap'
  },
  {
    id: 'sch_6',
    time: '19:30',
    period: 'المغرب والعشاء',
    title: 'صلاة المغرب والعشاء وجلسة العائلة',
    description: 'صلة الرحم والراحة الأسرية والتأمل',
    completed: false,
    icon: 'Home'
  },
  {
    id: 'sch_7',
    time: '21:30',
    period: 'الليل',
    title: 'مراجعة إنجاز اليوم والتخطيط للغد وسورة الملك',
    description: 'تقييم المهام وسنة قراءة تبارك قبل النوم',
    completed: false,
    icon: 'Moon'
  }
];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'tsk_1',
    title: 'قراءة سورة الكهف والتدبر في دروسها',
    category: 'عبادات',
    priority: 'عالي',
    completed: false,
    dueDate: 'اليوم',
    estimatedMinutes: 25
  },
  {
    id: 'tsk_2',
    title: 'إنهاء التقرير الأسبوعي أو الواجب الدراسي',
    category: 'عمل',
    priority: 'عالي',
    completed: false,
    dueDate: 'اليوم',
    estimatedMinutes: 50
  },
  {
    id: 'tsk_3',
    title: 'مراجعة وتثبيت حفظ الحزب 59',
    category: 'دراسة',
    priority: 'متوسط',
    completed: false,
    dueDate: 'غداً',
    estimatedMinutes: 30
  },
  {
    id: 'tsk_4',
    title: 'ممارسة رياضة المشي أو تمارين المقاومة',
    category: 'صحة',
    priority: 'عادي',
    completed: true,
    dueDate: 'اليوم',
    estimatedMinutes: 30
  }
];

const INITIAL_GOALS: GoalItem[] = [
  {
    id: 'gl_1',
    title: 'ختم القرآن الكريم تلاوة وتدبراً',
    category: 'قرآن',
    currentValue: 12,
    targetValue: 30,
    unit: 'جزء',
    deadline: 'نهاية الشهر',
    completed: false
  },
  {
    id: 'gl_2',
    title: 'ساعات تركيز بومودورو الشهرية',
    category: 'إنتاجية',
    currentValue: 28,
    targetValue: 50,
    unit: 'ساعة',
    deadline: 'نهاية الشهر',
    completed: false
  },
  {
    id: 'gl_3',
    title: 'إتمام قراءة كتاب فقه السيرة',
    category: 'تطوير',
    currentValue: 180,
    targetValue: 350,
    unit: 'صفحة',
    deadline: 'خلال 3 أسابيع',
    completed: false
  }
];

const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'first_focus',
    title: 'البداية المباركة',
    description: 'إتمام أول جلسة تركيز بومودورو بنجاح',
    icon: 'Sparkles',
    unlocked: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'focus_master',
    title: 'فارس التركيز',
    description: 'الوصول إلى 100 دقيقة تركيز خالص',
    icon: 'Hourglass',
    unlocked: true,
    progress: 100,
    maxProgress: 100
  },
  {
    id: 'quran_companion',
    title: 'رفيق القرآن',
    description: 'قراءة 50 آية وتدبر معانيها وتفاسيرها',
    icon: 'BookOpen',
    unlocked: false,
    progress: 32,
    maxProgress: 50
  },
  {
    id: 'streak_flame',
    title: 'شعلة الانضباط',
    description: 'الاستمرار في استخدام التطبيق 3 أيام متتالية',
    icon: 'Flame',
    unlocked: true,
    progress: 3,
    maxProgress: 3
  },
  {
    id: 'task_slayer',
    title: 'صانع الإنجاز',
    description: 'إنجاز 10 مهام من قائمة مهامك',
    icon: 'CheckCircle2',
    unlocked: false,
    progress: 6,
    maxProgress: 10
  },
  {
    id: 'serenity_seeker',
    title: 'واحة السكينة',
    description: 'تشغيل أصوات الطبيعة الهادئة أثناء جلسة تركيز',
    icon: 'CloudRain',
    unlocked: true,
    progress: 1,
    maxProgress: 1
  }
];

const INITIAL_STATS: UserStats = {
  points: 480,
  level: 3,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalFocusMinutes: 135,
  completedTasksCount: 6,
  quranVersesRead: 45,
  quranSurahsCompleted: [1, 103, 108, 112, 113, 114],
  bookmarks: {
    surahId: 18,
    ayahNumber: 1,
    savedAt: new Date().toISOString()
  }
};

class StorageService {
  public get<T>(key: string, defaultValue: T): T {
    try {
      const val = localStorage.getItem(`itqan_${key}`);
      return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
      console.warn(`Storage get error for ${key}`, e);
      return defaultValue;
    }
  }

  public set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`itqan_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage set error for ${key}`, e);
    }
  }

  public getSchedule(): ScheduleItem[] {
    return this.get<ScheduleItem[]>('schedule', INITIAL_SCHEDULE);
  }

  public saveSchedule(items: ScheduleItem[]): void {
    this.set('schedule', items);
  }

  public getTasks(): TaskItem[] {
    return this.get<TaskItem[]>('tasks', INITIAL_TASKS);
  }

  public saveTasks(tasks: TaskItem[]): void {
    this.set('tasks', tasks);
  }

  public getGoals(): GoalItem[] {
    return this.get<GoalItem[]>('goals', INITIAL_GOALS);
  }

  public saveGoals(goals: GoalItem[]): void {
    this.set('goals', goals);
  }

  public getStats(): UserStats {
    return this.get<UserStats>('stats', INITIAL_STATS);
  }

  public saveStats(stats: UserStats): void {
    this.set('stats', stats);
  }

  public getBadges(): AchievementBadge[] {
    return this.get<AchievementBadge[]>('badges', INITIAL_BADGES);
  }

  public saveBadges(badges: AchievementBadge[]): void {
    this.set('badges', badges);
  }

  public getFavoriteReciter(): string {
    return this.get<string>('reciter', 'mishary_alafasy');
  }

  public saveFavoriteReciter(id: string): void {
    this.set('reciter', id);
  }

  public getMotivationalIntroEnabled(): boolean {
    return this.get<boolean>('motivation_intro_enabled', true);
  }

  public saveMotivationalIntroEnabled(enabled: boolean): void {
    this.set('motivation_intro_enabled', enabled);
  }

  // Award points & check level ups
  public addPoints(amount: number, reason: string): UserStats {
    const stats = this.getStats();
    stats.points += amount;
    stats.level = Math.floor(stats.points / 200) + 1;
    this.saveStats(stats);
    return stats;
  }
}

export const storageService = new StorageService();
