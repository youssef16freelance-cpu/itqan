import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Target,
  ListTodo,
  Clock,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { GoalItem, ScheduleItem, TaskItem, UserStats } from '../../types';
import { storageService } from '../../services/storage';
import { PrayerTimesBoard } from '../dashboard/PrayerTimesBoard';

interface TasksScheduleViewProps {
  schedule: ScheduleItem[];
  tasks: TaskItem[];
  goals: GoalItem[];
  onUpdateSchedule: (items: ScheduleItem[]) => void;
  onUpdateTasks: (tasks: TaskItem[]) => void;
  onUpdateGoals: (goals: GoalItem[]) => void;
  onPointsEarned?: (points: number) => void;
}

export const TasksScheduleView: React.FC<TasksScheduleViewProps> = ({
  schedule,
  tasks,
  goals,
  onUpdateSchedule,
  onUpdateTasks,
  onUpdateGoals,
  onPointsEarned
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'goals'>('schedule');

  // New task form state
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskItem['category']>('عمل');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem['priority']>('متوسط');
  const [newTaskMinutes, setNewTaskMinutes] = useState<number>(25);

  // New schedule form state
  const [showAddScheduleModal, setShowAddScheduleModal] = useState<boolean>(false);
  const [newScheduleTime, setNewScheduleTime] = useState<string>('07:00');
  const [newSchedulePeriod, setNewSchedulePeriod] = useState<ScheduleItem['period']>('الفجر والصباح');
  const [newScheduleTitle, setNewScheduleTitle] = useState<string>('');

  // New goal form state
  const [showAddGoalModal, setShowAddGoalModal] = useState<boolean>(false);
  const [newGoalTitle, setNewGoalTitle] = useState<string>('');
  const [newGoalTarget, setNewGoalTarget] = useState<number>(30);
  const [newGoalUnit, setNewGoalUnit] = useState<string>('جزء');

  // Filter tasks
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Toggle Schedule Item
  const handleToggleScheduleItem = (id: string) => {
    const updated = schedule.map(item => {
      if (item.id === id) {
        const nextCompleted = !item.completed;
        if (nextCompleted && onPointsEarned) {
          onPointsEarned(10);
        }
        return { ...item, completed: nextCompleted };
      }
      return item;
    });
    onUpdateSchedule(updated);
    storageService.saveSchedule(updated);
  };

  // Delete Schedule Item
  const handleDeleteScheduleItem = (id: string) => {
    const updated = schedule.filter(s => s.id !== id);
    onUpdateSchedule(updated);
    storageService.saveSchedule(updated);
  };

  // Add Schedule Item
  const handleAddScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTitle.trim()) return;

    const newItem: ScheduleItem = {
      id: `sch_${Date.now()}`,
      time: newScheduleTime,
      period: newSchedulePeriod,
      title: newScheduleTitle.trim(),
      completed: false
    };

    const updated = [...schedule, newItem].sort((a, b) => a.time.localeCompare(b.time));
    onUpdateSchedule(updated);
    storageService.saveSchedule(updated);
    setNewScheduleTitle('');
    setShowAddScheduleModal(false);
  };

  // Toggle Task Item
  const handleToggleTask = (id: string) => {
    const updated = tasks.map(task => {
      if (task.id === id) {
        const nextCompleted = !task.completed;
        if (nextCompleted) {
          const stats = storageService.getStats();
          stats.completedTasksCount += 1;
          stats.points += 15;
          storageService.saveStats(stats);
          if (onPointsEarned) onPointsEarned(15);
        }
        return {
          ...task,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined
        };
      }
      return task;
    });
    onUpdateTasks(updated);
    storageService.saveTasks(updated);
  };

  // Delete Task Item
  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    onUpdateTasks(updated);
    storageService.saveTasks(updated);
  };

  // Add Task Item
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      completed: false,
      estimatedMinutes: newTaskMinutes
    };

    const updated = [newTask, ...tasks];
    onUpdateTasks(updated);
    storageService.saveTasks(updated);
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  // Goal increment/decrement step
  const handleGoalStep = (goalId: string, delta: number) => {
    const updated = goals.map(goal => {
      if (goal.id === goalId) {
        const nextVal = Math.max(0, goal.currentValue + delta);
        const isDone = nextVal >= goal.targetValue;
        if (isDone && !goal.completed && onPointsEarned) {
          onPointsEarned(50);
        }
        return {
          ...goal,
          currentValue: nextVal,
          completed: isDone
        };
      }
      return goal;
    });
    onUpdateGoals(updated);
    storageService.saveGoals(updated);
  };

  // Delete Goal
  const handleDeleteGoal = (goalId: string) => {
    const updated = goals.filter(g => g.id !== goalId);
    onUpdateGoals(updated);
    storageService.saveGoals(updated);
  };

  // Add Goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal: GoalItem = {
      id: `goal_${Date.now()}`,
      title: newGoalTitle.trim(),
      category: 'إيماني',
      currentValue: 0,
      targetValue: newGoalTarget,
      unit: newGoalUnit.trim(),
      completed: false
    };

    const updated = [...goals, newGoal];
    onUpdateGoals(updated);
    storageService.saveGoals(updated);
    setNewGoalTitle('');
    setShowAddGoalModal(false);
  };

  // Schedule periods grouping
  const periodsOrder: ScheduleItem['period'][] = [
    'الفجر والصباح',
    'الظهر',
    'العصر',
    'المغرب والعشاء',
    'الليل'
  ];

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto">
      {/* Top Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c59b27]/20 pb-4">
        <div className="flex items-center gap-1.5 p-1 bg-[#051c15] rounded-2xl border border-[#c59b27]/25 shadow-inner">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] border border-[#c59b27]/50 shadow-md shadow-[#020e0a]'
                : 'text-[#ded3c0]/70 hover:text-[#fbf8f2]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>الجدول ومواقيت الصلاة</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] border border-[#c59b27]/50 shadow-md shadow-[#020e0a]'
                : 'text-[#ded3c0]/70 hover:text-[#fbf8f2]'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>المهام اليومية ({tasks.filter(t => !t.completed).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'goals'
                ? 'bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] border border-[#c59b27]/50 shadow-md shadow-[#020e0a]'
                : 'text-[#ded3c0]/70 hover:text-[#fbf8f2]'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>الأهداف الكبرى ({goals.length})</span>
          </button>
        </div>

        {/* Action Button */}
        {activeTab === 'schedule' && (
          <button
            onClick={() => setShowAddScheduleModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] text-[#fbf8f2] text-xs font-bold border border-[#c59b27]/40 shadow-md shadow-[#020e0a] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <span>إضافة محطة</span>
          </button>
        )}

        {activeTab === 'tasks' && (
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] text-[#fbf8f2] text-xs font-bold border border-[#c59b27]/40 shadow-md shadow-[#020e0a] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <span>مهمة جديدة</span>
          </button>
        )}

        {activeTab === 'goals' && (
          <button
            onClick={() => setShowAddGoalModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] text-[#fbf8f2] text-xs font-bold border border-[#c59b27]/40 shadow-md shadow-[#020e0a] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <span>هدف جديد</span>
          </button>
        )}
      </div>

      {/* 1. Daily Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Architectural Prayer Board */}
          <PrayerTimesBoard />

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-[#fbf8f2] font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>محطات وبرنامج اليوم الإيماني والعملي</span>
            </h3>

            {periodsOrder.map(period => {
              const periodItems = schedule.filter(s => s.period === period);
              if (periodItems.length === 0) return null;

              return (
                <div key={period} className="rounded-2xl bg-[#062017]/80 border border-[#c59b27]/25 p-5 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-[#c59b27]/20 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                      <h4 className="text-sm font-bold text-[#fbf8f2] font-display">{period}</h4>
                    </div>
                    <span className="text-[11px] text-[#ded3c0]/70 font-mono">
                      {periodItems.filter(i => i.completed).length} من {periodItems.length} مكتمل
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {periodItems.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          item.completed
                            ? 'bg-[#041611]/60 border-[#c59b27]/15 text-[#ded3c0]/50 opacity-70'
                            : 'bg-[#08281e]/80 border-[#c59b27]/30 text-[#fbf8f2] hover:border-[#c59b27]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleScheduleItem(item.id)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                              item.completed
                                ? 'bg-[#c59b27] text-[#041611] font-bold'
                                : 'border border-[#c59b27]/40 hover:border-[#d4af37] text-transparent'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <div>
                            <p className={`text-xs font-semibold ${item.completed ? 'line-through text-[#ded3c0]/50' : 'text-[#fbf8f2]'}`}>
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-[11px] text-[#ded3c0]/65 mt-0.5">{item.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono tabular-nums px-2.5 py-1 rounded-lg bg-[#041712] border border-[#c59b27]/30 text-[#d4af37]">
                            {item.time}
                          </span>
                          <button
                            onClick={() => handleDeleteScheduleItem(item.id)}
                            className="text-[#ded3c0]/40 hover:text-red-400 p-1 transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'completed'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setTaskFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  taskFilter === filter
                    ? 'bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] border-[#c59b27]/50 font-bold'
                    : 'bg-[#062017]/70 text-[#ded3c0]/70 hover:text-[#fbf8f2] border-[#c59b27]/20'
                }`}
              >
                {filter === 'all' ? 'جميع المهام' : filter === 'pending' ? 'المهام الجارية' : 'المكتملة'}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center bg-[#062017]/60 rounded-2xl border border-[#c59b27]/25 text-[#ded3c0]/70 text-xs">
                لا توجد مهام تطابق هذا التصفية.
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-[#041611]/60 border-[#c59b27]/15 text-[#ded3c0]/50 opacity-60'
                      : 'bg-[#062017]/85 border-[#c59b27]/25 text-[#fbf8f2] hover:border-[#c59b27]/50 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        task.completed
                          ? 'bg-[#c59b27] text-[#041611] font-bold'
                          : 'border border-[#c59b27]/40 hover:border-[#d4af37] text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <p className={`text-xs font-semibold ${task.completed ? 'line-through text-[#ded3c0]/50' : 'text-[#fbf8f2]'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#ded3c0]/70 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-[#041913] border border-[#c59b27]/30 text-[#ded3c0]">
                          {task.category}
                        </span>
                        <span>·</span>
                        <span
                          className={
                            task.priority === 'عالي'
                              ? 'text-[#e5c158] font-semibold'
                              : task.priority === 'متوسط'
                              ? 'text-[#d4af37]'
                              : 'text-[#ded3c0]/70'
                          }
                        >
                          أولوية {task.priority}
                        </span>
                        {task.dueDate && (
                          <>
                            <span>·</span>
                            <span>الموعد: {task.dueDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {task.estimatedMinutes && (
                      <span className="text-xs font-mono tabular-nums text-[#ded3c0]/70 px-2 py-0.5 rounded bg-[#041913] border border-[#c59b27]/20">
                        {task.estimatedMinutes} د
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-[#ded3c0]/40 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                      title="حذف المهمة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. Goals Tab */}
      {activeTab === 'goals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(goal => {
            const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            return (
              <div
                key={goal.id}
                className="p-5 rounded-3xl bg-[#062017]/85 border border-[#c59b27]/25 space-y-4 hover:border-[#c59b27]/50 transition-all shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#fbf8f2] font-display">{goal.title}</h3>
                    <p className="text-[11px] text-[#ded3c0]/70 mt-0.5">
                      التصنيف: {goal.category} {goal.deadline && `· الموعد: ${goal.deadline}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-[#ded3c0]/40 hover:text-red-400 p-1 cursor-pointer transition-colors"
                    title="حذف الهدف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono tabular-nums text-[#ded3c0]">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </span>
                    <span className="font-bold text-[#d4af37] font-mono tabular-nums">
                      {percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#03150f] overflow-hidden border border-[#c59b27]/20">
                    <div
                      className="h-full bg-gradient-to-r from-[#c59b27] to-[#e5c158] rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Quick Step Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[#c59b27]/20 text-xs">
                  <span className="text-[#ded3c0]/70">تحديث الإنجاز:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleGoalStep(goal.id, -1)}
                      className="w-7 h-7 rounded-lg bg-[#041913] border border-[#c59b27]/30 flex items-center justify-center text-[#ded3c0] hover:bg-[#07241c] cursor-pointer"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleGoalStep(goal.id, 1)}
                      className="w-7 h-7 rounded-lg bg-[#0a3528] border border-[#c59b27]/50 flex items-center justify-center text-[#fbf8f2] hover:bg-[#0e4838] font-bold cursor-pointer text-[#d4af37]"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleGoalStep(goal.id, 5)}
                      className="px-2 h-7 rounded-lg bg-[#041913] border border-[#c59b27]/30 flex items-center justify-center text-[#ded3c0] hover:bg-[#07241c] font-mono text-[11px] cursor-pointer"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAddTask}
            className="manuscript-border bg-[#051c15] border border-[#c59b27]/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#c59b27]/20">
              <h3 className="text-sm font-bold text-[#fbf8f2] font-display">إضافة مهمة جديدة</h3>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="w-7 h-7 rounded-full bg-[#082a20] text-[#ded3c0] flex items-center justify-center border border-[#c59b27]/30 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#ded3c0]">عنوان المهمة</label>
              <input
                type="text"
                required
                placeholder="مثال: كتابة التقرير، مراجعة جزء عم..."
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#fbf8f2] placeholder-[#ded3c0]/40 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#ded3c0]">التصنيف</label>
                <select
                  value={newTaskCategory}
                  onChange={e => setNewTaskCategory(e.target.value as any)}
                  className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#fbf8f2]"
                >
                  <option value="عبادات">عبادات</option>
                  <option value="عمل">عمل</option>
                  <option value="دراسة">دراسة</option>
                  <option value="تطوير">تطوير</option>
                  <option value="صحة">صحة</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#ded3c0]">الأولوية</label>
                <select
                  value={newTaskPriority}
                  onChange={e => setNewTaskPriority(e.target.value as any)}
                  className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#fbf8f2]"
                >
                  <option value="عالي">عالي</option>
                  <option value="متوسط">متوسط</option>
                  <option value="عادي">عادي</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#ded3c0]">الوقت التقديري (بالدقائق)</label>
              <input
                type="number"
                min="5"
                max="300"
                step="5"
                value={newTaskMinutes}
                onChange={e => setNewTaskMinutes(Number(e.target.value))}
                className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#fbf8f2]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="px-4 py-2 rounded-xl bg-[#082a20] text-[#ded3c0] text-xs font-medium border border-[#c59b27]/20 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] text-[#fbf8f2] text-xs font-semibold border border-[#c59b27]/40 cursor-pointer shadow-md"
              >
                حفظ المهمة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Schedule Modal */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAddScheduleItem}
            className="manuscript-border bg-[#051c15] border border-[#c59b27]/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#c59b27]/20">
              <h3 className="text-sm font-bold text-[#fbf8f2] font-display">إضافة محطة في الجدول اليومي</h3>
              <button
                type="button"
                onClick={() => setShowAddScheduleModal(false)}
                className="w-7 h-7 rounded-full bg-[#082a20] text-[#ded3c0] flex items-center justify-center border border-[#c59b27]/30 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#ded3c0]">عنوان المحطة / النشاط</label>
              <input
                type="text"
                required
                placeholder="مثال: وِرد القرآن، صلاة الضحى، رياضة..."
                value={newScheduleTitle}
                onChange={e => setNewScheduleTitle(e.target.value)}
                className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#fbf8f2] placeholder-[#ded3c0]/40 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#ded3c0]">الوقت</label>
                <input
                  type="time"
                  required
                  value={newScheduleTime}
                  onChange={e => setNewScheduleTime(e.target.value)}
                  className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#fbf8f2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#ded3c0]">الفترة</label>
                <select
                  value={newSchedulePeriod}
                  onChange={e => setNewSchedulePeriod(e.target.value as any)}
                  className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#fbf8f2]"
                >
                  {periodsOrder.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddScheduleModal(false)}
                className="px-4 py-2 rounded-xl bg-[#082a20] text-[#ded3c0] text-xs font-medium border border-[#c59b27]/20 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] text-[#fbf8f2] text-xs font-semibold border border-[#c59b27]/40 cursor-pointer shadow-md"
              >
                حفظ المحطة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAddGoal}
            className="manuscript-border bg-[#051c15] border border-[#c59b27]/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#c59b27]/20">
              <h3 className="text-sm font-bold text-[#fbf8f2] font-display">إضافة هدف رئيسي جديد</h3>
              <button
                type="button"
                onClick={() => setShowAddGoalModal(false)}
                className="w-7 h-7 rounded-full bg-[#082a20] text-[#ded3c0] flex items-center justify-center border border-[#c59b27]/30 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#ded3c0]">عنوان الهدف</label>
              <input
                type="text"
                required
                placeholder="مثال: ختم القرآن الكريم، 100 ساعة تركيز..."
                value={newGoalTitle}
                onChange={e => setNewGoalTitle(e.target.value)}
                className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#fbf8f2] placeholder-[#ded3c0]/40 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#ded3c0]">الهدف الإجمالي (العدد)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newGoalTarget}
                  onChange={e => setNewGoalTarget(Number(e.target.value))}
                  className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#fbf8f2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#ded3c0]">الوحدة</label>
                <input
                  type="text"
                  required
                  placeholder="جزء، صفحة، ساعة..."
                  value={newGoalUnit}
                  onChange={e => setNewGoalUnit(e.target.value)}
                  className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#fbf8f2]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddGoalModal(false)}
                className="px-4 py-2 rounded-xl bg-[#082a20] text-[#ded3c0] text-xs font-medium border border-[#c59b27]/20 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] text-[#fbf8f2] text-xs font-semibold border border-[#c59b27]/40 cursor-pointer shadow-md"
              >
                إنشاء الهدف
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
