import { ambientAudioEngine } from './ambientAudio';
import { egyptTimeService } from './egyptTimeService';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'quran_wird' | 'focus_session' | 'mulk_night' | 'general';
  actionLabel?: string;
  actionTab?: 'quran' | 'timer' | 'schedule';
  targetSurahId?: number;
}

export interface NotificationSettings {
  soundEnabled: boolean;
  dailyWirdEnabled: boolean;
  dailyWirdTime: string; // "06:30"
  focusSessionEnabled: boolean;
  focusSessionTime: string; // "09:30"
  surahMulkNightEnabled: boolean;
  surahMulkNightTime: string; // "22:30"
}

const STORAGE_NOTIFS_KEY = 'itqan_notifications_v3';
const STORAGE_SETTINGS_KEY = 'itqan_notification_settings_v3';
const STORAGE_LAST_TRIGGERED_KEY = 'itqan_notif_last_triggered';

const DEFAULT_SETTINGS: NotificationSettings = {
  soundEnabled: true,
  dailyWirdEnabled: true,
  dailyWirdTime: '06:30',
  focusSessionEnabled: true,
  focusSessionTime: '09:30',
  surahMulkNightEnabled: true,
  surahMulkNightTime: '22:30'
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'initial_wird',
    title: 'تذكير الورد القرآني اليومي',
    message: '«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» — حان وقت وردك اليومي المبارك لتنال السكينة والبركة في يومك.',
    timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    read: false,
    type: 'quran_wird',
    actionLabel: 'فتح المصحف وقراءة الورد',
    actionTab: 'quran',
    targetSurahId: 1
  },
  {
    id: 'initial_focus',
    title: 'جلسة التركيز وبومودورو المجدولة',
    message: 'استعد لخوض 25 دقيقة من العمل العميق والإنتاجية العالية دون مشتتات مع صوت الطبيعة.',
    timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    read: false,
    type: 'focus_session',
    actionLabel: 'تشغيل مؤقت التركيز',
    actionTab: 'timer'
  }
];

class NotificationService {
  private notifications: AppNotification[] = [];
  private settings: NotificationSettings = DEFAULT_SETTINGS;
  private listeners: Set<() => void> = new Set();
  private tickerInterval: number | null = null;
  private lastTriggered: Record<string, string> = {}; // { wird: 'YYYY-MM-DD', focus: 'YYYY-MM-DD' }

  constructor() {
    this.loadState();
    this.startTicker();
  }

