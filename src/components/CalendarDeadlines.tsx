import React, { useState } from 'react';
import { DeadlineReminder, Language, LessonPlan } from '../types';
import { UPCOMING_DEADLINES } from '../data/curriculumData';
import { useTranslation } from '../data/translations';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Bell, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  ExternalLink 
} from 'lucide-react';

interface CalendarDeadlinesProps {
  plans: LessonPlan[];
  lang: Language;
}

export const CalendarDeadlines: React.FC<CalendarDeadlinesProps> = ({
  plans,
  lang,
}) => {
  const t = useTranslation(lang);
  const [deadlines, setDeadlines] = useState<DeadlineReminder[]>(UPCOMING_DEADLINES);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationStatusMsg, setNotificationStatusMsg] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isCompleted: !d.isCompleted } : d))
    );
  };

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationEnabled(true);
          setNotificationStatusMsg(lang === 'km' ? 'បានបើកការជូនដំណឹង Push Notifications ដោយជោគជ័យ!' : 'Push notifications enabled successfully!');
          new Notification('KruPlano MoEYS', {
            body: lang === 'km' ? 'ការជូនដំណឹងកិច្ចតែងការបង្រៀនត្រូវបានបើក!' : 'Lesson plan reminders are now active!',
            icon: '/icon.svg',
          });
        } else {
          setNotificationStatusMsg(lang === 'km' ? 'ការអនុញ្ញាតជូនដំណឹងត្រូវបានបដិសេធ' : 'Notifications permission denied');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setNotificationStatusMsg('Browser does not support notifications');
    }
    setTimeout(() => setNotificationStatusMsg(null), 3500);
  };

  const handleDownloadIcs = () => {
    window.location.href = '/api/calendar/export.ics';
  };

  const daysOfWeekKm = ['ចន្ទ (Mon)', 'អង្គារ (Tue)', 'ពុធ (Wed)', 'ព្រហស្បតិ៍ (Thu)', 'សុក្រ (Fri)', 'សៅរ៍ (Sat)'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-khmer">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{lang === 'km' ? 'កាលវិភាគបឋមសិក្សាកម្ពុជា' : 'Cambodia Primary School Schedule'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-khmer-heading">
            {t.navCalendar}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'km' 
              ? 'ការតាមដានថ្ងៃកំណត់បញ្ជូនកិច្ចតែងការ និងការធ្វើសមកាលកម្មជាមួយ Google Calendar / Apple Calendar'
              : 'Track submission deadlines and synchronize schedule with Google, Apple, and Outlook calendars.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleEnableNotifications}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'km' ? 'បើកការជូនដំណឹង (Push)' : 'Enable Notifications'}</span>
          </button>

          <button
            onClick={handleDownloadIcs}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportCalendarIcs}</span>
          </button>
        </div>
      </div>

      {notificationStatusMsg && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{notificationStatusMsg}</span>
        </div>
      )}

      {/* Grid: Timetable on left, Deadlines on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Timetable (Monday to Saturday) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white font-khmer-heading">
              {lang === 'km' ? 'កាលវិភាគបង្រៀនប្រចាំសប្តាហ៍ (ចន្ទ ដល់ សៅរ៍)' : 'Weekly Teaching Timetable (Mon - Sat)'}
            </h2>
            <span className="text-xs text-slate-500 font-mono">ម៉ោងសិក្សា ៧:៣០ ដល់ ១១:០០ ព្រឹក</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {daysOfWeekKm.map((day, idx) => {
              // Find plans on this day
              const dayPlans = plans.slice(idx * 1, idx * 1 + 2);
              return (
                <div
                  key={day}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 flex flex-col justify-between"
                >
                  <div className="font-bold text-xs text-blue-900 dark:text-blue-300 border-b border-slate-200 dark:border-slate-700 pb-1 font-khmer-heading">
                    {day}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {dayPlans.length > 0 ? (
                      dayPlans.map((dp) => (
                        <div key={dp.id} className="p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700/60">
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                            {dp.lessonTitleKm}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {dp.grade.replace('grade', 'ថ. ')} · {dp.durationMinutes}m
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[11px] text-slate-400 italic py-2">
                        {lang === 'km' ? 'គ្មានម៉ោងបង្រៀន' : 'No lessons scheduled'}
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-200 dark:border-slate-700/60 flex justify-between">
                    <span>៧:៣០ ព្រឹក</span>
                    <span className="text-emerald-600 font-bold">MoEYS</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deadlines & Reminders */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white font-khmer-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{t.notifications}</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {deadlines.filter((d) => !d.isCompleted).length} កិច្ចការ
            </span>
          </div>

          <div className="space-y-3">
            {deadlines.map((dl) => (
              <div
                key={dl.id}
                onClick={() => toggleComplete(dl.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  dl.isCompleted
                    ? 'bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
                    : dl.priority === 'high'
                    ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-1 rounded-full ${dl.isCompleted ? 'bg-emerald-500 text-white' : 'border border-slate-400'}`}>
                    {dl.isCompleted && <Check className="w-3 h-3" />}
                  </div>

                  <div className="space-y-1 flex-1">
                    <h3 className={`text-xs font-bold ${dl.isCompleted ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {dl.titleKm}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{dl.dueDate.replace('T', ' ')}</span>
                      {dl.priority === 'high' && (
                        <span className="text-red-600 font-bold uppercase text-[10px]">បន្ទាន់</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-800 dark:text-slate-200">ចំណាំ MoEYS៖ </span>
            <span>កិច្ចតែងការបង្រៀនត្រូវបញ្ជូនទៅលោកនាយកសាលារៀងរាល់ព្រឹកថ្ងៃចន្ទ វេលាម៉ោង ៧:៣០ នាទី។</span>
          </div>
        </div>

      </div>
    </div>
  );
};
