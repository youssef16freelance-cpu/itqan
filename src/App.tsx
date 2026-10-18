/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Navigation, NavTab } from './components/layout/Navigation';
import { Dashboard } from './components/dashboard/Dashboard';
import { QuranView } from './components/quran/QuranView';
import { HisnMuslimView } from './components/hisn/HisnMuslimView';
import { PomodoroView } from './components/timer/PomodoroView';
import { TasksScheduleView } from './components/tasks/TasksScheduleView';
import { AmbientSoundView } from './components/ambient/AmbientSoundView';
import { MotivationView } from './components/motivation/MotivationView';
import { StatsAchievementsView } from './components/stats/StatsAchievementsView';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { NotificationToast } from './components/notifications/NotificationToast';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { storageService } from './services/storage';
import { AchievementBadge, GoalItem, ScheduleItem, TaskItem, UserStats } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [stats, setStats] = useState<UserStats>(() => storageService.getStats());
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => storageService.getSchedule());
  const [tasks, setTasks] = useState<TaskItem[]>(() => storageService.getTasks());
  const [goals, setGoals] = useState<GoalItem[]>(() => storageService.getGoals());
  const [badges, setBadges] = useState<AchievementBadge[]>(() => storageService.getBadges());

  // Deep-link / shortcut state
  const [selectedSurahId, setSelectedSurahId] = useState<number>(1);
  const [timerInitialMinutes, setTimerInitialMinutes] = useState<number>(25);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);

  // Check URL parameters for PWA shortcuts (e.g. /?tab=quran)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const validTabs: NavTab[] = ['dashboard', 'quran', 'hisn_muslim', 'timer', 'schedule', 'ambient', 'motivation', 'stats'];
      if (tabParam === 'hisn') {
        setCurrentTab('hisn_muslim');
      } else if (tabParam && validTabs.includes(tabParam as NavTab)) {
        setCurrentTab(tabParam as NavTab);
      }
      const surahParam = params.get('surah');
      if (surahParam) {
        const id = parseInt(surahParam, 10);
        if (!isNaN(id) && id >= 1 && id <= 114) {
          setSelectedSurahId(id);
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const handleNotificationNavigate = (tab: 'quran' | 'timer' | 'schedule', surahId?: number) => {
    if (tab === 'quran') {
      if (surahId) setSelectedSurahId(surahId);
      setCurrentTab('quran');
    } else if (tab === 'timer') {
      setCurrentTab('timer');
    } else if (tab === 'schedule') {
      setCurrentTab('schedule');
    }
  };

  // Check and unlock badges based on updated stats
  const checkBadges = (currentStats: UserStats, currentTasks: TaskItem[]) => {
    let updated = false;
    const newBadges = badges.map(badge => {
      let nextProgress = badge.progress;
      let nextUnlocked = badge.unlocked;

      if (badge.id === 'first_focus' && currentStats.totalFocusMinutes > 0) {
        nextUnlocked = true;
        nextProgress = 1;
      } else if (badge.id === 'focus_master') {
        nextProgress = currentStats.totalFocusMinutes;
        if (nextProgress >= badge.maxProgress) nextUnlocked = true;
      } else if (badge.id === 'quran_companion') {
        nextProgress = currentStats.quranVersesRead;
        if (nextProgress >= badge.maxProgress) nextUnlocked = true;
      } else if (badge.id === 'task_slayer') {
        nextProgress = currentStats.completedTasksCount;
        if (nextProgress >= badge.maxProgress) nextUnlocked = true;
      }

      if (nextUnlocked !== badge.unlocked || nextProgress !== badge.progress) {
        updated = true;
        return { ...badge, unlocked: nextUnlocked, progress: nextProgress };
      }
      return badge;
    });

    if (updated) {
      setBadges(newBadges);
      storageService.saveBadges(newBadges);
    }
  };

  const handleToggleSchedule = (id: string) => {
    const updated = schedule.map(s => {
      if (s.id === id) {
        const next = !s.completed;
        if (next) {
          addPoints(10);
        }
        return { ...s, completed: next };
      }
      return s;
    });
    setSchedule(updated);
    storageService.saveSchedule(updated);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        const next = !t.completed;
        if (next) {
          const newStats = {
            ...stats,
            completedTasksCount: stats.completedTasksCount + 1,
            points: stats.points + 15
          };
          newStats.level = Math.floor(newStats.points / 200) + 1;
          setStats(newStats);
          storageService.saveStats(newStats);
          checkBadges(newStats, updated);
        }
        return { ...t, completed: next };
      }
      return t;
    });
    setTasks(updated);
    storageService.saveTasks(updated);
  };

  const addPoints = (amount: number) => {
    const newStats = {
      ...stats,
      points: stats.points + amount,
      level: Math.floor((stats.points + amount) / 200) + 1
    };
    setStats(newStats);
    storageService.saveStats(newStats);
    checkBadges(newStats, tasks);
  };

  const handleSessionComplete = (minutes: number) => {
    const newStats = {
      ...stats,
      totalFocusMinutes: stats.totalFocusMinutes + minutes,
      points: stats.points + minutes,
      level: Math.floor((stats.points + minutes) / 200) + 1
    };
    setStats(newStats);
    storageService.saveStats(newStats);
    checkBadges(newStats, tasks);
  };

  const handleAyahRead = (count: number) => {
    const newStats = {
      ...stats,
      quranVersesRead: stats.quranVersesRead + count
    };
    setStats(newStats);
    storageService.saveStats(newStats);
    checkBadges(newStats, tasks);
  };

  const handleDhikrCounted = (count: number) => {
    setStats(storageService.getStats());
  };

  const handleStartCustomTimer = (minutes: number) => {
    setTimerInitialMinutes(minutes);
    setCurrentTab('timer');
  };

  const handleOpenQuranSurah = (surahId: number) => {
    setSelectedSurahId(surahId);
    setCurrentTab('quran');
  };

  const handleOpenBookmark = () => {
    if (stats.bookmarks) {
      setSelectedSurahId(stats.bookmarks.surahId);
      setCurrentTab('quran');
    }
  };

  // Theme state: dark / light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('itqan_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('itqan_theme', next);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-250 islamic-pattern-bg ${
      theme === 'dark'
        ? 'bg-[#041611] text-[#fbf8f2] selection:bg-[#c59b27] selection:text-white'
        : 'bg-[#fbf8f2] text-[#17211b] selection:bg-[#c59b27] selection:text-white'
    }`}>
      {/* Top Header */}
      <Header
        stats={stats}
        theme={theme}
        currentTab={currentTab}
        onNavigate={tab => setCurrentTab(tab)}
        onToggleTheme={handleToggleTheme}
        onOpenAmbient={() => setCurrentTab('ambient')}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenQuranBookmark={stats.bookmarks ? handleOpenBookmark : undefined}
      />

      {/* Navigation Sub-header / Tab Bar */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            schedule={schedule}
            tasks={tasks}
            onToggleSchedule={handleToggleSchedule}
            onToggleTask={handleToggleTask}
            onNavigate={tab => setCurrentTab(tab)}
            onStartCustomTimer={handleStartCustomTimer}
            onOpenQuranSurah={handleOpenQuranSurah}
            onOpenNotifications={() => setIsNotificationCenterOpen(true)}
          />
        )}

        {currentTab === 'quran' && (
          <QuranView
            initialSurahId={selectedSurahId}
            onAyahRead={handleAyahRead}
          />
        )}

        {currentTab === 'hisn_muslim' && (
          <HisnMuslimView
            onDhikrCounted={handleDhikrCounted}
          />
        )}

        {currentTab === 'timer' && (
          <PomodoroView
            initialMinutes={timerInitialMinutes}
            onSessionComplete={handleSessionComplete}
          />
        )}

        {currentTab === 'schedule' && (
          <TasksScheduleView
            schedule={schedule}
            tasks={tasks}
            goals={goals}
            onUpdateSchedule={setSchedule}
            onUpdateTasks={setTasks}
            onUpdateGoals={setGoals}
            onPointsEarned={addPoints}
          />
        )}

        {currentTab === 'ambient' && (
          <AmbientSoundView />
        )}

        {currentTab === 'motivation' && (
          <MotivationView />
        )}

        {currentTab === 'stats' && (
          <StatsAchievementsView
            stats={stats}
            badges={badges}
          />
        )}
      </main>

      {/* Global Notification Toast */}
      <NotificationToast onNavigateAction={handleNotificationNavigate} />

      {/* Notification Center Modal */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onNavigateAction={handleNotificationNavigate}
      />

      {/* Offline Mode Indicator */}
      <OfflineIndicator />

      {/* Luxury Islamic Footer */}
      <Footer
        onNavigate={tab => setCurrentTab(tab)}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
      />
    </div>
  );
}