  private loadState() {
    try {
      const savedNotifs = localStorage.getItem(STORAGE_NOTIFS_KEY);
      if (savedNotifs) {
        this.notifications = JSON.parse(savedNotifs);
      } else {
        this.notifications = INITIAL_NOTIFICATIONS;
        this.saveNotifications(this.notifications);
      }

      const savedSettings = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (savedSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      } else {
        this.settings = DEFAULT_SETTINGS;
        this.saveSettings(this.settings);
      }

      const savedTriggered = localStorage.getItem(STORAGE_LAST_TRIGGERED_KEY);
      if (savedTriggered) {
        this.lastTriggered = JSON.parse(savedTriggered);
      }
    } catch (e) {
      console.warn('Error loading notifications state', e);
      this.notifications = INITIAL_NOTIFICATIONS;
      this.settings = DEFAULT_SETTINGS;
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (e) {}
    });
  }

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  public saveSettings(settings: NotificationSettings) {
    this.settings = settings;
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
    this.notify();
  }

  private saveNotifications(notifs: AppNotification[]) {
    this.notifications = notifs;
    try {
      localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(notifs));
    } catch (e) {}
    this.notify();
  }

  public markAsRead(id: string) {
    const updated = this.notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(updated);
  }

  public markAllAsRead() {
    const updated = this.notifications.map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
  }

  public clearAll() {
    this.saveNotifications([]);
  }

  public async requestBrowserPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const res = await Notification.requestPermission();
      return res === 'granted';
    } catch (e) {
      return false;
    }
  }

  // Trigger a new notification
  public triggerNotification(
    title: string,
    message: string,
    type: AppNotification['type'],
    actionLabel?: string,
    actionTab?: 'quran' | 'timer' | 'schedule',
    targetSurahId?: number
  ) {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type,
      actionLabel,
      actionTab,
      targetSurahId
    };

    // 1. Play serene audio tone if enabled
    if (this.settings.soundEnabled) {
      try {
        ambientAudioEngine.playNotificationTone();
      } catch (e) {
        console.warn('Audio tone play error', e);
      }
    }

    // 2. Fire browser native notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          dir: 'rtl',
          lang: 'ar'
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (e) {
        console.warn('Native notification failed', e);
      }
    }

    // 3. Store notification and notify UI
    const updated = [newNotif, ...this.notifications].slice(0, 40); // keep last 40
    this.saveNotifications(updated);
  }

  // Periodic ticker to check local scheduled times
  private startTicker() {
    if (this.tickerInterval) return;

    this.tickerInterval = window.setInterval(() => {
      this.checkSchedules();
    }, 20000); // checks every 20 seconds
  }

  private checkSchedules() {
    const egyptNow = egyptTimeService.getEgyptNow();
    const currentHHMM = `${egyptNow.hour.toString().padStart(2, '0')}:${egyptNow.minute.toString().padStart(2, '0')}`;
    const todayStr = `${egyptNow.year}-${String(egyptNow.month).padStart(2, '0')}-${String(egyptNow.day).padStart(2, '0')}`;

    let stateChanged = false;

    // Check prayer times adhan
    try {
      const prayerCalc = egyptTimeService.getCalculation();
      prayerCalc.prayers.forEach(prayer => {
        if (prayer.id !== 'sunrise' && prayer.time === currentHHMM) {
          const prayerKey = `adhan_${prayer.id}_${todayStr}`;
          if (this.lastTriggered[prayerKey] !== todayStr) {
            this.lastTriggered[prayerKey] = todayStr;
            stateChanged = true;
            this.triggerNotification(
              `حان الآن موعد أذان ${prayer.name} 🕌`,
              `الله أكبر، الله أكبر · حان الآن موعد أذان ${prayer.name} بتوقيت ${prayerCalc.city.name}، جمهورية مصر العربية.`,
              'general',
              'لوحة مواقيت الصلاة',
              'schedule'
            );
          }
        }
      });
    } catch (e) {
      console.warn('Prayer schedule check error', e);
    }

    // 1. Quran Daily Wird check
    if (this.settings.dailyWirdEnabled && this.settings.dailyWirdTime === currentHHMM) {
      if (this.lastTriggered['wird'] !== todayStr) {
        this.lastTriggered['wird'] = todayStr;
        stateChanged = true;
        this.triggerNotification(
          'تذكير الورد القرآني اليومي 📖',
          '«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» — حان وقت قراءة وردك القرآني اليومي، رتّل وتدبر لتنال البركة والسكينة.',
          'quran_wird',
          'فتح المصحف وقراءة الورد',
          'quran',
          1
        );
      }
    }

    // 2. Scheduled Focus Session check
    if (this.settings.focusSessionEnabled && this.settings.focusSessionTime === currentHHMM) {
      if (this.lastTriggered['focus'] !== todayStr) {
        this.lastTriggered['focus'] = todayStr;
        stateChanged = true;
        this.triggerNotification(
          'تذكير موعد جلسة التركيز المجدولة ⏳',
          'حان موعد جلسة العمل والتركيز المجدولة | استعن بالله وأنجز أهم أولوياتك بهدوء عبر مؤقت بومودورو.',
          'focus_session',
          'تشغيل مؤقت التركيز',
          'timer'
        );
      }
    }

    // 3. Surah Al-Mulk at night check
    if (this.settings.surahMulkNightEnabled && this.settings.surahMulkNightTime === currentHHMM) {
      if (this.lastTriggered['mulk'] !== todayStr) {
        this.lastTriggered['mulk'] = todayStr;
        stateChanged = true;
        this.triggerNotification(
          'تذكير سورة الملك قبل النوم ✨',
          'المنجية من عذاب القبر — استمع أو اقرأ سورة الملك (تبارك) واختم يومك بخير وبركة وسكينة.',
          'mulk_night',
          'قراءة سورة الملك',
          'quran',
          67 // Surah Al-Mulk is Surah 67
        );
      }
    }

    if (stateChanged) {
      try {
        localStorage.setItem(STORAGE_LAST_TRIGGERED_KEY, JSON.stringify(this.lastTriggered));
      } catch (e) {}
    }
  }
}

export const notificationService = new NotificationService();
