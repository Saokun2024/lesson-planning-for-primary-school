import React, { useState, useEffect } from 'react';
import { 
  LessonPlan, 
  SharedResource, 
  AdminFeedback, 
  Language 
} from './types';
import { INITIAL_LESSON_PLANS, SHARED_COMMUNITY_RESOURCES } from './data/curriculumData';
import { 
  getLocalPlans, 
  saveLocalPlans, 
  getLocalResources, 
  saveLocalResources, 
  syncPlansWithCloud 
} from './utils/storage';
import { Header } from './components/Header';
import { LessonPlannerForm } from './components/LessonPlannerForm';
import { MyPlansList } from './components/MyPlansList';
import { ResourceHub } from './components/ResourceHub';
import { AdminFeedbackPanel } from './components/AdminFeedbackPanel';
import { CalendarDeadlines } from './components/CalendarDeadlines';
import { ReportsExport } from './components/ReportsExport';
import { PrintableLessonPlan } from './components/PrintableLessonPlan';
import { BiometricModal } from './components/BiometricModal';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';

export default function App() {
  // Theme state: defaults to light, honors stored preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('kruplano_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  // Language state: defaults to Khmer ('km')
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('kruplano_lang');
    return (saved as Language) || 'km';
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'planner' | 'my-plans' | 'resources' | 'feedback' | 'calendar' | 'reports'>('planner');

  // Network online status
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Lesson plans & current active plan
  const [plans, setPlans] = useState<LessonPlan[]>(() => getLocalPlans());
  const [currentPlan, setCurrentPlan] = useState<LessonPlan>(() => plans[0] || INITIAL_LESSON_PLANS[0]);
  
  // Shared resources
  const [resources, setResources] = useState<SharedResource[]>(() => getLocalResources());

  // Printable mode
  const [printingPlan, setPrintingPlan] = useState<LessonPlan | null>(null);

  // Biometric security lock state
  const [isAppLocked, setIsAppLocked] = useState<boolean>(false);

  // Dark mode effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kruplano_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kruplano_theme', 'light');
    }
  }, [isDark]);

  // Language persistence
  useEffect(() => {
    localStorage.setItem('kruplano_lang', lang);
  }, [lang]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-trigger sync when connectivity returns
      handleSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial background cloud sync on app start
    handleSync();

    // Register service worker if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration note:', err);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSync = async () => {
    const synced = await syncPlansWithCloud(plans);
    if (synced && synced.length > 0) {
      setPlans(synced);
    }
  };

  const handleSavePlan = (plan: LessonPlan) => {
    const updated = {
      ...plan,
      lastModified: new Date().toISOString(),
      syncStatus: isOnline ? ('synced' as const) : ('pending' as const),
    };
    setCurrentPlan(updated);
    setPlans((prev) => {
      const existingIdx = prev.findIndex((p) => p.id === updated.id);
      let nextList: LessonPlan[];
      if (existingIdx >= 0) {
        nextList = [...prev];
        nextList[existingIdx] = updated;
      } else {
        nextList = [updated, ...prev];
      }
      saveLocalPlans(nextList);
      return nextList;
    });

    if (isOnline) {
      fetch('/api/lesson-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch((e) => console.log('Offline save note', e));
    }
  };

  const handleSubmitReview = (plan: LessonPlan) => {
    const updated = { ...plan, status: 'submitted' as const };
    handleSavePlan(updated);
  };

  const handleDeletePlan = (id: string) => {
    setPlans((prev) => {
      const nextList = prev.filter((p) => p.id !== id);
      saveLocalPlans(nextList);
      return nextList;
    });
    if (currentPlan.id === id) {
      const remaining = plans.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        setCurrentPlan(remaining[0]);
      }
    }
    if (isOnline) {
      fetch(`/api/lesson-plans/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const handleReviewFeedbackSubmit = (planId: string, feedback: AdminFeedback) => {
    setPlans((prev) => {
      const nextList = prev.map((p) => {
        if (p.id === planId) {
          const feedbacks = p.feedbacks ? [feedback, ...p.feedbacks] : [feedback];
          return {
            ...p,
            status: feedback.status,
            feedbacks,
          };
        }
        return p;
      });
      saveLocalPlans(nextList);
      return nextList;
    });

    if (isOnline) {
      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, feedback }),
      }).catch(() => {});
    }
  };

  const handleSharePlan = (plan: LessonPlan) => {
    const newRes: SharedResource = {
      id: `res-${Date.now()}`,
      titleKm: plan.lessonTitleKm,
      titleEn: plan.lessonTitleEn || plan.lessonTitleKm,
      descriptionKm: `${plan.chapterKm} — ${plan.objectives.knowledgeKm}`,
      descriptionEn: `${plan.chapterEn || plan.chapterKm} — ${plan.objectives.knowledgeEn || ''}`,
      authorName: plan.teacherNameKm,
      schoolName: plan.schoolNameKm,
      grade: plan.grade,
      subject: plan.subject,
      resourceType: 'lesson_plan',
      likesCount: 1,
      downloadsCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      lessonPlanData: plan,
    };
    setResources((prev) => {
      const nextList = [newRes, ...prev];
      saveLocalResources(nextList);
      return nextList;
    });
    setActiveTab('resources');
  };

  const handleCloneResource = (res: SharedResource) => {
    const clonedPlan: LessonPlan = res.lessonPlanData
      ? {
          ...res.lessonPlanData,
          id: `lp-cloned-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          status: 'draft',
          feedbacks: [],
          lastModified: new Date().toISOString(),
          syncStatus: 'pending',
        }
      : {
          ...INITIAL_LESSON_PLANS[0],
          id: `lp-cloned-${Date.now()}`,
          lessonTitleKm: res.titleKm,
          lessonTitleEn: res.titleEn,
          grade: res.grade,
          subject: res.subject,
          date: new Date().toISOString().slice(0, 10),
          status: 'draft',
        };

    setPlans((prev) => {
      const nextList = [clonedPlan, ...prev];
      saveLocalPlans(nextList);
      return nextList;
    });
    setCurrentPlan(clonedPlan);
    setActiveTab('planner');
  };

  const handleLikeResource = (resId: string) => {
    setResources((prev) => {
      const nextList = prev.map((r) =>
        r.id === resId ? { ...r, likesCount: r.likesCount + 1 } : r
      );
      saveLocalResources(nextList);
      return nextList;
    });
  };

  const handleUploadNewResource = (newRes: Partial<SharedResource>) => {
    const fullRes: SharedResource = {
      id: `res-${Date.now()}`,
      titleKm: newRes.titleKm || '',
      titleEn: newRes.titleEn || newRes.titleKm || '',
      descriptionKm: newRes.descriptionKm || '',
      descriptionEn: newRes.descriptionEn || '',
      authorName: newRes.authorName || 'គ្រូបង្រៀនបឋម',
      schoolName: newRes.schoolName || 'សាលាបឋមសិក្សា',
      grade: newRes.grade || 'grade2',
      subject: newRes.subject || 'khmer',
      resourceType: newRes.resourceType || 'lesson_plan',
      likesCount: 0,
      downloadsCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setResources((prev) => {
      const nextList = [fullRes, ...prev];
      saveLocalResources(nextList);
      return nextList;
    });
    if (isOnline) {
      fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullRes),
      }).catch(() => {});
    }
  };

  const handleNewPlan = () => {
    const freshPlan: LessonPlan = {
      ...INITIAL_LESSON_PLANS[0],
      id: `lp-${Date.now()}`,
      lessonTitleKm: 'មេរៀនថ្មី',
      lessonTitleEn: 'New Lesson Plan',
      subTopicKm: '',
      subTopicEn: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'draft',
      feedbacks: [],
      isShared: false,
      sharedLikes: 0,
      sharedDownloads: 0,
      lastModified: new Date().toISOString(),
      syncStatus: 'pending',
    };
    setCurrentPlan(freshPlan);
    setActiveTab('planner');
  };

  // If viewing printable official MoEYS PDF
  if (printingPlan) {
    return (
      <PrintableLessonPlan
        plan={printingPlan}
        lang={lang}
        onBack={() => setPrintingPlan(null)}
      />
    );
  }

  const pendingSyncCount = plans.filter((p) => p.syncStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isOnline={isOnline}
        onLockApp={() => setIsAppLocked(true)}
        onNewPlan={handleNewPlan}
      />

      {/* Offline & Sync Notification Banner */}
      <OfflineSyncBanner
        isOnline={isOnline}
        pendingSyncCount={pendingSyncCount}
        onTriggerSync={handleSync}
        lang={lang}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'planner' && (
          <LessonPlannerForm
            currentPlan={currentPlan}
            setCurrentPlan={setCurrentPlan}
            onSave={handleSavePlan}
            onSubmitReview={handleSubmitReview}
            onPreviewPrint={(p) => setPrintingPlan(p)}
            onShareToCommunity={handleSharePlan}
            lang={lang}
          />
        )}

        {activeTab === 'my-plans' && (
          <MyPlansList
            plans={plans}
            onSelectPlan={(p) => {
              setCurrentPlan(p);
              setActiveTab('planner');
            }}
            onPrintPlan={(p) => setPrintingPlan(p)}
            onDeletePlan={handleDeletePlan}
            onSubmitPlan={handleSubmitReview}
            onSharePlan={handleSharePlan}
            onNewPlan={handleNewPlan}
            lang={lang}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceHub
            resources={resources}
            onCloneResource={handleCloneResource}
            onLikeResource={handleLikeResource}
            onUploadNewResource={handleUploadNewResource}
            lang={lang}
          />
        )}

        {activeTab === 'feedback' && (
          <AdminFeedbackPanel
            plans={plans}
            onReviewSubmit={handleReviewFeedbackSubmit}
            lang={lang}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarDeadlines
            plans={plans}
            lang={lang}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsExport
            plans={plans}
            lang={lang}
          />
        )}
      </main>

      {/* Biometric / PIN Lock Screen Modal */}
      <BiometricModal
        isOpen={isAppLocked}
        onSuccess={() => setIsAppLocked(false)}
        lang={lang}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-khmer">
            <span>គ្រូផ្លាណូ (KruPlano) · ស្តង់ដារកិច្ចតែងការបឋមសិក្សាកម្ពុជា MoEYS</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Offline-First PWA</span>
            <span>·</span>
            <span>Cloud Sync</span>
            <span>·</span>
            <span>A4 Printable</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
