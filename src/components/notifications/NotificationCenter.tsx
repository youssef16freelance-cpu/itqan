import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  Trash2,
  Clock,
  BookOpen,
  Timer,
  Calendar,
  Sparkles,
  Settings,
  Volume2,
  VolumeX,
  X,
  Play
} from 'lucide-react';
import {
  AppNotification,
  NotificationSettings,
  notificationService
} from '../../services/notificationService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAction: (tab: 'quran' | 'timer' | 'schedule', surahId?: number) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigateAction
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(() => notificationService.getSettings());
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [browserPermGranted, setBrowserPermGranted] = useState<boolean>(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  useEffect(() => {
    const update = () => {
      setNotifications(notificationService.getNotifications());
      setSettings(notificationService.getSettings());
    };
    update();
    const unsub = notificationService.subscribe(update);
    return () => unsub();
  }, []);

  const handleRequestPermission = async () => {
    const ok = await notificationService.requestBrowserPermission();
    setBrowserPermGranted(ok);
  };

  const handleTestNotification = (type: 'wird' | 'focus') => {
    if (type === 'wird') {
      notificationService.triggerNotification(
        'تذكير فوري: وِرد القرآن الكريم',
        '«وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ» - حان موعد وِردك اليومي المبارك.',
        'quran_wird',
        'بدء الورد في المصحف',
        'quran'
      );
    } else {
      notificationService.triggerNotification(
        'تذكير فوري: موعد جلسة التركيز',
        'استعد لخوض 25 دقيقة من العمل العميق وإتقان المهام بدون مشتتات.',
        'focus_session',
        'تشغيل مؤقت بومودورو',
        'timer'
      );
    }
  };

  const handleSaveSetting = <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    notificationService.saveSettings(next);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="manuscript-border bg-[#051c15] border border-[#c59b27]/40 rounded-3xl max-w-xl w-full p-6 max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#c59b27]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#093527] text-[#d4af37] border border-[#c59b27]/40 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#fbf8f2] font-display">مركز التنبيهات والتذكيرات</h3>
              <p className="text-[11px] text-[#ded3c0]/70">تذكير بوِرد القرآن ومواعيد جلسات التركيز المجدولة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                showSettings
                  ? 'bg-[#c59b27] text-[#041611] border-[#c59b27] font-bold'
                  : 'bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] border-[#c59b27]/30'
              }`}
              title="إعدادات المواعيد"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">تعديل المواعيد</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] flex items-center justify-center border border-[#c59b27]/30 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Permission Banner (if not granted) */}
        {!browserPermGranted && (
          <div className="my-3 p-3 rounded-2xl bg-[#082a20] border border-[#c59b27]/30 flex items-center justify-between gap-3 text-xs">
            <p className="text-[#ded3c0]">
              تفعيل إشعارات المتصفح لتلقي التنبيهات حتى وإن كان التطبيق مصغرًا.
            </p>
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] font-semibold border border-[#c59b27]/40 shrink-0 cursor-pointer"
            >
              تفعيل التنبيهات
            </button>
          </div>
        )}

        {/* Settings View */}
        {showSettings ? (
          <div className="space-y-4 py-3 overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-2 border-b border-[#c59b27]/20 text-xs">
              <span className="font-bold text-[#fbf8f2]">ضبط مواعيد التذكيرات الذكية:</span>
              <button
                onClick={() => handleSaveSetting('soundEnabled', !settings.soundEnabled)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border cursor-pointer ${
                  settings.soundEnabled
                    ? 'bg-[#093527] border-[#c59b27]/50 text-[#d4af37]'
                    : 'bg-[#041913] border-[#c59b27]/20 text-[#ded3c0]/50'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>نغمة السكينة</span>
              </button>
            </div>

            {/* Daily Quran Wird Reminder Setting */}
            <div className="p-4 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-bold text-[#fbf8f2]">تذكير وِرد القرآن الكريم</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dailyWirdEnabled}
                  onChange={e => handleSaveSetting('dailyWirdEnabled', e.target.checked)}
                  className="w-4 h-4 accent-[#d4af37] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#ded3c0] pt-1">
                <span>توقيت التذكير اليومي:</span>
                <input
                  type="time"
                  value={settings.dailyWirdTime}
                  onChange={e => handleSaveSetting('dailyWirdTime', e.target.value)}
                  className="bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-2.5 py-1 text-[#fbf8f2] font-mono"
                />
              </div>
            </div>

            {/* Scheduled Focus Session Setting */}
            <div className="p-4 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-bold text-[#fbf8f2]">تذكير جلسة التركيز المجدولة</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.focusSessionEnabled}
                  onChange={e => handleSaveSetting('focusSessionEnabled', e.target.checked)}
                  className="w-4 h-4 accent-[#d4af37] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#ded3c0] pt-1">
                <span>توقيت جلسة التركيز:</span>
                <input
                  type="time"
                  value={settings.focusSessionTime}
                  onChange={e => handleSaveSetting('focusSessionTime', e.target.value)}
                  className="bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-2.5 py-1 text-[#fbf8f2] font-mono"
                />
              </div>
            </div>

            {/* Surah Al-Mulk at night Setting */}
            <div className="p-4 rounded-2xl bg-[#062017]/85 border border-[#c59b27]/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-bold text-[#fbf8f2]">تذكير سورة الملك قبل النوم</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.surahMulkNightEnabled}
                  onChange={e => handleSaveSetting('surahMulkNightEnabled', e.target.checked)}
                  className="w-4 h-4 accent-[#d4af37] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#ded3c0] pt-1">
                <span>توقيت التذكير الليلي:</span>
                <input
                  type="time"
                  value={settings.surahMulkNightTime}
                  onChange={e => handleSaveSetting('surahMulkNightTime', e.target.value)}
                  className="bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-2.5 py-1 text-[#fbf8f2] font-mono"
                />
              </div>
            </div>

            {/* Test buttons */}
            <div className="pt-2 border-t border-[#c59b27]/20 flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#ded3c0]/70">تجربة فورية:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTestNotification('wird')}
                  className="px-3 py-1.5 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#d4af37] text-xs font-medium border border-[#c59b27]/30 cursor-pointer"
                >
                  تجربة تنبيه الورد
                </button>
                <button
                  onClick={() => handleTestNotification('focus')}
                  className="px-3 py-1.5 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] text-xs font-medium border border-[#c59b27]/30 cursor-pointer"
                >
                  تجربة تنبيه التركيز
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Notifications List */
          <div className="flex-1 overflow-y-auto my-3 space-y-2.5 pr-1">
            <div className="flex items-center justify-between text-[11px] text-[#ded3c0]/70 pb-1">
              <span>التنبيهات السابقة ({notifications.length})</span>
              {notifications.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => notificationService.markAllAsRead()}
                    className="hover:text-[#d4af37] cursor-pointer"
                  >
                    تحديد الكل كمقروء
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => notificationService.clearAll()}
                    className="hover:text-red-400 cursor-pointer"
                  >
                    مسح السجل
                  </button>
                </div>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center bg-[#062017]/50 rounded-2xl border border-[#c59b27]/20 text-[#ded3c0]/70 text-xs">
                لا توجد تنبيهات حاليًا. ستصلك التنبيهات في المواعيد المحددة لوِردك اليومي وجلسات التركيز.
              </div>
            ) : (
              notifications.map(notif => {
                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      !notif.read
                        ? 'bg-[#082a20] border-[#c59b27]/60 shadow-md ring-1 ring-[#c59b27]/30'
                        : 'bg-[#062017]/60 border-[#c59b27]/20 text-[#ded3c0]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            notif.type === 'quran_wird' || notif.type === 'mulk_night'
                              ? 'bg-[#093527] text-[#d4af37] border border-[#c59b27]/40'
                              : notif.type === 'focus_session'
                              ? 'bg-[#07261e] text-[#d4af37] border border-[#c59b27]/40'
                              : 'bg-[#041913] text-[#d4af37]'
                          }`}
                        >
                          {notif.type === 'quran_wird' || notif.type === 'mulk_night' ? (
                            <BookOpen className="w-4 h-4" />
                          ) : notif.type === 'focus_session' ? (
                            <Timer className="w-4 h-4" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#fbf8f2]">{notif.title}</h4>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                            )}
                          </div>
                          <p className="text-xs text-[#ded3c0]/85 mt-1 leading-relaxed">
                            {notif.message}
                          </p>

                          {/* Quick Action Button */}
                          {notif.actionLabel && notif.actionTab && (
                            <div className="pt-2.5">
                              <button
                                onClick={() => {
                                  notificationService.markAsRead(notif.id);
                                  onNavigateAction(notif.actionTab!, notif.targetSurahId);
                                  onClose();
                                }}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] text-[#fbf8f2] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-[#c59b27]/40 shadow-sm"
                              >
                                <Play className="w-3 h-3 fill-current text-[#d4af37]" />
                                <span>{notif.actionLabel}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => notificationService.markAsRead(notif.id)}
                        className="text-[#ded3c0]/40 hover:text-[#fbf8f2] p-1 cursor-pointer"
                        title="تحديد كمقروء"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#c59b27]/20 flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#ded3c0]/70">
            النظام يعمل محليًا مع تنبيهات صوتية هادئة
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] font-medium border border-[#c59b27]/20 cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
