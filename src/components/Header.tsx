import React from 'react';
import { Language } from '../types';
import { useTranslation } from '../data/translations';
import { 
  FileText, 
  FolderGit2, 
  Share2, 
  CheckCircle2, 
  Calendar, 
  FileSpreadsheet, 
  Moon, 
  Sun, 
  Globe, 
  Lock, 
  Plus, 
  Wifi, 
  WifiOff 
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'planner' | 'my-plans' | 'resources' | 'feedback' | 'calendar' | 'reports';
  setActiveTab: (tab: 'planner' | 'my-plans' | 'resources' | 'feedback' | 'calendar' | 'reports') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  isDark: boolean;
  toggleTheme: () => void;
  isOnline: boolean;
  onLockApp: () => void;
  onNewPlan: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isDark,
  toggleTheme,
  isOnline,
  onLockApp,
  onNewPlan,
}) => {
  const t = useTranslation(lang);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element Brand Wordmark */}
          <button
            onClick={() => setActiveTab('planner')}
            className="text-xl font-bold tracking-tight text-blue-900 dark:text-blue-400 font-khmer-heading whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span>គ្រូផ្លាណូ</span>
            <span className="text-sm font-sans font-medium text-slate-500 dark:text-slate-400">KruPlano</span>
          </button>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('planner')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'planner'
                  ? 'text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-600'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navPlanner}
            </button>

            <button
              onClick={() => setActiveTab('my-plans')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'my-plans'
                  ? 'text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-600'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navMyPlans}
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'resources'
                  ? 'text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-600'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navResourceHub}
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'feedback'
                  ? 'text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-600'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navAdminFeedback}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'calendar'
                  ? 'text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-600'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navCalendar}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'reports'
                  ? 'text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-600'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navReports}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Online / Offline status badge */}
            <span
              title={isOnline ? t.onlineSynced : t.syncOfflineBadge}
              className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
            >
              {isOnline ? (
                <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-500" />
              )}
              <span className="hidden sm:inline font-mono text-[11px]">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </span>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'km' ? 'en' : 'km')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? t.lightMode : t.darkMode}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Biometric Security Lock */}
            <button
              onClick={onLockApp}
              className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.biometricTitle}
              aria-label="Lock app"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onNewPlan}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.createNewPlan}</span>
            </button>
          </div>

        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-4 text-xs font-medium border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('planner')}
            className={`whitespace-nowrap ${activeTab === 'planner' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {t.navPlanner}
          </button>
          <button
            onClick={() => setActiveTab('my-plans')}
            className={`whitespace-nowrap ${activeTab === 'my-plans' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {t.navMyPlans}
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`whitespace-nowrap ${activeTab === 'resources' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {t.navResourceHub}
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`whitespace-nowrap ${activeTab === 'feedback' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {t.navAdminFeedback}
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`whitespace-nowrap ${activeTab === 'calendar' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {t.navCalendar}
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`whitespace-nowrap ${activeTab === 'reports' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {t.navReports}
          </button>
        </div>
      </div>
    </header>
  );
};
